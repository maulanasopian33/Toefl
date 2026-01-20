<template>
  <div class="min-h-screen bg-gray-50/50 flex flex-col">
    <!-- Anti-Cheating Wrapper -->
    <AntiCheatWrapper @action-detected="handleCheatingAction">

      <!-- Sophisticated Sticky Navigation Bar -->
      <nav v-if="testMetadata && testMetadata.sectionOrder.length > 0" id="sectionNavBar" 
           class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4">
        <div class="max-w-7xl mx-auto flex justify-center">
          <div class="flex space-x-1 md:space-x-4">
            <button v-for="(item, index) in testMetadata.sectionOrder" 
                    :key="item.id" 
                    @click="goToSection(index)" 
                    :class="[
                      currentSectionIndex === index 
                        ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50' 
                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                    ]" 
                    class="relative px-6 py-4 text-sm font-bold transition-all duration-300 border-b-2 outline-none">
              {{ item.name }}
              <div v-if="currentSectionIndex === index" class="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Application Content -->
      <main class="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

        <!-- Sidebar / Ringkasan Ujian (Hidden on mobile, sticky on desktop) -->
        <aside id="sidebar" class="hidden lg:block lg:col-span-3 space-y-6">
          <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-24">
            <SidebarContent 
              :item-count="totalQuestionsCount"
              :answered-count="answeredQuestionsCount"
              :progress="progressPercentage"
              :formatted-time="formattedTime"
              :questions="currentSectionQuestions"
              :get-nav-button-class="getNavButtonClass"
              @go-to-question="goToQuestion"
            />
          </div>
        </aside>

        <!-- Area Konten Utama -->
        <section id="mainContentArea" class="lg:col-span-9">
          <!-- Floating Button for Mobile Sidebar -->
          <button 
            @click="isSidebarOpen = true"
            class="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-600/40 flex items-center justify-center hover:bg-emerald-700 active:scale-90 transition-all border-4 border-white"
          >
            <Icon name="heroicons:list-bullet-solid" class="w-6 h-6" />
            <div v-if="answeredQuestionsCount > 0" class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
              {{ answeredQuestionsCount }}
            </div>
          </button>

          <!-- Mobile Sidebar Modal Overlay -->
          <Transition name="fade">
            <div v-if="isSidebarOpen" 
                 @click.self="isSidebarOpen = false"
                 class="lg:hidden fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[50] flex items-end justify-center p-4">
              <Transition name="slide-up">
                <div v-if="isSidebarOpen" class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                  <div class="absolute top-4 right-4 z-10">
                    <button @click="isSidebarOpen = false" class="p-2 w-10 h-10 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                      <Icon name="heroicons:x-mark" class="w-6 h-6" />
                    </button>
                  </div>
                  <SidebarContent 
                    :item-count="totalQuestionsCount"
                    :answered-count="answeredQuestionsCount"
                    :progress="progressPercentage"
                    :formatted-time="formattedTime"
                    :questions="currentSectionQuestions"
                    :get-nav-button-class="getNavButtonClass"
                    @go-to-question="(g, q) => { goToQuestion(g, q); isSidebarOpen = false; }"
                  />
                </div>
              </Transition>
            </div>
          </Transition>

          <div class="bg-white min-h-[600px] rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 relative overflow-hidden">
            <!-- Decorative Elements -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full opacity-50 blur-3xl"></div>
            <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-50 rounded-full opacity-50 blur-3xl"></div>

            <!-- Loading State -->
            <div v-if="isLoadingMetadata || isLoadingSection" class="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-8 space-y-4">
              <div class="relative">
                <Icon name="svg-spinners:ring-resize" class="h-20 w-20 text-emerald-500" />
                <Icon name="heroicons:document-text" class="absolute inset-0 m-auto h-8 w-8 text-emerald-600" />
              </div>
              <h3 class="text-2xl font-black text-gray-800">Menyiapkan Ujian</h3>
              <p class="text-gray-400 font-medium">Memastikan data sinkron dan aman...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-12 space-y-6">
              <div class="p-4 bg-red-50 rounded-full border border-red-100">
                <Icon name="heroicons:exclamation-triangle" class="h-16 w-16 text-red-500" />
              </div>
              <div class="space-y-2">
                <h2 class="text-2xl font-black text-gray-800">Ups! Terjadi Kesalahan</h2>
                <p class="text-gray-500 font-medium max-w-sm mx-auto">{{ error.message }}</p>
              </div>
              <button @click="fetchTestMetadata" class="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center space-x-2">
                <Icon name="heroicons:arrow-path" class="w-5 h-5" />
                <span>Coba Lagi</span>
              </button>
            </div>

            <!-- Waiting for Exam Start -->
            <div v-else-if="!isTestOpen" class="flex flex-col items-center justify-center h-full min-h-[500px] py-12 px-4 text-center space-y-12">
              <div class="relative">
                <div class="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div class="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border border-emerald-50 ring-1 ring-emerald-100">
                  <Icon name="heroicons:calendar-days" class="h-20 w-20 text-emerald-600" />
                </div>
              </div>

              <div class="space-y-4 max-w-lg mx-auto">
                <h2 class="text-4xl font-black text-gray-900 tracking-tight leading-tight">Ujian Belum Dimulai</h2>
                <p class="text-gray-500 text-lg leading-relaxed font-medium">
                  Persiapkan diri Anda. Ujian akan terbuka secara otomatis dalam:
                </p>
              </div>
              
              <div class="flex flex-wrap justify-center gap-6">
                <div v-for="(val, label) in { Hari: countdown.days, Jam: countdown.hours, Menit: countdown.minutes, Detik: countdown.seconds }" :key="label" 
                     class="group flex flex-col items-center p-6 bg-white min-w-[120px] rounded-3xl border border-gray-100 shadow-sm transition-all hover:border-emerald-200 hover:shadow-emerald-500/10">
                  <span class="text-4xl font-black text-emerald-600 tabular-nums tracking-tighter shadow-emerald-100 drop-shadow-sm group-hover:scale-110 transition-transform">
                    {{ val.toString().padStart(2, '0') }}
                  </span>
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-3">{{ label }}</span>
                </div>
              </div>

              <div class="inline-flex items-center gap-3 px-6 py-2.5 bg-gray-50 text-gray-600 rounded-2xl text-sm font-bold border border-gray-100 shadow-sm">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Menunggu Sinyal Server...
              </div>
            </div>

            <!-- Content Components -->
            <SectionIntroScreen
              v-else-if="quizState === 'intro' && currentSection"
              :section-title="currentSection.name"
              :instructions="currentSection.instructions"
              :audio-src="currentSection.audioInstructions"
              :font-size="testSessionStore.fontSize"
              @startSection="startCurrentSection"
              class="fade-in-up"
            />

            <QuestionView
              v-else-if="quizState === 'questions' && currentQuestion && currentGroup"
              :question-data="{ ...currentQuestion, type: currentSection.name, passage: currentGroup.passage }"
              :question-number="currentQuestionIndex + 1"
              :total-questions="currentGroup.questions.length"
              :is-first="isFirstQuestionOfSection"
              :is-last="isLastQuestionOfSection"
              :font-size="testSessionStore.fontSize"
              @next="handleNextQuestion"
              @prev="handlePrevQuestion"
              @update:userAnswer="updateUserAnswer"
              class="fade-in-up"
            />

            <!-- Finished Screen -->
            <div v-else-if="quizState === 'finished'" class="flex flex-col items-center justify-center h-full min-h-[500px] text-center space-y-10 py-8 relative z-10">
              <div class="relative">
                <div class="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div class="relative w-28 h-28 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-700/30">
                  <Icon name="heroicons:check-badge" class="w-16 h-16 text-white" />
                </div>
              </div>

              <div class="space-y-4 max-w-md mx-auto">
                <h2 class="text-4xl font-black text-gray-900 tracking-tight leading-tight">Ujian Selesai!</h2>
                <p class="text-gray-500 text-lg font-medium">Terima kasih telah menyelesaikan ujian ini dengan jujur.</p>
              </div>

              <div class="w-full max-w-sm p-8 bg-gray-50/80 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 shadow-inner">
                <div v-if="isSubmitting" class="flex flex-col items-center space-y-4">
                  <Icon name="svg-spinners:blocks-scale" class="h-12 w-12 text-emerald-500" />
                  <p class="text-emerald-700 font-bold tracking-tight">Menyimpan Respons Anda...</p>
                </div>
                <div v-else-if="finalScore" class="space-y-2">
                  <p class="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Skor Akhir Anda</p>
                  <p class="text-7xl font-black text-emerald-600 drop-shadow-md">
                    {{ finalScore.score }}<span class="text-gray-300 text-3xl font-medium">/{{ finalScore.totalQuestions }}</span>
                  </p>
                </div>
              </div>

              <button @click="navigateTo('/')" class="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center space-x-3 group">
                <Icon name="heroicons:home" class="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>
        </section>
      </main>

    </AntiCheatWrapper>

    <!-- Accessibility Floating Menu -->
    <AccessibilityFloating 
      :current-size="testSessionStore.fontSize" 
      @update:size="testSessionStore.setFontSize" 
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useTestSession, type Section, type Question, type QuestionGroup } from '@/composables/useTestSession';
import { useTestSessionStore } from '@/stores/testSessionStore';
import AntiCheatWrapper from '@/components/Test/AntiCheatWrapper.vue';
import SectionIntroScreen from '@/components/Test/SectionIntroScreen.vue';
import QuestionView from '@/components/Test/QuestionView.vue';
import SidebarContent from '@/components/Test/SidebarContent.vue';
import AccessibilityFloating from '@/components/Test/AccessibilityFloating.vue';

