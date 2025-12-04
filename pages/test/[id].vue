<template>
  <div>
    <!-- Anti-Cheating Wrapper -->
    <AntiCheatWrapper @action-detected="handleCheatingAction">

    <!-- Section Navigation Bar -->
    <nav v-if="testMetadata && testMetadata.sectionOrder.length > 0" id="sectionNavBar" class="bg-gray-800 flex justify-center space-x-4 md:space-x-8 pt-4">
      <button v-for="(item, index) in testMetadata.sectionOrder" :key="item.id" @click="goToSection(index)" :class="currentSectionIndex === index ? 'active-section' : ''" class="section-nav-button text-white text-lg font-medium px-4 py-2 rounded-t-lg hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent">{{item.name}}</button>
    </nav>
    <!-- Konten Utama Aplikasi -->
    <main class="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

        <!-- Sidebar / Ringkasan Tes (Dapat dilipat) -->
        <aside id="sidebar" class="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit top-4 sidebar-transition">
            <div id="sidebarContent">
                <h2 class="text-2xl font-semibold mb-6 text-gray-800">Ringkasan Tes</h2>
                <div class="flex items-center justify-between mb-3">
                    <span class="text-gray-600">Waktu Ujian:</span>
                    <span id="timer" class="text-indigo-600 font-bold text-lg">{{ formattedTime }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Progress:</span>
                    <span id="progressText" class="text-indigo-600 font-bold text-lg">{{ answeredQuestionsCount }} / {{ totalQuestionsCount }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div id="progressBar" class="bg-indigo-600 h-2.5 rounded-full" :style="{ width: `${progressPercentage}%` }"></div>
                </div>

                <div class="mt-8 pt-6 border-t border-gray-200">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">Navigasi Pertanyaan</h3>
                    <div id="questionNavigationGrid" class="grid grid-cols-5 gap-2">
                        <button 
                            v-for="(question, index) in currentSectionQuestions" 
                            :key="question.id"
                            @click="goToQuestion(question.groupIndex, question.questionIndexInGroup)"
                            :class="getNavButtonClass(question, index)"
                            class="p-2 rounded-md font-semibold text-sm transition duration-200 ease-in-out"
                        >{{ index + 1 }}</button>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Area Konten Utama -->
        <section id="mainContentArea" class="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg sidebar-transition">
            <!-- Loading State -->
            <div v-if="isLoadingMetadata || isLoadingSection" class="flex flex-col items-center justify-center h-full text-center p-8">
              <Icon name="lucide:loader-2" class="h-16 w-16 animate-spin text-gray-400 mb-4" />
              <h3 class="text-xl font-semibold text-gray-700">Memuat Data Ujian...</h3>
              <p class="text-gray-500 mt-2">Mohon tunggu sebentar.</p>
            </div>
            <!-- Error State -->
            <div v-else-if="error" class="flex flex-col items-center justify-center h-full text-center text-red-600 text-xl font-semibold p-8">
              <Icon name="lucide:alert-triangle" class="h-16 w-16 text-red-500 mb-4" />
              <p>Terjadi kesalahan: {{ error.message }}</p>
              <p class="text-gray-500 text-base mt-2">Silakan coba muat ulang halaman.</p>
            </div>
            <!-- Tampilkan layar pengantar bagian -->
    <SectionIntroScreen
      v-if="quizState === 'intro' && currentSection"
      :section-title="currentSection.name"
      :instructions="currentSection.instructions"
      :audio-src="currentSection.audioInstructions"
      @startSection="startCurrentSection"
    />

    <!-- Tampilkan pertanyaan -->
    <QuestionView
      v-else-if="quizState === 'questions' && currentQuestion && currentGroup"
      :question-data="{ ...currentQuestion, type: currentSection.name, passage: currentGroup.passage }"
      :question-number="currentQuestionIndex + 1"
      :total-questions="currentGroup.questions.length"
      :is-first="isFirstQuestionOfSection"
      :is-last="isLastQuestionOfSection"
      @next="handleNextQuestion"
      @prev="handlePrevQuestion"
      @update:userAnswer="updateUserAnswer"
    />

    <!-- Tampilkan layar selesai kuis -->
    <div v-else-if="quizState === 'finished'" class="text-center text-gray-700 text-xl font-semibold p-8 bg-white rounded-lg shadow-lg max-w-xl mx-auto my-8">
      <h2 class="text-3xl font-bold mb-4">Ujian Selesai!</h2>
      <p class="mb-6">Anda telah menyelesaikan semua bagian ujian.</p>
      <div v-if="isSubmitting" class="flex flex-col items-center">
        <Icon name="lucide:loader-2" class="h-12 w-12 animate-spin text-indigo-500 mb-4" />
        <p class="text-lg font-semibold mb-6">Menyimpan dan menghitung skor...</p>
      </div>
      <div v-else-if="finalScore">
        <p class="text-lg mb-2">Skor Anda:</p>
        <p class="text-5xl font-bold text-indigo-600 mb-6">{{ finalScore.score }} / {{ finalScore.totalQuestions }}</p>
      </div>
      <button @click="navigateTo('/')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
        Kembali ke Dashboard
      </button>
    </div>
        </section>
    </main>

    </AntiCheatWrapper>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useTestSession, type Section, type Question, type QuestionGroup } from '@/composables/useTestSession';
import AntiCheatWrapper from '@/components/Test/AntiCheatWrapper.vue';
import SectionIntroScreen from '@/components/Test/SectionIntroScreen.vue';
import QuestionView from '@/components/Test/QuestionView.vue';

const route = useRoute();
const testId = route.params.id as string;

const {
  testMetadata, sectionDetails, sectionsData, finalScore,
  isLoadingMetadata, isLoadingSection, isSubmitting, error, fetchTestMetadata,
  fetchSectionData, submitAnswers,
} = useTestSession(testId);

console.log("Meta Data",testMetadata);
console.log("Sections Data",sectionsData);
console.log("final score",finalScore);
  


// --- State Lokal Halaman Ujian ---
const quizState = ref<'intro' | 'questions' | 'finished'>('intro');
const currentSectionIndex = ref(0);
const currentGroupIndex = ref(0);
const currentQuestionIndex = ref(0);
const timeLeft = ref(0);
let timerInterval: NodeJS.Timeout | null = null;

// --- Computed Properties ---
const currentSection = computed<Section | null>(() => sectionsData.value[currentSectionIndex.value] || null);
const currentGroup = computed<QuestionGroup | null>(() => currentSection.value?.groups?.[currentGroupIndex.value] || null);
const currentQuestion = computed<Question | null>(() => currentGroup.value?.questions?.[currentQuestionIndex.value] || null);

const currentSectionQuestions = computed(() => {
  if (!currentSection.value?.groups) return [];
  let questionCounter = 0;
  return currentSection.value.groups.flatMap((group, groupIdx) => 
    group.questions.map((question, questionIdx) => ({
      ...question,
      groupIndex: groupIdx,
      questionIndexInGroup: questionIdx,
    }))
  );
});

const allQuestions = computed(() => {
  return sectionsData.value.flatMap(s => s.groups || []).flatMap(g => g.questions || []);
});

const totalQuestionsCount = computed(() => {
  return testMetadata.value?.totalQuestions || 0;
});

const answeredQuestionsCount = computed(() => allQuestions.value.filter(q => q.userAnswer).length);
console.log("answerd count", answeredQuestionsCount);
console.log("answerd", allQuestions);


const progressPercentage = computed(() => totalQuestionsCount.value > 0 ? (answeredQuestionsCount.value / totalQuestionsCount.value) * 100 : 0);


const isFirstQuestionOfSection = computed(() => currentGroupIndex.value === 0 && currentQuestionIndex.value === 0);
const isLastQuestionOfSection = computed(() => {
  if (!currentSection.value?.groups) return true;
  const lastGroupIndex = currentSection.value.groups.length - 1;
  const lastQuestionIndex = currentSection.value.groups[lastGroupIndex]?.questions.length - 1;
  return currentGroupIndex.value === lastGroupIndex && currentQuestionIndex.value === lastQuestionIndex;
});

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60).toString().padStart(2, '0');
  const seconds = (timeLeft.value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});

