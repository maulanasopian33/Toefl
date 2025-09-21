<template>
  <div class="card mb-6">
    <h3 class="text-xl font-bold text-gray-800 mb-4">Keikutsertaan</h3>
    <div :class="alertClass">
      <p class="font-semibold mb-2">{{ statusTitle }}</p>
      <p class="text-sm" :class="{ 'mb-4': showButton }">{{ statusMessage }}</p>
      <button
        v-if="showButton"
        @click="handleButtonClick"
        :class="buttonClass"
        class="text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getNamaLengkap, getEmail, isEmailVerified, getPhoto } from '@/utils/userHelpers';
import { useBatchJoin } from '@/composables/Batch/join';
const { showConfirm,showAlert } = useNotificationPopup();
const props = defineProps({
  batch: {
    type: Array,
    required: true
  }
});

const { data: user, pending, error } = await useUserMe();

const emit = defineEmits(['updateBatch']);
const BatchData = computed(() => props.batch);
const isStudentRegistered = computed(() => BatchData.value.participants.find((participant) => participant.name === getNamaLengkap(user.value)));
const today = new Date();
const startDate = new Date(props.batch.tanggalMulai);
const endDate = new Date(props.batch.tanggalSelesai);

const status = computed(() => {
  if (isStudentRegistered.value) {
    if (today >= startDate && today <= endDate) return 'registered-ongoing';
    if (today < startDate) return 'registered-pending';
    return 'registered-closed';
  } else {
    if (props.batch.statusBatch === 'aktif' && today < endDate) return 'not-registered-open';
    if (props.batch.statusBatch === 'tutup') return 'not-registered-closed';
    return 'not-registered-past';
  }
});

const alertClass = computed(() => {
  switch (status.value) {
    case 'registered-ongoing':
    case 'registered-closed':
      return 'alert-success';
    case 'registered-pending':
    case 'not-registered-open':
      return 'alert-info';
    case 'not-registered-closed':
    case 'not-registered-past':
      return 'alert-danger';
    default:
      return 'alert-info';
  }
});

const statusTitle = computed(() => {
  switch (status.value) {
    case 'registered-ongoing':
    case 'registered-pending':
    case 'registered-closed':
      return 'Anda sudah terdaftar di batch ini!';
    case 'not-registered-open':
      return 'Batch ini terbuka untuk pendaftaran!';
    case 'not-registered-closed':
      return 'Batch ini sudah ditutup.';
    case 'not-registered-past':
      return 'Batch ini sudah tidak tersedia.';
    default:
      return 'Memuat status keikutsertaan...';
  }
});

const statusMessage = computed(() => {
  switch (status.value) {
    case 'registered-ongoing':
      return 'Ujian sedang berlangsung. Anda dapat memulai atau melanjutkan tes Anda sekarang.';
    case 'registered-pending':
      return `Ujian akan dimulai pada tanggal ${props.batch.startDate}. Persiapkan diri Anda!`;
    case 'registered-closed':
      return `Batch ujian ini telah selesai pada tanggal ${props.batch.endDate}. Anda dapat melihat hasil Anda di Riwayat Skor.`;
    case 'not-registered-open':
      return 'Bergabunglah sekarang untuk mengikuti ujian pada tanggal yang ditentukan.';
    case 'not-registered-closed':
    case 'not-registered-past':
      return 'Pendaftaran untuk batch ini telah berakhir atau batch telah selesai.';
    default:
      return '';
  }
});

const showButton = computed(() => ['registered-ongoing', 'registered-closed', 'not-registered-open'].includes(status.value));

const buttonText = computed(() => {
  switch (status.value) {
    case 'registered-ongoing':
      return 'Mulai / Lanjutkan Ujian';
    case 'registered-closed':
      return 'Lihat Riwayat Skor';
    case 'not-registered-open':
      return 'Gabung Batch';
    default:
      return '';
  }
});

const buttonClass = computed(() => {
  switch (status.value) {
    case 'registered-ongoing':
    case 'not-registered-open':
      return 'main-button';
    case 'registered-closed':
      return 'secondary-button';
    default:
      return '';
  }
});

const handleButtonClick = () => {
  switch (status.value) {
    case 'registered-ongoing':
      navigateTo(`/batch/${props.batch.id}`);
      break;
    case 'registered-closed':
      navigateTo(`/batch/${props.batch.id}/results`);
      break;
    case 'not-registered-open':
      daftarBatch();
      break;
  }
};

const daftarBatch = async() => {
  try {
    const confirmation = await showConfirm("Apakah Anda Yakin Ingin Daftar Batch Ini?");
    if (confirmation) {
      const batchData = {
        userId : user.value.uid,
        batchId : BatchData.value.idBatch
      };
      const { data, pending, error } = await useBatchJoin(batchData);
      if (error.value) {
        throw error.value
      }
      if (data.value) {
        showAlert('Pendaftaran berhasil!');
        await refreshNuxtData();
      }
    }
  } catch (error) {
    console.log(error)
    showAlert('Pendaftaran gagal. Silakan coba lagi.');
  }
}
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
</script>

<style scoped>
.alert-info {
    background-color: #e0f2fe;
    border-left: 4px solid #3b82f6;
    color: #1e40af;
    padding: 1rem;
    border-radius: 0.5rem;
}
.alert-success {
    background-color: #d1fae5;
    border-left: 4px solid #34d399;
    color: #065f46;
    padding: 1rem;
    border-radius: 0.5rem;
}
.alert-danger {
    background-color: #fee2e2;
    border-left: 4px solid #ef4444;
    color: #991b1b;
    padding: 1rem;
    border-radius: 0.5rem;
}
.main-button {
    background-color: #10b981;
    transition: all 0.2s ease-in-out;
}
.main-button:hover {
    background-color: #059669;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}
.secondary-button {
    background-color: #06b6d4;
    transition: all 0.2s ease-in-out;
}
.secondary-button:hover {
    background-color: #0891b2;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}
</style>