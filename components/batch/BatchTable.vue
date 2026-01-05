<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
            <th class="px-6 py-4 min-w-[250px]">Batch Info</th>
            <th class="px-6 py-4 whitespace-nowrap">Jadwal & Durasi</th>
            <th class="px-6 py-4 whitespace-nowrap">Peserta</th>
            <th class="px-6 py-4 whitespace-nowrap">Harga</th>
            <th class="px-6 py-4 text-center whitespace-nowrap">Status</th>
            <th class="px-6 py-4 text-right whitespace-nowrap">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr 
            v-for="batch in batches" 
            :key="batch.idBatch" 
            class="group hover:bg-gray-50/50 transition-colors duration-200"
          >
            <!-- Batch Info -->
            <td class="px-6 py-4 align-top">
              <div class="flex flex-col gap-1">
                <span @click="$emit('view', batch)" class="font-semibold cursor-pointer text-gray-900 group-hover:text-blue-600 transition-colors">
                  {{ batch.name }}
                </span>
                <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed max-w-xs">
                  {{ batch.description }}
                </p>
                <div class="flex flex-wrap items-center gap-2 mt-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                    {{ formatType(batch.type) }}
                  </span>
                  <span v-if="batch.sessions?.length" class="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    <Icon name="lucide:layers" class="w-3 h-3" />
                    {{ batch.sessions.length }} Sesi
                  </span>
                </div>
              </div>
            </td>

            <!-- Jadwal -->
            <td class="px-6 py-4 align-top whitespace-nowrap">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2 text-sm text-gray-700">
                  <Icon name="lucide:calendar-range" class="w-4 h-4 text-gray-400" />
                  <span>{{ formatDate(batch.start_date) }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500 pl-6">
                  <span>s/d {{ formatDate(batch.end_date) }}</span>
                </div>
                <div v-if="batch.duration_minutes" class="flex items-center gap-2 text-xs text-gray-400 pl-6 mt-1">
                  <Icon name="lucide:clock" class="w-3 h-3" />
                  <span>{{ Math.floor(batch.duration_minutes / 60) }} Jam</span>
                </div>
              </div>
            </td>

            <!-- Peserta -->
            <td class="px-6 py-4 align-top whitespace-nowrap">
              <div class="flex flex-col gap-1">
                <div class="text-sm font-medium text-gray-900">
                  <span class="text-blue-600">0</span> 
                  <span class="text-gray-400 mx-1">/</span> 
                  {{ batch.max_participants }}
                </div>
                <div class="text-xs text-gray-500">
                  Min: {{ batch.min_participants || '-' }}
                </div>
              </div>
            </td>

            <!-- Harga -->
            <td class="px-6 py-4 align-top whitespace-nowrap">
              <div class="font-semibold text-gray-900">
                {{ formatCurrency(batch.price, batch.currency) }}
              </div>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 align-top text-center whitespace-nowrap">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                :class="getStatusClass(batch.status)"
              >
                {{ batch.status || 'DRAFT' }}
              </span>
            </td>

            <!-- Aksi -->
            <td class="px-6 py-4 align-top text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  @click="$emit('edit', batch)"
                  class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Edit Batch"
                >
                  <Icon name="lucide:pencil" class="w-4 h-4" />
                </button>
                <button 
                  @click="$emit('delete', batch)"
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Hapus Batch"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          
          <tr v-if="!batches || batches.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
              <div class="flex flex-col items-center justify-center gap-3">
                <div class="p-3 bg-gray-100 rounded-full">
                  <Icon name="lucide:inbox" class="w-6 h-6 text-gray-400" />
                </div>
                <p class="text-sm">Belum ada data batch tersedia.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  batches: any[]
}>()

defineEmits(['edit', 'delete', 'view'])

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formatCurrency = (amount: number, currency: string = 'IDR') => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatType = (type: string) => {
  return type?.replace(/_/g, ' ') || '-'
}

const getStatusClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'OPEN':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'CLOSED':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'FULL':
      return 'bg-orange-50 text-orange-700 border-orange-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}
</script>