<template>
  <div class="min-h-screen bg-gray-50/50 flex flex-col relative overflow-hidden font-sans">
    <!-- Decorative Elements -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full opacity-50 blur-3xl -z-10"></div>
    <div class="absolute top-1/2 -left-24 w-64 h-64 bg-emerald-50 rounded-full opacity-40 blur-3xl -z-10"></div>

    <main class="flex-grow container mx-auto px-4 py-8 md:px-6 lg:py-12 relative z-10 pb-24 lg:pb-12">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Back Button & Title -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <button @click="navigateTo('/history')" class="group inline-flex items-center text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors mb-2">
              <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Riwayat
            </button>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Analisis <span class="text-emerald-600">Hasil Tes</span></h1>
            <p v-if="history" class="text-sm text-gray-500 font-medium">Batch: {{ history.batchName }} • {{ formatDate(history.completedDate) }}</p>
          </div>
          
          <div v-if="history && history.status === 'COMPLETED' && history.certificateUrl" class="flex-shrink-0">
            <a :href="history.certificateUrl" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95">
              <Icon name="heroicons:academic-cap" class="w-5 h-5" />
              Unduh Sertifikat
            </a>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <Icon name="svg-spinners:ring-resize" class="h-16 w-16 text-emerald-500" />
          <p class="mt-6 text-gray-400 font-bold animate-pulse">Memproses data hasil...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-rose-100 text-center space-y-6">
          <div class="flex justify-center">
            <div class="p-6 bg-rose-50 rounded-full text-rose-500">
              <Icon name="heroicons:exclamation-circle" class="w-16 h-16" />
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-2xl font-black text-gray-900">Gagal Memuat Detail</h3>
            <p class="text-gray-500 font-medium max-w-sm mx-auto">Kami tidak dapat menemukan detail hasil tes ini. Silakan hubungi admin jika masalah berlanjut.</p>
          </div>
          <button @click="navigateTo('/history')" class="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all">Kembali</button>
        </div>

        <!-- Pending State -->
        <div v-else-if="history && history.status === 'PENDING'" class="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-emerald-100 text-center space-y-8">
          <div class="relative flex justify-center">
            <div class="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div class="relative w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <Icon name="svg-spinners:ring-resize" class="w-12 h-12 text-white" />
            </div>
          </div>
          <div class="space-y-4">
            <h3 class="text-3xl font-black text-gray-900">Skor Sedang Dihitung</h3>
            <p class="text-gray-500 text-lg font-medium max-w-md mx-auto leading-relaxed">
              Hasil ujian Anda sedang diproses oleh sistem. Halaman ini akan diperbarui secara otomatis ketika skor tersedia.
            </p>
          </div>
          <div class="inline-flex items-center gap-3 px-6 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold border border-emerald-100">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Memproses di Antrean...
          </div>
        </div>

        <!-- Success State: Detailed Analysis -->
        <div v-else-if="history && history.status === 'COMPLETED'" class="space-y-8 animate-fade-in-up">
          <!-- Score Overview Card -->
          <div class="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 select-none pointer-events-none">
              <Icon name="heroicons:trophy" class="w-48 h-48 text-emerald-600" />
            </div>
            
            <div class="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div class="flex-shrink-0 relative">
                <div class="w-40 h-40 rounded-full border-8 border-emerald-50 flex items-center justify-center bg-white shadow-inner">
                  <div class="text-center">
                    <p class="text-5xl font-black text-emerald-600 leading-none">{{ history.score }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Skor Total</p>
                  </div>
                </div>
                <!-- Mini Badge -->
                <div class="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                  <Icon name="heroicons:check-badge" class="w-6 h-6" />
                </div>
              </div>

              <div class="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                <div v-for="(val, section) in history.sectionScores" :key="section" class="bg-gray-50/80 p-5 rounded-3xl border border-gray-100 text-center transition-all hover:bg-white hover:shadow-lg hover:shadow-gray-100">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{{ section }}</p>
                  <p class="text-2xl font-black text-gray-800">{{ val }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section Detailed Content (Placeholder for individual answer analysis) -->
          <div class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 space-y-6">
             <div class="flex items-center justify-between">
                <h3 class="text-xl font-black text-gray-900 tracking-tight">Performance Summary</h3>
                <span class="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-widest">Akurasi: {{ calculateAccuracy(history) }}%</span>
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex items-center gap-5">
                   <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                      <Icon name="heroicons:check-circle" class="w-7 h-7" />
                   </div>
                   <div>
                      <p class="text-2xl font-black text-emerald-700 leading-none">{{ history.correctCount || '-' }}</p>
                      <p class="text-xs font-bold text-emerald-600/60 uppercase tracking-wider mt-1">Jawaban Benar</p>
                   </div>
                </div>
                <div class="p-6 bg-rose-50/50 rounded-3xl border border-rose-100 flex items-center gap-5">
                   <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                      <Icon name="heroicons:x-circle" class="w-7 h-7" />
                   </div>
                   <div>
                      <p class="text-2xl font-black text-rose-700 leading-none">{{ history.wrongCount || '-' }}</p>
                      <p class="text-xs font-bold text-rose-600/60 uppercase tracking-wider mt-1">Jawaban Salah</p>
                   </div>
                </div>
             </div>
             
             <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p class="text-sm font-medium text-gray-500 leading-relaxed italic">
                  "Teruslah berlatih! Setiap kesalahan adalah kesempatan untuk belajar. Fokuslah pada bagian yang memiliki skor lebih rendah untuk meningkatkan kemampuan Anda di sesi berikutnya."
                </p>
             </div>
          </div>
          
          <!-- Call to Action -->
          <div class="flex justify-center pt-4">
            <button @click="navigateTo('/')" class="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center space-x-3">
              <Icon name="heroicons:home" class="w-5 h-5" />
              <span>Kembali ke Beranda</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <BottomNav class="z-50" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useTestHistoryDetail } from '@/composables/useTestHistory';
import BottomNav from '@/components/DashboardUser/BottomNav.vue';

const route = useRoute();
const historyId = route.params.id as string;

definePageMeta({
  middleware: ['auth', 'role-check'],
  permission: "test.history",
  title: 'Analisis Hasil'
});

const { history, isLoading, error, refresh } = useTestHistoryDetail(historyId);

// Auto refresh if status is PENDING
watch(() => history.value?.status, (newStatus) => {
  if (newStatus === 'PENDING') {
    const interval = setInterval(async () => {
      await refresh();
      if (history.value?.status !== 'PENDING') {
        clearInterval(interval);
      }
    }, 5000);
    
    onBeforeUnmount(() => clearInterval(interval));
  }
}, { immediate: true });

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

const calculateAccuracy = (h: any) => {
  if (!h || !h.totalQuestions) return 0;
  return Math.round(((h.correctCount || 0) / h.totalQuestions) * 100);
};
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
