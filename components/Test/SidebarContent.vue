<template>
  <div class="sidebar-container">
    <!-- Header Ringkasan -->
    <div class="bg-emerald-600 p-6 text-white relative">
      <div class="absolute top-0 right-0 p-4 opacity-10">
        <Icon name="heroicons:clipboard-document-check" class="w-16 h-16" />
      </div>
      <h2 class="text-xl font-bold relative z-10">Ringkasan Ujian</h2>
      <p class="text-emerald-100 text-xs mt-1 relative z-10 opacity-80 uppercase tracking-widest font-bold">Informasi Sesi Ini</p>
    </div>

    <!-- Stats Content -->
    <div class="p-6 space-y-6">
      <!-- Timer Card -->
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div class="flex items-center space-x-3 text-gray-500 font-bold text-xs uppercase tracking-tight">
          <Icon name="heroicons:clock" class="w-5 h-5 text-emerald-500" />
          <span>Sisa Waktu</span>
        </div>
        <span class="text-2xl font-black text-gray-800 tabular-nums tracking-tight">
          {{ formattedTime }}
        </span>
      </div>

      <!-- Progress Tracking -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:check-badge" class="w-4 h-4 text-emerald-500" />
            <span class="text-xs font-bold text-gray-500 uppercase">Progress</span>
          </div>
          <span class="text-emerald-600 font-black text-sm">
            {{ answeredCount }} <span class="text-gray-400 font-medium">/ {{ itemCount }}</span>
          </span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div class="bg-emerald-500 h-full rounded-full transition-all duration-500 relative shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
               :style="{ width: `${progress}%` }">
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      <!-- Question Navigation -->
      <div class="pt-6 border-t border-gray-50">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
          <Icon name="heroicons:list-bullet" class="w-4 h-4 mr-2" />
          Navigasi Soal
        </h3>
        <div class="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          <button 
            v-for="(question, index) in questions" 
            :key="question.id"
            @click="$emit('goToQuestion', question.groupIndex, question.questionIndexInGroup)"
            :class="getNavButtonClass(question, index)"
            class="aspect-square flex items-center justify-center rounded-xl font-black text-sm transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  itemCount: number;
  answeredCount: number;
  progress: number;
  formattedTime: string;
  questions: any[];
  getNavButtonClass: (question: any, index: number) => string;
}>();

defineEmits(['goToQuestion']);
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s linear infinite;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
