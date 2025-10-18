<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 shadow-sm focus:outline-none',
      colorClasses,
      sizeClasses,
      disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-0.5'
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  color: { type: String, default: 'teal' }, // teal, gray, red, blue
  size: { type: String, default: 'md' }, // sm, md, lg
  disabled: { type: Boolean, default: false },
});

const colorClasses = computed(() => {
  switch (props.color) {
    case 'teal': return 'bg-teal-600 text-white hover:bg-teal-700';
    case 'red': return 'bg-red-600 text-white hover:bg-red-700';
    case 'gray': return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    default: return 'bg-teal-600 text-white hover:bg-teal-700';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-sm px-3 py-1.5';
    case 'lg': return 'text-lg px-6 py-3';
    default: return 'text-base px-4 py-2';
  }
});
</script>
