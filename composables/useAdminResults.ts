import { ref, watch, type Ref } from 'vue';
import { useFirebaseToken } from './FirebaseToken';

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
      return response.data.map(batch => ({ id: batch.idBatch, name: batch.name }));
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

      const response = await $fetch<AdminTestResult[]>(`${useRuntimeConfig().public.API_URL}/results/${batchId.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      results.value = response;
    } catch (e: any) {
      error.value = e;
    } finally {
      isLoading.value = false;
    }
  };

  watch(batchId, fetchData, { immediate: true });
  return { results, isLoading, error, refresh: fetchData };
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

  console.log("data", data);
  

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