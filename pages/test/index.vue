<template>
  <div>
    <!-- Section Navigation Bar -->
        <nav id="sectionNavBar" class="bg-primary flex justify-center space-x-4 md:space-x-8 pt-4">
          <button v-for="(item, index) in sections" :class="currentSectionIndex === index ? 'active-section' : ''" class="section-nav-button text-white text-lg font-medium px-4 py-2 rounded-t-lg hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent">{{item.name}}</button>
        </nav>
    <!-- Konten Utama Aplikasi -->
    <main class="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

        <!-- Sidebar / Ringkasan Tes (Dapat dilipat) -->
        <aside id="sidebar" class="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit top-4 sidebar-transition">
            <div id="sidebarContent">
                <h2 class="text-2xl font-semibold mb-6 text-gray-800">Ringkasan Tes</h2>
                <div class="flex items-center justify-between mb-3">
                    <span class="text-gray-600">Waktu Tersisa:</span>
                    <span id="timer" class="text-blue-600 font-bold text-lg">00:00</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Progress:</span>
                    <span id="progressText" class="text-blue-600 font-bold text-lg">0/0</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div id="progressBar" class="bg-blue-600 h-2.5 rounded-full" style="width: 0%;"></div>
                </div>

                <div class="mt-8 pt-6 border-t border-gray-200">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">Navigasi Pertanyaan</h3>
                    <div id="questionNavigationGrid" class="grid grid-cols-5 gap-2">
                        <button id="q-btn-R2" class="p-2 rounded-md font-semibold text-sm transition duration-200 ease-in-out bg-gray-200 text-gray-700 hover:bg-gray-300">2</button>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Area Konten Utama -->
        <section id="mainContentArea" class="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg sidebar-transition">
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
      :question-data="currentQuestion"
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
      <h2 class="text-3xl font-bold mb-4">Kuis Selesai!</h2>
      <p class="mb-6">Anda telah menyelesaikan semua bagian kuis.</p>
      <p class="text-2xl font-semibold mb-6">Skor Anda: {{ calculateScore() }} dari {{ totalQuestionsAnswered }}</p>
      <button @click="resetQuiz" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
        Mulai Ulang Kuis
      </button>
    </div>
        </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
// -------------------- IMPORTS --------------------
import CustomAudioPlayer from '@/components/CustomAudioPlayer/index.vue';
import { DataSoal } from '@/data/DataSoal';

// -------------------- DECLARATIONS --------------------
// Definisi data bagian dan pertanyaan
const sections = ref(DataSoal);
const quizState = ref<'intro' | 'questions' | 'finished'>('intro');
const currentSectionIndex = ref<number>(0);
const currentGroupIndex = ref<number>(0); // Indeks grup saat ini dalam bagian
const currentQuestionIndex = ref<number>(0);




// ------------------------- FUNCTIONS -------------------------
// const renderSectionIntro = () => {
//     const currentSection = sections[currentSectionIndex.value];
//     introSectionTitle.value = `Mulai Bagian: ${currentSection.name}`;
//     introInstructions.value = currentSection.instructions;
//     audioInstructions.value = currentSection.audioInstructions || '';
// }
// const goToSection = (index: number) => {
//     currentSectionIndex.value = index;
//     renderSectionIntro();
// }
// ------------------------- ONLOAD -------------------------
// renderSectionIntro()


// ------------------------- copy ----------------------------

// Definisikan tipe untuk struktur data

// Status kuis: 'intro', 'questions', 'finished'

// Computed property untuk bagian saat ini
const currentSection = computed<Section | null>(() => {
  if (currentSectionIndex.value < sections.value.length) {
    return sections.value[currentSectionIndex.value];
  }
  return null;
});

// Computed property untuk grup pertanyaan saat ini
const currentGroup = computed<QuestionGroup | null>(() => {
  if (currentSection.value && currentSection.value.groups && currentGroupIndex.value < currentSection.value.groups.length) {
    return currentSection.value.groups[currentGroupIndex.value];
  }
  return null;
});

// Computed property untuk pertanyaan saat ini
const currentQuestion = computed<Question | null>(() => {
  if (currentGroup.value && currentGroup.value.questions && currentQuestionIndex.value < currentGroup.value.questions.length) {
    // Gabungkan properti passage/audioUrl dari grup ke objek pertanyaan
    const question = currentGroup.value.questions[currentQuestionIndex.value];
    return {
      ...question,
      passage: currentGroup.value.passage || question.passage, // Prioritaskan passage dari grup
      audioUrl: currentGroup.value.audioUrl || question.audioUrl // Prioritaskan audioUrl dari grup
    };
  }
  return null;
});

// Computed property untuk memeriksa apakah ini pertanyaan pertama di bagian ini
const isFirstQuestionOfSection = computed<boolean>(() => {
  return currentSectionIndex.value === 0 && currentGroupIndex.value === 0 && currentQuestionIndex.value === 0;
});

// Computed property untuk memeriksa apakah ini pertanyaan terakhir di bagian ini
const isLastQuestionOfSection = computed<boolean>(() => {
  if (!currentSection.value || !currentSection.value.groups) return false;
  const lastGroupIndex = currentSection.value.groups.length - 1;
  const lastGroup = currentSection.value.groups[lastGroupIndex];
  if (!lastGroup || !lastGroup.questions) return false;
  const lastQuestionInLastGroupIndex = lastGroup.questions.length - 1;

  return (
    currentGroupIndex.value === lastGroupIndex &&
    currentQuestionIndex.value === lastQuestionInLastGroupIndex
  );
});

