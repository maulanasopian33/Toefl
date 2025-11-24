<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
    <div class="p-6">
      <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {{ batch.namaBatch }}
        </h1>
        <span
          :class="batchStatus.class"
          class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
        >
          <Icon :name="batchStatus.icon" class="h-3.5 w-3.5" />
          {{ batchStatus.text }}
        </span>
      </div>
      <p v-if="batch.deskripsiBatch" class="mt-2 text-sm text-gray-600">
        {{ batch.deskripsiBatch }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-px border-t border-gray-200 bg-gray-50 sm:grid-cols-4">
      <div class="flex items-center gap-3 bg-white p-4">
        <Icon name="lucide:calendar-days" class="h-6 w-6 flex-shrink-0 text-gray-400" />
        <div>
          <p class="text-xs text-gray-500">Tanggal Mulai</p>
          <p class="text-sm font-semibold text-gray-800">{{ formatDate(batch.tanggalMulai) }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 bg-white p-4">
        <Icon name="lucide:calendar-off" class="h-6 w-6 flex-shrink-0 text-gray-400" />
        <div>
          <p class="text-xs text-gray-500">Tanggal Selesai</p>
          <p class="text-sm font-semibold text-gray-800">{{ formatDate(batch.tanggalSelesai) }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 bg-white p-4">
        <Icon name="lucide:tag" class="h-6 w-6 flex-shrink-0 text-gray-400" />
        <div>
          <p class="text-xs text-gray-500">Harga</p>
          <p class="text-sm font-semibold text-gray-800">{{ formatCurrency(batch.price || batch.harga) }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 bg-white p-4">
        <Icon name="lucide:users" class="h-6 w-6 flex-shrink-0 text-gray-400" />
        <div>
          <p class="text-xs text-gray-500">Peserta</p>
          <p class="text-sm font-semibold text-gray-800">{{ batch.participants?.length || 0 }} orang</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  batch: {
    type: Object,
    required: true,
  },
});

const batchStatus = computed(() => {
  switch (props.batch.statusBatch) {
    case 'aktif':
      return { text: 'Dibuka', icon: 'lucide:play-circle', class: 'bg-emerald-100 text-emerald-800' };
    case 'draft':
      return { text: 'Draft', icon: 'lucide:pencil', class: 'bg-yellow-100 text-yellow-800' };
    case 'tutup':
      return { text: 'Diarsipkan', icon: 'lucide:archive', class: 'bg-gray-100 text-gray-800' };
    default:
      return { text: 'Selesai', icon: 'lucide:check-circle', class: 'bg-blue-100 text-blue-800' };
  }
});

const formatDate = (isoString) => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '-';
  if (value === 0) return 'Gratis';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};
</script>