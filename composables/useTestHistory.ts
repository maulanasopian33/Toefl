import { useFirebaseToken } from './FirebaseToken';

/**
 * @interface TestHistory
 * @description Mendefinisikan struktur data untuk riwayat tes, baik daftar maupun detail.
 */
export interface TestHistory {
  id: string;
  batchName: string;
  completedDate: string;
  score: number;
  maxScore?: number;
  detailsUrl?: string;
  // Properti untuk halaman detail
  sectionScores?: {
    listening: number;
    structure: number;
    reading: number;
  };
  organizer?: string;
  testDate?: string;
  certificateUrl?: string;
}

/**
 * @composable useTestHistory
 * @description Composable untuk mengambil semua riwayat tes yang telah diselesaikan oleh pengguna.
 */
export const useTestHistory = () => {
  const config = useRuntimeConfig();
  const { data, pending, error, refresh } = useAsyncData<TestHistory[]>(
    'test-history-list',
    async () => {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Autentikasi pengguna gagal.');
      // Langsung mengembalikan hasil fetch karena API mengembalikan array, bukan objek {data: ...}
      return await $fetch<TestHistory[]>(`${config.public.API_URL}/exams/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      // Memberikan nilai default array kosong untuk mencegah error 'length' of undefined
      default: () => [],
    }
  );

  return {
    histories: data,
    isLoading: pending,
    error,
    refresh,
  };
}

/**
 * @composable useTestHistoryDetail
 * @description Mengambil detail satu riwayat tes berdasarkan ID.
 * @param {string} historyId - ID dari riwayat tes yang ingin diambil.
 */
export const useTestHistoryDetail = (historyId: string) => {
  const config = useRuntimeConfig();
  const { data, pending, error, refresh } = useAsyncData<TestHistory>(
    `test-history-detail-${historyId}`,
    async () => {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Autentikasi pengguna gagal.');
      // Langsung mengembalikan hasil fetch, dengan asumsi API detail juga mengembalikan objek langsung
      return await $fetch<TestHistory>(`${config.public.API_URL}/exams/history/${historyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      // Memberikan nilai default null untuk detail, karena ini adalah objek tunggal
      default: () => null,
    }
  );

  return {
    history: data,
    isLoading: pending,
    error,
    refresh,
  };
};