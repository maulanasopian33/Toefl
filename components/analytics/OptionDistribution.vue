<template>
  <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-xl font-black text-gray-900">Distribusi Opsi Jawaban</h2>
        <p class="text-sm text-gray-500 font-medium">Analisis distractor (pengecoh) utuk melihat sebaran jawaban peserta pada tiap soal.</p>
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

    <!-- TABLE -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-sm font-black text-gray-400 uppercase tracking-wider">
            <th class="py-4 px-4 w-[15%]">Section</th>
            <th class="py-4 px-4 w-1/3">Opsi Jawaban</th>
            <th class="py-4 px-4 text-center">Pemilih</th>
            <th class="py-4 px-4 text-center">Persentase</th>
            <th class="py-4 px-4 text-center">Kunci Jawaban</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="animate-pulse">
            <td colspan="5" class="py-8 text-center text-gray-400 font-bold">Memuat distribusi jawaban...</td>
          </tr>
          <tr v-else-if="results.length === 0">
            <td colspan="5" class="py-8 text-center text-gray-400 font-bold">Data distribusi opsi tidak tersedia.</td>
          </tr>
          <tr v-else v-for="(item, i) in results" :key="i" class="border-b border-gray-50 hover:bg-slate-50 transition-colors">
            <td class="py-4 px-4">
               <span class="text-xs font-black px-2 py-1 rounded bg-indigo-50 text-indigo-700 uppercase tracking-tight">
                  {{ item.section }}
               </span>
            </td>
            <td class="py-4 px-4">
              <div class="text-sm text-gray-800 font-bold line-clamp-2" v-html="item.option"></div>
            </td>
            <td class="py-4 px-4 text-center">
              <span class="text-lg font-black text-gray-900">{{ item.selected_count }}</span>
              <span class="text-xs text-gray-400 ml-1">orang</span>
            </td>
            <td class="py-4 px-4 text-center">
              <span class="text-sm font-black px-3 py-1 bg-gray-100 rounded-full text-gray-700">{{ item.percentage }}</span>
            </td>
            <td class="py-4 px-4 text-center">
              <span v-if="item.is_correct === 'Yes'" class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">
                <Icon name="lucide:key" class="w-3 h-3" /> Benar
              </span>
              <span v-else class="text-gray-400 text-xl font-bold">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'

const { fetchOptionDistribution, downloadCSV } = useAnalytics()

const results = ref([])
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchOptionDistribution()
    results.value = res || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleExport = () => {
  downloadCSV('option-distribution', {}, 'question_option_distribution')
}

onMounted(() => {
  loadData()
})
</script>
