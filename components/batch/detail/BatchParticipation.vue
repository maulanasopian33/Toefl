<template>
  <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
    <div v-if="isRegistered" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-green-700 flex items-center gap-2">
          <Icon name="lucide:check-circle-2" class="w-6 h-6" />
          Terdaftar
        </h3>
        <p class="text-sm text-gray-600 mt-1">
          Anda sudah terdaftar di batch ini.
          <span v-if="needsPayment" class="font-medium text-amber-600">Menunggu pembayaran.</span>
          <span v-else class="font-medium text-green-600">Siap mengikuti tes.</span>
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <NuxtLink to="/" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Icon name="lucide:home" class="w-4 h-4 mr-2" />
          Ke Beranda
        </NuxtLink>
        <button v-if="needsPayment" @click="goToPayment" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-sm">
          <Icon name="lucide:credit-card" class="w-4 h-4 mr-2" />
          Lanjutkan Pembayaran
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-800">Partisipasi</h3>
        <div class="flex items-center gap-4 mt-2">
          <div class="flex items-center text-gray-600">
            <Icon name="lucide:users" class="w-5 h-5 mr-2" />
            <span class="font-medium">{{ batch.participants?.length || 0 }} / {{ batch.max_participants }} Peserta</span>
          </div>
          <div class="w-px h-5 bg-gray-300"></div>
          <div class="text-sm text-gray-500">
            Minimal: {{ batch.min_participants || '-' }} peserta
          </div>
        </div>
      </div>
      <button 
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isRegistrationDisabled || isLoading" @click="handleJoinBatch"
      >
        <Icon v-if="isLoading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
        <Icon v-else :name="registrationIcon" class="w-5 h-5" />
        {{ isLoading ? 'Memproses...' : registrationText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  batch: { type: Object, required: true }
})

const emit = defineEmits(['update-batch'])
const config = useRuntimeConfig()
const { $auth } = useNuxtApp()
const { user } = useAuth()
const router = useRouter()
const isLoading = ref(false)

const isRegistrationDisabled = computed(() => {
  const now = new Date();
  const open = props.batch.registration_open_at ? new Date(props.batch.registration_open_at) : null;
  const close = props.batch.registration_close_at ? new Date(props.batch.registration_close_at) : null;
  
  if (props.batch.status !== 'OPEN') return true;
  if (open && now < open) return true;
  if (close && now > close) return true;
  if ((props.batch.participants?.length || 0) >= props.batch.max_participants) return true;
  
  return false;
});

const registrationText = computed(() => {
  const now = new Date();
  const open = props.batch.registration_open_at ? new Date(props.batch.registration_open_at) : null;

  if (props.batch.status === 'FULL' || (props.batch.participants?.length || 0) >= props.batch.max_participants) return 'Kuota Penuh';
  if (props.batch.status !== 'OPEN') return 'Pendaftaran Ditutup';
  if (open && now < open) return 'Segera Dibuka';
  
  return 'Daftar Sekarang';
});

const registrationIcon = computed(() => isRegistrationDisabled.value ? 'lucide:lock' : 'lucide:edit-3');

const userParticipation = computed(() => {
  if (!user.value || !props.batch.participants) return null;
  const uid = user.value.uid;
  return props.batch.participants.find((p: any) => 
    p.user_id === uid || p.userId === uid || (p.user && p.user.id === uid)
  );
});

const isRegistered = computed(() => !!userParticipation.value);

const needsPayment = computed(() => {
  const p = userParticipation.value;
  if (!p) return false;
  const status = p.status || p.payment_status;
  return ['pending', 'UNPAID', 'waiting_payment'].includes(status);
});

const showNotification = (message: string, type: 'success' | 'error') => {
  // Menggunakan alert sebagai notifikasi sederhana
  alert(message)
}

const goToPayment = () => {
  const p = userParticipation.value;
  if (p) {
    // Menggunakan externalId atau id partisipasi untuk navigasi ke halaman pembayaran
    const paymentId = p.externalId || p.external_id || p.id; 
    router.push(`/payment/${paymentId}`);
  }
}

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
</script>