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

export interface Section {
  id: string;
  name: string;
  type: string;
  instructions: string;
  groups: Group[];
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
    // lazy: true agar tidak memblokir rendering
    lazy: true,
    // Sediakan nilai default untuk mencegah error
    default: () => [],
  });

  return { data, pending, error };
}