<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
    <div class="flex items-center gap-3">
      <Icon name="lucide:info" class="h-5 w-5 flex-shrink-0 text-gray-500" />
      <h3 class="text-lg font-semibold text-gray-800">Instruksi Penting</h3>
    </div>
    <div v-if="instruksi" class="prose prose-sm mt-4 max-w-none text-gray-600" v-html="instruksi"></div>
    <div v-else class="mt-4 text-center text-gray-400 italic">
      <p>Tidak ada instruksi khusus untuk batch ini.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  instruksi: {
    type: String,
    default: ''
  }
});
</script>