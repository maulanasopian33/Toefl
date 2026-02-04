<template>
  <div class="audio-player-container group" 
       @contextmenu.prevent
       :class="[isLoading ? 'opacity-70 pointer-events-none' : '']">
    
    <div class="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-100">
      
      <!-- Play/Pause Button -->
      <button @click="handleTogglePlay" 
              class="relative w-12 h-12 flex-shrink-0 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
        <div v-if="localIsActive && isPlaying" class="absolute -inset-1 bg-emerald-400/20 rounded-full animate-ping"></div>
        <Icon :name="(localIsActive && isPlaying) ? 'heroicons:pause-solid' : 'heroicons:play-solid'" class="w-6 h-6" />
      </button>

      <div class="flex-grow flex flex-col gap-1">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-black tracking-widest uppercase" :class="localIsActive && isPlaying ? 'text-emerald-600' : 'text-gray-400'">
             {{ isLoading && localIsActive ? 'Buffering...' : (localIsActive && isPlaying ? 'Playing' : 'Audio Player') }}
          </span>
          <span class="text-[10px] font-black text-gray-400 font-mono">
            {{ localIsActive ? formatTime(currentTime) : '00:00' }} / {{ localIsActive ? formatTime(duration) : formatTime(0) }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="relative h-2 bg-gray-100 rounded-full overflow-hidden cursor-pointer" @click="handleSeek">
          <!-- Loading Shimmer -->
          <div v-if="isLoading && localIsActive" class="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent animate-shimmer"></div>
          
          <!-- Progress Fill -->
          <div class="absolute inset-y-0 left-0 bg-emerald-600 transition-all duration-300 rounded-full" 
               :style="{ width: `${localIsActive ? progress : 0}%` }">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAudioPlayer } from '@/composables/useAudioPlayer'

const props = defineProps<{
  src: string
  title?: string
  id: string
}>()

const { 
  currentSource, isPlaying, isLoading, progress, 
  duration, currentTime, play, togglePlay, seek, stop
} = useAudioPlayer()

const localIsActive = computed(() => currentSource.value?.id === props.id)

const handleTogglePlay = () => {
  if (localIsActive.value) {
    togglePlay()
  } else {
    play({
      id: props.id,
      url: props.src,
      title: props.title
    })
  }
}

const handleSeek = (e: MouseEvent) => {
  if (!localIsActive.value) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const p = x / rect.width
  seek(p * duration.value)
}

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s linear infinite;
}
</style>
