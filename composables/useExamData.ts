import type { Ref } from 'vue'

// Definisikan tipe data yang sesuai dengan API Anda
interface Question {
  id: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string | null;
}

interface Group {
  id: string;
  passage: string | null;
  audioUrl: string | null;
  questions: Question[];
}

/**
 * Composable untuk mengambil data ujian dari API dengan autentikasi.
 * @param examId - ID dari ujian yang akan diambil.
 */
export const useExamData = (examId: string) => {
  const { $auth } = useNuxtApp();
  const { showNotification } = useNotification();
  const config = useRuntimeConfig();
  const apiUrl = `${config.public.API_URL}/exams/${examId}`;

  const { data, pending, error } = useFetch<Section[]>(apiUrl, {
    lazy: true,
    default: () => [],
    async onRequest({ options }) {
      try {
        const token = await $auth.currentUser?.getIdToken();
        if (!token) {
          showNotification('Gagal mendapatkan token otentikasi.', 'error');
          return;
        }
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      catch (e: any) {
        showNotification('Terjadi kesalahan saat otentikasi.', 'error');
        const { logToServer } = useLogger();
        logToServer({
          level: 'error',
          message: 'Auth error in useExamData onRequest',
          metadata: { examId, error: e.message }
        });
      }
    },
  });

  const { logToServer } = useLogger();
  watch(error, (newErr) => {
    if (newErr) {
       logToServer({
         level: 'error',
         message: 'Failed to fetch exam data in useExamData',
         metadata: { examId, error: newErr.message }
       });
    }
  });

  return { data, pending, error };
}