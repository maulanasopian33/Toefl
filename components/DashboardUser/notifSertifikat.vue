<template>
  <!-- Notifikasi Pembayaran Berhasil / Sertifikat Siap -->
  <div 
    id="certificateReadyNotification" 
    class="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm transition-all hover:shadow-md mb-6"
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
          <h3 class="text-lg font-bold text-gray-900">
            Pembayaran Berhasil
          </h3>
          <span class="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            Lunas
          </span>
        </div>
        
        <p class="text-sm leading-relaxed text-gray-600 mt-2">
          Pembayaran Anda telah terverifikasi. Sertifikat hasil tes Anda kini sudah tersedia dan dapat diunduh.
        </p>

        <!-- Action Buttons -->
        <div class="mt-5 flex flex-wrap gap-3">
          <button 
            id="viewCertificateButton"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            @click="$emit('click-download')"
          >
            <Icon name="lucide:download" class="h-4 w-4" />
            Lihat & Unduh Sertifikat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['click-download']);
</script>

<style>

</style>