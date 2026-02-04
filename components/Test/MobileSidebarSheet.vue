<template>
  <Transition name="slide-up">
    <div v-if="isOpen" class="fixed inset-0 z-[70] flex flex-col justify-end lg:hidden">
      <!-- Backdrop -->
      <div @click="$emit('close')" class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

      <!-- Main Sheet Container -->
      <div class="relative w-full bg-white/90 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-white/50 overflow-hidden max-h-[85vh] flex flex-col">
        
        <!-- Animated Background Elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <!-- Drag Handle / Header -->
        <div class="flex-shrink-0 pt-4 pb-2 flex justify-center cursor-grab active:cursor-grabbing" @click="$emit('close')">
          <div class="w-12 h-1.5 bg-gray-300/80 rounded-full hover:bg-gray-400 transition-colors"></div>
        </div>

        <!-- Header Content -->
        <div class="px-6 pb-4 flex items-center justify-between border-b border-gray-100/50 flex-shrink-0 relative z-10">
          <div>
            <h2 class="text-xl font-black text-gray-800 tracking-tight">Ringkasan Ujian</h2>
            <p class="text-emerald-600 font-bold text-xs uppercase tracking-widest mt-0.5">Mobile Dashboard</p>
          </div>
          <button @click="$emit('close')" class="p-2 bg-gray-100/80 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-grow overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar relative z-10">
          
          <!-- Timer & Progress Card -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Timer -->
            <div class="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-center items-center text-center space-y-1 relative overflow-hidden group">
              <div class="absolute inset-0 bg-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Icon name="heroicons:clock" class="w-6 h-6 text-emerald-600 mb-1" />
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sisa Waktu</span>
              <span class="text-2xl font-black text-gray-800 tabular-nums tracking-tight">{{ formattedTime }}</span>
            </div>

            <!-- Progress -->
            <div class="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-center items-center text-center space-y-1 relative overflow-hidden group">
              <div class="absolute inset-0 bg-indigo-100/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Icon name="heroicons:chart-pie" class="w-6 h-6 text-indigo-600 mb-1" />
              <div class="flex flex-col items-center">
                 <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                 <span class="text-xl font-black text-gray-800">
                    {{ answeredCount }}<span class="text-xs text-gray-400 font-bold">/{{ itemCount }}</span>
                 </span>
              </div>
            </div>
          </div>

          <!-- Progress Bar Visual -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs font-bold text-gray-500">
              <span>Kelengkapan Jawaban</span>
              <span>{{ Math.round(progress) }}%</span>
            </div>
            <div class="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full relative transition-all duration-500" :style="{ width: `${progress}%` }">
                 <div class="absolute inset-0 bg-white/30 animate-[shimmer_2s_linear_infinite]"></div>
              </div>
            </div>
          </div>

          <!-- Question Grid -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2 text-gray-800 border-b border-gray-100 pb-2">
              <Icon name="heroicons:squares-2x2" class="w-5 h-5 text-emerald-600" />
              <h3 class="font-black text-sm uppercase tracking-widest">Navigasi Soal</h3>
            </div>
            
            <div class="grid grid-cols-5 gap-3">
              <button 
                v-for="(question, index) in questions" 
                :key="question.id"
                @click="$emit('goToQuestion', question.groupIndex, question.questionIndexInGroup)"
                :class="getNavButtonClass(question, index)"
                class="aspect-square flex items-center justify-center rounded-xl font-black text-sm transition-all duration-200 shadow-sm border border-transparent active:scale-95"
              >
                {{ index + 1 }}
              </button>
            </div>
          </div>

          <!-- Bottom Padding for safe area/scrolling -->
          <div class="h-8"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  itemCount: number;
  answeredCount: number;
  progress: number;
  formattedTime: string;
  questions: any[];
  getNavButtonClass: (question: any, index: number) => string;
}>();

defineEmits(['close', 'goToQuestion']);
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
