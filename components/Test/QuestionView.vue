<template>
  <div>
    <!-- Header Pertanyaan -->
    <div class="mb-6 border-b border-gray-200 pb-4">
      <h2 id="questionSectionTitle" class="text-2xl font-semibold mb-6 text-gray-800">
        Bagian {{ questionData.type }} - Pertanyaan {{ questionNumber }} dari {{ totalQuestions }}
      </h2>
    </div>
    <!-- Konten Pertanyaan -->
    <div class="mb-8">
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
        <div id="passageText" class="text-sm md:text-base leading-relaxed whitespace-pre-wrap" v-html="questionData.passage"></div>
      </div>

      <div id="questionText" dir="rtl" class="text-gray-900 text-xl text-right font-medium mb-4">
        <div class="prose prose-lg mt-2 max-w-none" v-html="questionData.question"></div>
      </div>

      <!-- Pilihan Jawaban -->
    <div class="space-y-3">
      <label
        v-for="option in questionData.options"
        :key="option.id"
        class="flex items-center gap-4 rounded-lg border p-4 transition-all duration-200 cursor-pointer"
        :class="{
          'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200': localUserAnswer === option.id,
          'border-gray-200 bg-white hover:bg-gray-50': localUserAnswer !== option.id
        }"
      >
        <input
          type="radio"
          :name="`question-${questionData.id}`"
          :value="option.id"
          v-model="localUserAnswer"
          class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span class="prose prose-sm max-w-none flex-1" v-html="option.text"></span>
      </label>
    </div>
    </div>

    <!-- Tombol Navigasi -->
    <div class="mt-8 flex justify-between border-t border-gray-200 pt-6">
      <button
        @click="$emit('prev')"
        :disabled="isFirst"
        class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon name="lucide:arrow-left" class="h-4 w-4" />
        Sebelumnya
      </button>
      <button
        @click="$emit('next')"
        class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
      >
        {{ isLast ? 'Selesai & Lanjut' : 'Selanjutnya' }}
        <Icon name="lucide:arrow-right" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Question } from '@/composables/useTestSession';

const props = defineProps<{
  questionData: Question;
  questionNumber: number;
  totalQuestions: number;
  isFirst: boolean;
  isLast: boolean;
}>();

const emit = defineEmits(['update:userAnswer', 'next', 'prev']);

const localUserAnswer = ref(props.questionData.userAnswer || null);



// Watch untuk perubahan dari parent (misal saat navigasi nomor soal)
watch(() => props.questionData.userAnswer, (newVal) => {
  localUserAnswer.value = newVal || null;
});

// Watch untuk perubahan lokal dan emit ke parent
watch(localUserAnswer, (newVal) => {
  console.log("local answer",localUserAnswer);
  emit('update:userAnswer', {
    questionId: props.questionData.id,
    answer: newVal
  });
});
</script>