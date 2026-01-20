<template>
  <div class="p-8 space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3 text-emerald-600">
        <Icon name="heroicons:clock" class="w-6 h-6" />
        <h3 class="text-lg font-extrabold text-gray-900 tracking-tight">Riwayat Tes Terakhir</h3>
      </div>
      <button v-if="histories && histories.length > 0" @click="navigateTo('/history')" class="text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors flex items-center gap-1 group">
        Lihat Semua
        <Icon name="heroicons:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 space-y-4">
      <Icon name="svg-spinners:ring-resize" class="h-12 w-12 text-emerald-500" />
      <p class="text-gray-400 font-medium">Memuat riwayat...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div class="p-4 bg-red-50 rounded-full border border-red-100">
        <Icon name="heroicons:exclamation-triangle" class="h-10 w-10 text-red-500" />
      </div>
      <p class="text-gray-500 font-medium">Gagal memuat data riwayat.</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!histories || histories.length === 0" class="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div class="p-4 bg-gray-50 rounded-full border border-gray-100 text-gray-300">
        <Icon name="heroicons:document-magnifying-glass" class="h-12 w-12" />
      </div>
      <div class="space-y-1">
        <p class="text-gray-800 font-bold leading-tight">Belum Ada Riwayat</p>
        <p class="text-gray-400 text-sm font-medium">Tes yang Anda selesaikan akan muncul di sini.</p>
      </div>
    </div>

    <!-- Success State -->
    <div v-else-if="latestHistory" class="relative group">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-gray-50/50 rounded-3xl border border-gray-100 group-hover:border-emerald-100 transition-colors">
        <div class="space-y-3">
          <div class="inline-flex items-center px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {{ formatDate(latestHistory.completedDate) }}
          </div>
          <h4 class="text-lg font-extrabold text-gray-900 group-hover:text-emerald-600 transition-colors">{{ latestHistory.batchName }}</h4>
          
          <!-- Rincian Skor per Sesi -->
          <div v-if="latestHistory.sectionScores" class="flex flex-wrap gap-4 pt-2">
            <div v-for="(val, key) in { Listening: latestHistory.sectionScores.listening, Structure: latestHistory.sectionScores.structure, Reading: latestHistory.sectionScores.reading }" :key="key" class="space-y-1">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ key }}</p>
              <p class="text-base font-bold text-gray-700">{{ val }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center md:items-end space-y-1">
          <p class="text-4xl font-extrabold text-emerald-600 drop-shadow-sm">{{ latestHistory.score }}</p>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Total Score</p>
        </div>
      </div>
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