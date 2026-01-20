<template>
  <!-- Notifikasi Pembayaran Belum Selesai -->
  <div 
    v-if="hasPending"
    id="paymentPendingNotification" 
    class="relative overflow-hidden rounded-[2.5rem] border border-amber-100 bg-white p-8 shadow-xl shadow-amber-900/5 transition-all hover:shadow-md"
  >
    <!-- Background Decoration -->
    <div class="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-50 blur-3xl opacity-50 pointer-events-none"></div>
    
    <div class="relative flex flex-col gap-6 md:flex-row md:items-center">
      <!-- Icon Section -->
      <div class="flex-shrink-0">
        <div class="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-amber-100 text-amber-600 ring-8 ring-amber-50">
          <Icon name="heroicons:credit-card" class="h-8 w-8" />
        </div>
      </div>

      <!-- Content Section -->
      <div class="flex-1 space-y-4">
        <div class="space-y-1">
          <span class="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-600 border border-amber-100 uppercase tracking-widest">
            Perlu Tindakan
          </span>
          <h3 class="text-xl font-extrabold text-gray-900">
            Pembayaran Belum Selesai
          </h3>
          <p class="text-gray-500 text-sm font-medium">Selesaikan pembayaran untuk dapat mengikuti tes TOEFL.</p>
        </div>
        
        <div class="flex flex-wrap gap-6 p-5 bg-amber-50/50 border border-amber-100 rounded-2xl">
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Total Tagihan</p>
            <p class="text-xl font-extrabold text-gray-900">{{ displayAmount }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Sesi Ujian</p>
            <p class="text-sm font-bold text-gray-700">{{ displayNameTest }}</p>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex-shrink-0">
        <button 
          id="goToPaymentButton"
          class="flex items-center gap-3 rounded-2xl bg-amber-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-amber-600/20 transition-all hover:bg-amber-700 hover:scale-105 active:scale-95"
          @click="handleNavigate"
        >
          <span>Bayar Sekarang</span>
          <Icon name="heroicons:chevron-right" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';

const emit = defineEmits(['click-payment']);
const router = useRouter();

const props = defineProps({
  amount: {
    type: String,
    default: ''
  },
  invoiceId: {
    type: String,
    default: ''
  }
});

const config = useRuntimeConfig();
const { $auth } = useNuxtApp();

const pendingPayment = ref<any>(null);
const isLoading = ref(false);

const fetchPendingPayment = async () => {
  const user = $auth?.currentUser;
  if (!user) return;

  isLoading.value = true;
  try {
    const token = await user.getIdToken();
    const response: any = await $fetch(`${config.public.API_URL}/payments/user/${user.uid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Asumsi response bisa berupa array atau object { data: [] }
    const payments = Array.isArray(response) ? response : (response.data || []);
    
    if (Array.isArray(payments)) {
      // Cari pembayaran dengan status pending
      pendingPayment.value = payments.find((p: any) => p.status === 'pending' || p.status === 'UNPAID');
    }
  } catch (error) {
    console.error('Gagal memuat data pembayaran:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPendingPayment();
});

const displayAmount = computed(() => {
  if (pendingPayment.value) {
    const val = pendingPayment.value.amount || pendingPayment.value.price || 0;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  }
  return 'Rp -';
});

const displayNameTest = computed(() => {
  if (pendingPayment.value) return pendingPayment.value.participant?.batch?.namaBatch || '-';
  return '-';
});

const hasPending = computed(() => {
  return (props.amount && props.invoiceId) || !!pendingPayment.value;
});

const handleNavigate = () => {
  // Prioritaskan navigasi jika data pembayaran tersedia
  if (pendingPayment.value) {
    const id = pendingPayment.value.externalId || pendingPayment.value.id;
    router.push(`/payment/${id}`);
  } else {
    emit('click-payment');
  }
};
</script>

<style>

</style>