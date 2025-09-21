<template>
  <div class="card mb-6">
    <h3 class="text-xl font-bold text-gray-800 mb-4">Instruksi Penting</h3>
    <div v-html="instruksi"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  instruksi: String
});
</script>