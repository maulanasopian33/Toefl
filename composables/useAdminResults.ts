import { ref, watch, type Ref } from 'vue';
import { useFirebaseToken } from './FirebaseToken';

/**
 * @interface AdminTestResult
 * @description Mendefinisikan struktur data untuk hasil tes dari perspektif admin.
 */
export interface AdminTestResult {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  nim: string;
  batchName: string;
  completedDate: string;
  score: number;
  sectionScores: Record<string, number>;
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
 * @interface AdminBatch
 * @description Mendefinisikan struktur data untuk sebuah batch.
 */
export interface AdminBatch {
  id: string;
  name: string;
}

// --- Data Mockup untuk Admin ---
const mockAdminResults: AdminTestResult[] = [
  {
    id: 'res-001',
    userId: 'user-abc',
    userName: 'Ahmad Subarjo',
    userEmail: 'ahmad.s@example.com',
    batchName: 'TOAFL September',
    completedDate: '2025-12-05T01:38:25.000Z',
    score: 450,
    sectionScores: { 
      "Istima'": 45, 
      "Tarakib": 44, 
      "Qira'ah": 46 
    },
  },
  {
    id: 'res-002',
    userId: 'user-def',
    userName: 'Siti Aminah',
    userEmail: 'siti.a@example.com',
    batchName: 'TOAFL September',
    completedDate: '2025-12-05T01:30:20.000Z',
    score: 520,
    sectionScores: { 
      "Istima'": 52, 
      "Tarakib": 51, 
      "Qira'ah": 53 
    },
  },
  {
    id: 'res-003',
    userId: 'user-ghi',
    userName: 'Budi Santoso',
    userEmail: 'budi.s@example.com',
    batchName: 'TOAFL Oktober',
    completedDate: '2025-10-20T10:15:00.000Z',
    score: 495,
    sectionScores: { 
      "Istima'": 50, 
      "Tarakib": 49, 
      "Qira'ah": 50
    },
  },
];

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
      return response.data.map(batch => ({ id: batch.idBatch, name: batch.namaBatch }));
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

      // Mengambil data hasil tes berdasarkan ID batch
      // Tipe untuk respons API /results/{id} yang baru
      type ApiUserResult = {
        userId: string;
        userName: string;
        userEmail: string;
        namaLengkap: string;
        nim: string;
        results: AdminTestResult[];
      };

      const response = await $fetch<ApiUserResult[]>(`${useRuntimeConfig().public.API_URL}/results/${batchId.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Transformasi data: ambil skor tertinggi untuk setiap user
      const processedResults = response.map(user => {
        if (!user.results || user.results.length === 0) {
          return null; // Abaikan user tanpa hasil tes
        }

        // Cari hasil dengan skor tertinggi
        const highestScoreResult = user.results.reduce((max, current) => 
          current.score > max.score ? current : max
        );

        // Gabungkan info user dengan hasil skor tertingginya, dan petakan namaLengkap ke userName
        return { 
          ...highestScoreResult, 
          userId: user.userId,
          userName: user.namaLengkap, // Menggunakan namaLengkap sebagai userName
          userEmail: user.userEmail,
          nim: user.nim };

      }).filter(Boolean) as AdminTestResult[]; // Filter null dan pastikan tipe data benar

      results.value = processedResults;
    } catch (e: any) {
      error.value = e;
    } finally {
      isLoading.value = false;
    }
  };

  watch(batchId, fetchData, { immediate: true });
  return { results, isLoading, error };
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

  return { result: data, isLoading: pending, error, refresh };
};