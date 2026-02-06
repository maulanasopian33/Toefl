<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- HEADER -->
    <header class="flex flex-col gap-4 rounded-[2.5rem] bg-white px-10 py-8 border border-gray-100 shadow-xl ring-1 ring-gray-900/5 sm:flex-row sm:items-center sm:justify-between transition-all hover:shadow-2xl">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          <div class="p-3 bg-indigo-100 rounded-[1.25rem] text-indigo-600">
            <Icon name="lucide:pie-chart" class="w-8 h-8" />
          </div>
          Analisis Hasil Ujian
        </h1>
        <p class="mt-2 text-sm text-gray-500 font-medium">
          Lihat distribusi skor, performa per bagian, dan tingkat kesulitan soal.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Batch Selector -->
        <select 
          v-model="selectedBatchId"
          class="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm transition-all"
        >
          <option value="">Semua Batch</option>
          <option v-for="b in batches" :key="b.idBatch" :value="b.idBatch">
            {{ b.name }}
          </option>
        </select>
        
        <button
          @click="fetchReport(selectedBatchId)"
          class="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all transform active:scale-95 whitespace-nowrap"
        >
          <Icon name="lucide:refresh-cw" class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
          Update Analisis
        </button>
      </div>
    </header>

    <!-- SUMMARY CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Participants -->
      <div class="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div class="relative">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Peserta</p>
          <h3 class="text-4xl font-black text-gray-900 mb-2 truncate">
            {{ summary.totalParticipants }}
          </h3>
          <div class="flex items-center gap-2 text-blue-500 font-bold text-[10px]">
             Suah Mengerjakan Ujian
          </div>
        </div>
      </div>

      <!-- Average Score -->
      <div class="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div class="relative">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Rata-Rata Skor</p>
          <h3 class="text-4xl font-black text-gray-900 mb-2 truncate">
            {{ summary.avgScore }}
          </h3>
          <div class="flex items-center gap-2 text-emerald-500 font-bold text-[10px]">
             Performa Batch Ini
          </div>
        </div>
      </div>

      <!-- Highest Score -->
      <div class="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div class="relative">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Skor Tertinggi</p>
          <h3 class="text-4xl font-black text-gray-900 mb-2 truncate">
            {{ summary.maxScore }}
          </h3>
          <div class="flex items-center gap-2 text-amber-500 font-bold text-[10px]">
             <Icon name="lucide:award" class="w-3.5 h-3.5" />
             Pencapaian Terbaik
          </div>
        </div>
      </div>

      <!-- Lowest Score -->
      <div class="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div class="relative">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Skor Terendah</p>
          <h3 class="text-4xl font-black text-gray-900 mb-2 truncate">
            {{ summary.minScore }}
          </h3>
          <div class="flex items-center gap-2 text-rose-500 font-bold text-[10px]">
             Perlu Perhatian Ekstra
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN ANALYSIS SECTION -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Score Distribution Chart -->
      <div class="lg:col-span-12 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl overflow-hidden group">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h4 class="text-xl font-black text-gray-900">Distribusi Skor</h4>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Sebaran jumlah peserta berdasarkan rentang nilai</p>
          </div>
        </div>
        
        <div v-if="distribution.length > 0" class="h-[300px]">
           <ClientOnly>
             <apexchart
                type="bar"
                height="300"
                :options="distOptions"
                :series="distSeries"
             />
           </ClientOnly>
        </div>
        <div v-else class="h-[300px] flex items-center justify-center text-gray-300 font-bold text-sm bg-slate-50 rounded-3xl border border-dashed border-gray-200">
           Tidak ada data distribusi untuk periode ini
        </div>
      </div>

      <!-- Section Stats -->
      <div class="lg:col-span-8 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl">
        <h4 class="text-xl font-black text-gray-900 mb-2">Performa per Bagian (Section)</h4>
        <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mb-10">Rata-rata persentase jawaban benar</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div v-for="sect in sectionStats" :key="sect.sectionName" class="flex flex-col items-center text-center">
              <div class="relative w-32 h-32 mb-6 group">
                <!-- Circular Progress Mockup with SVG -->
                <svg class="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" stroke-width="8" fill="transparent" class="text-slate-100" />
                  <circle 
                    cx="64" cy="64" r="58" stroke="currentColor" stroke-width="10" fill="transparent" 
                    :stroke-dasharray="364" 
                    :stroke-dashoffset="364 - (364 * parseFloat(sect.avgCorrectPercentage as string) / 100)"
                    stroke-linecap="round"
                    class="text-indigo-600 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                   <span class="text-2xl font-black text-gray-900">{{ Math.round(parseFloat(sect.avgCorrectPercentage as string)) }}%</span>
                </div>
              </div>
              <h5 class="font-black text-gray-800 text-sm uppercase tracking-tight">{{ sect.sectionName }}</h5>
              <p class="text-[10px] text-gray-400 font-bold mt-1">JAWABAN BENAR</p>
           </div>
        </div>
      </div>

      <!-- Quick Analysis Card -->
      <div class="lg:col-span-4 bg-indigo-600 rounded-[3rem] p-10 text-white shadow-xl shadow-indigo-600/30 flex flex-col justify-between relative overflow-hidden group">
         <div class="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
         <div class="relative z-10 h-full flex flex-col justify-between">
           <div>
             <div class="p-3 bg-white/20 rounded-2xl inline-block mb-6">
                <Icon name="lucide:lightbulb" class="w-8 h-8" />
             </div>
             <h4 class="text-2xl font-black mb-4">Wawasan Singkat</h4>
             <p class="text-sm font-medium text-indigo-100 leading-relaxed mb-6">
               {{ getInsightMessage() }}
             </p>
           </div>
           
           <div class="space-y-3">
              <div class="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/5">
                <span class="text-xs font-bold text-indigo-100">Kapasitas Ujian</span>
                <span class="text-sm font-black">{{ Math.round(summary.totalParticipants / 100) }}% Sibuk</span>
              </div>
              <button class="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-colors shadow-lg">
                Cetak Hasil Kolektif
              </button>
           </div>
         </div>
      </div>
    </div>

    <!-- DIFFICULTY TABLES -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Hardest Questions -->
      <div class="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
        <div class="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-rose-50/30">
           <div>
             <h4 class="text-xl font-black text-gray-900">Top 5 Soal Tersulit</h4>
             <p class="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">Berdasarkan persentase keberhasilan terendah</p>
           </div>
           <Icon name="lucide:trending-down" class="w-8 h-8 text-rose-200" />
        </div>
        <div class="overflow-hidden">
           <div v-for="(q, idx) in difficulty.hardest" :key="q.id" class="px-10 py-6 border-b border-gray-50 last:border-0 flex items-center gap-6 hover:bg-slate-50 transition-colors">
              <span class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-rose-100 text-rose-600 font-black text-sm">{{ idx + 1 }}</span>
              <div class="flex-grow min-w-0">
                 <p class="text-sm font-bold text-gray-800 line-clamp-2" v-html="q.text"></p>
                 <div class="flex items-center gap-3 mt-2">
                    <span class="text-[10px] text-gray-400 font-bold uppercase italic">Persentase Benar:</span>
                    <span class="text-xs font-black text-rose-600">{{ Math.round(parseFloat(q.correctPercentage as string)) }}%</span>
                 </div>
              </div>
              <Icon name="lucide:chevron-right" class="w-5 h-5 text-gray-300" />
           </div>
           <div v-if="difficulty.hardest.length === 0" class="p-10 text-center text-gray-400 font-medium italic">Data soal belum tersedia.</div>
        </div>
      </div>

       <!-- Easiest Questions -->
       <div class="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
        <div class="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-emerald-50/30">
           <div>
             <h4 class="text-xl font-black text-gray-900">Top 5 Soal Termudah</h4>
             <p class="text-xs text-emerald-500 font-bold uppercase tracking-widest mt-1">Berdasarkan persentase keberhasilan tertinggi</p>
           </div>
           <Icon name="lucide:trending-up" class="w-8 h-8 text-emerald-200" />
        </div>
        <div class="overflow-hidden">
           <div v-for="(q, idx) in difficulty.easiest" :key="q.id" class="px-10 py-6 border-b border-gray-50 last:border-0 flex items-center gap-6 hover:bg-slate-50 transition-colors">
              <span class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-black text-sm">{{ idx + 1 }}</span>
              <div class="flex-grow min-w-0">
                 <p class="text-sm font-bold text-gray-800 line-clamp-2" v-html="q.text"></p>
                 <div class="flex items-center gap-3 mt-2">
                    <span class="text-[10px] text-gray-400 font-bold uppercase italic">Persentase Benar:</span>
                    <span class="text-xs font-black text-emerald-600">{{ Math.round(parseFloat(q.correctPercentage as string)) }}%</span>
                 </div>
              </div>
              <Icon name="lucide:chevron-right" class="w-5 h-5 text-gray-300" />
           </div>
           <div v-if="difficulty.easiest.length === 0" class="p-10 text-center text-gray-400 font-medium italic">Data soal belum tersedia.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useExamReport } from '@/composables/useExamReport'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
})

