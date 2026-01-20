<template>
  <div class="relative z-10 space-y-8">
    <div class="space-y-4">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-100">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Dashboard Peserta
      </div>
      <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
        Siap untuk <span class="text-emerald-600">Tes TOEFL</span> Anda?
      </h2>
      <p class="text-gray-500 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
        Uji kemampuan Bahasa Inggris Anda di bagian Reading, Listening, Speaking, dan Writing.
        Mulai tes baru atau lanjutkan dari progres terakhir Anda.
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4">
      <button 
        @click="$emit('mulai-tes')" 
        class="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 transition-all active:scale-95"
      >
        <Icon name="heroicons:play-circle" class="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span class="text-lg">Mulai Tes Baru</span>
      </button>
      
      <button class="flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black hover:scale-105 transition-all active:scale-95">
        <Icon name="heroicons:arrow-path" class="w-5 h-5" />
        <span class="text-lg">Lanjutkan Tes</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['mulai-tes']);
</script>

<style>

</style>