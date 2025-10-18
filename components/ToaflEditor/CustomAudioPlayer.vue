<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps<{
  src: string;
}>();

const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1); // Volume dari 0 (diam) hingga 1 (maks)
const isMuted = ref(false);
let lastVolume = 1; // Untuk menyimpan level volume sebelum di-mute

const progress = computed(() => (duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0));

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds === Infinity) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const togglePlay = () => {
  if (!audio.value) return;
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
};

const toggleMute = () => {
  if (!audio.value) return;
  isMuted.value = !isMuted.value;
  if (isMuted.value) {
    lastVolume = volume.value;
    volume.value = 0;
  } else {
    // Jika volume sebelumnya 0, set ke nilai kecil agar tidak tetap diam
    volume.value = lastVolume > 0 ? lastVolume : 0.5;
  }
};

const handlePlay = () => { isPlaying.value = true; };
const handlePause = () => { isPlaying.value = false; };
const handleEnded = () => { isPlaying.value = false; currentTime.value = 0; };

const handleTimeUpdate = () => {
  if (audio.value) currentTime.value = audio.value.currentTime;
};

const handleLoadedMetadata = () => {
  if (audio.value) duration.value = audio.value.duration;
};

const seek = (event: MouseEvent) => {
  if (!audio.value) return;
  const progressBar = event.currentTarget as HTMLElement;
  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const newTime = (clickX / rect.width) * duration.value;
  audio.value.currentTime = newTime;
};

// Watcher untuk mengubah volume audio saat slider digerakkan
watch(volume, (newVolume) => {
  if (audio.value) {
    audio.value.volume = newVolume;
    // Jika volume diubah dari 0, otomatis unmute
    if (newVolume > 0 && isMuted.value) {
      isMuted.value = false;
    }
  }
});

onMounted(() => {
  if (audio.value) {
    audio.value.addEventListener('timeupdate', handleTimeUpdate);
    audio.value.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.value.addEventListener('play', handlePlay);
    audio.value.addEventListener('pause', handlePause);
    audio.value.addEventListener('ended', handleEnded);
  }
});

onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.removeEventListener('timeupdate', handleTimeUpdate);
    audio.value.removeEventListener('loadedmetadata', handleLoadedMetadata);
    audio.value.removeEventListener('play', handlePlay);
    audio.value.removeEventListener('pause', handlePause);
    audio.value.removeEventListener('ended', handleEnded);
  }
});
</script>

<template>
  <div class="flex items-center space-x-3 w-full bg-gray-100 p-2 rounded-lg">
    <audio ref="audio" :src="src" class="hidden"></audio>

    <button @click="togglePlay" class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors shadow-sm">
      <svg v-if="!isPlaying" class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
      <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
    </button>

    <div class="flex-grow flex items-center space-x-3">
      <span class="text-sm font-mono text-gray-600">{{ formatTime(currentTime) }}</span>
      <div class="w-full bg-gray-300 rounded-full h-1.5 cursor-pointer" @click="seek">
        <div class="bg-indigo-500 h-1.5 rounded-full" :style="{ width: `${progress}%` }"></div>
      </div>
      <span class="text-sm font-mono text-gray-600">{{ formatTime(duration) }}</span>
    </div>

    <div class="flex items-center space-x-2 w-32">
      <button @click="toggleMute" class="text-gray-500 hover:text-indigo-600">
        <svg v-if="volume > 0.5 && !isMuted" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M20 4v16m-6-12a9 9 0 010 12.728M4 4v16h4l5-5V9L8 4H4z"></path></svg>
        <svg v-else-if="volume > 0 && !isMuted" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h4l5-5V9L8 4H4zm11.536 4.464a5 5 0 010 7.072"></path></svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h4l5-5V9L8 4H4zm12 12l-6-6m0 6l6-6"></path></svg>
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        v-model="volume"
        class="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  </div>
</template>