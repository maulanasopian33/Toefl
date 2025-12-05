<template>
  <div class="card bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
    <h3 class="text-xl font-semibold text-slate-800 mb-4">Riwayat Tes Terakhir</h3>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
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
    <div v-else-if="!history" class="text-center py-8">
      <div class="flex justify-center mb-4">
        <div class="bg-slate-100 rounded-full p-3">
          <Icon name="lucide:history" class="w-8 h-8 text-slate-500" />
        </div>
      </div>
      <p class="text-slate-600 font-medium">Belum ada tes yang diselesaikan</p>
      <p class="text-sm text-slate-500 mt-1">Hasil tes terakhir Anda akan muncul di sini.</p>
    </div>

    <!-- Success State -->
    <div v-else>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p class="text-sm text-slate-500">{{ formatDate(history.completedDate) }}</p>
          <h4 class="text-lg font-semibold text-slate-800">{{ history.batchName }}</h4>
        </div>
        <div class="text-right">
          <p class="text-3xl font-bold text-green-600">{{ history.score }}</p>
          <p class="text-sm text-slate-500">Skor Total</p>
        </div>
      </div>
      <!-- Rincian Skor per Sesi -->
      <div class="mt-4 pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center">
        <div v-for="section in history.sections" :key="section.name">
          <p class="font-semibold text-slate-700">{{ section.score }}</p>
          <p class="text-xs text-slate-500">{{ section.name }}</p>
        </div>
      </div>
    </div>

    <!-- Footer Button -->
    <div class="mt-4 border-t border-slate-200 pt-4 flex justify-end">
      <button @click="navigateTo('/history')" class="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors duration-200">
        Lihat Semua Riwayat
        <Icon name="lucide:arrow-right" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { $auth } = useNuxtApp();

// Ambil data dari API. Kita akan mengambil array dan memilih yang pertama.
const { data: history, pending, error } = await useAsyncData('latest-history', async () => {
  const token = await $auth.currentUser?.getIdToken();
  if (!token) return null;

  // Endpoint ini mengembalikan array riwayat tes
  const response = await $fetch<{ data: any[] }>(`${config.public.API_URL}/exams/history`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  // Kembalikan hanya elemen pertama (tes terbaru) jika ada, atau null jika array kosong.
  return response.data && response.data.length > 0 ? response.data[0] : null;
}, {
  lazy: true, // Data akan dimuat di sisi client
  server: false // Tidak perlu dijalankan di server
});


const formatDate = (isoString: string) => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};
</script>