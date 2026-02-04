<template>
  <Transition name="slide-up">
    <div v-if="currentSource" 
         @contextmenu.prevent 
         class="fixed bottom-16 right-6 z-[60] group select-none flex flex-col items-end space-y-3">
      
      <!-- Minimalist Toggle Button (Visible when minimized) -->
      <button v-if="isMinimized" 
              @click="isMinimized = false"
              class="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-90 border-4 border-white relative">
        <Icon name="heroicons:speaker-wave" class="w-6 h-6" />
        <div v-if="isPlaying" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
      </button>

      <!-- Premium Glassmorphism Container -->
      <div v-else class="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-4 md:p-6 w-[300px] md:w-[340px] relative overflow-hidden transition-all duration-500 hover:shadow-emerald-500/10 hover:border-emerald-100/50">
        
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
                <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{{ isPlaying ? 'Audio Playing' : 'Audio Paused' }}</span>
                <span class="text-xs font-bold text-gray-800 truncate max-w-[140px]">{{ currentSource.title || 'Ujian Audio' }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-1">
              <!-- Minimize Button -->
              <button @click="isMinimized = true" class="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <Icon name="heroicons:minus-solid" class="w-5 h-5" />
              </button>
              <!-- Close Button -->
              <!-- <button @click="stop" class="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <Icon name="heroicons:x-mark" class="w-5 h-5" />
              </button> -->
            </div>
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
          <div class="flex items-center justify-center space-x-6 pb-2 border-b border-gray-50">
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

          <!-- Audio List (Available Tracks) -->
          <div v-if="availableTracks.length > 0" class="space-y-2">
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Available Tracks</span>
            <div class="space-y-1 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
              <button 
                v-for="track in availableTracks" 
                :key="track.id"
                @click="play(track)"
                class="w-full text-left p-2 rounded-xl transition-all flex items-center justify-between group/item"
                :class="currentSource.id === track.id ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'hover:bg-gray-50 text-gray-500'"
              >
                <div class="flex items-center space-x-2 min-w-0">
                  <Icon 
                    :name="currentSource.id === track.id && isPlaying ? 'heroicons:speaker-wave' : 'heroicons:play'" 
                    class="w-3.5 h-3.5 flex-shrink-0"
                    :class="currentSource.id === track.id ? 'text-emerald-600' : 'text-gray-300 group-hover/item:text-emerald-500'"
                  />
                  <span class="text-[11px] font-bold truncate leading-none">{{ track.title }}</span>
                </div>
                <div v-if="currentSource.id === track.id && isPlaying" class="flex space-x-0.5 items-end h-3">
                  <div class="w-0.5 bg-emerald-500 animate-[music-bar_0.8s_ease-in-out_infinite]"></div>
                  <div class="w-0.5 bg-emerald-500 animate-[music-bar_0.6s_ease-in-out_infinite_0.1s]"></div>
                  <div class="w-0.5 bg-emerald-500 animate-[music-bar_0.7s_ease-in-out_infinite_0.2s]"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAudioPlayer } from '@/composables/useAudioPlayer'

const { 
  currentSource, isPlaying, isLoading, progress, 
  duration, currentTime, availableTracks,
  stop, togglePlay, seek, play
} = useAudioPlayer()

const isMinimized = ref(false)

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

@keyframes music-bar {
  0%, 100% { height: 4px; }
  50% { height: 10px; }
}

/* Glassmorphism subtle polish */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
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
