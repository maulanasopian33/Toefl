<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Log Aktivitas Sistem</h1>
        <p class="text-sm text-gray-500 mt-1">
          Melihat rekaman aktivitas yang terjadi di dalam sistem.
        </p>
      </div>
    </div>

    <!-- FILTERS & SEARCH -->
    <div class="card">
      <div class="p-4">
        <h3 class="text-base font-semibold text-gray-800 mb-4">Filter & Pencarian</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <label for="search-filter" class="block text-xs font-medium text-gray-600 mb-1">Cari Log</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon name="lucide:search" class="h-4 w-4 text-gray-400" />
              </div>
              <input id="search-filter" type="text" v-model="searchQuery" placeholder="Cari pesan, user, atau ID..." class="input w-full pl-10" />
            </div>
          </div>

          <!-- Filter Level -->
          <div>
            <label for="level-filter" class="block text-xs font-medium text-gray-600 mb-1">Level</label>
            <select id="level-filter" v-model="selectedLevel" class="input w-full">
              <option value="">Semua Level</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <!-- Filter Action -->
          <div>
            <label for="action-filter" class="block text-xs font-medium text-gray-600 mb-1">Aksi</label>
            <select id="action-filter" v-model="selectedAction" class="input w-full">
              <option value="">Semua Aksi</option>
              <option v-for="action in actionOptions" :key="action" :value="action">
                {{ action }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- DAFTAR LOG -->
    <div class="card">
      <div class="border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <h3 class="card-title mb-0 flex-1">
          Menampilkan log untuk tanggal:
          <input id="date-picker" type="date" v-model="selectedDate" class="input input-sm ml-2" />
        </h3>
        <p v-if="!loading && totalLogs > 0" class="text-xs text-gray-500">
          Total {{ totalLogs }} log ditemukan.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-16 flex flex-col items-center justify-center text-sm text-gray-500">
        <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin mb-3 text-gray-400" />
        <span class="font-medium">Memuat Log Aktivitas...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-16 flex flex-col items-center justify-center text-center">
        <Icon name="lucide:server-crash" class="w-12 h-12 mx-auto mb-3 text-red-400" />
        <h4 class="font-semibold text-lg text-gray-800">Gagal Memuat Data</h4>
        <p class="text-sm text-gray-500 mt-1 mb-4">
          Terjadi masalah saat mengambil data dari server.
        </p>
        <button @click="refresh" class="btn-secondary inline-flex items-center gap-2">
          <Icon name="lucide:refresh-cw" class="w-4 h-4" />
          Coba Lagi
        </button>
      </div>

      <!-- No Data State -->
      <div v-else-if="logs.length === 0" class="py-16 flex flex-col items-center justify-center text-center">
        <Icon name="lucide:search-x" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <h4 class="font-semibold text-lg text-gray-800">
          {{ isFiltering ? 'Tidak Ada Hasil' : 'Belum Ada Aktivitas' }}
        </h4>
        <p class="text-sm text-gray-500 mt-1">
          {{ isFiltering ? 'Tidak ada log yang cocok dengan kriteria filter Anda.' : 'Tidak ada aktivitas yang tercatat pada tanggal ini.' }}
        </p>
      </div>

      <!-- Log List -->
      <div v-else>
        <LogItem v-for="(log, index) in logs" :key="index" :log="log" />
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 text-xs sm:text-sm">
        <div class="flex items-center gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1 || loading" class="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Sebelumnya
          </button>
          <button @click="currentPage++" :disabled="currentPage === totalPages || loading" class="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Berikutnya
          </button>
        </div>
        <span class="text-gray-600">
          Halaman
          <span class="font-semibold">{{ currentPage }}</span> dari <span class="font-semibold">{{ totalPages }}</span>
        </span>
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
</script>