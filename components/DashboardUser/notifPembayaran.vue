<template>
  <!-- Notifikasi Pembayaran Belum Selesai -->
  <div 
    v-if="hasPending"
    id="paymentPendingNotification" 
    class="relative overflow-hidden rounded-2xl border border-amber-200 bg-white p-6 shadow-sm transition-all hover:shadow-md mb-6"
  >
    <!-- Background Decoration -->
    <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-50/50 blur-3xl pointer-events-none"></div>
    
    <div class="relative flex flex-col gap-5 sm:flex-row sm:items-start">
      <!-- Icon Section -->
      <div class="flex-shrink-0">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 ring-4 ring-amber-50">
          <Icon name="lucide:wallet-cards" class="h-6 w-6" />
        </div>
      </div>

      <!-- Content Section -->
      <div class="flex-1">
        <div class="mb-1 flex flex-wrap items-center gap-2">
          <h3 class="text-lg font-bold text-gray-900">
            Pembayaran Tertunda
          </h3>
          <span class="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
            Perlu Tindakan
          </span>
        </div>
        
        <div class="mt-3 mb-4 grid grid-cols-2 gap-4 rounded-xl bg-amber-50/80 border border-amber-100 p-4 sm:max-w-md">
          <div>
            <p class="text-xs font-medium text-amber-600/80 uppercase tracking-wider">Total Tagihan</p>
            <p class="mt-1 text-lg font-bold text-gray-900">{{ displayAmount }}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-amber-600/80 uppercase tracking-wider">Nama Test</p>
            <p class="mt-1 font-mono text-sm font-medium text-gray-700">{{ displayNameTest }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-5 flex flex-wrap gap-3">
          <button 
            id="goToPaymentButton"
            class="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            @click="handleNavigate"
          >
            <Icon name="lucide:credit-card" class="h-4 w-4" />
            Lakukan Pembayaran
          </button>
        </div>
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