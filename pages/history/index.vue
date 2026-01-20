<template>
  <div class="min-h-screen bg-gray-50/50 flex flex-col relative overflow-hidden font-sans">
    <!-- Decorative Elements -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full opacity-50 blur-3xl -z-10"></div>
    <div class="absolute top-1/2 -left-24 w-64 h-64 bg-emerald-50 rounded-full opacity-40 blur-3xl -z-10"></div>

    <main class="flex-grow container mx-auto px-4 py-8 md:px-6 lg:py-12 relative z-10 pb-24 lg:pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <!-- Bagian Utama Konten -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Header Halaman -->
          <header class="space-y-2">
            <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Riwayat <span class="text-emerald-600">Tes Anda</span></h1>
            <p class="text-sm text-gray-500 font-medium">Lihat semua hasil tes yang pernah Anda selesaikan.</p>
          </header>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
            <Icon name="svg-spinners:ring-resize" class="h-16 w-16 text-emerald-500" />
            <p class="mt-6 text-gray-400 font-bold animate-pulse">Memuat riwayat tes...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-rose-100 text-center space-y-4">
            <div class="flex justify-center">
              <div class="p-5 bg-rose-50 rounded-3xl text-rose-500">
                <Icon name="heroicons:server-stack" class="w-12 h-12" />
              </div>
            </div>
            <div class="space-y-2">
              <h3 class="text-lg font-bold text-gray-900">Gagal Memuat Data</h3>
              <p class="text-sm text-gray-400 font-medium">Terjadi kesalahan saat mengambil data riwayat. Silakan coba lagi nanti.</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="histories && histories.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center px-8 space-y-8">
            <div class="p-8 bg-gray-50 rounded-full text-gray-200">
              <Icon name="heroicons:document-magnifying-glass" class="w-20 h-20" />
            </div>
            <div class="space-y-2">
              <h3 class="text-xl font-extrabold text-gray-900 tracking-tight">Belum Ada Riwayat</h3>
              <p class="text-sm text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">Anda belum menyelesaikan tes apa pun. Hasil tes Anda akan muncul di sini setelah selesai.</p>
            </div>
            <NuxtLink to="/" class="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95">
              <Icon name="heroicons:arrow-left-circle" class="w-5 h-5" />
              Kembali ke Dashboard
            </NuxtLink>
          </div>

          <!-- Success State: Daftar Riwayat -->
          <div v-else class="space-y-6">
            <div v-for="history in histories" :key="history.id" 
                 class="group bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-emerald-200/20 transition-all duration-500 relative overflow-hidden">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative z-10">
                <!-- Info Tes -->
                <div class="space-y-3">
                  <div class="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                    <Icon name="heroicons:calendar" class="w-3 h-3 mr-1" />
                    {{ formatDate(history.completedDate) }}
                  </div>
                  <h4 class="text-xl font-extrabold text-gray-900 group-hover:text-emerald-600 transition-colors tracking-tight leading-tight">{{ history.batchName }}</h4>
                </div>

                <div class="flex items-center gap-8">
                  <!-- Skor -->
                  <div class="flex flex-col items-center sm:items-end">
                    <p class="text-4xl font-extrabold text-emerald-600 leading-none drop-shadow-sm">{{ history.score }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Total Score</p>
                  </div>

                  <!-- Tombol Aksi -->
                  <button @click="navigateTo(history.detailsUrl)" class="flex-shrink-0 inline-flex items-center justify-center gap-3 text-sm font-bold text-white bg-gray-900 hover:bg-black px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-gray-900/10 active:scale-95 group-hover:bg-emerald-600 group-hover:shadow-emerald-600/20">
                    Detail
                    <Icon name="heroicons:chevron-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              <!-- Background Accent -->
              <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-3xl select-none pointer-events-none"></div>
            </div>
          </div>
        </div>

        <!-- Sidebar dengan Link Cepat -->
        <aside class="hidden lg:block lg:col-span-4 space-y-6">
          <div class="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-24">
            <QuickLinksSidebar />
          </div>
        </aside>
      </div>
    </main>
    <BottomNav class="z-50" />
  </div>
</template>

<script setup lang="ts">
import QuickLinksSidebar from '@/components/DashboardUser/QuickLinksSidebar.vue';
import BottomNav from '@/components/DashboardUser/BottomNav.vue';
import { useTestHistory } from '@/composables/useTestHistory';

definePageMeta({
  middleware: ['auth', 'role-check'],
  permission: "test.history",
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
