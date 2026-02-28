import { useFirebaseToken } from './FirebaseToken';
import { useLogger } from './useLogger';

/**
 * @interface TestHistory
 * @description Mendefinisikan struktur data untuk riwayat tes, baik daftar maupun detail.
 */
export interface TestHistory {
  id: string;
  batchName: string;
  completedDate: string;
  score: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
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
  const { logError } = useLogger();

  const { data, pending, error, refresh } = useAsyncData<TestHistory[]>(
    'test-history-list',
    async () => {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Autentikasi pengguna gagal.');
      return await $fetch<TestHistory[]>(`${config.public.API_URL}/exams/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      default: () => [],
    }
  );

  watch(error, (newErr) => {
    if (newErr) {
      logError('Failed to fetch test history list', { error: newErr.message });
    }
  });

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
  const { logError } = useLogger();

  const { data, pending, error, refresh } = useAsyncData<TestHistory>(
    `test-history-detail-${historyId}`,
    async () => {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Autentikasi pengguna gagal.');
      return await $fetch<TestHistory>(`${config.public.API_URL}/exams/history/${historyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      default: () => null,
    }
  );

  watch(error, (newErr) => {
    if (newErr) {
      logError(`Failed to fetch test history detail for ${historyId}`, { error: newErr.message, historyId });
    }
  });

  return {
    history: data,
    isLoading: pending,
    error,
    refresh,
  };
};