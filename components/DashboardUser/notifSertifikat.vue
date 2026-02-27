<template>
  <!-- Notifikasi Pembayaran Berhasil / Sertifikat Siap -->
  <div 
    v-if="totalItems > 0 && !isLoading"
    id="certificateReadyNotification" 
    class="relative overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/5 transition-all hover:shadow-md"
  >
    <!-- Background Decoration -->
    <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-50/50 blur-3xl pointer-events-none"></div>
    
    <div class="relative flex flex-col gap-5 sm:flex-row sm:items-start">
      <!-- Icon Section -->
      <div class="flex-shrink-0">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50">
          <Icon name="lucide:check-circle-2" class="h-6 w-6" />
        </div>
      </div>

      <!-- Content Section -->
      <div class="flex-1">
        <div class="mb-1 flex flex-wrap items-center gap-2">
          <h3 class="text-lg font-extrabold text-gray-900 tracking-tight">
            Pembayaran Berhasil
          </h3>
          <span class="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 uppercase tracking-widest">
            Lunas
          </span>
        </div>
        
        <p class="text-sm leading-relaxed text-gray-600 mt-2">
          Pembayaran Anda telah terverifikasi. Sertifikat hasil tes Anda kini sudah tersedia dan dapat diunduh.
        </p>

        <div class="mt-5 flex flex-wrap gap-3">
          <button 
            id="viewCertificateButton"
            class="flex items-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:scale-105 active:scale-95"
            @click="navigateTo('/profile')"
          >
            <Icon name="lucide:award" class="h-5 w-5" />
            <span>Lihat Sertifikat Saya</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useCertificates } from '@/composables/useCertificates';

const emit = defineEmits(['click-download']);
const { certificates, totalItems, fetchCertificates, isLoading } = useCertificates();

onMounted(() => {
  fetchCertificates(1, 1); // Cukup cek apakah ada minimal 1 sertifikat
});
</script>

<style>

</style>