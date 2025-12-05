<template>
  <div class="card bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
    <h3 class="text-xl font-semibold text-slate-800 mb-4">Riwayat Tes Terakhir</h3>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="flex justify-center mb-4">
        <Icon name="lucide:loader-2" class="w-8 h-8 text-slate-400 animate-spin" />
      </div>
      <p class="text-slate-500">Memuat riwayat tes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
       <div class="flex justify-center mb-4">
          <div class="bg-red-100 rounded-full p-3">
              <Icon name="lucide:alert-triangle" class="w-8 h-8 text-red-500" />
          </div>
      </div>
      <p class="text-slate-600 font-medium">Gagal memuat data</p>
      <p class="text-sm text-slate-500 mt-1">Terjadi kesalahan saat mengambil riwayat tes.</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!histories || histories.length === 0" class="text-center py-8">
      <div class="flex justify-center mb-4">
        <div class="bg-slate-100 rounded-full p-3">
          <Icon name="lucide:history" class="w-8 h-8 text-slate-500" />
        </div>
      </div>
      <p class="text-slate-600 font-medium">Belum ada tes yang diselesaikan</p>
      <p class="text-sm text-slate-500 mt-1">Hasil tes terakhir Anda akan muncul di sini.</p>
    </div>

    <!-- Success State -->
    <div v-else-if="latestHistory">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p class="text-sm text-slate-500">{{ formatDate(latestHistory.completedDate) }}</p>
          <h4 class="text-lg font-semibold text-slate-800">{{ latestHistory.batchName }}</h4>
        </div>
        <div class="text-right">
          <p class="text-3xl font-bold text-green-600">{{ latestHistory.score }}</p>
          <p class="text-sm text-slate-500">Skor Total</p>
        </div>
      </div>
      <!-- Rincian Skor per Sesi -->
      <div v-if="latestHistory.sectionScores" class="mt-4 pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="font-semibold text-slate-700">{{ latestHistory.sectionScores.listening }}</p>
          <p class="text-xs text-slate-500">Listening</p>
        </div>
        <div>
          <p class="font-semibold text-slate-700">{{ latestHistory.sectionScores.structure }}</p>
          <p class="text-xs text-slate-500">Structure</p>
        </div>
        <div>
          <p class="font-semibold text-slate-700">{{ latestHistory.sectionScores.reading }}</p>
          <p class="text-xs text-slate-500">Reading</p>
        </div>
      </div>
    </div>

    <!-- Footer Button -->
    <div v-if="histories && histories.length > 0" class="mt-4 border-t border-slate-200 pt-4 flex justify-end">
      <button @click="navigateTo('/history')" class="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors duration-200">
        Lihat Semua Riwayat
        <Icon name="lucide:arrow-right" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTestHistory } from '@/composables/useTestHistory';
import { computed } from 'vue';

const { histories, isLoading, error } = useTestHistory();

// Mengambil riwayat tes terbaru (elemen pertama dari array)
const latestHistory = computed(() => (histories.value && histories.value.length > 0) ? histories.value[0] : null);

// Fungsi untuk memformat tanggal
const formatDate = (isoString: string) => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};
</script>