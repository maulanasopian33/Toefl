<template>
  <input
    type="text"
    :placeholder="placeholder"
    v-model="model"
    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out"
  />
</template>

<script setup lang="ts">
const model = defineModel<string>()
const props = defineProps({ placeholder: { type: String, default: 'Cari...' } })
</script>
