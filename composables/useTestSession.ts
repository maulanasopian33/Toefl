import { ref, onMounted } from 'vue';
import { useFirebaseToken } from './FirebaseToken';

// --- Interfaces ---
export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  question: string;
  options: Option[];
  userAnswer?: string | null; // Untuk menyimpan jawaban pengguna
}

export interface QuestionGroup {
  id: string;
  passage: string | null;
  audioUrl: string | null;
  questions: Question[];
}

export interface Section {
  id: string;
  name: string;
  instructions: string;
  audioInstructions?: string | null;
  groups: QuestionGroup[];
}

export interface TestMetadata {
  id: string;
  name: string;
  totalTime: number;
  sectionOrder: { id: string; name: string }[];
}

export interface SectionDetail {
  id: string;
  name: string;
  questionCount: number;
}

export interface UserAnswerPayload {
  questionId: string;
  userAnswer: string; // ID dari pilihan jawaban
}

// --- Composable ---
export function useTestSession(testId: string) {
  const config = useRuntimeConfig();
  const API_BASE_URL = `${config.public.API_URL}/exams/${testId}`;

  // --- State ---
  const testMetadata = ref<TestMetadata | null>(null);
  const sectionDetails = ref<SectionDetail[]>([]); // State untuk detail section
  const sectionsData = ref<Section[]>([]);
  const finalScore = ref<{ score: number; totalQuestions: number } | null>(null);

  // --- Loading & Error State ---
  const isLoadingMetadata = ref(true);
  const isLoadingSection = ref(false);
  const isSubmitting = ref(false);
  const error = ref<Error | null>(null);

  /**
   * Mengambil metadata tes (nama, waktu, daftar bagian).
   */
  const fetchTestMetadata = async () => {
    isLoadingMetadata.value = true;
    error.value = null;
    try {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Token autentikasi tidak ditemukan.');
      const response = await $fetch<TestMetadata>(`${API_BASE_URL}/metadata`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      testMetadata.value = response;

    } catch (e: any) {
      error.value = e;
    } finally {
      isLoadingMetadata.value = false;
    }
  };

  /**
   * Mengambil data lengkap untuk satu bagian (section) tertentu.
   */
  const fetchSectionData = async (sectionId: string, index: number) => {
    // Hindari fetch ulang jika data sudah ada
    if (sectionsData.value[index]?.groups) return;

    isLoadingSection.value = true;
    error.value = null;
    try {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Token autentikasi tidak ditemukan.');
      const response = await $fetch<Section>(`${API_BASE_URL}/sections/${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      sectionsData.value[index] = response;
    } catch (e: any) {
      error.value = e;
    } finally {
      isLoadingSection.value = false;
    }
  };

  /**
   * Mengirim semua jawaban ke server untuk dihitung skornya.
   */
  const submitAnswers = async (answers: UserAnswerPayload[]) => {
    isSubmitting.value = true;
    error.value = null;
    try {
      const token = await useFirebaseToken();
      if (!token) throw new Error('Token autentikasi tidak ditemukan.');
      const response = await $fetch<{ score: number; totalQuestions: number }>(`${API_BASE_URL}/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { answers },
      });
      finalScore.value = response;
    } catch (e: any) {
      error.value = e;
    } finally {
      isSubmitting.value = false;
    }
  };

  // Panggil metadata saat composable diinisialisasi
  onMounted(fetchTestMetadata);

  return {
    testMetadata, sectionDetails, sectionsData, finalScore,
    isLoadingMetadata, isLoadingSection, isSubmitting, error,
    fetchSectionData, submitAnswers,
  };
}