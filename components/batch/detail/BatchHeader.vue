<template>
  <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
          {{ formatType(batch.type) }}
        </span>
        <h1 class="text-3xl font-bold text-gray-900 mt-3">{{ batch.name }}</h1>
        <p class="text-gray-600 mt-2 max-w-2xl">{{ batch.description }}</p>
        <div v-if="batch.creator" class="flex items-center gap-2 text-sm text-gray-500 mt-4">
          <Icon name="lucide:user-circle" class="w-4 h-4" />
          <span>Dibuat oleh {{ batch.creator.name }}</span>
        </div>
      </div>
      <div class="flex-shrink-0 text-left md:text-right mt-4 md:mt-0">
        <div class="text-3xl font-bold text-gray-900">{{ formatCurrency(batch.price, batch.currency) }}</div>
        <div class="text-sm text-gray-500">per peserta</div>
      </div>
    </div>
    <div class="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
      <div>
        <p class="text-sm text-gray-500">Status</p>
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1"
          :class="getStatusClass(batch.status)"
        >
          {{ batch.status || 'DRAFT' }}
        </span>
      </div>
      <div>
        <p class="text-sm text-gray-500">Durasi Program</p>
        <p class="font-semibold text-gray-800 mt-1">{{ formatDateRange(batch.start_date, batch.end_date) }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Pendaftaran</p>
        <p class="font-semibold text-gray-800 mt-1">{{ formatDateRange(batch.registration_open_at, batch.registration_close_at) }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Total Durasi</p>
        <p class="font-semibold text-gray-800 mt-1">{{ batch.duration_minutes ? `${Math.floor(batch.duration_minutes / 60)} Jam` : '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({ batch: { type: Object, required: true } })

const formatType = (type: string) => (type?.replace(/_/g, ' ') || 'Tidak Diketahui').toLowerCase()

const formatCurrency = (amount: number, currency: string = 'IDR') => {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatDateRange = (start: string, end: string) => {
  if (!start || !end) return 'Belum ditentukan'
  return `${formatDate(start)} - ${formatDate(end)}`
}

const getStatusClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'OPEN': return 'bg-green-50 text-green-700 border-green-200'
    case 'CLOSED': return 'bg-red-50 text-red-700 border-red-200'
    case 'FULL': return 'bg-orange-50 text-orange-700 border-orange-200'
    default: return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}
</script>