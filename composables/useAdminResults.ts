import { ref, watch, type Ref } from 'vue';
import { useFirebaseToken } from './FirebaseToken';
import { useLogger } from './useLogger';

/**
 * @interface AdminTestResult
 * @description Mendefinisikan struktur data untuk hasil tes dari perspektif admin.
 */
export interface AdminTestResult {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  namaLengkap: string;
  nim: string;
  score: number;
  sectionScores: Record<string, number>;
  submittedAt: string;
}

/**
 * @interface AdminUserBatchResultDetail
 * @description Mendefinisikan struktur data untuk detail hasil tes seorang user dalam satu batch.
 * Berisi info user dan array dari semua percobaan tesnya.
 */
export interface AdminUserBatchResultDetail {
  userId: string;
  userName: string;
  userEmail: string;
  nim: string;
  batchName: string;
  results: Omit<AdminTestResult, 'userId' | 'userName' | 'userEmail' | 'nim'>[];
}

/**
 * @interface AnswerDetail
 * @description Mendefinisikan struktur data untuk detail sebuah jawaban.
 */
export interface AnswerDetail {
  questionNumber: number;
  questionText: string; // Bisa ditambahkan jika API menyediakan
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  section: string;
}

/**
 * @interface AdminBatch
 * @description Mendefinisikan struktur data untuk sebuah batch.
 */
export interface AdminBatch {
  id: string;
  name: string;
}



const mockBatches: AdminBatch[] = [
  { id: 'toafl-september', name: 'TOAFL September' },
  { id: 'toafl-oktober', name: 'TOAFL Oktober' },
  { id: 'toefl-prediction-nov', name: 'TOEFL Prediction November' },
];

/**
 * @composable useAdminBatches
 * @description Mengambil daftar semua batch yang tersedia.
 */
export const useAdminBatches = () => {
  const config = useRuntimeConfig();
  const { data, pending, error, refresh } = useAsyncData<AdminBatch[]>(
    'admin-batches-list',
    async () => {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Autentikasi pengguna gagal.');
      
      // Tipe untuk respons API /batch yang sebenarnya
      type ApiBatchResponse = {
        data: { idBatch: string; namaBatch: string }[];
      };

      const response = await $fetch<ApiBatchResponse>(`${config.public.API_URL}/batch`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Transformasi data dari { idBatch, namaBatch } menjadi { id, name }
      return response.data.map(batch => ({ id: batch.idBatch, name: (batch as any).namaBatch || (batch as any).name }));
    },
    {
      default: () => [],
    }
  );

  return { batches: data, isLoading: pending, error, refresh };
};

/**
 * @composable useAdminResults
 * @description Mengambil daftar hasil tes untuk batch tertentu (admin view).
 */
export const useAdminResults = (batchId: Ref<string>) => {
  const results = ref<AdminTestResult[]>([]);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  const fetchData = async () => {
    if (!batchId.value) return;

    isLoading.value = true;
    error.value = null;
    try {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Autentikasi pengguna gagal.');

      const response = await $fetch<any>(`${useRuntimeConfig().public.API_URL}/results/${batchId.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle both { data: [...] } and directly [...] response formats
      const rawData = Array.isArray(response) ? response : (response.data || []);
      
      // Transform data: map 'idResult' or similar to 'id' if 'id' is missing
      results.value = rawData.map((res: any) => ({
        ...res,
        id: res.id || res.idResult || `res-${res.userId}-${new Date(res.submittedAt).getTime()}`
      }));
    } catch (e: any) {
      error.value = e;
      const { logToServer } = useLogger();
      logToServer({
        level: 'error',
        message: 'Failed to fetch admin results data',
        metadata: { batchId: batchId.value, error: e.message }
      });
    } finally {
      isLoading.value = false;
    }
  };

  const deleteResult = async (resultId: string) => {
    try {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Autentikasi pengguna gagal.');

      await $fetch(`${useRuntimeConfig().public.API_URL}/results/${resultId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh local data
      fetchData();
    } catch (e: any) {
      const { logToServer } = useLogger();
      logToServer({
        level: 'error',
        message: 'Failed to delete result',
        metadata: { resultId, error: e.message }
      });
      throw e;
    }
  };

  watch(batchId, fetchData, { immediate: true });
  return { results, isLoading, error, refresh: fetchData, deleteResult };
};

/**
 * @composable useAdminResultDetail
 * @description Mengambil detail satu hasil tes berdasarkan ID-nya.
 */
export const useAdminResultDetail = (userId: Ref<string>, batchId: Ref<string>) => {
  const config = useRuntimeConfig();
  const { data, pending, error, refresh } = useAsyncData<AdminUserBatchResultDetail>(
    `admin-result-${userId.value}-${batchId.value}`,
    async () => {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Autentikasi pengguna gagal.');

      // Implementasi API yang sebenarnya
      // Endpoint ini mengembalikan objek detail yang berisi info user dan array 'results'.
      const response = await $fetch<AdminUserBatchResultDetail>(`${config.public.API_URL}/results/user/${userId.value}/batch/${batchId.value}`, {
        headers: { Authorization: `Bearer ${token}` },
        // transform: (response) => {
        //   // Transform the response to return only the results array
        //   // Assuming your API returns an object with a data property
        //   return response.data;
        // },
      });
      return response;
    }
  );

  // Process results data
  

  return { result: data, isLoading: pending, error, refresh };
};

/**
 * @composable useAdminAnswerDetails
 * @description Mengambil detail jawaban (user vs benar) untuk sebuah percobaan tes.
 */
export const useAdminAnswerDetails = (attemptId: Ref<string>) => {
  const config = useRuntimeConfig();
  const { data, pending, error, refresh, execute } = useAsyncData<AnswerDetail[]>(
    `admin-answer-details-${attemptId.value}`,
    async () => {
      if (!attemptId.value) return [];
      
      const token = await useFirebaseToken();
      if (!token) throw new Error('Autentikasi pengguna gagal.');

      // Implementasi API yang sebenarnya
      // Endpoint ini diasumsikan mengembalikan array objek AnswerDetail.
      const response = await $fetch<AnswerDetail[]>(`${config.public.API_URL}/results/answers/${attemptId.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response;
    },
    { immediate: false } // Jangan langsung dijalankan saat komponen dibuat
  );

  return { answerDetails: data, isAnswersLoading: pending, answersError: error, fetchAnswerDetails: execute };
};

/**
 * @composable useRecalculateBatch
 * @description Menghitung ulang semua skor dalam satu batch (hanya admin).
 */
export const useRecalculateBatch = () => {
  const isRecalculating = ref(false);
  const error = ref<string | null>(null);

  const recalculate = async (batchId: string) => {
    isRecalculating.value = true;
    error.value = null;

    try {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Autentikasi pengguna gagal.');

      const response = await $fetch<{ message: string; summary: any }>(`${useRuntimeConfig().public.API_URL}/results/recalculate-batch`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { batchId }
      });

      return response;
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Gagal menghitung ulang batch.';
      throw e;
    } finally {
      isRecalculating.value = false;
    }
  };

  return { recalculate, isRecalculating, recalculateError: error };
};