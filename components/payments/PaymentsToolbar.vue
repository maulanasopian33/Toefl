<template>
  <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 border-b border-gray-100 pb-3">
    <h3 class="card-title mb-0">Daftar Pembayaran</h3>

    <div class="flex flex-col md:flex-row md:items-center gap-2 w-full lg:w-auto">
      <!-- Filter Status -->
      <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full md:w-auto">
        <Icon name="lucide:filter" class="w-4 h-4 text-gray-400 flex-shrink-0" />
        <select
          :value="selectedStatus"
          @change="$emit('update:selectedStatus', $event.target.value)"
          class="input !border-0 !bg-transparent !px-0 !py-0 text-xs sm:text-sm"
        >
          <option value="">Semua Status</option>
          <option value="Paid">Lunas (Paid)</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Gagal (Failed)</option>
          <option value="Refunded">Dikembalikan (Refunded)</option>
        </select>
      </div>

      <!-- Filter Batch -->
      <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full md:w-auto">
        <Icon name="lucide:layers" class="w-4 h-4 text-gray-400 flex-shrink-0" />
        <select
          :value="selectedBatch"
          @change="$emit('update:selectedBatch', $event.target.value)"
          class="input !border-0 !bg-transparent !px-0 !py-0 text-xs sm:text-sm"
        >
          <option value="">Semua Batch</option>
          <option v-for="b in batchOptions" :key="b" :value="b">{{ b }}</option>
        </select>
      </div>

      <!-- Search -->
      <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64">
        <Icon name="lucide:search" class="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          :value="q"
          @input="$emit('update:q', $event.target.value)"
          placeholder="Cari nama peserta atau email..."
          class="input !border-0 !bg-transparent !px-0 !py-0 text-xs sm:text-sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  q: String,
  selectedStatus: String,
  selectedBatch: String,
  batchOptions: {
    type: Array,
    default: () => [],
  },
});
defineEmits(['update:q', 'update:selectedStatus', 'update:selectedBatch']);
</script>