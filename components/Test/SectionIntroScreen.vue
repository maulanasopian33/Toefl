<template>
  <div class="flex flex-col items-center justify-center min-h-[500px] text-center p-0 md:p-12 space-y-8 animate-fade-in">
    <div class="space-y-2">
      <span class="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px]">Persiapan Bagian</span>
      <h2 class="text-4xl font-black text-gray-900 leading-tight">{{ sectionTitle }}</h2>
    </div>
    
    <div class="w-full max-w-2xl bg-gray-50/50 rounded-3xl p-8 border border-gray-100 text-left shadow-inner">
      <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
        <Icon name="heroicons:information-circle" class="w-4 h-4 mr-2" />
        Instruksi Pengerjaan
      </h3>
      <div class="prose prose-emerald max-w-none text-gray-600 leading-relaxed font-medium" v-html="instructions"></div>
    </div>

    <!-- Audio Instruction Player -->
    <div v-if="audioSrc" class="w-full max-w-md p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
      <div class="flex items-center space-x-3 text-emerald-600">
        <Icon name="heroicons:speaker-wave" class="w-5 h-5" />
        <span class="text-xs font-bold uppercase tracking-wider">Instruksi Berbasis Suara</span>
      </div>
      <audio controls :src="audioSrc" class="w-full"></audio>
    </div>

    <button 
      @click="$emit('startSection')" 
      class="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 transition-all active:scale-95 overflow-hidden"
    >
      <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      <Icon name="heroicons:play-circle" class="h-6 w-6" />
      <span>Mulai Mengerjakan</span>
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

<style scoped>
.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

/* Custom Audio Styles */
audio::-webkit-media-controls-panel {
  @apply bg-gray-50;
}
</style>