// --- Watchers ---
watch(testMetadata, (newMetadata) => {
  if (newMetadata && newMetadata.sectionOrder.length > 0 && sectionsData.value.length === 0) {
    timeLeft.value = newMetadata.totalTime;
    fetchSectionData(newMetadata.sectionOrder[0].id, 0);
  }
}, { immediate: true });

// --- Functions ---
const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      finishQuiz();
    }
  }, 1000);
};

const startCurrentSection = () => {
  quizState.value = 'questions';
  if (currentSectionIndex.value === 0 && currentGroupIndex.value === 0 && currentQuestionIndex.value === 0) {
    startTimer();
  }
};

const updateUserAnswer = (payload: { questionId: string; answer: string | null }) => {
  console.log('updateUserAnswer dipanggil dengan payload:', payload);
  // Cari pertanyaan di sumber data utama (sectionsData) dan perbarui di sana.
  for (const section of sectionsData.value) {
    for (const group of section.groups) {
      const question = group.questions.find(q => q.id === payload.questionId);
      if (question) {
        console.log('Pertanyaan ditemukan, memperbarui jawaban:', question.id);
        question.userAnswer = payload.answer;
        // Log seluruh data pertanyaan setelah diubah untuk verifikasi
        console.log('Data allQuestions setelah diubah:', JSON.parse(JSON.stringify(allQuestions.value)));
        console.log('Jumlah jawaban terhitung:', allQuestions.value.filter(q => q.userAnswer).length);
        return; // Keluar dari loop setelah pertanyaan ditemukan dan diperbarui.
      }
    }
  }
  console.warn('Pertanyaan dengan ID', payload.questionId, 'tidak ditemukan di sectionsData.');
};

