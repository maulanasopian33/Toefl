<template>
  <div class="bg-slate-50 min-h-screen">
    <main class="container mx-auto px-4 py-6 sm:px-6 lg:py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- Bagian Utama Konten -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Header Halaman -->
          <header class="mb-6">
            <h1 class="text-3xl font-bold text-slate-800">Riwayat Tes Anda</h1>
            <p class="mt-1 text-slate-600">Lihat semua hasil tes yang pernah Anda selesaikan.</p>
          </header>

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-20">
            <div class="flex justify-center mb-4">
              <Icon name="lucide:loader-2" class="w-10 h-10 text-slate-400 animate-spin" />
            </div>
            <p class="text-slate-500 font-medium">Memuat riwayat tes...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="card bg-red-50 border-red-200 text-red-700 p-6 rounded-xl text-center">
            <div class="flex justify-center mb-3">
                <Icon name="lucide:server-crash" class="w-10 h-10 text-red-500" />
            </div>
            <h3 class="font-semibold">Gagal Memuat Data</h3>
            <p class="text-sm mt-1">Terjadi kesalahan saat mengambil data riwayat. Silakan coba lagi nanti.</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="histories.length === 0" class="text-center py-20 bg-white rounded-xl border border-slate-200/80 shadow-sm">
            <div class="flex justify-center mb-4">
              <div class="bg-slate-100 rounded-full p-4">
                <Icon name="lucide:history" class="w-12 h-12 text-slate-400" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-slate-700">Belum Ada Riwayat</h3>
            <p class="text-slate-500 mt-2">Anda belum menyelesaikan tes apa pun. <br>Hasil tes Anda akan muncul di sini setelah selesai.</p>
            <button @click="navigateTo('/')" class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors duration-200">
                Kembali ke Dashboard
                <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </button>
          </div>

          <!-- Success State: Daftar Riwayat -->
          <div v-else class="space-y-4">
            <div v-for="history in histories" :key="history.id" class="card bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition-all duration-200">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <!-- Info Tes -->
                <div class="flex-grow">
                  <p class="text-xs text-slate-500">{{ formatDate(history.completedDate) }}</p>
                  <h4 class="text-lg font-semibold text-slate-800">{{ history.batchName }}</h4>
                </div>

                <!-- Skor -->
                <div class="flex-shrink-0 text-left sm:text-right">
                  <p class="text-2xl font-bold text-green-600">{{ history.score }}</p>
                  <p class="text-xs text-slate-500">Skor Total</p>
                </div>

                <!-- Tombol Aksi -->
                <div class="flex-shrink-0">
                  <button @click="navigateTo(history.detailsUrl)" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg">
                    Lihat Rincian
                    <Icon name="lucide:arrow-right" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar dengan Link Cepat -->
        <div class="hidden lg:block lg:col-span-1 h-fit lg:sticky top-6">
          <QuickLinksSidebar />
        </div>
      </div>

      <!-- Bottom Navigation untuk Mobile -->
      <BottomNav />
    </main>
  </div>
</template>

<script setup lang="ts">
import QuickLinksSidebar from '@/components/DashboardUser/QuickLinksSidebar.vue';
import BottomNav from '@/components/DashboardUser/BottomNav.vue';
import { useTestHistory } from '@/composables/useTestHistory';

definePageMeta({
  middleware: ['auth', 'role-check'],
  roles: ['user'],
  title: 'Riwayat Tes'
});

const { histories, isLoading, error } = useTestHistory();

/**
 * @function formatDate
 * @description Memformat tanggal dari string ISO ke format lokal (Indonesia).
 * @param {string} isoString - Tanggal dalam format ISO.
 * @returns {string} Tanggal yang sudah diformat.
 */
const formatDate = (isoString: string): string => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
