import { ref, computed } from 'vue';

export interface Payment {
  id: string;
  name: string;
  email: string;
  batchName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Unpaid'; // Unpaid sebagai fallback
  date: string;
  payment_proof?: string | null;
}

interface ApiResponse {
  data: Payment[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

  // Filter & sorting
  const q = ref('');
  const selectedStatus = ref('');
  const selectedBatch = ref('');
  const sortKey = ref('date');
  const sortOrder = ref('desc');

/**
 * Composable untuk mengelola data pembayaran.
 * Menggabungkan pengambilan data server-side dengan `useFetch`
 * dan logika filtering/sorting client-side.
 */
export const usePayments = () => {
  const config = useRuntimeConfig();
  const apiUrl = `${config.public.API_URL}/payments`;

  // State untuk parameter reaktif yang akan dikirim ke API
  const currentPage = ref(1);
  const pageSize = ref(20); // Bisa diubah jika diperlukan

  // Gunakan useAsyncData + $fetch untuk kontrol lebih, termasuk token
  const { data, pending: loading, error, refresh: fetchPayments } = useAsyncData<ApiResponse>(
    'payments',
    async () => {
      const authToken = await useFirebaseToken();
      if (!authToken) {
        throw new Error('User not authenticated.');
      }

      return $fetch(apiUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: {
          page: currentPage.value,
          limit: pageSize.value,
          // Jika backend mendukung filter server-side, tambahkan di sini:
          // q: q.value,
          // status: selectedStatus.value,
          // batch: selectedBatch.value,
        },
      });
    },
    { watch: [currentPage] } // Otomatis fetch ulang saat currentPage berubah
  );

  // Computed properties untuk data dan pagination dari `useFetch`
  const payments = computed<Payment[]>(() => {
    // Lakukan pemetaan dari struktur data API ke struktur yang diharapkan oleh UI
    return (data.value?.data ?? []).map((p: any) => ({
      id: p.id,
      name: p.participant?.user?.name ?? 'Nama Tidak Tersedia',
      email: p.participant?.user?.email ?? 'Email Tidak Tersedia',
      batchName: p.participant?.batch?.namaBatch ?? '-',
      amount: parseFloat(p.amount) || 0,
      // Kapitalisasi huruf pertama status agar konsisten (e.g., 'pending' -> 'Pending')
      status: p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Unpaid',
      date: p.createdAt,
      payment_proof: p.payment_proof,
    }));
  });
  const totalItems = computed(() => data.value?.totalItems ?? payments.value.length);
  const totalPages = computed(() => data.value?.totalPages ?? 1);

  // Opsi batch di filter (diambil dari data)
  const batchOptions = computed(() => {
    const set = new Set(
      payments.value
        .map((p) => p.batchName)
        .filter(Boolean)
    );
    return Array.from(set);
  });

  // Filter di client-side
  const filteredPayments = computed(() => {
    if (!payments.value) return [];
    const query = q.value.toLowerCase();
    return payments.value.filter((p) => {
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (p.email?.toLowerCase().includes(query));
      const matchStatus = !selectedStatus.value || p.status === selectedStatus.value;
      const matchBatch = !selectedBatch.value || p.batchName === selectedBatch.value;
      return matchQuery && matchStatus && matchBatch;
    });
  });

  // Sorting
  const sortedPayments = computed(() => {
    const data = [...filteredPayments.value];
    data.sort((a: any, b: any) => {
      let valA = a[sortKey.value as keyof Payment];
      let valB = b[sortKey.value as keyof Payment];

      if (sortKey.value === 'date') {
        valA = new Date(valA || 0);
        valB = new Date(valB || 0);
      }
      
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  });

  // Ringkasan count
  const paidCount = computed(() => (payments.value || []).filter((p) => p.status === 'Paid').length);
  const nonPaidCount = computed(() => (payments.value || []).filter((p) => p.status !== 'Paid').length);

  const sortBy = (key: string) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortOrder.value = 'asc';
    }
  };

  /**
   * Mengubah status pembayaran di server.
   * @param paymentId ID dari pembayaran yang akan diubah.
   * @param status Status baru ('paid', 'pending', 'unpaid').
   */
  const updatePaymentStatus = async (paymentId: string, status: 'paid' | 'pending' | 'failed' | 'refunded') => {
    const updateUrl = `${apiUrl}/${paymentId}/status`;
    const authToken = await useFirebaseToken();
    if (!authToken) {
      throw new Error('User not authenticated.');
    }

    return $fetch(updateUrl, {
      method: 'PATCH', // PATCH lebih cocok untuk pembaruan parsial daripada PUT
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        status: status,
        method: 'manual', // Menambahkan method sesuai kebutuhan backend
        payment_proof: null // Menambahkan payment_proof sesuai kebutuhan backend
      },
    });
  };

  /**
   * Mengedit detail pembayaran secara penuh.
   * @param paymentId ID dari pembayaran yang akan diubah.
   * @param payload Data pembayaran yang diperbarui.
   */
  const updatePayment = async (paymentId: string, payload: { amount: number; status: string; method: string; payment_proof: string | null }) => {
    const updateUrl = `${apiUrl}/${paymentId}`;
    const authToken = await useFirebaseToken();
    if (!authToken) {
      throw new Error('User not authenticated.');
    }

    // Menggunakan PUT untuk mengganti seluruh data sesuai dengan praktik RESTful
    return $fetch(updateUrl, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
      body: payload,
    });
  };

  /**
   * Membuat pembayaran baru secara manual.
   * @param payload Data untuk pembayaran baru.
   */
  const createPayment = async (payload: { participantId: string; amount: number; method: string; }) => {
    const authToken = await useFirebaseToken();
    if (!authToken) {
      throw new Error('User not authenticated.');
    }

    // Menggunakan POST ke endpoint utama /payments
    return $fetch(apiUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        ...payload,
        status: 'pending', // Status di-set default ke 'pending'
      },
    });
  };

  return {
    payments,
    loading,
    error,
    q,
    selectedStatus,
    selectedBatch,
    sortKey,
    sortOrder,
    currentPage, // state yang bisa diubah untuk memicu fetch
    totalPages, // hasil dari fetch
    totalItems,
    fetchPayments,
    batchOptions,
    sortedPayments,
    paidCount,
    nonPaidCount,
    sortBy,
    updatePaymentStatus,
    updatePayment,
    createPayment,
  };
}