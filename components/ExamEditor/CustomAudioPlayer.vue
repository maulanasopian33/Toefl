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
  <div class="flex items-center gap-4 w-full bg-white border border-slate-200 p-3 rounded-xl shadow-sm transition-shadow hover:shadow-md">
    <audio ref="audio" :src="src" class="hidden"></audio>

    <button @click="togglePlay" class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm shadow-indigo-200 active:scale-95">
      <Icon v-if="!isPlaying" name="lucide:play" class="w-5 h-5 ml-0.5" />
      <Icon v-else name="lucide:pause" class="w-5 h-5" />
    </button>

    <div class="flex-grow flex flex-col justify-center gap-1.5">
      <div class="flex items-center justify-between text-xs font-medium text-slate-500 font-mono px-0.5">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
      <div class="relative w-full h-2 bg-slate-100 rounded-full cursor-pointer group" @click="seek">
        <div class="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-100 group-hover:bg-indigo-600" :style="{ width: `${progress}%` }"></div>
        <div class="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white border-2 border-indigo-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" :style="{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }"></div>
      </div>
    </div>

    <div class="flex items-center gap-2 w-24 group/volume">
      <button @click="toggleMute" class="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50">
        <Icon v-if="volume > 0.5 && !isMuted" name="lucide:volume-2" class="w-5 h-5" />
        <Icon v-else-if="volume > 0 && !isMuted" name="lucide:volume-1" class="w-5 h-5" />
        <Icon v-else name="lucide:volume-x" class="w-5 h-5" />
      </button>
      <div class="relative flex-grow h-1.5 bg-slate-100 rounded-full cursor-pointer">
        <div class="absolute top-0 left-0 h-full bg-slate-400 rounded-full transition-colors group-hover/volume:bg-indigo-500" :style="{ width: `${volume * 100}%` }"></div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="volume"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  </div>
</template>