// Computed property untuk total pertanyaan yang dijawab (untuk skor)
const totalQuestionsAnswered = computed<number>(() => {
  let count = 0;
  sections.value.forEach(section => {
    section.groups?.forEach(group => { // Iterasi melalui grup
      count += group.questions.length;
    });
  });
  return count;
});

// Fungsi untuk memulai bagian saat ini (dipanggil dari SectionIntroScreen)
const startCurrentSection = () => {
  quizState.value = 'questions';
  currentGroupIndex.value = 0; // Pastikan mulai dari grup pertama di bagian baru
  currentQuestionIndex.value = 0; // Pastikan mulai dari pertanyaan pertama di grup pertama
};

// Fungsi untuk memperbarui jawaban pengguna di array `sections` utama
const updateUserAnswer = ({ questionId, answer }: { questionId: string; answer: string | null }) => {
  const section = sections.value[currentSectionIndex.value];
  if (section && section.groups) {
    const group = section.groups[currentGroupIndex.value]; // Dapatkan grup saat ini
    if (group && group.questions) {
      const question = group.questions.find((q) => q.id === questionId);
      if (question) {
        question.userAnswer = answer;
        console.log(`Memperbarui pertanyaan ${questionId} dengan jawaban: ${answer}`);
      }
    }
  }
};

// Fungsi untuk menangani navigasi ke pertanyaan berikutnya
const handleNextQuestion = ({ questionId, answer }: { questionId: string; answer: string | null }) => {
  // Simpan jawaban untuk pertanyaan saat ini
  updateUserAnswer({ questionId, answer });

  if (currentGroup.value && currentQuestionIndex.value < currentGroup.value.questions.length - 1) {
    // Masih ada pertanyaan di grup ini
    currentQuestionIndex.value++;
  } else {
    // Ini adalah pertanyaan terakhir di grup saat ini
    if (currentSection.value && currentGroupIndex.value < currentSection.value.groups.length - 1) {
      // Pindah ke grup berikutnya di bagian ini
      currentGroupIndex.value++;
      currentQuestionIndex.value = 0; // Reset indeks pertanyaan untuk grup baru
    } else {
      // Ini adalah grup terakhir di bagian saat ini
      if (currentSectionIndex.value < sections.value.length - 1) {
        // Pindah ke bagian berikutnya
        currentSectionIndex.value++;
        currentGroupIndex.value = 0; // Reset indeks grup untuk bagian baru
        currentQuestionIndex.value = 0; // Reset indeks pertanyaan untuk bagian baru
        quizState.value = 'intro'; // Kembali ke layar pengantar bagian berikutnya
      } else {
        // Semua bagian dan grup selesai
        quizState.value = 'finished';
      }
    }
  }
};

// Fungsi untuk menangani navigasi ke pertanyaan sebelumnya
const handlePrevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    // Masih ada pertanyaan sebelumnya di grup ini
    currentQuestionIndex.value--;
  } else {
    // Ini adalah pertanyaan pertama di grup saat ini
    if (currentGroupIndex.value > 0) {
      // Pindah ke grup sebelumnya di bagian ini
      currentGroupIndex.value--;
      // Atur indeks pertanyaan ke pertanyaan terakhir dari grup sebelumnya
      if (currentSection.value && currentSection.value.groups && currentSection.value.groups[currentGroupIndex.value]) {
        currentQuestionIndex.value = currentSection.value.groups[currentGroupIndex.value].questions.length - 1;
      }
    } else {
      // Ini adalah grup pertama di bagian saat ini
      if (currentSectionIndex.value > 0) {
        // Pindah ke bagian sebelumnya
        currentSectionIndex.value--;
        quizState.value = 'intro'; // Kembali ke layar pengantar bagian sebelumnya
        // Tidak perlu mengatur currentGroupIndex atau currentQuestionIndex di sini,
        // karena akan diatur ulang saat bagian dimulai kembali.
      }
    }
  }
};

// Fungsi untuk menghitung skor akhir
const calculateScore = (): number => {
  let score = 0;
  sections.value.forEach(section => {
    section.groups?.forEach(group => {
      group.questions.forEach(question => {
        if (question.userAnswer !== null && question.userAnswer === question.correctAnswer) {
          score++;
        }
      });
    });
  });
  return score;
};

// Fungsi untuk mereset kuis ke awal
const resetQuiz = () => {
  currentSectionIndex.value = 0;
  currentGroupIndex.value = 0; // Reset indeks grup
  currentQuestionIndex.value = 0;
  quizState.value = 'intro';
  // Reset semua jawaban pengguna
  sections.value.forEach(section => {
    section.groups?.forEach(group => {
      group.questions.forEach(question => {
        question.userAnswer = null;
      });
    });
  });
};
</script>

<style scoped>
.section-nav-button {
            transition: all 0.2s ease-in-out;
            border-bottom: 3px solid transparent; /* Default transparent bottom border */
            padding-bottom: 0.75rem; /* pb-3 */
        }
        .section-nav-button.active-section {
            border-color: #ffffff; /* White border for active section */
            font-weight: 700; /* font-bold */
        }
</style>