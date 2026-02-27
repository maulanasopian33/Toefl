<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- HEADER -->
    <header class="flex flex-col gap-4 rounded-[2.5rem] bg-white px-10 py-8 border border-gray-100 shadow-xl ring-1 ring-gray-900/5 sm:flex-row sm:items-center sm:justify-between transition-all hover:shadow-2xl">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          <div class="p-3 bg-indigo-100 rounded-[1.25rem] text-indigo-600">
            <Icon name="lucide:users" class="w-8 h-8" />
          </div>
          Laporan Peserta
        </h1>
        <p class="mt-2 text-sm text-gray-500 font-medium">
          Daftar lengkap peserta ujian, skor, dan status kelulusan.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3 no-print">
        <!-- Search -->
        <div class="relative">
          <input 
            v-model="search"
            type="text"
            placeholder="Cari nama atau email..."
            class="pl-10 pr-4 py-3 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all w-64"
            @keyup.enter="handleFilter"
          />
          <Icon name="lucide:search" class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        <!-- Batch Selector -->
        <select 
          v-model="selectedBatchId"
          class="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm transition-all"
          @change="handleFilter"
        >
          <option value="">Semua Batch</option>
          <option v-for="b in batches" :key="b.idBatch" :value="b.idBatch">
            {{ b.name }}
          </option>
        </select>
        
        <button
          @click="handleFilter"
          class="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-6 py-3.5 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all transform active:scale-95 whitespace-nowrap"
        >
          <Icon name="lucide:refresh-cw" class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
          Refresh
        </button>

        <button
          @click="exportCSV({ batchId: selectedBatchId, search })"
          class="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all transform active:scale-95 whitespace-nowrap"
        >
          <Icon name="lucide:file-spreadsheet" class="w-5 h-5" />
          CSV
        </button>

        <button
          @click="handlePrint()"
          class="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all transform active:scale-95 whitespace-nowrap"
        >
          <Icon name="lucide:printer" class="w-5 h-5" />
          Cetak
        </button>
      </div>
    </header>

    <!-- CONTENT -->
    <div class="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Peserta</th>
              <th class="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Batch</th>
              <th class="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Skor</th>
              <th class="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Tanggal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <template v-if="isLoading">
               <tr v-for="i in 5" :key="i">
                 <td class="px-8 py-6"><div class="h-4 bg-gray-100 rounded w-32 animate-pulse"></div></td>
                 <td class="px-8 py-6"><div class="h-4 bg-gray-100 rounded w-24 animate-pulse"></div></td>
                 <td class="px-8 py-6 text-center"><div class="h-4 bg-gray-100 rounded w-12 mx-auto animate-pulse"></div></td>
                 <td class="px-8 py-6 text-right"><div class="h-4 bg-gray-100 rounded w-24 ml-auto animate-pulse"></div></td>
               </tr>
            </template>
            <template v-else-if="participants.length > 0">
              <tr v-for="p in participants" :key="p.id" class="hover:bg-slate-50 transition-colors group">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {{ p.user?.name?.charAt(0) || '?' }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900">{{ p.user?.name }}</p>
                      <p class="text-xs text-gray-500">{{ p.user?.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                    {{ p.batch?.name || '-' }}
                  </span>
                </td>
                <td class="px-8 py-6 text-center">
                  <span class="text-lg font-black" :class="getScoreColor(p.score)">
                    {{ p.score }}
                  </span>
                </td>
                <td class="px-8 py-6 text-right">
                  <p class="text-sm font-bold text-gray-700">{{ formatDate(p.createdAt) }}</p>
                  <p class="text-xs text-gray-400">{{ formatTime(p.createdAt) }}</p>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="4" class="px-8 py-12 text-center text-gray-400 font-medium italic">
                Tidak ada data peserta yang ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
        <button 
          :disabled="page === 1"
          @click="changePage(page - 1)"
          class="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <span class="text-xs font-bold text-gray-500">
          Page {{ page }} of {{ totalPages }}
        </span>

        <button 
          :disabled="page === totalPages"
          @click="changePage(page + 1)"
          class="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useParticipantReport } from '@/composables/useParticipantReport'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
})

const { isLoading, participants, totalItems, totalPages, currentPage, fetchReport, exportCSV } = useParticipantReport()

const handlePrint = () => {
  if (process.client) {
    window.print()
  }
}

const selectedBatchId = ref('')
const search = ref('')
const page = ref(1)
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

const handleFilter = () => {
  page.value = 1
  fetchData()
}

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    fetchData()
  }
}

const fetchData = () => {
  fetchReport({
    batchId: selectedBatchId.value,
    search: search.value,
    page: page.value,
    limit: 10
  })
}

const getScoreColor = (score: number) => {
  if (score >= 500) return 'text-indigo-600'
  if (score >= 450) return 'text-emerald-500'
  if (score >= 400) return 'text-amber-500'
  return 'text-rose-500'
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    da: 'numeric', month: 'short', year: 'numeric'
  })
}

const formatTime = (dateString: string) => {
   if (!dateString) return '-'
   return new Date(dateString).toLocaleTimeString('id-ID', {
     hour: '2-digit', minute: '2-digit'
   })
}

onMounted(async () => {
  await fetchBatches()
  fetchData()
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
@media print {
  .no-print, header .flex-wrap, .px-8.py-6.border-t {
    display: none !important;
  }
  .animate-fade-in-up {
    animation: none !important;
  }
  .bg-white {
    box-shadow: none !important;
    border: none !important;
  }
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
