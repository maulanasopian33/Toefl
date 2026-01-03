<template>
  <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <Icon name="lucide:alert-triangle" class="w-5 h-5 text-yellow-500" />
      Instruksi Khusus
    </h3>
    <div v-if="instruksi" class="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
      {{ instruksi }}
    </div>
    <div v-else class="text-center py-10 text-gray-500">
      <p class="text-sm">Tidak ada instruksi khusus untuk batch ini.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({ instruksi: { type: String, default: '' } })
</script>