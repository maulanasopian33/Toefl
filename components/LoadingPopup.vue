<template>
  <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      
      <p class="mt-4 text-gray-700 font-medium">Memproses...</p>
    </div>
  </div>
</template>

<script setup>
const { isLoading } = useLoading();
</script>