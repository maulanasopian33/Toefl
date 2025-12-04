<template>
  <div id="questionView" class="p-6 md:p-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto my-8 cursor-default select-none">
    <h2 id="questionSectionTitle" class="text-2xl font-semibold mb-6 text-gray-800">
      Bagian {{ questionData.type }} - Pertanyaan {{ questionNumber }} dari {{ totalQuestions }}
    </h2>

    <!-- Konten Pertanyaan -->
    <div class="mb-8">
      <p id="instructionText" class="text-gray-700 text-lg leading-relaxed mb-4">
        Bacalah paragraf berikut dengan seksama dan jawablah pertanyaan di bawahnya.
      </p>

      <!-- Audio Player (Hidden by default for Reading Section) -->
      <div
        id="audioPlayerContainer"
        class="bg-gray-100 p-4 rounded-lg mb-6 shadow-sm"
        :class="{ hidden: !questionData.audioUrl }"
      >
        <audio id="audioPlayer" controls class="w-full rounded-md">
          <source :src="questionData.audioUrl" type="audio/mpeg" />
          Browser Anda tidak mendukung elemen audio.
        </audio>
        <p class="text-sm text-gray-500 mt-2 text-center">Dengarkan audio di atas.</p>
      </div>

      <!-- Passage Area -->
      <div
        v-if="questionData.passage"
        id="passageArea" dir="rtl"
        class="bg-gray-50 p-4 text-right rounded-lg border border-gray-200 text-gray-800 mb-6 max-h-80 overflow-y-auto custom-scrollbar"
      >
        <p id="passageText" class="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {{ questionData.passage }}
        </p>
      </div>

      <p id="questionText" dir="rtl" class="text-gray-900 text-xl text-right font-medium mb-4">
        {{ questionData.question }}
      </p>

      <!-- Pilihan Jawaban -->
      <div id="answerOptions" class="space-y-4" dir="rtl">
        <label
          v-for="(option, index) in questionData.options"
          :key="index"
          class="bg-gray-100 p-4 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer transition duration-200 ease-in-out flex items-center"
          :class="{ 'bg-blue-100 border-blue-400': selectedAnswer === option }"
        >
          <input
            type="radio"
            :name="`answer-${questionData.id}`"
            :value="option"
            v-model="selectedAnswer"
            class="mx-3 form-radio text-blue-600 focus:ring-blue-500 h-5 w-5"
            @change="handleOptionChange"
          />
          <span class="text-gray-800 text-base flex-grow">{{ getOptionLabel(index) }}. {{ option }}</span>
        </label>
      </div>
    </div>

    <!-- Tombol Navigasi -->
    <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <button
        id="prevButton"
        @click="$emit('prev')"
        :disabled="isFirst"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        
      </button>
      <button
        id="nextButton"
        @click="nextQuestion"
        :disabled="isLast && (questionData.options ? !selectedAnswer : false)"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        
        <svg
          class="w-5 h-5 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts"> // Tambahkan lang="ts" untuk TypeScript
import { ref, watch, onMounted } from 'vue';

interface Option {
  id: string;
  text: string;
}

// Definisikan tipe untuk questionData
interface QuestionData {
  id: string;
  type: string;
  passage?: string; // Opsional karena mungkin tidak selalu ada (misal di writing/speaking)
  audioUrl?: string; // Opsional
  question: string;
  options?: Option[]; // Diubah menjadi array of Option
  correctAnswer?: string; // Opsional
  userAnswer: string | null;
}

// Define props for the component
const props = defineProps<{
  questionData: QuestionData;
  questionNumber: number;
  totalQuestions: number;
  isFirst: boolean;
  isLast: boolean;
}>();

// Define emits for parent communication with types
const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'prev'): void;
  (e: 'update:userAnswer', payload: { questionId: string; answer: string | null }): void;
}>();

// Reactive state for the selected answer
const selectedAnswer = ref<string | null>(props.questionData.userAnswer); // Akan menyimpan ID Opsi

// Watch for changes in questionData.userAnswer to update selectedAnswer
// This is important when navigating between questions that might already have an answer
watch(
  () => props.questionData.userAnswer,
  (newValue) => {
    selectedAnswer.value = newValue;
  },
  { immediate: true } // Run immediately on component mount
);

// Handle radio button change
const handleOptionChange = () => {
  // Emit the updated user answer to the parent
  emit('update:userAnswer', {
    questionId: props.questionData.id,
    answer: selectedAnswer.value,
  });
};

// Handle next button click
const nextQuestion = () => {
  emit('next');
};

// Helper function to get option labels (A, B, C, D)
const getOptionLabel = (index: number) => {
  return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
};

// If it's a listening question, ensure audio plays
onMounted(() => {
  if (props.questionData.audioUrl) {
    const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
    if (audioPlayer) {
      audioPlayer.load(); // Load the audio source
      // You might want to add audioPlayer.play() here, but often auto-play is blocked by browsers.
      // It's better to let the user manually play it.
    }
  }
});
</script>

<style scoped>
/* Custom scrollbar for passage area */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
