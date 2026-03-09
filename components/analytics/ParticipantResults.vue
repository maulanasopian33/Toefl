<template>
  <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-xl font-black text-gray-900">Analisis Hasil Peserta</h2>
        <p class="text-sm text-gray-500 font-medium">Lihat dan ekspor performa peserta berdasarkan batch dan tanggal.</p>
      </div>
      <div class="flex items-center gap-3">
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
            <th class="py-4 px-4">Nama Peserta</th>
            <th class="py-4 px-4">Batch</th>
            <th class="py-4 px-4">Nilai Section</th>
            <th class="py-4 px-4">Benar / Salah</th>
            <th class="py-4 px-4 text-center">Score</th>
            <th class="py-4 px-4">Tanggal</th>
            <th class="py-4 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="animate-pulse">
            <td colspan="7" class="py-8 text-center text-gray-400 font-bold">Memuat data...</td>
          </tr>
          <tr v-else-if="results.length === 0">
            <td colspan="7" class="py-8 text-center text-gray-400 font-bold">Tidak ada data ditemukan.</td>
          </tr>
          <tr v-else v-for="item in results" :key="item.participant_id" class="border-b border-gray-50 hover:bg-slate-50">
            <td class="py-4 px-4">
              <div class="font-bold text-gray-900">{{ item.user?.name || '-' }}</div>
              <div class="text-xs text-gray-500">{{ item.user?.email || '-' }}</div>
            </td>
            <td class="py-4 px-4 text-sm font-medium text-gray-700">{{ item.batch?.name || '-' }}</td>
            <td class="py-4 px-4">
              <div v-if="item.sectionScores" class="flex flex-wrap gap-1">
                <span v-for="(val, key) in item.sectionScores" :key="key" class="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold whitespace-nowrap cursor-help" :title="key">
                  {{ key.split(' ')[0] }}: {{ val }}
                </span>
              </div>
              <span v-else class="text-gray-400 text-xs">-</span>
            </td>
            <td class="py-4 px-4">
              <div class="flex gap-2">
                <span class="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">{{ item.correctCount }}B</span>
                <span class="px-2 py-1 rounded bg-rose-100 text-rose-700 text-xs font-bold">{{ item.wrongCount }}S</span>
              </div>
            </td>
            <td class="py-4 px-4 text-center">
              <span class="text-lg font-black text-indigo-600">{{ item.score }}</span>
            </td>
            <td class="py-4 px-4 text-sm text-gray-500">{{ new Date(item.submittedAt).toLocaleDateString() }}</td>
            <td class="py-4 px-4">
              <div class="flex items-center justify-center gap-2">
                <button @click="viewDiagnostic(item)" class="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors tooltip-trigger" title="Rapor Diagnostik">
                  <Icon name="lucide:award" class="w-4 h-4" />
                </button>
                <button @click="viewDetails(item)" class="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors tooltip-trigger" title="Detail Jawaban">
                  <Icon name="lucide:file-search" class="w-4 h-4" />
                </button>
                <button @click="viewProgress(item)" class="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors tooltip-trigger" title="Riwayat Progress">
                  <Icon name="lucide:trending-up" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div class="flex justify-between items-center mt-6">
      <span class="text-sm font-bold text-gray-500">Total: {{ totalItems }} data</span>
      <div class="flex gap-2">
        <button @click="changePage(page - 1)" :disabled="page <= 1" class="px-3 py-1 bg-gray-100 rounded text-sm disabled:opacity-50 font-bold text-gray-600">Prev</button>
        <span class="px-3 py-1 text-sm font-black text-gray-900">{{ page }} / {{ totalPages }}</span>
        <button @click="changePage(page + 1)" :disabled="page >= totalPages" class="px-3 py-1 bg-gray-100 rounded text-sm disabled:opacity-50 font-bold text-gray-600">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { useAdminBatches } from '@/composables/useAdminResults'

const emit = defineEmits(['switch-tab'])

const { fetchParticipantResults, downloadCSV } = useAnalytics()
const { batches } = useAdminBatches()
const config = useRuntimeConfig()

const results = ref([])
const loading = ref(false)
const page = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)

const filters = ref({
  batchId: '',
  date: '',
  search: ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchParticipantResults({ ...filters.value, page: page.value, limit: 10 })
    results.value = res.results || []
    totalPages.value = res.totalPages || 1
    totalItems.value = res.totalItems || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const changePage = (p) => {
  if(p >= 1 && p <= totalPages.value) {
    page.value = p
    loadData()
  }
}

const handleExport = () => {
  downloadCSV('participant-results', { ...filters.value }, 'participant_results')
}

const viewDetails = (item) => {
  emit('switch-tab', 'details', { participantId: item.user?.uid, batchId: item.batch?.idBatch })
}

const viewDiagnostic = (item) => {
  emit('switch-tab', 'diagnostic', { participantId: item.user?.uid, batchId: item.batch?.idBatch })
}

const viewProgress = (item) => {
  emit('switch-tab', 'progress', { participantId: item.user?.uid })
}

watch(() => filters.value.batchId, () => { page.value = 1; loadData() })

onMounted(() => {
  loadData()
})
</script>
