<template>
  <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-xl font-black text-gray-900">Detail Jawaban Peserta</h2>
        <p class="text-sm text-gray-500 font-medium">Analisis butir jawaban peserta untuk mendeteksi kelemahan pada materi tertentu.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <select v-model="filters.batchId" class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700">
          <option value="">Semua Batch</option>
          <option v-for="b in batches" :key="b.idBatch" :value="b.idBatch">{{ b.name }}</option>
        </select>
        <select v-model="filters.isCorrect" class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700">
          <option value="">Semua (Benar/Salah)</option>
          <option value="true">Jawaban Benar</option>
          <option value="false">Jawaban Salah</option>
        </select>
        <button @click="loadData" class="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200">
          <Icon name="lucide:refresh-cw" class="w-5 h-5" :class="{'animate-spin': loading}" />
        </button>
        <button @click="handleExport" class="px-5 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-emerald-700">
          <Icon name="lucide:file-spreadsheet" class="w-4 h-4" /> Export CSV
        </button>
      </div>
    </div>

    <!-- Active Filters Badge -->
    <div v-if="filters.participantId" class="w-full flex justify-end mb-4 animate-fade-in">
      <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shadow-sm">
        <Icon name="lucide:filter" class="w-3 h-3" /> Filter Peserta Terpilih Aktif
        <button @click="clearParticipant" class="hover:text-indigo-900 hover:bg-indigo-200 rounded-full p-0.5 transition-colors">
          <Icon name="lucide:x" class="w-3 h-3" />
        </button>
      </span>
    </div>

    <!-- TABLE -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-sm font-black text-gray-400 uppercase tracking-wider">
            <th class="py-4 px-4 w-1/4">Peserta & Batch</th>
            <th class="py-4 px-4 w-[15%]">Section</th>
            <th class="py-4 px-4 w-1/3">Soal Singkat / Teaser</th>
            <th class="py-4 px-4">Jawaban Peserta</th>
            <th class="py-4 px-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="animate-pulse">
            <td colspan="5" class="py-8 text-center text-gray-400 font-bold">Memuat detail jawaban...</td>
          </tr>
          <tr v-else-if="results.length === 0">
            <td colspan="5" class="py-8 text-center text-gray-400 font-bold">Tidak ada jawaban ditemukan (Hanya memuat maks 1000 data terbaru di UI).</td>
          </tr>
          <tr v-else v-for="(item, i) in results" :key="i" class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
            <td class="py-4 px-4">
              <div class="font-bold text-gray-900">{{ item.participant_name }}</div>
              <div class="text-xs font-medium text-gray-500 max-w-[150px] truncate" :title="item.batch_name">{{ item.batch_name }}</div>
            </td>
            <td class="py-4 px-4 text-xs font-bold text-indigo-600 uppercase tracking-wide">{{ item.section }}</td>
            <td class="py-4 px-4">
              <div class="text-xs text-gray-600 font-medium line-clamp-2" v-html="item.question_text"></div>
            </td>
            <td class="py-4 px-4">
              <div class="text-sm font-bold text-gray-800 line-clamp-1 truncate" v-html="item.selected_option || '(Tidak Dijawab)'"></div>
            </td>
            <td class="py-4 px-4 text-center">
              <span v-if="item.is_correct === 'Yes'" class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600">
                <Icon name="lucide:check" class="w-5 h-5" />
              </span>
              <span v-else class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600">
                <Icon name="lucide:x" class="w-5 h-5" />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { useAdminBatches } from '@/composables/useAdminResults'

const { fetchAnswerDetails, downloadCSV } = useAnalytics()
const { batches } = useAdminBatches()
const config = useRuntimeConfig()

const selectedParticipantId = inject('selectedParticipantId', ref(''))
const selectedBatchId = inject('selectedBatchId', ref(''))

const results = ref([])
const loading = ref(false)

const filters = ref({
  batchId: selectedBatchId.value || '',
  participantId: selectedParticipantId.value || '',
  isCorrect: ''
})

const clearParticipant = () => {
  filters.value.participantId = ''
  selectedParticipantId.value = ''
  loadData()
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchAnswerDetails({ ...filters.value })
    results.value = res || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleExport = () => {
  downloadCSV('answer-details', { ...filters.value }, 'participant_answers_detail')
}

watch(() => filters.value.batchId, () => loadData())
watch(() => filters.value.isCorrect, () => loadData())

watch(selectedBatchId, (newVal) => {
  if (newVal !== filters.value.batchId) {
    filters.value.batchId = newVal
  }
})

watch(selectedParticipantId, (newVal) => {
  if (newVal !== filters.value.participantId) {
    filters.value.participantId = newVal
    loadData()
  }
})

onMounted(() => {
  loadData()
})
</script>
