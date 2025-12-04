<template>
  <div>
    <!-- Header Pertanyaan -->
    <div class="mb-6 border-b border-gray-200 pb-4">
      <p class="text-sm text-gray-500">Pertanyaan {{ questionNumber }} dari {{ totalQuestions }}</p>
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