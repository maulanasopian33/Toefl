<template>
  <div class="p-6 sm:p-8">
    <!-- Header Halaman -->
    <header class="mb-8">
      <NuxtLink to="/admin/results/batch" class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 mb-4">
        <Icon name="lucide:arrow-left" class="h-4 w-4" />
        Kembali ke Hasil Batch
      </NuxtLink>
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Detail Hasil Tes</h1>
          <p v-if="!isLoading && result?.userName" class="mt-1 text-slate-600">
            Menampilkan riwayat tes untuk <span class="font-semibold">{{ result.userName }}</span> pada batch <span class="font-semibold">{{ result.batchName }}</span>.
          </p>
           <p v-else class="mt-1 text-slate-500">Memuat riwayat hasil tes...</p>
        </div>
        <div v-if="!isLoading && result" class="flex items-center gap-2">
           <button class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <Icon name="lucide:download" class="h-4 w-4" />
            Unduh Sertifikat
          </button>
          <button class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">
            <Icon name="lucide:send" class="h-4 w-4" />
            Kirim Hasil ke Email
          </button>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 text-center">
      <Icon name="lucide:loader-2" class="w-12 h-12 text-slate-400 animate-spin mb-4" />
      <h3 class="text-xl font-semibold text-slate-700">Memuat Detail Hasil</h3>
      <p class="text-slate-500">Mohon tunggu sebentar...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center bg-red-50 rounded-lg border border-red-200">
      <Icon name="lucide:server-crash" class="w-14 h-14 text-red-500 mb-4" />
      <h3 class="text-xl font-semibold text-red-800">Gagal Memuat Data</h3>
      <p class="text-red-700 max-w-md mt-2">Terjadi kesalahan saat mengambil data hasil tes. Silakan coba lagi nanti.</p>
    </div>

    <!-- Content -->
    <div v-else-if="result" class="space-y-8">
      <!-- Card Info Peserta -->
      <div class="bg-white rounded-2xl shadow-lg border border-slate-200/80">
        <div class="p-5 border-b border-slate-200">
          <h2 class="text-lg font-semibold text-slate-800">Informasi Peserta</h2>
        </div>
        <div class="p-5 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
          <div>
            <span class="text-slate-500 block">Nama Lengkap:</span>
            <span class="font-semibold text-slate-800">{{ result.userName }}</span>
          </div>
          <div>
            <span class="text-slate-500 block">Email:</span>
            <span class="font-medium text-slate-700">{{ result.userEmail }}</span>
          </div>
          <div>
            <span class="text-slate-500 block">NIM:</span>
            <span class="font-medium text-slate-700">{{ result.nim }}</span>
          </div>
          <div>
            <span class="text-slate-500 block">ID Peserta:</span>
            <span class="font-mono text-xs text-slate-500">{{ result.userId }}</span>
          </div>
        </div>
      </div>

      <!-- Riwayat Pengerjaan Tes -->
      <div>
        <h2 class="text-2xl font-bold text-slate-800 mb-4">Riwayat Pengerjaan Tes</h2>
        <div v-if="result.results && result.results.length > 0" class="space-y-6">
          <!-- Iterasi setiap hasil tes -->
          <div v-for="(attempt, index) in sortedResults" :key="attempt.id" class="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
            <div class="p-5 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
              <h3 class="font-semibold text-slate-800">
                Percobaan Tes #{{ sortedResults.length - index }}
                <span v-if="index === 0" class="ml-2 text-xs font-bold text-white bg-green-600 px-2 py-1 rounded-full">TERBARU & SKOR TERTINGGI</span>
              </h3>
              <div class="text-sm text-slate-600">
                <Icon name="lucide:calendar-days" class="inline-block mr-1.5 h-4 w-4" />
                {{ formatDate(attempt.completedDate) }}
              </div>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <!-- Skor Total -->
              <div class="text-center md:border-r md:border-slate-200 md:pr-6">
                <p class="text-sm text-slate-500 uppercase tracking-wider">Skor Total</p>
                <p class="text-6xl font-bold text-green-600 mt-1">{{ attempt.score }}</p>
                <p class="text-xs text-slate-500 mt-1">ID: {{ attempt.id }}</p>
              </div>
              <!-- Rincian Skor Sesi -->
              <div class="md:col-span-2 space-y-3">
                <div v-for="(score, section) in attempt.sectionScores" :key="section" class="flex items-center justify-between gap-4 p-3 bg-slate-50/80 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0">
                      <Icon :name="getSectionIcon(section as string)" class="h-4 w-4" />
                    </div>
                    <p class="font-semibold text-slate-800 capitalize">{{ section }}</p>
                  </div>
                  <p class="text-xl font-bold text-indigo-700">{{ score }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 bg-slate-50 rounded-lg">
          <Icon name="lucide:file-question" class="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 class="text-lg font-semibold text-slate-700">Tidak Ada Riwayat Tes</h3>
          <p class="text-sm text-slate-500 mt-1">Peserta ini belum menyelesaikan satu tes pun di batch ini.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useAdminResultDetail, type AdminTestResult } from '@/composables/useAdminResults';
import { computed } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  roles: ['admin'],
  title: 'Detail Hasil Tes'
});

const route = useRoute();
const userId = computed(() => route.params.userId as string);
const batchId = computed(() => route.params.batchId as string);

const { result, isLoading, error } = useAdminResultDetail(userId, batchId);

// Mengurutkan hasil tes dari yang terbaru (skor tertinggi) ke yang terlama
const sortedResults = computed(() => {
  if (!result.value || !result.value.results) return [];
  return [...result.value.results].sort((a, b) => {
    // Urutkan berdasarkan skor (tertinggi dulu), lalu tanggal (terbaru dulu)
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
  });
});

const formatDate = (isoString: string | undefined): string => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

const getSectionIcon = (sectionName: string): string => {
  const lowerSection = sectionName.toLowerCase();
  if (lowerSection.includes("istima'")) return 'lucide:headphones';
  if (lowerSection.includes('tarakib')) return 'lucide:book-marked';
  if (lowerSection.includes("qira'ah")) return 'lucide:book-open-text';
  return 'lucide:file-text';
};
</script>

<style scoped>
/* Custom styles can be added here if needed */
</style>