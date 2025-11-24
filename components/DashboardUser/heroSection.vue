<template>
  <h2 class="text-3xl font-bold text-gray-800 mb-6">Siap untuk Tes TOEFL Anda?</h2>
  <p class="text-gray-700 text-lg mb-8">
      Uji kemampuan Bahasa Inggris Anda di bagian Reading, Listening, Speaking, dan Writing.
      Mulai tes baru atau lanjutkan dari progres terakhir Anda.
  </p>
  <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <button @click="$emit('mulai-tes')" id="startTestButton" class="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-md transition duration-300 ease-in-out text-xl flex items-center justify-center">
          <svg class="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          Mulai Tes Baru
      </button>
      <button class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-8 rounded-lg shadow-md transition duration-300 ease-in-out text-xl flex items-center justify-center">
          <svg class="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Lanjutkan Tes
      </button>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['mulai-tes']);
</script>

<style>

</style>