<template>
  <div class="p-6 sm:p-8">
    <!-- Header Halaman -->
    <header class="mb-12">
      <NuxtLink to="/admin/results/batch" class="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 mb-6 group transition-colors">
        <div class="p-1.5 bg-gray-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
           <Icon name="lucide:arrow-left" class="h-4 w-4" />
        </div>
        Kembali ke Hasil Batch
      </NuxtLink>
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
           <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                 <Icon name="lucide:clipboard-list" class="w-6 h-6" />
              </div>
              <h1 class="text-3xl font-black tracking-tight text-slate-800">Detail Hasil Tes</h1>
           </div>
           <p v-if="!isLoading && result?.userName" class="text-slate-500 font-medium">
             Menampilkan riwayat tes untuk <span class="font-black text-indigo-600">{{ result.userName }}</span> pada batch <span class="text-slate-800 font-bold">{{ result.batchName }}</span>.
           </p>
           <p v-else class="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Memuat riwayat hasil tes...</p>
        </div>
        <div v-if="!isLoading && result" class="flex items-center gap-3">
           <button class="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-xl shadow-gray-100 hover:bg-gray-50 transition-all transform active:scale-95">
            <Icon name="lucide:download" class="h-4 w-4 text-indigo-500" />
            Unduh Sertifikat
          </button>
          <button class="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 text-sm font-black text-white shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all transform active:scale-95">
            <Icon name="lucide:send" class="h-4 w-4 text-indigo-400" />
            Kirim ke Email
          </button>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm animate-pulse">
      <Icon name="lucide:loader-2" class="w-16 h-16 text-gray-200 animate-spin mb-6" />
      <h3 class="text-xl font-black text-slate-900">Memuat Detail Hasil</h3>
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Sinkronisasi data sistem...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-32 text-center bg-rose-50 rounded-[3rem] border border-rose-100 px-6">
      <div class="w-20 h-20 bg-white rounded-[2rem] shadow-xl shadow-rose-100 flex items-center justify-center text-rose-500 mb-8 ring-8 ring-rose-50">
         <Icon name="lucide:alert-octagon" class="w-10 h-10" />
      </div>
      <h3 class="text-2xl font-black text-rose-900">Gagal Memuat Data</h3>
      <p class="text-rose-700/70 max-w-md mt-2 font-medium">Terjadi kesalahan saat mengambil data hasil tes. Silakan pastikan koneksi Anda stabil.</p>
      <button @click="router.go(0)" class="mt-8 px-8 py-3.5 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-200">Coba Lagi</button>
    </div>

    <!-- Content -->
    <div v-else-if="result" class="space-y-12">
      <!-- Card Info Peserta -->
      <div class="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
        <div class="px-8 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
          <h2 class="text-base font-black text-gray-900 tracking-tight uppercase tracking-widest text-xs">Informasi Peserta</h2>
          <div class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
        <div class="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Nama Lengkap</span>
            <span class="text-sm font-black text-gray-800">{{ result.userName }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email Akun</span>
            <span class="text-sm font-bold text-gray-500">{{ result.userEmail }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">NIM / ID</span>
            <span class="text-sm font-bold text-gray-800">{{ result.nim || '-' }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">ID Sistem</span>
            <span class="font-mono text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{{ result.userId }}</span>
          </div>
        </div>
      </div>

      <!-- Riwayat Pengerjaan Tes -->
      <div class="space-y-8">
        <div class="flex items-center gap-4">
           <h2 class="text-2xl font-black text-slate-800">Riwayat Percobaan</h2>
           <div class="flex-grow h-px bg-gray-100"></div>
           <span class="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">{{ result.results?.length || 0 }} Percobaan</span>
        </div>

        <div v-if="result.results && result.results.length > 0" class="grid grid-cols-1 gap-10">
          <div v-for="(attempt, index) in sortedResults" :key="attempt.id" class="group relative rounded-[3rem] bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden ring-1 ring-gray-900/5">
            <!-- Header Attempt -->
            <div class="px-10 py-6 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group-hover:bg-indigo-50/30 transition-colors">
              <div class="flex items-center gap-4">
                 <div class="w-12 h-12 rounded-[1.25rem] bg-white border border-gray-200 flex items-center justify-center font-black text-gray-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all shadow-sm">
                    #{{ sortedResults.length - index }}
                 </div>
                 <div>
                    <h3 class="font-black text-slate-900 text-lg">Percobaan Tes</h3>
                    <div class="flex items-center gap-2 mt-0.5">
                       <span v-if="index === 0" class="text-[9px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded-lg border border-emerald-600/10 shadow-lg shadow-emerald-500/20 uppercase tracking-widest italic">Terbaru & Tertinggi</span>
                       <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ formatDate(attempt.completedDate) }}</span>
                    </div>
                 </div>
              </div>
              <button 
                @click="openAnswerDetailModal(attempt)" 
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-gray-200 px-5 py-2.5 text-xs font-black text-gray-700 shadow-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all transform active:scale-95"
              >
                <Icon name="lucide:file-check-2" class="h-4 w-4" />
                Detail Jawaban
              </button>
            </div>
            
            <div class="p-10 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 items-center">
              <!-- Skor Total -->
              <div class="flex flex-col items-center justify-center p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group/score">
                <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover/score:bg-indigo-500/10 transition-colors"></div>
                <p class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 leading-none">Skor Total</p>
                <p class="text-7xl font-black text-indigo-600 mt-1 tabular-nums tracking-tighter">{{ attempt.score }}</p>
                <div class="mt-6 px-4 py-1.5 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm">ID: {{ attempt.id.substring(0,8) }}...</div>
              </div>
              
              <!-- Rincian Skor Sesi -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="(score, section) in attempt.sectionScores" :key="section" class="flex flex-col p-5 bg-white border border-gray-100 rounded-3xl hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group/item">
                  <div class="flex items-center justify-between gap-4 mb-4">
                    <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/50 group-hover/item:scale-110 transition-transform">
                      <Icon :name="getSectionIcon(section as string)" class="h-5 w-5" />
                    </div>
                    <p class="text-3xl font-black text-indigo-600 tracking-tighter tabular-nums">{{ score }}</p>
                  </div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest capitalize px-1">{{ section }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[3rem] border border-gray-100 border-dashed m-4">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-200 border border-gray-100 mb-6 shadow-sm">
             <Icon name="lucide:file-question" class="h-10 w-10" />
          </div>
          <h3 class="text-xl font-black text-slate-800">Tidak Ada Riwayat Tes</h3>
          <p class="text-sm text-slate-400 font-medium mt-1">Peserta ini belum menyelesaikan satu tes pun di batch ini.</p>
        </div>
      </div>
    </div>

    <!-- Modal Detail Jawaban -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="isModalOpen = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-md" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-5xl transform overflow-hidden rounded-[2.5rem] bg-white text-left align-middle shadow-2xl transition-all border border-gray-100 flex flex-col h-[85vh]">
                <!-- Header -->
                <div class="px-10 py-6 border-b border-gray-50 flex items-center justify-between flex-shrink-0 bg-gray-50/50">
                  <div class="flex items-center gap-4">
                     <div class="p-2.5 bg-indigo-100 rounded-2xl flex items-center justify-center">
                        <Icon name="lucide:file-search" class="w-7 h-7 text-indigo-600" />
                     </div>
                     <div>
                        <DialogTitle as="h3" class="text-xl font-black text-gray-900 leading-tight">Analisis Jawaban Percobaan #{{ selectedAttempt?.attemptNumber }}</DialogTitle>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Komparasi jawaban peserta dengan standar kunci jawaban</p>
                     </div>
                  </div>
                  <button @click="isModalOpen = false" class="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all">
                    <Icon name="lucide:x" class="w-6 h-6" />
                  </button>
                </div>
                
                <!-- Main Content -->
                <div class="flex-grow overflow-y-auto custom-scrollbar p-10 bg-white">
                  <!-- Loading State Modal -->
                  <div v-if="isAnswersLoading" class="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <Icon name="lucide:loader-2" class="w-16 h-16 text-indigo-100 animate-spin" />
                    <p class="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Sinkronisasi jawaban ke server...</p>
                  </div>

                  <!-- Error State Modal -->
                  <div v-else-if="answersError" class="flex flex-col items-center justify-center h-full text-center bg-rose-50 rounded-[2.5rem] p-12 border border-rose-100">
                    <div class="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-rose-100 flex items-center justify-center text-rose-500 mb-6 ring-4 ring-rose-100/50">
                       <Icon name="lucide:server-crash" class="w-8 h-8" />
                    </div>
                    <h3 class="text-xl font-black text-rose-900">Gagal Memuat Jawaban</h3>
                    <p class="text-rose-700/60 max-w-md mt-1 font-medium">Terjadi masalah saat mengambil data rincian jawaban. Silakan coba sesaat lagi.</p>
                    <button @click="fetchAnswerDetails" class="mt-6 px-6 py-2.5 bg-white border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-colors shadow-sm">Coba Ulang</button>
                  </div>

                  <!-- Tabel Jawaban -->
                  <div v-else-if="answerDetails" class="overflow-x-auto rounded-[2rem] border border-gray-100 shadow-sm">
                    <table class="w-full text-sm text-left">
                      <thead class="text-[10px] font-black text-gray-400 uppercase bg-gray-50/80 sticky top-0 backdrop-blur-md z-10">
                        <tr>
                          <th scope="col" class="px-8 py-5 w-20 text-center tracking-widest">NO</th>
                          <th scope="col" class="px-8 py-5 tracking-widest">STRUKTUR / SESI</th>
                          <th scope="col" class="px-8 py-5 text-center tracking-widest">JAWABAN USER</th>
                          <th scope="col" class="px-8 py-5 text-center tracking-widest">KUNCI</th>
                          <th scope="col" class="px-8 py-5 text-center tracking-widest">STATUS</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-50">
                        <tr v-for="answer in answerDetails" :key="answer.questionNumber" class="group/row transition-colors" :class="!answer.isCorrect ? 'bg-rose-50/30' : 'bg-transparent hover:bg-gray-50/50'">
                          <td class="px-8 py-5 text-center">
                             <div class="w-8 h-8 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 font-black text-[10px] group-hover/row:bg-white group-hover/row:border-indigo-100 group-hover/row:text-indigo-600 transition-all">
                                {{ answer.questionNumber }}
                             </div>
                          </td>
                          <td class="px-8 py-5">
                             <div class="text-xs font-black text-gray-800 uppercase tracking-tight group-hover/row:text-indigo-700 transition-colors" v-html="answer.section"></div>
                          </td>
                          <td class="px-8 py-5 text-center">
                             <div class="inline-flex h-9 w-9 items-center justify-center rounded-xl font-black text-sm transition-all" :class="answer.isCorrect ? 'bg-indigo-50 text-indigo-700 ring-4 ring-indigo-500/5' : 'bg-rose-100 text-rose-700 ring-4 ring-rose-500/10'">
                                {{ answer.userAnswer || '-' }}
                             </div>
                          </td>
                          <td class="px-8 py-5 text-center">
                             <div class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 font-black text-sm shadow-sm">
                                {{ answer.correctAnswer }}
                             </div>
                          </td>
                          <td class="px-8 py-5 text-center">
                            <span v-if="answer.isCorrect" class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-[10px] font-black text-white shadow-lg shadow-emerald-500/20 uppercase tracking-widest">
                               BEBENAR
                            </span>
                            <span v-else class="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-3 py-1.5 text-[10px] font-black text-white shadow-lg shadow-rose-500/20 uppercase tracking-widest">
                               SALAH
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Footer -->
                <div class="px-10 py-6 border-t border-gray-50 flex justify-end bg-gray-50/50 flex-shrink-0 rounded-b-[2.5rem]">
                  <button @click="isModalOpen = false" class="px-8 py-3 bg-gray-900 text-white font-black text-sm rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 transform active:scale-95">Tutup Analisis</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup lang="ts">
import { useAdminResultDetail, useAdminAnswerDetails, type AdminTestResult } from '@/composables/useAdminResults';
import { computed, ref, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

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

// --- State untuk Modal Detail Jawaban ---
const isModalOpen = ref(false);
const selectedAttempt = ref<{id: string, attemptNumber: number} | null>(null);
const selectedAttemptId = computed(() => selectedAttempt.value?.id || '');

const { answerDetails, isAnswersLoading, answersError, fetchAnswerDetails } = useAdminAnswerDetails(selectedAttemptId);

const openAnswerDetailModal = (attempt: AdminTestResult & { attemptNumber: number }) => {
  selectedAttempt.value = { id: attempt.id, attemptNumber: attempt.attemptNumber };
  isModalOpen.value = true;
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
    dateStyle: 'medium',
    timeStyle: 'short'
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
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}
</style>