<template>
  <div class="p-6 sm:p-8">
    <!-- Header Halaman -->
    <header class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Hasil Tes per Batch</h1>
        <p class="mt-1 text-slate-600">Tinjau hasil tes dari semua peserta dalam satu batch.</p>
      </div>
      <!-- Pemilih Batch -->
      <div class="w-full sm:w-64">
        <label for="batch-selector" class="sr-only">Pilih Batch</label>
        <select id="batch-selector" v-model="selectedBatchId" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option v-if="isBatchesLoading" value="">Memuat batch...</option>
          <option v-for="batch in batches" :key="batch.id" :value="batch.id">{{ batch.name }}</option>
        </select>
      </div>
    </header>

    <!-- Card Utama untuk Tabel -->
    <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
      <header class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 class="font-bold text-gray-800 whitespace-nowrap flex items-center gap-2">
          <div class="p-1.5 bg-blue-50 rounded-lg text-blue-600">
             <Icon name="lucide:file-bar-chart-2" class="w-5 h-5" />
          </div>
          Hasil untuk: <span class="text-blue-600">{{ selectedBatchName }}</span>
        </h2>
        <!-- Input Pencarian -->
        <div class="w-full sm:max-w-xs">
          <label for="search-filter" class="sr-only">Cari Peserta</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="lucide:search" class="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input type="text" id="search-filter" v-model="searchQuery" placeholder="Cari nama atau email..." class="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
          </div>
        </div>
      </header>

      <!-- Container untuk State dan Tabel -->
      <div class="overflow-x-auto relative">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-center">
          <Icon name="lucide:loader-2" class="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <h3 class="text-sm font-semibold text-gray-700">Memuat Hasil Tes...</h3>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-16 text-center bg-red-50/50 m-6 rounded-xl border border-red-100">
          <Icon name="lucide:server-crash" class="w-10 h-10 text-red-500 mb-3" />
          <h3 class="text-sm font-semibold text-red-800">Gagal Memuat Data</h3>
          <p class="text-xs text-red-600 mt-1">Silakan coba lagi nanti.</p>
        </div>

        <!-- Empty States -->
        <div v-else-if="results.length === 0 || filteredAndSortedResults.length === 0" class="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <div class="p-4 bg-gray-50 rounded-full mb-3">
             <Icon :name="searchQuery ? 'lucide:search-x' : 'lucide:inbox'" class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-sm font-semibold text-gray-900">
            {{ searchQuery ? 'Tidak Ada Hasil' : 'Belum Ada Data' }}
          </h3>
          <p class="text-xs mt-1 max-w-xs mx-auto">
            {{ 
              searchQuery 
                ? `Tidak ada peserta yang cocok dengan "${searchQuery}".` 
                : 'Belum ada hasil tes tercatat untuk batch ini.' 
            }}
          </p>
        </div>

        <!-- Tabel Hasil Tes -->
        <div v-else>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th scope="col" class="px-6 py-4">
                  <button @click="handleSort('namaLengkap')" class="flex items-center gap-1 hover:text-blue-600 transition-colors group">
                    Nama Peserta <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="namaLengkap" />
                  </button>
                </th>
                <th scope="col" class="px-6 py-4">
                   <button @click="handleSort('userEmail')" class="flex items-center gap-1 hover:text-blue-600 transition-colors group">
                    Email <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="userEmail" />
                  </button>
                </th>
                <th scope="col" class="px-6 py-4">
                   <button @click="handleSort('nim')" class="flex items-center gap-1 hover:text-blue-600 transition-colors group">
                    NIM <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="nim" />
                  </button>
                </th>
                <th scope="col" class="px-6 py-4 text-center">
                  <button @click="handleSort('score')" class="mx-auto flex items-center gap-1 hover:text-blue-600 transition-colors group">
                    Skor Total <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="score" />
                  </button>
                </th>
                <th v-for="sectionName in sectionNames" :key="sectionName" scope="col" class="px-6 py-4 text-center capitalize">
                  <button @click="handleSort(`sectionScores.${sectionName}`)" class="mx-auto flex items-center gap-1 hover:text-blue-600 transition-colors group">
                    {{ sectionName }} <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" :currentKey="`sectionScores.${sectionName}`" />
                  </button>
                </th>
                <th scope="col" class="px-6 py-4">
                  <button @click="handleSort('submittedAt')" class="flex items-center gap-1 hover:text-blue-600 transition-colors group">
                    Selesai <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="submittedAt" />
                  </button>
                </th>
                <th scope="col" class="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="result in paginatedResults" :key="`${result.userId}-${result.submittedAt}`" class="group hover:bg-gray-50 transition-colors">
                <th scope="row" class="px-6 py-4 font-bold text-gray-900 whitespace-nowrap group-hover:text-blue-600 transition-colors">
                  {{ result.namaLengkap || result.userName }}
                </th>
                <td class="px-6 py-4 text-xs text-gray-500">
                  {{ result.userEmail }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-700 font-mono">
                  {{ result.nim || '-' }}
                </td>
                <td class="px-6 py-4 text-center">
                   <span class="inline-flex items-center justify-center px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100 min-w-[3rem]">
                      {{ result.score }}
                   </span>
                </td>
                <td v-for="sectionName in sectionNames" :key="`${result.userId}-${sectionName}`" class="px-6 py-4 text-center text-sm text-gray-600">
                  {{ result.sectionScores[sectionName] ?? '-' }}
                </td>
                <td class="px-6 py-4 text-xs text-gray-500">
                   <div class="flex items-center gap-1.5">
                      <Icon name="lucide:calendar" class="w-3 h-3 text-gray-400" />
                      {{ formatDate(result.submittedAt) }}
                   </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <NuxtLink 
                    :to="`/admin/results/${result.userId}/${selectedBatchId}`" 
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-flex items-center justify-center"
                    title="Lihat Detail"
                  >
                    <Icon name="lucide:eye" class="w-4 h-4" />
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div v-if="filteredAndSortedResults.length > itemsPerPage" class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-sm text-gray-500">
          Menampilkan <span class="font-bold text-gray-800">{{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredAndSortedResults.length) }}</span> dari <span class="font-bold text-gray-800">{{ filteredAndSortedResults.length }}</span> hasil
        </span>
        <div class="flex gap-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1" 
            class="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
          >
            Sebelumnya
          </button>
          <button 
            @click="currentPage++" 
            :disabled="currentPage >= totalPages" 
            class="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SortIcon from '@/components/admin/SortIcon.vue';
