<template>
  <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Daftar Peserta ({{ participants?.length || 0 }})</h3>
    <div v-if="!participants || participants.length === 0" class="text-center py-10 text-gray-500">
      <Icon name="lucide:user-x" class="w-10 h-10 mx-auto text-gray-400" />
      <p class="mt-2 text-sm">Belum ada peserta yang terdaftar.</p>
    </div>
    <div v-else>
      <p class="text-gray-600">Daftar peserta akan ditampilkan di sini.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({ participants: { type: Array, default: () => [] } })
</script>