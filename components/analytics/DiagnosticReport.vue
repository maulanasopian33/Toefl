<template>
  <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-xl font-black text-gray-900">Rapor Diagnostik Individual</h2>
        <p class="text-sm text-gray-500 font-medium">Analisis mendalam performa peserta dibandingkan dengan rata-rata batch (Radar Chart).</p>
      </div>
      <div class="flex items-center gap-3">
        <button v-if="reportData" @click="printReport" class="px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <Icon name="lucide:printer" class="w-4 h-4" /> Cetak Rapor
        </button>
      </div>
    </div>

    <!-- State: No Participant Selected -->
    <div v-if="!selectedParticipantId || !selectedBatchId" class="py-16 flex flex-col items-center justify-center text-center">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
        <Icon name="lucide:user-search" class="w-10 h-10 text-gray-400" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">Pilih Peserta Terlebih Dahulu</h3>
      <p class="text-gray-500 max-w-sm">Buka tab <strong>Hasil Peserta</strong>, lalu klik tombol Rapor Diagnostik pada salah satu baris untuk melihat analisis individual.</p>
    </div>

    <!-- State: Loading -->
    <div v-else-if="loading" class="py-16 flex flex-col items-center justify-center text-center animate-pulse">
      <Icon name="lucide:loader-2" class="w-10 h-10 text-indigo-500 animate-spin mb-4" />
      <p class="text-gray-500 font-bold">Mengkalkulasi model diagnostik...</p>
    </div>

    <!-- State: Error -->
    <div v-else-if="error" class="py-12 text-center">
      <div class="p-4 bg-red-50 text-red-600 rounded-xl inline-block font-bold">
        Gagal memuat rapor: {{ error }}
      </div>
      <div class="mt-4">
        <button @click="loadReport" class="text-sm font-bold text-indigo-600 hover:underline">Coba Lagi</button>
      </div>
    </div>

    <!-- State: Loaded -->
    <div v-else-if="reportData" id="printable-report" class="space-y-8 print:p-8 print:bg-white print:text-black">
      
      <!-- Report Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 print:border-gray-300 print:bg-none">
        <div>
          <h3 class="text-2xl font-black text-indigo-900 print:text-black">{{ reportData.participant.name }}</h3>
          <p class="text-indigo-700/80 font-medium flex items-center gap-2 mt-1 print:text-gray-600">
            <Icon name="lucide:mail" class="w-4 h-4" /> {{ reportData.participant.email }}
          </p>
          <div class="flex flex-wrap items-center gap-3 mt-4">
            <span class="px-3 py-1 bg-white text-indigo-700 rounded-lg text-xs font-bold shadow-sm border border-indigo-100 flex items-center gap-1">
              <Icon name="lucide:calendar" class="w-3 h-3" /> {{ new Date(reportData.testSummary.testDate).toLocaleDateString() }}
            </span>
            <span class="px-3 py-1 bg-white text-indigo-700 rounded-lg text-xs font-bold shadow-sm border border-indigo-100 flex items-center gap-1">
              <Icon name="lucide:users" class="w-3 h-3" /> {{ reportData.batch.name }}
            </span>
          </div>
        </div>
        
        <div class="flex flex-col items-center md:items-end w-full md:w-auto p-4 bg-white rounded-xl shadow-sm border border-indigo-100/50 print:border-gray-200">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Skor</span>
          <div class="text-4xl font-black text-emerald-600 print:text-black">
            {{ reportData.testSummary.totalScore }}
          </div>
          <div class="mt-2 text-center">
            <span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black tracking-wide border border-emerald-200">
              CEFR Level: {{ reportData.testSummary.cefrLevel }}
            </span>
          </div>
        </div>
      </div>

      <!-- Descriptive Feedback -->
      <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <h4 class="text-sm font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Icon name="lucide:message-square" class="w-4 h-4 text-indigo-400" /> Analisis Deskriptif
        </h4>
        <p class="text-gray-700 font-medium leading-relaxed">
          {{ reportData.testSummary.feedback }}
        </p>
      </div>

      <!-- Radar Chart & breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        
        <div class="flex flex-col justify-center min-h-[350px]">
          <h4 class="text-center font-bold text-gray-600 mb-2">Area Profil Kemampuan (Radar Chart)</h4>
          <ClientOnly>
            <apexchart v-if="chartOptions && chartSeries.length > 0" type="radar" height="350" :options="chartOptions" :series="chartSeries"></apexchart>
          </ClientOnly>
        </div>

        <div>
          <h4 class="font-bold text-gray-800 mb-4 px-2 tracking-tight">Perbandingan per Section</h4>
          <div class="space-y-3">
            <div v-for="(sec, idx) in reportData.sections" :key="idx" class="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-gray-700 text-sm">{{ sec.name }}</span>
                <span class="flex items-center gap-1 font-black" :class="sec.score >= sec.batchAverage ? 'text-emerald-600' : 'text-rose-600'">
                  {{ sec.score }}
                  <Icon v-if="sec.score >= sec.batchAverage" name="lucide:trending-up" class="w-4 h-4 opacity-70" />
                  <Icon v-else name="lucide:trending-down" class="w-4 h-4 opacity-70" />
                </span>
              </div>
              
              <!-- Progress Bars -->
              <div class="space-y-2 mt-3 text-xs font-semibold">
                <div class="flex items-center gap-3">
                  <span class="w-16 text-gray-500">Nilai Anda</span>
                  <div class="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-500 rounded-full" :style="{ width: `${(sec.score / sec.maxScore) * 100}%` }"></div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="w-16 text-gray-400">Rata Batch</span>
                  <div class="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-gray-300 rounded-full" :style="{ width: `${(sec.batchAverage / sec.maxScore) * 100}%` }"></div>
                  </div>
                  <span class="w-8 text-right text-gray-500">{{ sec.batchAverage }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch, onMounted } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'

