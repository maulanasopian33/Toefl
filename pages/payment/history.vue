<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-5xl">
      <!-- Header Section -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Riwayat Pembayaran</h1>
          <p class="mt-1 text-sm text-slate-500">Pantau status dan riwayat transaksi ujian Anda.</p>
        </div>
        
        <div class="flex gap-2">
           <button @click="fetchHistory" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
             <Icon name="lucide:refresh-cw" :class="{'animate-spin': isLoading}" class="w-4 h-4" />
             Refresh
           </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div class="relative">
            <div class="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
            <div class="relative bg-white p-3 rounded-full shadow-sm border border-indigo-50">
                <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        </div>
        <p class="mt-6 text-slate-600 font-medium animate-pulse">Memuat data transaksi...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-rose-100 text-center px-4">
        <div class="bg-rose-50 p-4 rounded-full mb-4 text-rose-600">
          <Icon name="lucide:alert-circle" class="h-8 w-8" />
        </div>
        <h3 class="text-lg font-semibold text-slate-900">Gagal Memuat Data</h3>
        <p class="mt-2 text-slate-500 max-w-sm">{{ error }}</p>
        <button @click="fetchHistory" class="mt-6 inline-flex items-center gap-2 rounded-lg bg-white border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          Coba Lagi
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="payments.length === 0" class="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-slate-200 text-center px-4">
        <div class="bg-slate-50 p-6 rounded-full mb-6">
          <Icon name="lucide:receipt" class="h-12 w-12 text-slate-300" />
        </div>
        <h3 class="text-xl font-bold text-slate-900">Belum Ada Transaksi</h3>
        <p class="mt-2 text-slate-500 max-w-md mx-auto leading-relaxed">
          Anda belum memiliki riwayat pembayaran. Silakan mendaftar pada batch ujian yang tersedia untuk memulai.
        </p>
        <NuxtLink to="/" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
          <Icon name="lucide:search" class="w-4 h-4" />
          Lihat Jadwal Ujian
        </NuxtLink>
      </div>

      <!-- Payment List -->
      <div v-else class="space-y-4">
        <!-- Desktop Header -->
        <div class="hidden md:grid grid-cols-12 gap-6 px-6 py-4 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider shadow-sm">
          <div class="col-span-4">Invoice & Nominal</div>
          <div class="col-span-3">Keterangan</div>
          <div class="col-span-2">Tanggal</div>
          <div class="col-span-2">Status</div>
          <div class="col-span-1 text-right"></div>
        </div>

        <!-- Payment Items -->
        <div v-for="payment in payments" :key="payment.id" 
             class="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 overflow-hidden">
          
          <!-- Mobile Layout -->
          <div class="md:hidden p-5">
            <div class="flex justify-between items-start mb-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wide">
                        {{ payment.method === 'manual' ? 'Manual' : 'Transfer' }}
                    </span>
                    <span class="text-xs font-mono text-slate-400">#{{ payment.invoiceNumber }}</span>
                </div>
                <h3 class="text-xl font-bold text-slate-900">{{ formatCurrency(payment.amount) }}</h3>
              </div>
              <div :class="getStatusColor(payment.status)" class="px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5">
                 <Icon :name="getStatusIcon(payment.status)" class="w-3.5 h-3.5" />
                 {{ getStatusLabel(payment.status) }}
              </div>
            </div>
            
            <div class="space-y-3 mb-5">
              <div class="flex items-start gap-3">
                <div class="mt-0.5 p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                    <Icon name="lucide:graduation-cap" class="w-4 h-4" />
                </div>
                <div>
                    <p class="text-sm font-semibold text-slate-800">{{ payment.batchName }}</p>
                    <p class="text-xs text-slate-500">Pembayaran Ujian</p>
                </div>
              </div>
              <div class="flex items-center gap-3 pl-1">
                 <Icon name="lucide:calendar" class="w-4 h-4 text-slate-400 ml-1" />
                 <span class="text-sm text-slate-600">{{ formatDate(payment.createdAt) }} <span class="text-slate-400 mx-1">•</span> {{ formatTime(payment.createdAt) }}</span>
              </div>
            </div>

            <NuxtLink :to="`/payment/${payment.id}`" class="block w-full text-center py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
                Lihat Detail Transaksi
            </NuxtLink>
          </div>

          <!-- Desktop Layout -->
          <div class="hidden md:grid grid-cols-12 gap-6 items-center p-5">
            <!-- Invoice & Amount -->
            <div class="col-span-4">
              <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300">
                  <Icon name="lucide:receipt" class="h-6 w-6" />
                </div>
                <div>
                  <p class="text-lg font-bold text-slate-900">{{ formatCurrency(payment.amount) }}</p>
                  <p class="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                    <Icon name="lucide:hash" class="w-3 h-3" />
                    {{ payment.invoiceNumber }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="col-span-3">
              <p class="text-sm font-semibold text-slate-800 line-clamp-1">{{ payment.batchName }}</p>
              <p class="text-xs text-slate-500 mt-1">Pembayaran Ujian</p>
            </div>

            <!-- Date -->
            <div class="col-span-2">
              <p class="text-sm font-medium text-slate-700">{{ formatDate(payment.createdAt) }}</p>
              <p class="text-xs text-slate-400 mt-1">{{ formatTime(payment.createdAt) }} WIB</p>
            </div>

            <!-- Status -->
            <div class="col-span-2">
               <div :class="getStatusColor(payment.status)" class="inline-flex px-3 py-1 rounded-full text-xs font-bold border items-center gap-1.5">
                 <Icon :name="getStatusIcon(payment.status)" class="w-3.5 h-3.5" />
                 {{ getStatusLabel(payment.status) }}
              </div>
            </div>

            <!-- Action -->
            <div class="col-span-1 text-right">
              <NuxtLink :to="`/payment/${payment.id}`" class="inline-flex items-center justify-center h-9 w-9 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" title="Lihat Detail">
                <Icon name="lucide:chevron-right" class="h-5 w-5" />
              </NuxtLink>
            </div>
          </div>
          
          <!-- Hover Effect Bar -->
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
      
      <!-- Footer Note -->
      <div v-if="payments.length > 0" class="mt-8 text-center">
        <p class="text-xs text-slate-400">
          Menampilkan {{ payments.length }} transaksi terakhir. Jika ada kendala, hubungi <a href="#" class="text-indigo-500 hover:underline">Bantuan</a>.
        </p>
      </div>
    </div>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import BottomNav from '@/components/DashboardUser/BottomNav.vue';

definePageMeta({
  middleware: ['auth'],
  title: 'Riwayat Pembayaran'
});

const config = useRuntimeConfig();
const { $auth } = useNuxtApp();
const { user } = useAuth();

const payments = ref<any[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const fetchHistory = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const token = await $auth.currentUser?.getIdToken();
    if (!token) throw new Error("Sesi berakhir, silakan login kembali.");

    // Mengambil data pembayaran user
    const response: any = await $fetch(`${config.public.API_URL}/payments/user/${user.value?.uid}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const rawData = Array.isArray(response) ? response : (response.data || []);
    
    // Transformasi dan Sorting data
    payments.value = rawData
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((p: any) => ({
        ...p,
        batchName: p.participant?.batch?.namaBatch || 'Tes TOAFL',
        invoiceNumber: p.invoiceNumber || p.externalId || (p.id ? p.id.substring(0,8).toUpperCase() : 'INV-???'),
        amount: parseFloat(p.amount) || 0
      }));

  } catch (err: any) {
    console.error("Fetch history error:", err);
    error.value = "Gagal memuat riwayat pembayaran. Silakan periksa koneksi internet Anda.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (user.value) {
    fetchHistory();
  } else {
    const unwatch = watch(user, (u) => {
      if (u) {
        fetchHistory();
        unwatch();
      }
    });
  }
});

// --- Helpers ---

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
};

const getStatusColor = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'paid' || s === 'settled' || s === 'lunas') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (s === 'pending' || s === 'waiting_payment' || s === 'unpaid') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (s === 'failed' || s === 'expired' || s === 'cancelled') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-slate-50 text-slate-600 border-slate-200';
};

const getStatusLabel = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'paid' || s === 'settled' || s === 'lunas') return 'Lunas';
  if (s === 'pending' || s === 'waiting_payment' || s === 'unpaid') return 'Menunggu';
  if (s === 'failed') return 'Gagal';
  if (s === 'expired') return 'Kadaluarsa';
  if (s === 'cancelled') return 'Dibatalkan';
  return status;
};

const getStatusIcon = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'paid' || s === 'settled' || s === 'lunas') return 'lucide:check-circle-2';
  if (s === 'pending' || s === 'waiting_payment' || s === 'unpaid') return 'lucide:clock';
  if (s === 'failed' || s === 'expired' || s === 'cancelled') return 'lucide:x-circle';
  return 'lucide:help-circle';
};
</script>