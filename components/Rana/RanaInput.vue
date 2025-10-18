<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      v-model="model"
      class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  modelValue: [String, Number]
});
const emit = defineEmits(['update:modelValue']);
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
</script>
