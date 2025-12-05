import { ref } from 'vue';

/**
 * @interface TestHistory
 * @description Merepresentasikan struktur data untuk satu item riwayat tes.
 */
export interface TestHistory {
  id: string;
  batchName: string;
  completedDate: string;
  score: number;
  maxScore: number;
  detailsUrl: string;
}

/**
 * @composable useTestHistory
 * @description Composable untuk mengambil semua riwayat tes yang telah diselesaikan oleh pengguna.
 */
export function useTestHistory() {
  const config = useRuntimeConfig();
  const { $auth } = useNuxtApp();

  // --- State ---
  const histories = ref<TestHistory[]>([]);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  const fetchHistories = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const token = await $auth.currentUser?.getIdToken();
      if (!token) throw new Error('Autentikasi pengguna gagal.');

      const response = await $fetch<{ data: TestHistory[] }>(`${config.public.API_URL}/exams/history`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      histories.value = response.data;
    } catch (e: any) {
      error.value = e;
    } finally {
      isLoading.value = false;
    }
  };

  // Secara otomatis memanggil data saat composable digunakan
  fetchHistories();

  return { histories, isLoading, error, refresh: fetchHistories };
}