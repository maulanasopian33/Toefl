<template>
  <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-xl font-black text-gray-900">Perkembangan Peserta</h2>
        <p class="text-sm text-gray-500 font-medium">Lacak peningkatan rata-rata nilai peserta (Data membutuhkan filter ID spesifik via backend/URL). Di bawah ini list pencapaian personal.</p>
      </div>
      <div class="flex items-center gap-3">
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
            <th class="py-4 px-4 w-[25%]">Nama Peserta</th>
            <th class="py-4 px-4">Batch</th>
            <th class="py-4 px-4 text-center">Tanggal Ujian</th>
            <th class="py-4 px-4 text-center">Total Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="animate-pulse">
            <td colspan="4" class="py-8 text-center text-gray-400 font-bold">Memuat riwayat perkembangan...</td>
          </tr>
          <tr v-else-if="results.length === 0">
            <td colspan="4" class="py-8 text-center text-gray-400 font-bold">Pilih peserta atau atur backend untuk fetch seluruh history (limitasi data besar).</td>
          </tr>
          <tr v-else v-for="(item, i) in results" :key="i" class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
            <td class="py-4 px-4 font-bold text-gray-900 bg-indigo-50/10">{{ item.participant_name }}</td>
            <td class="py-4 px-4 text-sm text-gray-700 font-bold">{{ item.batch_name }}</td>
            <td class="py-4 px-4 text-center text-sm text-gray-500">{{ new Date(item.test_date).toLocaleString() }}</td>
            <td class="py-4 px-4 text-center">
              <span class="text-xl font-black text-indigo-600 drop-shadow-sm">{{ item.total_score }}</span>
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

const { fetchParticipantProgress, downloadCSV } = useAnalytics()

const selectedParticipantId = inject('selectedParticipantId', ref(''))

const results = ref([])
const loading = ref(false)

const filters = ref({
  participantId: selectedParticipantId.value || ''
})

const clearParticipant = () => {
  filters.value.participantId = ''
  selectedParticipantId.value = ''
  loadData()
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchParticipantProgress({ participantId: filters.value.participantId })
    results.value = res || []
  } catch (e) {
    if(e.response && e.response.status === 400) {
      console.warn('Participant ID required. Need to implement participant picker.')
    }
  } finally {
    loading.value = false
  }
}

const handleExport = () => {
  downloadCSV('participant-progress', { ...filters.value }, 'participant_progress')
}

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
