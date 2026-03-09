<template>
  <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-xl font-black text-gray-900">Statistik Rekapitulasi Batch</h2>
        <p class="text-sm text-gray-500 font-medium">Lihat performa keseluruhan per satu angkatan batch.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <select v-model="filters.batchId" class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700">
          <option value="">Semua Batch</option>
          <option v-for="b in batches" :key="b.idBatch" :value="b.idBatch">{{ b.name }}</option>
        </select>
        <button @click="loadData" class="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200">
          <Icon name="lucide:refresh-cw" class="w-5 h-5" :class="{'animate-spin': loading}" />
        </button>
        <button @click="handleExport" class="px-5 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-emerald-700">
          <Icon name="lucide:file-spreadsheet" class="w-4 h-4" /> Export CSV
        </button>
      </div>
    </div>

    <!-- TABLE -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-sm font-black text-gray-400 uppercase tracking-wider">
            <th class="py-4 px-4 w-[25%]">Nama Batch</th>
            <th class="py-4 px-4 text-center">Total Peserta</th>
            <th class="py-4 px-4 text-center">Rata-rata Skor</th>
            <th class="py-4 px-4 text-center">Tertinggi</th>
            <th class="py-4 px-4 text-center">Terendah</th>
            <th class="py-4 px-4 text-center">Pass Rate (>450)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="animate-pulse">
            <td colspan="6" class="py-8 text-center text-gray-400 font-bold">Memuat rekapan batch...</td>
          </tr>
          <tr v-else-if="results.length === 0">
            <td colspan="6" class="py-8 text-center text-gray-400 font-bold">Tidak ada ujian yang rampung pada batch terpilih.</td>
          </tr>
          <tr v-else v-for="(item, i) in results" :key="i" class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
            <td class="py-4 px-4 font-bold text-indigo-700 tracking-tight">{{ item.batch_name }}</td>
            <td class="py-4 px-4 text-center text-lg font-black text-gray-900">{{ item.total_participants }}</td>
            <td class="py-4 px-4 text-center font-bold text-emerald-600">{{ item.avg_total_score }}</td>
            <td class="py-4 px-4 text-center text-sm font-black">{{ item.max_score }}</td>
            <td class="py-4 px-4 text-center text-sm font-black">{{ item.min_score }}</td>
            <td class="py-4 px-4 text-center">
              <span class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 font-black rounded-[0.75rem] text-sm">
                 {{ item.pass_rate }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { useAdminBatches } from '@/composables/useAdminResults'

const { fetchBatchStatistics, downloadCSV } = useAnalytics()
const { batches } = useAdminBatches()
const config = useRuntimeConfig()

const results = ref([])
const loading = ref(false)

const filters = ref({
  batchId: ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchBatchStatistics({ ...filters.value })
    results.value = res || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleExport = () => {
  downloadCSV('batch-statistics', { ...filters.value }, 'batch_statistics')
}

watch(() => filters.value.batchId, () => loadData())

onMounted(() => {
  loadData()
})
</script>
