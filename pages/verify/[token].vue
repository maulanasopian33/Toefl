<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl opacity-50" />
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50" />

    <div class="max-w-md w-full z-10">
      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-indigo-100/50 border border-indigo-50/50 text-center space-y-6">
        <div class="relative w-20 h-20 mx-auto">
          <div class="absolute inset-0 border-4 border-indigo-100 rounded-full" />
          <div class="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin" />
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-black text-gray-900 uppercase tracking-widest leading-none">Memverifikasi</h2>
          <p class="text-sm font-bold text-gray-400">Sedang memeriksa keaslian sertifikat...</p>
        </div>
      </div>

      <!-- Result Card -->
      <transition 
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
        v-else
      >
        <div v-if="isValid" class="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-indigo-50/50 overflow-hidden">
          <!-- Top Header Section (Green) -->
          <div class="bg-emerald-500 p-8 text-center space-y-4">
            <div class="w-20 h-20 bg-white/20 rounded-3xl mx-auto flex items-center justify-center backdrop-blur-sm shadow-xl shadow-emerald-600/20">
              <Icon name="lucide:check-circle" class="w-12 h-12 text-white" />
            </div>
            <div class="space-y-1">
              <h1 class="text-2xl font-black text-white uppercase tracking-widest leading-none">Sertifikat Valid</h1>
              <p class="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Authentic Verified Certificate</p>
            </div>
          </div>

          <!-- Info Section -->
          <div class="p-8 space-y-6">
            <!-- Table Info -->
            <div class="space-y-4">
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Nama Peserta</span>
                <p class="text-lg font-black text-gray-900 leading-tight mr-1">{{ certificateData.name }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Nomor Sertifikat</span>
                  <p class="text-sm font-bold text-gray-700 font-mono tracking-tight">{{ certificateData.certificateNumber }}</p>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Skor Total</span>
                  <p class="text-sm font-black text-indigo-600 mr-1">{{ certificateData.score }} Points</p>
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Batch / Event</span>
                <p class="text-sm font-bold text-gray-700 leading-tight mr-1">{{ certificateData.event }}</p>
              </div>

              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Tanggal Terbit</span>
                <p class="text-sm font-bold text-gray-700 leading-tight mr-1">{{ certificateData.date }}</p>
              </div>
            </div>

            <!-- Footer Disclaimer -->
            <div class="pt-6 border-t border-gray-100 flex items-start gap-3">
              <Icon name="lucide:shield-check" class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p class="text-[11px] font-bold text-gray-400 leading-relaxed italic">
                Data ini diverifikasi oleh sistem pusat LB AI-UQI. Informasi yang ditampilkan bersifat resmi dan asli.
              </p>
            </div>
          </div>
        </div>

        <!-- Invalid State -->
        <div v-else class="bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-rose-100/50 border border-rose-50/50 text-center space-y-6">
          <div class="w-20 h-20 bg-rose-50 rounded-3xl mx-auto flex items-center justify-center border-2 border-rose-100">
            <Icon name="lucide:alert-triangle" class="w-12 h-12 text-rose-500" />
          </div>
          <div class="space-y-2">
            <h2 class="text-xl font-black text-gray-900 uppercase tracking-widest leading-none text-rose-600">Sertifikat Tidak Valid</h2>
            <p class="text-sm font-bold text-gray-400">Token verifikasi tidak ditemukan atau telah kedaluwarsa.</p>
          </div>
          <NuxtLink to="/" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-black transition-all">
            Halaman Utama
          </NuxtLink>
        </div>
      </transition>

      <!-- Institutional branding -->
      <div class="mt-8 flex flex-col items-center gap-3">
        <div class="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
           <svg class="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 3h12a2 2 0 0 1 2 2v10.5l-3-1.5-3 1.5-3-1.5-3 1.5-3-1.5V5a2 2 0 0 1 2-2zm3 4v2h6V7z"/>
            </svg>
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Official Verification Hub</span>
        </div>
        <p class="text-gray-400 text-[10px] font-bold">© {{ new Date().getFullYear() }} LB AI-UQI. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCertificates } from '@/composables/useCertificates'

definePageMeta({
  layout: 'blank'
})

const route = useRoute()
const { verifyCertificate, isLoading } = useCertificates()

const token = route.params.token as string
const isValid = ref(false)
const certificateData = ref<any>(null)

onMounted(async () => {
  if (token) {
    const result = await verifyCertificate(token)
    isValid.value = result.valid
    certificateData.value = result.data
  }
})
</script>

<style scoped>
/* No specific styles needed since using tailwind and premium utility design */
</style>
