<template>
  <Transition name="slide-up">
    <div v-if="currentSource" 
         @contextmenu.prevent 
         class="fixed bottom-6 right-6 z-[60] group select-none">
      
      <!-- Premium Glassmorphism Container -->
      <div class="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-4 md:p-6 w-[280px] md:w-[320px] relative overflow-hidden transition-all duration-500 hover:shadow-emerald-500/10 hover:border-emerald-100/50">
        
        <!-- Animated Background Gradient -->
        <div class="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-12 -left-12 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>

        <div class="relative space-y-4">
          <!-- Header: Status & Icon -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <div v-if="isPlaying" class="absolute -inset-1 bg-emerald-400/20 rounded-full animate-ping"></div>
                <div class="relative w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                  <Icon :name="isPlaying ? 'heroicons:speaker-wave' : 'heroicons:speaker-x-mark'" class="w-5 h-5" />
                </div>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Audio Playing</span>
                <span class="text-xs font-bold text-gray-800 truncate max-w-[120px]">{{ currentSource.title || 'Ujian Audio' }}</span>
              </div>
            </div>
            
            <!-- Close Button -->
            <button @click="stop" class="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>

          <!-- Progress Bar & Time -->
          <div class="space-y-2">
            <div class="relative h-1.5 bg-gray-100 rounded-full overflow-hidden cursor-pointer" @click="handleSeek">
              <!-- Loading/Buffering Shimmer -->
              <div v-if="isLoading" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
              
              <!-- Progress Fill -->
              <div class="absolute inset-y-0 left-0 bg-emerald-600 transition-all duration-300 rounded-full" 
                   :style="{ width: `${progress}%` }">
              </div>
            </div>
            
            <div class="flex justify-between items-center text-[10px] font-black tracking-tighter text-gray-400">
              <div class="flex items-center space-x-1">
                <span v-if="isLoading" class="text-emerald-500 flex items-center">
                   <Icon name="svg-spinners:ring-resize" class="w-2.5 h-2.5 mr-1" />
                   LOADING...
                </span>
                <span v-else>{{ formatTime(currentTime) }}</span>
              </div>
              <span>{{ formatTime(duration) }}</span>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center justify-center space-x-6">
            <button @click="seek(currentTime - 5)" class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="heroicons:backward-5" class="w-5 h-5" />
            </button>
            
            <button @click="togglePlay" 
                    class="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
               <Icon :name="isPlaying ? 'heroicons:pause-solid' : 'heroicons:play-solid'" class="w-6 h-6" />
            </button>
            
            <button @click="seek(currentTime + 5)" class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="heroicons:forward-5" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useAudioPlayer } from '@/composables/useAudioPlayer'

const { 
  currentSource, isPlaying, isLoading, progress, 
  duration, currentTime, stop, togglePlay, seek 
} = useAudioPlayer()

const formatTime = (seconds: number) => {
  if (!seconds) return '00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const handleSeek = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const p = x / rect.width
  seek(p * duration.value)
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100px) scale(0.9);
  opacity: 0;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s linear infinite;
}

/* Glassmorphism subtle polish */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
</style>
