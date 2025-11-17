<template>
  <div class="card text-center">
    <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
    <p class="text-gray-500 mt-2">Fitur ini sedang dalam pengembangan.</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Segera Hadir'
  }
})
</script>