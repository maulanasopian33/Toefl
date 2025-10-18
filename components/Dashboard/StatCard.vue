<template>
  <div class="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
    <div class="flex-shrink-0">
      <slot name="icon" />
    </div>
    <div>
      <p class="text-gray-500 text-sm">{{ label }}</p>
      <p class="text-2xl font-bold">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
})
</script>
