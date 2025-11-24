<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-gray-800">Status Partisipasi Anda</h2>
      
      <!-- Status: Belum Bergabung -->
      <div v-if="!participationStatus" class="mt-4 text-center">
        <div class="flex justify-center">
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Icon name="lucide:user-plus" class="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <p class="mt-3 font-medium text-gray-800">Anda belum terdaftar di batch ini.</p>
        <p class="mt-1 text-sm text-gray-500">Daftar sekarang untuk mengikuti tes pada batch ini.</p>
        <button @click="handleJoinBatch" :disabled="isLoading" class="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60">
          <Icon v-if="isLoading" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
          <span v-else>Join Batch Sekarang</span>
        </button>
      </div>

      <!-- Status: Menunggu Pembayaran -->
      <div v-else-if="participationStatus === 'pending_payment'" class="mt-4 text-center">
        <div class="flex justify-center">
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100">
            <Icon name="lucide:hourglass" class="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <p class="mt-3 font-medium text-gray-800">Menunggu Pembayaran</p>
        <p class="mt-1 text-sm text-gray-500">Selesaikan pembayaran sebelum batas waktu untuk mengamankan tempat Anda.</p>
        <button @click="handleGoToPayment" class="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400">
          Lanjutkan Pembayaran
        </button>
      </div>

      <!-- Status: Sudah Bayar / Siap Tes -->
      <div v-else-if="participationStatus === 'paid'" class="mt-4 text-center">
        <div class="flex justify-center">
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Icon name="lucide:check-circle-2" class="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <p class="mt-3 font-medium text-gray-800">Pendaftaran Berhasil!</p>
        <p class="mt-1 text-sm text-gray-500">Anda sudah terdaftar. Tes akan dapat dimulai sesuai jadwal yang ditentukan.</p>
        <button @click="handleStartTest" class="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
          Mulai Tes
        </button>
      </div>

      <!-- Status: Tes Selesai -->
      <div v-else-if="participationStatus === 'test_completed'" class="mt-4 text-center">
        <div class="flex justify-center">
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
            <Icon name="lucide:award" class="h-8 w-8 text-indigo-500" />
          </div>
        </div>
        <p class="mt-3 font-medium text-gray-800">Tes Telah Selesai</p>
        <p class="mt-1 text-sm text-gray-500">Anda telah menyelesaikan tes pada batch ini. Lihat hasil Anda di halaman riwayat.</p>
        <button @click="handleViewHistory" class="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          Lihat Riwayat Skor
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNotification } from '@/composables/useNotification';

const props = defineProps({
  batch: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update-batch']);

const { showNotification } = useNotification();
const isLoading = ref(false);
const config = useRuntimeConfig();
const { $auth } = useNuxtApp();

// Logika untuk menentukan status partisipasi pengguna.
const participationStatus = computed(() => {
  const currentUserId = $auth.currentUser?.uid;
  if (!currentUserId || !props.batch.participants) {
    return null; // Pengguna belum login atau tidak ada peserta
  }

  const userParticipant = props.batch.participants.find(
    (p) => p.userId === currentUserId
  );

  if (!userParticipant) {
    return null; // Pengguna belum terdaftar di batch ini
  }

  // Asumsi: Cek status pembayaran dari participant
  const paymentStatus = userParticipant.payments?.[0]?.status; // Ambil status pembayaran pertama

  if (paymentStatus === 'pending') return 'pending_payment';
  if (paymentStatus === 'paid') return 'paid';
  return null; // Default jika tidak ada status yang jelas atau status lain
});

console.log(props.batch);


const handleJoinBatch = async () => {
  isLoading.value = true;
  try {
    const token = await $auth.currentUser?.getIdToken();
    if (!token) throw new Error("Autentikasi gagal.");

    // Panggil API untuk mendaftarkan pengguna ke batch
    const response = await $fetch(`${config.public.API_URL}/participants/join`, {
      method: 'POST',
      body: { batchId: props.batch.idBatch },
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    showNotification('Anda berhasil terdaftar! Silakan lanjutkan ke pembayaran.', 'success');
    
    // Emit event untuk memberitahu parent (halaman [id].vue) agar memperbarui data batch
    emit('update-batch', response.data); // Asumsi API mengembalikan data batch terbaru

    console.log(response.data);
    
  } catch (error: any) {
    console.error("Gagal join batch:", error);

    // Default error message
    let errorMessage = 'Gagal mendaftar ke batch. Silakan coba lagi nanti.';

    // Cek jika ada pesan error spesifik dari body respons API
    if (error.data && error.data.message) {
      errorMessage = error.data.message;
    } 
    // Jika tidak ada, coba berikan pesan berdasarkan status code
    else if (error.statusCode) {
      switch (error.statusCode) {
        case 409: // Conflict
          errorMessage = 'Anda sudah terdaftar di batch ini.';
          break;
        case 404: // Not Found
          errorMessage = 'Batch yang Anda coba ikuti tidak ditemukan atau sudah ditutup.';
          break;
      }
    }

    showNotification(errorMessage, 'error');
  } finally {
    isLoading.value = false;
  }
};

const handleGoToPayment = () => {
  // Arahkan ke halaman pembayaran dengan ID invoice dari data partisipasi
  const invoiceId = props.batch.userParticipation?.invoiceId;
  if (invoiceId) {
    navigateTo(`/payment/${invoiceId}`);
  } else {
    showNotification('Detail pembayaran tidak ditemukan.', 'error');
  }
};

const handleStartTest = () => {
  // Arahkan ke halaman ujian
  navigateTo(`/test/${props.batch.idBatch}`);
};

const handleViewHistory = () => {
  // Arahkan ke halaman riwayat skor
  navigateTo('/history/scores');
};
</script>