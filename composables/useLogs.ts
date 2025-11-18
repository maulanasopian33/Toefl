import { ref, computed } from 'vue';

interface Log {
  action: string;
  details: object;
  level: string;
  message: string;
  paymentId?: string;
  timestamp: string;
  user: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: Log[];
}

/**
 * Mengambil log dari API berdasarkan tanggal yang dipilih.
 */
export const useLogs = () => {
  const config = useRuntimeConfig();
  const apiUrl = `${config.public.API_URL}/logs`;

  // Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const selectedDate = ref(getTodayDateString());
  // State untuk filter baru
  const selectedLevel = ref('');
  const selectedAction = ref('');
  const searchQuery = ref('');

  // State untuk paginasi client-side
  const currentPage = ref(1);
  const itemsPerPage = ref(15); // Jumlah log per halaman

  const { data, pending: loading, error, refresh } = useAsyncData<ApiResponse>(
    'logs',
    async () => {
      const authToken = await useFirebaseToken();
      if (!authToken) {
        throw new Error('User not authenticated.');
      }

      // Hanya tambahkan parameter 'date' jika tidak sama dengan hari ini
      // (tergantung implementasi API, mungkin lebih baik selalu mengirimkannya)
      const params = {
        date: selectedDate.value,
      };

      return $fetch(apiUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
        params,
      });
    },
    { watch: [selectedDate] } // Otomatis fetch ulang saat tanggal berubah
  );

  // Memproses data mentah dan menambahkan fallback untuk 'action'
  const processedLogs = computed<Log[]>(() => {
    const logs = (data.value?.data ?? []).map(log => ({
      ...log,
      action: log.action || 'Sistem', // Jika action tidak ada, beri nilai 'Sistem'
    }));

    // Urutkan log berdasarkan timestamp, data terbaru di atas
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });

  // Opsi dinamis untuk filter action
  const actionOptions = computed(() => {
    const actions = new Set(processedLogs.value.map(log => log.action));
    return Array.from(actions);
  });

  // Menerapkan filter di client-side
  const filteredLogs = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return processedLogs.value.filter(log => {
      const levelMatch = !selectedLevel.value || log.level === selectedLevel.value;
      const actionMatch = !selectedAction.value || log.action === selectedAction.value;
      const searchMatch =
        !query ||
        log.message.toLowerCase().includes(query) ||
        (log.user && log.user.toLowerCase().includes(query)) ||
        (log.paymentId && log.paymentId.toLowerCase().includes(query));

      return levelMatch && actionMatch && searchMatch;
    });
  });

  // Computed property untuk paginasi
  const paginatedLogs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredLogs.value.slice(start, end);
  });

  // Computed property untuk total halaman
  const totalPages = computed(() => {
    return Math.ceil(filteredLogs.value.length / itemsPerPage.value);
  });

  // Reset ke halaman 1 setiap kali filter berubah
  watch([selectedLevel, selectedAction, selectedDate, searchQuery], () => {
    currentPage.value = 1;
  });

  return {
    logs: paginatedLogs, // Kirim data yang sudah dipaginasi ke halaman
    loading,
    error,
    selectedDate,
    selectedLevel,
    selectedAction,
    searchQuery,
    actionOptions,
    refresh,
    currentPage,
    totalPages,
    totalLogs: computed(() => filteredLogs.value.length),
  };
};