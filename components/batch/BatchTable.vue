<template>
  <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
    <div class="overflow-x-auto relative">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
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
            class="group hover:bg-gray-50 transition-colors duration-200"
          >
            <!-- Batch Info -->
            <td class="px-6 py-4 align-top">
              <div class="flex flex-col gap-1.5">
                <span @click="$emit('view', batch)" class="font-bold text-base cursor-pointer text-gray-900 group-hover:text-blue-600 transition-colors">
                  {{ batch.name }}
                </span>
                <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed max-w-xs">
                  {{ batch.description }}
                </p>
                <div class="flex flex-wrap items-center gap-2 mt-2">
                  <span class="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 uppercase tracking-wider">
                    {{ formatType(batch.type) }}
                  </span>
                  <span v-if="batch.sessions?.length" class="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 font-medium">
                    <Icon name="lucide:layers" class="w-3 h-3" />
                    {{ batch.sessions.length }} Sesi
                  </span>
                </div>
              </div>
            </td>

            <!-- Jadwal -->
            <td class="px-6 py-4 align-top whitespace-nowrap">
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <div class="p-1 bg-indigo-50 rounded text-indigo-500">
                    <Icon name="lucide:calendar-range" class="w-3.5 h-3.5" />
                  </div>
                  <span>{{ formatDate(batch.start_date) }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500 pl-7">
                  <span>s/d {{ formatDate(batch.end_date) }}</span>
                </div>
                <div v-if="batch.duration_minutes" class="flex items-center gap-2 text-xs text-gray-400 pl-7 mt-0.5">
                  <Icon name="lucide:clock" class="w-3 h-3" />
                  <span>{{ Math.floor(batch.duration_minutes / 60) }} Jam</span>
                </div>
              </div>
            </td>

            <!-- Peserta -->
            <td class="px-6 py-4 align-top whitespace-nowrap">
              <div class="flex flex-col gap-1">
                <div class="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <span class="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{{ 0 }}</span> 
                  <span class="text-gray-300">/</span> 
                  <span>{{ batch.max_participants }}</span>
                </div>
                <div class="text-[11px] text-gray-400 font-medium">
                  Min: {{ batch.min_participants || '-' }} Peserta
                </div>
              </div>
            </td>

            <!-- Harga -->
            <td class="px-6 py-4 align-top whitespace-nowrap">
              <div class="font-bold text-gray-900 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-100 inline-block text-sm">
                {{ formatCurrency(batch.price, batch.currency) }}
              </div>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 align-top text-center whitespace-nowrap">
              <span 
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                :class="getStatusClass(batch.status)"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                {{ batch.status || 'DRAFT' }}
              </span>
            </td>

            <!-- Aksi -->
            <td class="px-6 py-4 align-top text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-2">
                <button 
                  @click="$emit('edit', batch)"
                  class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                  title="Edit Batch"
                >
                  <Icon name="lucide:pencil" class="w-4 h-4" />
                </button>
                <button 
                  @click="$emit('delete', batch)"
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                  title="Hapus Batch"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          
          <tr v-if="!batches || batches.length === 0">
            <td colspan="6" class="px-6 py-16 text-center text-gray-500 bg-gray-50/30">
              <div class="flex flex-col items-center justify-center gap-3">
                <div class="p-4 bg-gray-50 rounded-full border border-gray-100">
                  <Icon name="lucide:inbox" class="w-8 h-8 text-gray-300" />
                </div>
                <div>
                   <h4 class="text-sm font-semibold text-gray-900">Tidak Ada Batch</h4>
                   <p class="text-xs text-gray-500 mt-1">Belum ada data batch program tersedia.</p>
                </div>
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