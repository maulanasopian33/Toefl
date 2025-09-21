<template>
  <div class="card mb-6">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ batch.namaBatch }}</h2>
        <p class="text-gray-600 text-sm">ID Batch: <span>{{ batch.idBatch }}</span></p>
      </div>
      <div class="mt-4 md:mt-0 text-right">
        <p class="text-gray-700 text-sm font-semibold">Tanggal Ujian:</p>
        <p class="text-gray-900 text-base font-bold">{{ formatDateIndo(batch.tanggalMulai) }} - {{ formatDateIndo(batch.tanggalSelesai) }}</p>
      </div>
    </div>
    <hr class="my-4 border-gray-200">
    <p class="text-gray-700">{{ batch.deskripsiBatch }}</p>
  </div>
</template>

<script setup>

const props = defineProps({
  batch: {
    type: Object,
    required: true
  }
});
</script>