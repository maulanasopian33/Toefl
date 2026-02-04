<template>
  <div class="question-view space-y-8 animate-fade-in-up">
    <!-- Header Pertanyaan -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
      <div class="space-y-1">
        <div class="flex items-center space-x-2 text-emerald-600">
          <Icon name="heroicons:document-text" class="w-5 h-5" />
          <span class="text-xs font-black uppercase tracking-widest">{{ questionData.type }}</span>
        </div>
        <h2 :class="[fontSizeClasses.title]" class="font-black text-gray-900">Pertanyaan {{ questionNumber }} dari {{ totalQuestions }}</h2>
      </div>
      
      <!-- Quick Status -->
      <div class="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center space-x-2">
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span class="text-xs font-bold text-emerald-700 uppercase tracking-tight">Sesi Aktif</span>
      </div>
    </div>

    <!-- Konten Utama: Passage & Soal -->
    <div class="grid grid-cols-1 gap-8">
      <!-- Media: Group Audio (Passage) -->
      <div v-if="questionData.groupAudio" class="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50 shadow-inner space-y-3">
        <div class="flex items-center space-x-3 text-indigo-600">
          <Icon name="heroicons:speaker-wave" class="w-5 h-5" />
          <span class="text-xs font-black uppercase tracking-widest">Dengarkan Teks/Audio Reading</span>
        </div>
        <audio controls :src="`${config.public.MEDIA_URL}${questionData.groupAudio}`" class="w-full"></audio>
      </div>

      <!-- Media: Question Audio -->
      <div v-if="questionData.audioUrl" class="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 shadow-inner space-y-3">
        <div class="flex items-center space-x-3 text-gray-500">
          <Icon name="heroicons:speaker-wave" class="w-5 h-5" />
          <span class="text-xs font-black uppercase tracking-widest">Dengarkan Pertanyaan</span>
        </div>
        <audio controls :src="`${config.public.MEDIA_URL}${questionData.audioUrl}`" class="w-full"></audio>
      </div>

      <!-- Passage Area -->
      <div v-if="questionData.passage" 
           class="bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-100/50 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Icon name="heroicons:book-open" class="w-20 h-20" />
        </div>
        <h3 class="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center">
          <Icon name="heroicons:bars-3-bottom-right" class="w-4 h-4 mr-2" />
          Teks Bacaan (Passage)
        </h3>
        <div dir="rtl" :class="[fontSizeClasses.prose, 'leading-relaxed font-arabic text-right custom-scrollbar max-h-96 overflow-y-auto pr-2']" v-html="questionData.passage"></div>
      </div>

      <!-- Question Text -->
      <div class="space-y-6">
        <div dir="rtl" class="bg-white p-6 rounded-2xl border-r-4 border-emerald-500 shadow-sm">
          <div :class="[fontSizeClasses.question]" class="max-w-none text-gray-900 font-bold text-right" v-html="questionData.question"></div>
        </div>

        <!-- Jawaban (Options) -->
        <div class="grid grid-cols-1 gap-4">
          <label
            v-for="(option, index) in questionData.options"
            :key="option.id"
            class="group relative flex items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-300 cursor-pointer overflow-hidden"
            :class="[
              localUserAnswer === option.id 
                ? 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10' 
                : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-gray-50'
            ]"
          >
            <!-- Option Indicator (A, B, C, D) -->
            <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all duration-300"
                 :class="[
                   localUserAnswer === option.id 
                     ? 'bg-emerald-600 text-white translate-x-1' 
                     : 'bg-gray-100 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                 ]">
              {{ String.fromCharCode(65 + index) }}
            </div>

            <input
              type="radio"
              :name="`question-${questionData.id}`"
              :value="option.id"
              v-model="localUserAnswer"
              class="hidden"
            />
            
            <div :class="[fontSizeClasses.option]" class="prose max-w-none font-bold text-gray-700" v-html="option.text"></div>

            <!-- Check Icon when selected -->
            <div v-if="localUserAnswer === option.id" class="absolute right-4">
              <Icon name="heroicons:check-circle-solid" class="w-6 h-6 text-emerald-600 animate-bounce-in" />
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Tombol Navigasi -->
    <div class="flex items-center justify-between pt-8 border-t border-gray-100">
      <button
        @click="$emit('prev')"
        :disabled="isFirst"
        class="flex items-center gap-2 px-5 text-xs md:text-base py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:grayscale transition-all"
      >
        <Icon name="heroicons:arrow-long-left" class="w-5 h-5" />
        <span>Sebelumnya</span>
      </button>

      <button
        @click="$emit('next')"
        class="group flex items-center text-xs md:text-base gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
      >
        <span>{{ isLast ? 'Selesai & Lanjut' : 'Selanjutnya' }}</span>
        <Icon name="heroicons:arrow-long-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Question } from '@/composables/useTestSession';
const config = useRuntimeConfig();
const props = defineProps<{
  questionData: Question;
  questionNumber: number;
  totalQuestions: number;
  isFirst: boolean;
  isLast: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
}>();

const emit = defineEmits(['update:userAnswer', 'next', 'prev']);

const localUserAnswer = ref(props.questionData.userAnswer || null);

const fontSizeClasses = computed(() => {
  switch (props.fontSize) {
    case 'small':
      return {
        title: 'text-lg',
        prose: 'prose prose-sm',
        question: 'text-lg',
        option: 'text-xs'
      };
    case 'large':
      return {
        title: 'text-3xl',
        prose: 'prose prose-xl',
        question: 'text-2xl',
        option: 'text-lg'
      };
    case 'extra-large':
      return {
        title: 'text-4xl',
        prose: 'prose prose-2xl',
        question: 'text-3xl',
        option: 'text-xl'
      };
    default:
      return {
        title: 'text-xl md:text-2xl',
        prose: 'prose prose-lg',
        question: 'text-xl md:text-2xl',
        option: 'text-sm'
      };
  }
});

// Sync with parent when navigating
watch(() => props.questionData.userAnswer, (newVal) => {
  localUserAnswer.value = newVal || null;
});

// Emit changes to parent
watch(localUserAnswer, (newVal) => {
  emit('update:userAnswer', {
    questionId: props.questionData.id,
    answer: newVal
  });
});
</script>

<style scoped>
.question-view {
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-bounce-in {
  animation: bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.font-arabic {
  font-family: 'Amiri', 'Traditional Arabic', serif;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-emerald-200 rounded-full;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-emerald-300;
}
</style>