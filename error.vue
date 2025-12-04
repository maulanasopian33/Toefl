<script setup>
import { computed } from 'vue'

const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

const statusCode = computed(() => props.error?.statusCode || 500)

const title = computed(() => {
  if (statusCode.value === 404) {
    return 'Halaman Tidak Ditemukan'
  }
  return 'Terjadi Kesalahan'
})

const message = computed(() => {
  if (props.error?.statusCode === 404) {
    return 'Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin halaman tersebut telah dihapus atau dipindahkan.'
  }
  return props.error?.message || 'Terjadi kesalahan tak terduga di server. Tim kami telah diberitahu dan sedang menanganinya.'
})
</script>
<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <div class="container mx-auto px-6 py-10 flex-grow flex items-center justify-center">
      <div class="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 text-center">
    
      {{ statusCode }}
      </div>
    <h1 class="text-3xl font-extrabold text-gray-800 mb-4">
        {{ title }}
      </h1>
      <p class="text-gray-500 mt-2 mb-8 text-base">
        {{ message }}
      </p>
      <NuxtLink to="/" class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition duration-150">
        Kembali ke Halaman Utama
      </NuxtLink>
    </div>
  </div>
</template>
<style scoped>

.error-page {
  text-align: center;
}


</style>
