<template>
  <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-xl font-black text-gray-900">Analisis Kualitas Soal</h2>
        <p class="text-sm text-gray-500 font-medium">Evaluasi indeks kesulitan soal berdasarkan persentase jawaban benar.</p>
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
            <th class="py-4 px-4 w-[15%]">Section</th>
            <th class="py-4 px-4 w-1/3">Soal Singkat</th>
            <th class="py-4 px-4 text-center">Total Percobaan</th>
            <th class="py-4 px-4 text-center">Difficulty Index</th>
            <th class="py-4 px-4">Interpretasi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="animate-pulse">
            <td colspan="5" class="py-8 text-center text-gray-400 font-bold">Menghitung metrik kualitas...</td>
          </tr>
          <tr v-else-if="results.length === 0">
            <td colspan="5" class="py-8 text-center text-gray-400 font-bold">Data metrik tidak tersedia.</td>
          </tr>
          <tr v-else v-for="(item, i) in results" :key="item.question_id" class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
            <td class="py-4 px-4">
               <span class="text-xs font-black px-2 py-1 rounded bg-indigo-50 text-indigo-700 uppercase tracking-tight">
                  {{ item.section }}
               </span>
            </td>
            <td class="py-4 px-4">
              <div class="text-xs text-gray-600 font-medium line-clamp-2" v-html="item.question_text"></div>
            </td>
            <td class="py-4 px-4 text-center">
              <span class="text-sm font-bold text-gray-800">{{ item.total_attempts }}</span>
              <div class="text-[10px] text-gray-400 mt-1 uppercase">{{ item.correct_count }} Benar</div>
            </td>
            <td class="py-4 px-4 text-center">
              <div class="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1 mb-2">
                 <!-- Indicator bar based on difficulty index (0.00-1.00) -->
                 <div class="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                      :class="getBarColor(item.difficulty_index)"
                      :style="{ width: `${item.difficulty_index * 100}%` }"></div>
              </div>
              <span class="text-sm font-black text-gray-900">{{ item.difficulty_index }}</span>
            </td>
            <td class="py-4 px-4">
              <span :class="getBadgeColor(item.interpretation)" class="px-3 py-1 text-[11px] font-black uppercase tracking-widest rounded-full truncate flex w-max">
                {{ item.interpretation }}
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

const { fetchQuestionQuality, downloadCSV } = useAnalytics()
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
    const res = await fetchQuestionQuality({ ...filters.value })
    // sort by difficulty inside UI mostly
    results.value = res.sort((a,b) => a.difficulty_index - b.difficulty_index) || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleExport = () => {
  downloadCSV('question-quality', { ...filters.value }, 'question_analysis')
}

// Helpers for UI Colors
const getBarColor = (index) => {
  const i = parseFloat(index)
  if(i >= 0.8) return 'bg-sky-400'
  if(i >= 0.6) return 'bg-emerald-400'
  if(i >= 0.4) return 'bg-amber-400'
  if(i >= 0.2) return 'bg-orange-500'
  return 'bg-rose-600'
}

const getBadgeColor = (interp) => {
  switch(interp) {
    case 'Sangat Mudah': return 'bg-sky-100 text-sky-700'
    case 'Mudah': return 'bg-emerald-100 text-emerald-700'
    case 'Sedang': return 'bg-amber-100 text-amber-700'
    case 'Sulit': return 'bg-orange-100 text-orange-700'
    case 'Sangat Sulit': return 'bg-rose-100 text-rose-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

watch(() => filters.value.batchId, () => loadData())

onMounted(() => {
  loadData()
})
</script>
