<template>
  <div v-if="currentAudioSrc !== ''" class="bg-gray-100 p-4 rounded-lg shadow-md max-w-xl mx-auto flex items-center space-x-4">
    <button
      @click="togglePlayPause"
      class="p-3 rounded-full bg-primary-600 text-primary hover:bg-primary-700 transition duration-200"
      aria-label="Play/Pause"
    >
      <svg v-if="!isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
      </svg>
      <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H8a1 1 0 01-1-1V8z" clip-rule="evenodd" />
      </svg>
    </button>

    <div class="flex-grow relative h-2 bg-gray-300 rounded-full cursor-pointer" @click="handleSeek">
      <div
        class="h-full bg-primary rounded-full"
        :style="{ width: `${progress}%` }"
      ></div>
      <div class="absolute -bottom-6 flex justify-between w-full text-xs text-gray-600">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>

    <div class="flex items-center space-x-2">
      <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M9.383 3.017A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.707 11H2a1 1 0 01-1-1V9a1 1 0 011-1h2.707l3.586-3.586a1 1 0 011.09-.397zM14.075 4.094l2.553 2.553a1 1 0 010 1.414L14.075 10l2.553 2.553a1 1 0 010 1.414l-1.414 1.414a1 1 0 01-1.414 0L12 12.828l-2.553 2.553a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 010-1.414L8.757 10l-2.553-2.553a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 0L12 7.172l2.553-2.553a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        v-model="volume"
        @input="setVolume"
        class="w-20 bg-primary text-primary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useNuxtApp } from '#app';
import type { Howl, Howler } from 'howler'; // Mengimpor tipe Howl dan Howler

const props = defineProps<{
  audioSrc: string;
  autoplay?: boolean;
}>();

// Mengakses plugin yang sudah di-provide dengan tipe yang benar
const { $howl } = useNuxtApp();

let sound: Howl | null = null;
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0); // in percentage
const volume = ref(1); // 0 to 1

const currentAudioSrc = ref('');


const unloadAudio = () => {
  if (sound) {
    sound.stop();
    sound.unload();
    sound = null;
    isPlaying.value = false;
    currentTime.value = 0;
    duration.value = 0;
    progress.value = 0;
  }
};
watch(() => props.audioSrc, (newSrc) => {
  if (newSrc && newSrc !== currentAudioSrc.value) {
    currentAudioSrc.value = newSrc;
    loadAudio(newSrc);
  } else if (!newSrc) {
    currentAudioSrc.value = '';
    unloadAudio();
  }
}, { immediate: true });



const togglePlayPause = () => {
  if (!sound) return;

  if (isPlaying.value) {
    sound.pause();
  } else {
    sound.play();
  }
};

const updateProgress = () => {
  if (sound && isPlaying.value) {
    currentTime.value = sound.seek();
    progress.value = (currentTime.value / duration.value) * 100;
    requestAnimationFrame(updateProgress);
  }
};

const setVolume = () => {
  if (sound) {
    sound.volume(parseFloat(volume.value.toString()));
  }
};

const handleSeek = (event: MouseEvent) => {
  if (!sound || duration.value === 0) return;

  const progressBar = event.currentTarget as HTMLElement;
  const clickX = event.clientX - progressBar.getBoundingClientRect().left;
  const newProgress = (clickX / progressBar.offsetWidth);
  const newTime = newProgress * duration.value;
  sound.seek(newTime);
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const loadAudio = (src: string) => {
  unloadAudio();

  sound = new $howl({
    src: [src],
    html5: true,
    volume: volume.value,
    onplay: () => {
      isPlaying.value = true;
      if (sound) { // Pemeriksaan null
        duration.value = sound.duration();
      }
      requestAnimationFrame(updateProgress);
    },
    onpause: () => {
      isPlaying.value = false;
    },
    onend: () => {
      isPlaying.value = false;
      currentTime.value = duration.value;
      progress.value = 100;
    },
    onstop: () => {
      isPlaying.value = false;
      currentTime.value = 0;
      progress.value = 0;
    },
    onseek: () => {
      if (sound) { // Pemeriksaan null
        currentTime.value = sound.seek();
        progress.value = (currentTime.value / duration.value) * 100;
      }
    },
    onloaderror: (id: number, error: any) => { // Perbaikan: ubah string menjadi any
      console.error('Howler Load Error:', error);
    },
    onplayerror: (id: number, error: any) => { // Perbaikan: ubah string menjadi any
      console.error('Howler Play Error:', error);
      if (error === 'NotAllowedError') {
          console.warn('Audio autoplay was blocked by the browser. Please click play.');
      }
    }
  });

  if (props.autoplay) {
    sound.play();
  }
};

onUnmounted(() => {
  unloadAudio();
});
</script>

<style scoped>
/* Custom styling for volume range input, sama seperti sebelumnya */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none; /* Tambahkan ini */
  width: 100%;
  height: 4px;
  background: #D1D5DB; /* gray-300 */
  outline: none;
  opacity: 0.7;
  transition: opacity .15s ease-in-out;
  border-radius: 9999px; /* For rounded track */
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none; /* Tambahkan ini */
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3B82F6; /* primary-500 */
  cursor: pointer;
  margin-top: -6px; /* Adjust to center thumb vertically */
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3B82F6; /* primary-500 */
  cursor: pointer;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
}

input[type="range"]::-ms-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3B82F6; /* primary-500 */
  cursor: pointer;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 9999px;
  background: #D1D5DB;
}

input[type="range"]::-moz-range-track {
  height: 4px;
  border-radius: 9999px;
  background: #D1D5DB;
}

input[type="range"]::-ms-track {
  height: 4px;
  border-radius: 9999px;
  background: #D1D5DB;
}
</style>