import { useAdminResults, useAdminBatches } from '@/composables/useAdminResults';
import { ref, computed, watch } from 'vue';

// --- Page Meta ---
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "result.view_all",
  title: 'Hasil Tes per Batch'
});

// --- State & Composables ---
const { batches, isLoading: isBatchesLoading } = useAdminBatches();
const selectedBatchId = ref("");
const { results, isLoading, error, refresh } = useAdminResults(selectedBatchId);

// Search & Pagination State
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Sorting State
const sortKey = ref('submittedAt');
const sortOrder = ref('desc' as 'asc' | 'desc');

// --- Watchers ---
// Set initial batch
watch(batches, (newBatches) => {
  if (newBatches?.length > 0 && !selectedBatchId.value) {
    selectedBatchId.value = newBatches[0].id;
  }
}, { immediate: true });

// Reset pagination on search or batch change
watch([searchQuery, selectedBatchId], () => {
  currentPage.value = 1;
});

// Refresh data on batch change (handled by composable watch, but manually here just in case)
watch(selectedBatchId, () => {
  if (refresh) refresh();
});

// --- Computed Logic ---
const selectedBatchName = computed(() => 
  batches.value.find(b => b.id === selectedBatchId.value)?.name || '...'
);

const sectionNames = computed(() => {
  if (!results.value?.length) return [];
  // Get all unique section names from all results
  const names = new Set<string>();
  results.value.forEach(res => {
    Object.keys(res.sectionScores || {}).forEach(k => names.add(k));
  });
  return Array.from(names);
});

const filteredAndSortedResults = computed(() => {
  let list = [...(results.value || [])];

  // 1. Filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(r => 
      r.userName?.toLowerCase().includes(q) ||
      r.namaLengkap?.toLowerCase().includes(q) ||
      r.userEmail?.toLowerCase().includes(q) ||
      r.nim?.toLowerCase().includes(q)
    );
  }

  // 2. Sort
  list.sort((a, b) => {
    const getValue = (obj: any, path: string) => 
      path.split('.').reduce((o, i) => o?.[i], obj);

    const valA = getValue(a, sortKey.value);
    const valB = getValue(b, sortKey.value);

    if (valA === valB) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;

    const modifier = sortOrder.value === 'asc' ? 1 : -1;
    return valA < valB ? -1 * modifier : 1 * modifier;
  });

  return list;
});

const totalPages = computed(() => 
  Math.ceil(filteredAndSortedResults.value.length / itemsPerPage.value)
);

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredAndSortedResults.value.slice(start, start + itemsPerPage.value);
});

// --- Methods ---
const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const formatDate = (isoString?: string): string => {
  if (!isoString) return '-';
  try {
    return new Date(isoString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
};
</script>

<style scoped>
th, td {
  vertical-align: middle;
}
</style>