const route = useRoute();
const testId = route.params.id as string;
const testSessionStore = useTestSessionStore();

definePageMeta({
  middleware: ['auth', 'role-check'],
  permission: "test.read",
  title: 'Sesi Ujian'
});

const {
  testMetadata, sectionDetails, sectionsData, finalScore,
  isLoadingMetadata, isLoadingSection, isSubmitting, error, fetchTestMetadata,
  fetchSectionData, submitAnswers,
} = useTestSession(testId);

// --- State Lokal Halaman Ujian ---
const quizState = ref<'intro' | 'questions' | 'finished'>('intro');
const currentSectionIndex = ref(0);
const currentGroupIndex = ref(0);
const currentQuestionIndex = ref(0);
const timeLeft = ref(0);
const isSidebarOpen = ref(false);
let timerInterval: NodeJS.Timeout | null = null;
let clockInterval: NodeJS.Timeout | null = null;

// --- Time Control Logic ---
const currentTime = ref(new Date());

const scheduledStartTime = computed(() => {
  return testMetadata.value?.start_date ? new Date(testMetadata.value.start_date) : null;
});

const isTestOpen = computed(() => {
  if (!scheduledStartTime.value) return true;
  return currentTime.value >= scheduledStartTime.value;
});

const countdown = computed(() => {
  if (!scheduledStartTime.value) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const diff = scheduledStartTime.value.getTime() - currentTime.value.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
});

