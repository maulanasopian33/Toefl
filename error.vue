<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center space-y-6">
      <!-- Illustration -->
      <div class="relative w-48 h-48 mx-auto">
        <div class="absolute inset-0 bg-indigo-100 rounded-full animate-pulse opacity-50"></div>
        <div class="absolute inset-4 bg-indigo-50 rounded-full flex items-center justify-center">
          <Icon v-if="error.statusCode === 404" name="lucide:file-question" class="w-20 h-20 text-indigo-500" />
          <Icon v-else name="lucide:server-crash" class="w-20 h-20 text-red-500" />
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-slate-900 tracking-tight">
          {{ error.statusCode === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan' }}
        </h1>
        <p class="text-slate-600 text-lg">
          {{ error.statusCode === 404 
              ? 'Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.' 
              : 'Terjadi kesalahan internal pada server. Silakan coba lagi nanti.' 
          }}
        </p>
        <p v-if="error.message && error.statusCode !== 404" class="text-xs text-slate-400 font-mono bg-slate-100 p-2 rounded truncate max-w-xs mx-auto">
          {{ error.message }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button 
          @click="handleClearError" 
          class="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95"
        >
          <Icon name="lucide:home" class="w-5 h-5" />
          <span>Kembali ke Beranda</span>
        </button>
        <button 
          v-if="error.statusCode !== 404"
          @click="refreshPage" 
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all font-medium"
        >
          <Icon name="lucide:refresh-cw" class="w-5 h-5" />
          <span>Coba Lagi</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clearError } from '#app';

const props = defineProps({
  error: Object
});

const handleClearError = () => {
    clearError({ redirect: '/' });
};

const refreshPage = () => {
    window.location.reload();
};
</script>

<style scoped>
.btn-primary {
    @apply bg-indigo-600 text-white font-medium hover:bg-indigo-700;
}
</style>
