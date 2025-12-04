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
      catch (e) {
        showNotification('Terjadi kesalahan saat otentikasi.', 'error');
      }
    },
  });

  return { data, pending, error };
}