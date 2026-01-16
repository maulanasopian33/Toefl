<template>
  <div class="p-6 sm:p-8">
    <!-- Header Page -->
    <header class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Log Aktivitas Sistem</h1>
        <p class="mt-1 text-slate-600">Pantau dan kelola rekaman aktivitas yang terjadi di dalam sistem.</p>
      </div>
      <div>
         <!-- Optional: Add a global action button here if needed, e.g. Export Logs -->
      </div>
    </header>

    <!-- Main Card -->
    <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
      
      <!-- Filter & Search Header -->
      <div class="p-6 border-b border-gray-100 bg-gray-50/50 space-y-4">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <!-- Left: Title / Stats -->
          <div class="flex items-center gap-3">
             <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Icon name="lucide:activity" class="w-5 h-5" />
             </div>
             <div>
                <h2 class="font-bold text-gray-800">Daftar Aktivitas</h2>
                <p v-if="!loading && totalLogs > 0" class="text-xs text-gray-500">
                  Total {{ totalLogs }} log ditemukan
                </p>
             </div>
          </div>

          <!-- Right: Filters -->
          <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
             <!-- Date Picker -->
             <div class="relative">
                <input 
                  type="date" 
                  v-model="selectedDate" 
                  class="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-600"
                />
             </div>
             
             <!-- Level Filter -->
             <div class="relative">
                <select v-model="selectedLevel" class="w-full sm:w-40 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-600 appearance-none">
                   <option value="">Semua Level</option>
                   <option value="info">Info</option>
                   <option value="warn">Warning</option>
                   <option value="error">Error</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                   <Icon name="lucide:chevron-down" class="w-4 h-4" />
                </div>
             </div>

             <!-- Search -->
             <div class="relative group w-full sm:w-64">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="lucide:search" class="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Cari pesan, user..." 
                  class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
             </div>
          </div>
        </div>

        <!-- Secondary Filters (Action) -->
        <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200/50">
           <span class="text-xs font-medium text-gray-500 uppercase tracking-wider mr-1">Filter Aksi:</span>
           <button 
              @click="selectedAction = ''"
              class="px-3 py-1 text-xs font-medium rounded-full transition-colors border"
              :class="!selectedAction ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
           >
              Semua
           </button>
           <button 
              v-for="action in actionOptions" 
              :key="action"
              @click="selectedAction = action"
              class="px-3 py-1 text-xs font-medium rounded-full transition-colors border"
              :class="selectedAction === action ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
           >
              {{ action }}
           </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="bg-white min-h-[400px]">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-center">
          <Icon name="lucide:loader-2" class="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <h3 class="text-sm font-semibold text-gray-700">Memuat Log Aktivitas...</h3>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-16 text-center m-6 p-8 bg-red-50 rounded-2xl border border-red-100">
          <Icon name="lucide:server-crash" class="w-12 h-12 text-red-400 mb-4" />
          <h4 class="font-semibold text-lg text-gray-800">Gagal Memuat Data</h4>
          <p class="text-sm text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
            Terjadi masalah saat mengambil data dari server. Silakan coba muat ulang halaman.
          </p>
          <button @click="refresh" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
            <Icon name="lucide:refresh-cw" class="w-4 h-4" />
            Coba Lagi
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="logs.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
          <div class="p-4 bg-gray-50 rounded-full mb-4">
             <Icon :name="isFiltering ? 'lucide:search-x' : 'lucide:clipboard-list'" class="w-10 h-10 text-gray-400" />
          </div>
          <h4 class="font-semibold text-lg text-gray-900">
             {{ isFiltering ? 'Tidak Ada Hasil' : 'Belum Ada Aktivitas' }}
          </h4>
          <p class="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
             {{ isFiltering ? 'Tidak ada log yang cocok dengan kriteria pencarian atau filter Anda.' : 'System log masih kosong untuk saat ini.' }}
          </p>
          <button v-if="isFiltering" @click="resetFilters" class="mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
             Hapus semua filter
          </button>
        </div>

        <!-- Log List -->
        <div v-else class="divide-y divide-gray-50">
           <div class="px-6 py-4 space-y-3 bg-gray-50/30">
              <LogItem v-for="(log, index) in logs" :key="index" :log="log" />
           </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-sm text-gray-500">
           Halaman <span class="font-bold text-gray-800">{{ currentPage }}</span> dari <span class="font-bold text-gray-800">{{ totalPages }}</span>
        </span>
        <div class="flex gap-2">
          <button 
             @click="currentPage--" 
             :disabled="currentPage === 1 || loading" 
             class="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
          >
             Sebelumnya
          </button>
          <button 
             @click="currentPage++" 
             :disabled="currentPage === totalPages || loading" 
             class="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
          >
             Berikutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useLogs } from '@/composables/useLogs';
import LogItem from '@/components/logsActivity/LogItem.vue';

definePageMeta({
  title: 'System Logs - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission:"system.view_logs"
});

const {
  logs,
  loading,
  error,
  selectedDate,
  selectedLevel,
  selectedAction,
  searchQuery,
  actionOptions,
  currentPage,
  totalPages,
  totalLogs,
  refresh,
} = useLogs();

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return '-';
  try {
    const d = new Date(selectedDate.value);
    // Menambahkan timezone offset agar tanggal tidak bergeser
    const correctedDate = new Date(d.valueOf() + d.getTimezoneOffset() * 60 * 1000);
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(correctedDate);
  } catch (e) {
    return selectedDate.value;
  }
});

const isFiltering = computed(() => {
  return selectedLevel.value || selectedAction.value || searchQuery.value;
});

const resetFilters = () => {
    selectedLevel.value = '';
    selectedAction.value = '';
    searchQuery.value = '';
    selectedDate.value = new Date().toISOString().split('T')[0];
};
</script>