onMounted(() => {
  // Add global style for shimmer animation
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-shimmer {
      animation: shimmer 2s linear infinite;
    }
  `;
  document.head.appendChild(style);

  clockInterval = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

// --- Computed Properties ---
const currentSection = computed<Section | null>(() => sectionsData.value[currentSectionIndex.value] || null);
const currentGroup = computed<QuestionGroup | null>(() => currentSection.value?.groups?.[currentGroupIndex.value] || null);
const currentQuestion = computed<Question | null>(() => currentGroup.value?.questions?.[currentQuestionIndex.value] || null);

const currentSectionQuestions = computed(() => {
  if (!currentSection.value?.groups) return [];
  return currentSection.value.groups.flatMap((group, groupIdx) => 
    group.questions.map((question, questionIdx) => ({
      ...question,
      groupIndex: groupIdx,
      questionIndexInGroup: questionIdx,
    }))
  );
});

const allQuestions = computed(() => sectionsData.value.flatMap(s => s.groups || []).flatMap(g => g.questions || []));
const totalQuestionsCount = computed(() => testMetadata.value?.totalQuestions || 0);
const answeredQuestionsCount = computed(() => allQuestions.value.filter(q => q.userAnswer).length);
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

// --- Actions ---
const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--;
    else finishQuiz();
  }, 1000);
};

const startCurrentSection = () => {
  quizState.value = 'questions';
  if (currentSectionIndex.value === 0 && currentGroupIndex.value === 0 && currentQuestionIndex.value === 0) {
    startTimer();
  }
};

const updateUserAnswer = (payload: { questionId: string; answer: string | null }) => {
  for (const section of sectionsData.value) {
    for (const group of section.groups) {
      const question = group.questions.find(q => q.id === payload.questionId);
      if (question) {
        question.userAnswer = payload.answer;
        return;
      }
    }
  }
};

const handleNextQuestion = async () => {
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
  if (isCurrent) return 'bg-gray-900 text-white ring-4 ring-gray-100 z-10';
  if (question.userAnswer) return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:emerald-600';
  return 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700';
};

const handleCheatingAction = (details: { type: string, duration?: number }) => {
  console.warn('Tindakan tidak diizinkan terdeteksi:', details);
};

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
  if (clockInterval) clearInterval(clockInterval);
});
</script>

<style scoped>
.fade-in-up {
  animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Modal Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite;
}
</style>
