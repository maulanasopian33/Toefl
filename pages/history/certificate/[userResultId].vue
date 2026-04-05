<template>
  <div class="min-h-screen bg-gray-50/50 p-6 lg:p-10">
    <div class="max-w-3xl mx-auto space-y-8">
      
      <!-- Back Link -->
      <NuxtLink 
        to="/history" 
        class="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors group"
      >
        <Icon name="lucide:arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Riwayat Tes
      </NuxtLink>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-[2.5rem] p-16 shadow-xl border border-gray-100 flex flex-col items-center justify-center gap-6">
        <div class="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p class="text-sm font-black text-gray-400 uppercase tracking-widest">Memuat Sertifikat...</p>
      </div>

      <!-- No Certificate State -->
      <div v-else-if="!certificate" class="bg-white rounded-[2.5rem] p-16 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center gap-6">
        <div class="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center border-2 border-amber-100">
          <Icon name="lucide:clock" class="w-10 h-10 text-amber-500" />
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-black text-gray-900 uppercase tracking-widest">Belum Tersedia</h2>
          <p class="text-sm font-bold text-gray-400 max-w-xs">Sertifikat Anda Sedang Dalam Proses Penerbitan Oleh Admin. Silakan Cek Kembali Nanti.</p>
        </div>
      </div>

      <!-- Certificate Display Card -->
      <div v-else class="space-y-6">
        <div class="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
          <Icon name="lucide:award" class="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          
          <div class="relative z-10 space-y-8">
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <h1 class="text-3xl font-black uppercase tracking-widest leading-none">Sertifikat Digital</h1>
                <p class="text-xs font-black text-white/60 uppercase tracking-[0.3em]">Official Proficiency Certificate</p>
              </div>
              <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Icon name="lucide:check-circle" class="w-8 h-8" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-1">
                <span class="text-[10px] font-black text-white/50 uppercase tracking-widest">Nama Peserta</span>
                <p class="text-xl font-black">{{ certificate.name }}</p>
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-black text-white/50 uppercase tracking-widest">Nomor Sertifikat</span>
                <p class="text-lg font-bold font-mono">{{ certificate.certificateNumber }}</p>
              </div>
            </div>

            <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
               <div class="flex items-center gap-4">
                  <div class="text-center bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
                    <p class="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Skor Total</p>
                    <p class="text-2xl font-black">{{ certificate.score }}</p>
                  </div>
                  <div class="text-center bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
                    <p class="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Batch</p>
                    <p class="text-sm font-bold uppercase">{{ certificate.event }}</p>
                  </div>
               </div>
               
               <button 
                @click="downloadCertificate(certificate.id, `certificate-${certificate.certificateNumber}.pdf`)"
                class="w-full md:w-auto px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 <Icon name="lucide:download-cloud" class="w-5 h-5" />
                 Download PDF
               </button>
            </div>
          </div>
        </div>

        <!-- Verification Preview Card -->
        <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl flex flex-col md:flex-row items-center gap-8 group">
          <div class="w-32 h-32 bg-gray-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-indigo-400 transition-colors">
            <Icon name="lucide:qr-code" class="w-16 h-16 text-gray-300 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div class="flex-grow space-y-3 text-center md:text-left">
            <h3 class="text-lg font-black text-gray-900 leading-none">Verifikasi Keaslian</h3>
            <p class="text-sm font-bold text-gray-400 leading-relaxed">
              Sertifikat Anda Dilengkapi Dengan Fitur Verifikasi Keaslian Berbasis QR Code Public.
              Instansi Terkait Dapat Melakukan Verifikasi Kapan Saja Melalui Link Di Bawah Ini.
            </p>
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
               <a 
                :href="certificate.verifyUrl" 
                target="_blank"
                class="text-xs font-black text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
               >
                 {{ certificate.verifyUrl }}
               </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCertificates, type Certificate } from '@/composables/useCertificates'

const route = useRoute()
const { getCertificateByUserResult, downloadCertificate, isLoading } = useCertificates()

const userResultId = route.params.userResultId as string
const certificate = ref<Certificate | null>(null)

onMounted(async () => {
  if (userResultId) {
    certificate.value = await getCertificateByUserResult(parseInt(userResultId))
  }
})

definePageMeta({
  middleware: ['auth']
})
</script>

<style scoped>
</style>
