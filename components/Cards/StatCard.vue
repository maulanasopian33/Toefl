<template>
  <div class="bg-teal-500 p-6 rounded-xl text-white">
    <div class="flex items-center justify-between mb-2">
      <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path :d="stat.iconPath" />
        </svg>
      </div>
      <span class="text-sm opacity-90">{{ stat.title }}</span>
    </div>
    <div class="text-3xl font-bold">{{ stat.value }}</div>
  </div>
</template>

<script setup>
defineProps({
  stat: {
    type: Object,
    required: true,
  },
});
</script>