const { fetchDiagnosticReport, isLoading } = useAnalytics()

const selectedParticipantId = inject('selectedParticipantId', ref(''))
const selectedBatchId = inject('selectedBatchId', ref(''))

const reportData = ref(null)
const error = ref(null)
const loading = ref(false)

const chartOptions = ref({
  chart: {
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif'
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    show: false,
    min: 0
  },
  colors: ['#6366f1', '#cbd5e1'],
  fill: {
    opacity: 0.2
  },
  markers: {
    size: 4,
    colors: ['#fff'],
    strokeColors: ['#6366f1', '#94a3b8'],
    strokeWidth: 2,
  },
  stroke: {
    width: 2,
    dashArray: [0, 4]
  },
  legend: {
    position: 'bottom',
    markers: { radius: 12 }
  }
})

const chartSeries = ref([])

const loadReport = async () => {
  if (!selectedParticipantId.value || !selectedBatchId.value) {
    reportData.value = null
    return
  }

  loading.value = true
  error.value = null
  
  try {
    const res = await fetchDiagnosticReport(selectedParticipantId.value, selectedBatchId.value)
    reportData.value = res
    setupChart(res.sections)
  } catch (err) {
    console.error(err)
    error.value = err.message || 'Terjadi kesalahan sistem.'
  } finally {
    loading.value = false
  }
}

const setupChart = (sections) => {
  const categories = sections.map(s => s.name.split(' ')[0]) // Short names like 'Listening', 'Structure'
  const participantScores = sections.map(s => s.score)
  const batchAverages = sections.map(s => s.batchAverage)
  
  // Update max y-axis dynamically based on scoring scale
  const maxScore = Math.max(...sections.map(s => s.maxScore || 100))

  chartOptions.value = {
    ...chartOptions.value,
    xaxis: { categories },
    yaxis: { ...chartOptions.value.yaxis, max: maxScore }
  }

  chartSeries.value = [
    { name: 'Nilai Anda', data: participantScores },
    { name: 'Rata-rata Batch', data: batchAverages }
  ]
}

const printReport = () => {
  window.print()
}

watch([selectedParticipantId, selectedBatchId], () => {
  loadReport()
})

onMounted(() => {
  loadReport()
})
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #printable-report, #printable-report * {
    visibility: visible;
  }
  #printable-report {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
