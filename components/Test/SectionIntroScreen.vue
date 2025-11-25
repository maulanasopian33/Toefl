<template>
  <div class="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">{{ sectionTitle }}</h2>
    
    <div class="prose prose-sm max-w-2xl text-left mb-6 border-t border-b border-gray-200 py-4" v-html="instructions"></div>

    <div v-if="audioSrc" class="mb-6">
      <p class="text-sm text-gray-600 mb-2">Dengarkan instruksi audio:</p>
      <audio controls :src="audioSrc" class="w-full max-w-sm"></audio>
    </div>

    <button 
      @click="$emit('startSection')" 
      class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
    >
      <Icon name="lucide:play-circle" class="h-5 w-5" />
      Mulai Bagian Ini
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
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
    default: null,
  },
});

defineEmits(['startSection']);
</script>