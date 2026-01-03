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
          <p v-if="!isLoading && result" class="mt-1 text-slate-600">
            Menampilkan hasil tes untuk <span class="font-semibold">{{ result.userName }}</span> pada batch <span class="font-semibold">{{ result.batchName }}</span>.
          </p>
           <p v-else class="mt-1 text-slate-500">Memuat detail hasil tes...</p>
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
    <div v-else-if="result" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Kolom Kiri: Info Peserta & Skor Total -->
      <div class="lg:col-span-1 space-y-8">
        <!-- Card Info Peserta -->
        <div class="bg-white rounded-2xl shadow-lg border border-slate-200/80">
          <div class="p-5 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800">Informasi Peserta</h2>
          </div>
          <div class="p-5 space-y-4 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500">Nama Lengkap:</span>
              <span class="font-semibold text-slate-800 text-right">{{ result.userName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Email:</span>
              <span class="font-medium text-slate-700 text-right">{{ result.userEmail }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">NIM:</span>
              <span class="font-medium text-slate-700 text-right">{{ result.nim }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">ID Peserta:</span>
              <span class="font-mono text-xs text-slate-500 text-right">{{ result.userId }}</span>
            </div>
          </div>
        </div>

        <!-- Card Info Tes -->
         <div class="bg-white rounded-2xl shadow-lg border border-slate-200/80">
          <div class="p-5 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800">Informasi Tes</h2>
          </div>
          <div class="p-5 space-y-4 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500">Nama Batch:</span>
              <span class="font-semibold text-slate-800 text-right">{{ result.batchName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Tanggal Selesai:</span>
              <span class="font-medium text-slate-700 text-right">{{ formatDate(result.completedDate) }}</span>
            </div>
             <div class="flex justify-between">
              <span class="text-slate-500">ID Hasil Tes:</span>
              <span class="font-mono text-xs text-slate-500 text-right">{{ result.id }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Kolom Kanan: Rincian Skor -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-lg border border-slate-200/80">
          <div class="p-5 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800">Rincian Skor</h2>
          </div>
          <div class="p-5">
            <!-- Skor Total -->
            <div class="text-center mb-8">
              <p class="text-sm text-slate-500 uppercase tracking-wider">Skor Total</p>
              <p class="text-7xl font-bold text-green-600 mt-2">{{ result.score }}</p>
              <p class="mt-2 text-slate-600">Skor ini adalah hasil konversi dari total jawaban benar.</p>
            </div>

            <!-- Rincian per Sesi -->
            <div class="space-y-5">
              <h3 class="text-center text-sm font-semibold text-slate-700 uppercase tracking-wide pb-2 border-b-2 border-slate-200 border-dashed">Skor per Sesi</h3>
              <div v-for="(score, section) in result.sectionScores" :key="section" class="flex items-center justify-between gap-4 p-4 bg-slate-50/80 rounded-lg">
                <div class="flex items-center gap-4">
                   <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0">
                    <Icon :name="getSectionIcon(section as string)" class="h-5 w-5" />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-800 capitalize">{{ section }}</p>
                    <p class="text-xs text-slate-500">Skor untuk sesi ini</p>
                  </div>
                </div>
                <p class="text-2xl font-bold text-indigo-700">{{ score }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminResultDetail } from '@/composables/useAdminResults';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "result.view_all",
  title: 'Detail Hasil Tes'
});

const route = useRoute();
const resultId = computed(() => route.params.id as string);

const { result, isLoading, error } = useAdminResultDetail(resultId);

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