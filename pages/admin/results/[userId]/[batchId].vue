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
              <div class="md:col-span-2 space-y-3 flex flex-col justify-center">
                <button @click="openAnswerDetailModal(attempt)" class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 mb-3">
                  <Icon name="lucide:file-check-2" class="h-4 w-4" />
                  Lihat Detail Jawaban
                </button>
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

    <!-- Modal Detail Jawaban -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60" @click.self="isModalOpen = false">
      <div class="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col m-4">
        <header class="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 class="text-lg font-semibold text-slate-800">Detail Jawaban - Percobaan #{{ selectedAttempt?.attemptNumber }}</h2>
            <p class="text-sm text-slate-500">Membandingkan jawaban peserta dengan kunci jawaban.</p>
          </div>
          <button @click="isModalOpen = false" class="p-2 rounded-full hover:bg-slate-200">
            <Icon name="lucide:x" class="h-5 w-5 text-slate-600" />
          </button>
        </header>
        
        <main class="p-6 overflow-y-auto flex-grow">
          <!-- Loading State Modal -->
          <div v-if="isAnswersLoading" class="flex flex-col items-center justify-center h-full text-center">
            <Icon name="lucide:loader-2" class="w-10 h-10 text-slate-400 animate-spin mb-4" />
            <h3 class="text-lg font-semibold text-slate-700">Memuat Detail Jawaban...</h3>
          </div>
          <!-- Error State Modal -->
          <div v-else-if="answersError" class="flex flex-col items-center justify-center h-full text-center bg-red-50 rounded-lg p-8">
            <Icon name="lucide:server-crash" class="w-12 h-12 text-red-500 mb-4" />
            <h3 class="text-lg font-semibold text-red-800">Gagal Memuat Jawaban</h3>
            <p class="text-red-700 max-w-md mt-1">Terjadi kesalahan saat mengambil data jawaban. Silakan coba lagi.</p>
          </div>
          <!-- Tabel Jawaban -->
          <div v-else-if="answerDetails" class="overflow-x-auto">
            <table class="w-full text-sm text-left text-slate-600">
              <thead class="text-xs text-slate-700 uppercase bg-slate-200/70 sticky top-0">
                <tr>
                  <th scope="col" class="px-4 py-3 w-12 text-center">No.</th>
                  <th scope="col" class="px-4 py-3">Pertanyaan</th>
                  <th scope="col" class="px-4 py-3 text-center">Jawaban User</th>
                  <th scope="col" class="px-4 py-3 text-center">Kunci Jawaban</th>
                  <th scope="col" class="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="answer in answerDetails" :key="answer.questionNumber" class="bg-white border-b hover:bg-slate-50" :class="!answer.isCorrect && 'bg-red-50 hover:bg-red-100/70'">
                  <td class="px-4 py-3 font-medium text-slate-800 text-center">{{ answer.questionNumber }}</td>
                  <td class="px-4 py-3" v-html="answer.section"></td>
                  <td class="px-4 py-3 font-mono text-center">{{ answer.userAnswer }}</td>
                  <td class="px-4 py-3 font-mono text-center font-bold text-green-700">{{ answer.correctAnswer }}</td>
                  <td class="px-4 py-3 text-center">
                    <span v-if="answer.isCorrect" class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                      <Icon name="lucide:check" class="h-3.5 w-3.5" /> Benar
                    </span>
                    <span v-else class="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                      <Icon name="lucide:x" class="h-3.5 w-3.5" /> Salah
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useAdminResultDetail, useAdminAnswerDetails, type AdminTestResult } from '@/composables/useAdminResults';
import { computed, ref, watch } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "result.view_all",
  title: 'Detail Hasil Tes'
});

const route = useRoute();
const userId = computed(() => route.params.userId as string);
const batchId = computed(() => route.params.batchId as string);

const { result, isLoading, error } = useAdminResultDetail(userId, batchId);

console.log("result detail",result.value);


// --- State untuk Modal Detail Jawaban ---
const isModalOpen = ref(false);
const selectedAttempt = ref<{id: string, attemptNumber: number} | null>(null);
const selectedAttemptId = computed(() => selectedAttempt.value?.id || '');

const { answerDetails, isAnswersLoading, answersError, fetchAnswerDetails } = useAdminAnswerDetails(selectedAttemptId);

const openAnswerDetailModal = (attempt: AdminTestResult & { attemptNumber: number }) => {
  selectedAttempt.value = { id: attempt.id, attemptNumber: attempt.attemptNumber };
  isModalOpen.value = true;
  // fetchAnswerDetails akan dipanggil oleh watch
};

watch(isModalOpen, (isOpen) => {
  if (isOpen && selectedAttempt.value) fetchAnswerDetails();
});
// Mengurutkan hasil tes dari yang terbaru (skor tertinggi) ke yang terlama
const sortedResults = computed(() => {
  if (!result.value || !result.value.results) return [];
  return [...result.value.results].sort((a, b) => {
    // Urutkan berdasarkan skor (tertinggi dulu), lalu tanggal (terbaru dulu)
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
  }).map((res, index, arr) => ({
    ...res,
    attemptNumber: arr.length - index, // Memberi nomor percobaan
  }));
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