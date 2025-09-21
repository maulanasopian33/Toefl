<template>
  <div class="relative overflow-hidden rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white">
    <div class="relative z-10">
      <p class="text-xs opacity-90 mb-1">Office furniture</p>
      <p class="text-xs opacity-90 mb-2">GET DISCOUNT</p>
      <p class="text-2xl font-bold">{{ discount }}%</p>
    </div>
    <div class="absolute right-0 top-0 opacity-20">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'%3E%3Cpath d='M20 20h60v60H20z' fill='%23ffffff'/%3E%3C/svg%3E" alt="furniture" class="w-20 h-20">
    </div>
  </div>
</template>

<script setup>
defineProps({
  discount: {
    type: Number,
    required: true,
  },
});
</script>