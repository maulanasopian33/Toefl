<template>
  <div id="sectionIntroScreen" class="text-center py-10 px-4 bg-white rounded-lg shadow-lg max-w-3xl mx-auto my-8">
    <h2 id="introSectionTitle" class="text-3xl font-bold text-gray-800 mb-4">{{ sectionTitle }}</h2>
    <p class="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">{{ instructions }}</p>

    <!-- Audio Player for section instructions -->
    <div v-if="audioSrc" id="introAudioPlayerContainer" class="bg-gray-100 p-4 rounded-lg mb-6 shadow-sm mx-auto max-w-md">
      <audio id="introAudioPlayer" controls class="w-full rounded-md">
        <source :src="audioSrc" type="audio/mpeg">
        Browser Anda tidak mendukung elemen audio.
      </audio>
      <p class="text-sm text-gray-500 mt-2 text-center">Dengarkan audio instruksi di atas.</p>
    </div>

    <button
      id="startSectionButton"
      @click="$emit('startSection')"
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out"
    >
      Mulai Bagian Ini
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// Define props for the component
const props = defineProps({
  sectionTitle: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  audioSrc: {
    type: String,
    default: '',
  },
});

// Define emits for parent communication
const emit = defineEmits(['startSection']);

// Load audio when component is mounted if audioSrc is provided
onMounted(() => {
  if (props.audioSrc) {
    const audioPlayer = document.getElementById('introAudioPlayer');
    if (audioPlayer) {
      audioPlayer.load(); // Load the audio source
    }
  }
});
</script>

<style scoped>
/* Tambahkan gaya spesifik untuk komponen ini jika diperlukan */
</style>