const { isLoading, summary, distribution, sectionStats, difficulty, fetchReport } = useExamReport()

const selectedBatchId = ref('')
const batches = ref<any[]>([])

// Fetch batches for filter
const fetchBatches = async () => {
   const config = useRuntimeConfig()
   try {
     const { data } = await $fetch<any>(`${config.public.API_URL}/batch`)
     batches.value = data || []
   } catch (e) {
     console.error('Failed to fetch batches', e)
   }
}

// Chart Options for Score Distribution
const distSeries = computed(() => [{
  name: 'Jumlah Peserta',
  data: distribution.value.map(d => d.count)
}])

const distOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    fontFamily: 'system-ui, sans-serif',
  },
  colors: ['#4f46e5'],
  plotOptions: {
    bar: {
      borderRadius: 12,
      columnWidth: '45%',
      distributed: false,
      dataLabels: { position: 'top' }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: any) => val,
    offsetY: -20,
    style: { fontSize: '12px', colors: ['#6366f1'], fontWeight: '900' }
  },
  xaxis: {
    categories: distribution.value.map(d => d.range),
    labels: { style: { fontWeight: '700', fontSize: '11px' } },
  },
  yaxis: {
    labels: { style: { fontWeight: '700' } }
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4
  }
}))

const getInsightMessage = () => {
  if (summary.value.avgScore > 500) {
    return 'Luar biasa! Rata-rata peserta berada di atas 500. Sebagian besar materi tampaknya dikuasai dengan baik oleh kandidat.'
  } else if (summary.value.avgScore > 450) {
    return 'Performa cukup stabil. Mayoritas peserta memiliki pemahaman dasar yang baik, namun masih ada ruang untuk pengayaan materi.'
  } else if (summary.value.avgScore > 0) {
    return 'Performa rata-rata masih rendah. Anda mungkin perlu meninjau kembali tingkat kesulitan soal atau memberikan pelatihan lebih intensif.'
  }
  return 'Belum ada data yang cukup untuk memberikan wawasan cerdas saat ini.'
}

onMounted(async () => {
  await fetchBatches()
  fetchReport()
})

watch(selectedBatchId, (newId) => {
  fetchReport(newId)
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem;
  padding-right: 3rem;
}
</style>