const handleNextQuestion = async () => {
  console.log('handleNextQuestion dipanggil.');
  console.log('Pertanyaan saat ini:', JSON.parse(JSON.stringify(currentQuestion.value)));
  if (currentGroup.value && currentQuestionIndex.value < currentGroup.value.questions.length - 1) {
    currentQuestionIndex.value++;
  } else if (currentSection.value && currentGroupIndex.value < currentSection.value.groups.length - 1) {
    currentGroupIndex.value++;
    currentQuestionIndex.value = 0;
  } else if (testMetadata.value && currentSectionIndex.value < testMetadata.value.sectionOrder.length - 1) {
    currentSectionIndex.value++;
    currentGroupIndex.value = 0;
    currentQuestionIndex.value = 0;
    quizState.value = 'intro';
    await fetchSectionData(testMetadata.value.sectionOrder[currentSectionIndex.value].id, currentSectionIndex.value);
  } else {
    finishQuiz();
  }
};

const handlePrevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  } else if (currentGroupIndex.value > 0) {
    currentGroupIndex.value--;
    currentQuestionIndex.value = currentSection.value?.groups[currentGroupIndex.value].questions.length - 1 || 0;
  }
};

const finishQuiz = async () => {
  if (timerInterval) clearInterval(timerInterval);
  quizState.value = 'finished';
  const allAnswers = sectionsData.value
    .flatMap(s => s.groups || [])
    .flatMap(g => g.questions)
    .filter(q => q.userAnswer)
    .map(q => ({ questionId: q.id, userAnswer: q.userAnswer! }));
  await submitAnswers(allAnswers);
};

const goToSection = async (index: number) => {
  if (index < currentSectionIndex.value || sectionsData.value[index]) {
    currentSectionIndex.value = index;
    currentGroupIndex.value = 0;
    currentQuestionIndex.value = 0;
    quizState.value = 'intro';
  }
};

const goToQuestion = (groupIndex: number, questionIndex: number) => {
  currentGroupIndex.value = groupIndex;
  currentQuestionIndex.value = questionIndex;
  if (quizState.value === 'intro') {
    quizState.value = 'questions';
  }
};

const getNavButtonClass = (question: any, index: number) => {
  const isCurrent = question.groupIndex === currentGroupIndex.value && question.questionIndexInGroup === currentQuestionIndex.value;
  if (isCurrent) {
    return 'bg-indigo-600 text-white ring-2 ring-indigo-400';
  }
  if (question.userAnswer) {
    return 'bg-green-200 text-green-800 hover:bg-green-300';
  }
  return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
};

const handleCheatingAction = (details: { type: string, duration?: number }) => {
  console.warn('Tindakan tidak diizinkan terdeteksi:', details);
  // Anda bisa menambahkan logika penalti di sini, misalnya mengirim log ke server.
};

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.bg-primary {
  background-color: #4a5568; /* Contoh: abu-abu gelap */
}
.active-section {
  background-color: #2d3748; /* Lebih gelap untuk section aktif */
  border-bottom: 3px solid #63b3ed; /* Aksen biru */
}
.sidebar-transition {
  transition: all 0.3s ease-in-out;
}
</style>