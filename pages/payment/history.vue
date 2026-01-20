<template>
  <div class="min-h-screen bg-gray-50/50 flex flex-col relative overflow-hidden font-sans">
    <!-- Decorative Elements -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full opacity-50 blur-3xl -z-10"></div>
    <div class="absolute top-1/2 -left-24 w-64 h-64 bg-emerald-50 rounded-full opacity-40 blur-3xl -z-10"></div>

    <main class="flex-grow container mx-auto px-4 py-8 md:px-6 lg:py-12 relative z-10 pb-24 lg:pb-12">
      <div class="mx-auto max-w-5xl space-y-8">
        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="space-y-2">
            <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Riwayat <span class="text-emerald-600">Pembayaran</span></h1>
            <p class="text-sm text-gray-500 font-medium">Pantau status dan riwayat transaksi ujian Anda.</p>
          </div>
          
          <button @click="fetchHistory" class="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-all shadow-xl shadow-gray-200/50 group">
            <Icon name="heroicons:arrow-path" :class="{'animate-spin text-emerald-500': isLoading}" class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Muat Ulang
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <Icon name="svg-spinners:ring-resize" class="h-16 w-16 text-emerald-500" />
          <p class="mt-6 text-gray-400 font-bold animate-pulse">Memuat data transaksi...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-16 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center px-4 space-y-6">
          <div class="p-5 bg-rose-50 rounded-3xl border border-rose-100 text-rose-500">
            <Icon name="heroicons:exclamation-circle" class="h-12 w-12" />
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold text-gray-900">Gagal Memuat Data</h3>
            <p class="text-gray-400 font-medium max-w-sm">{{ error }}</p>
          </div>
          <button @click="fetchHistory" class="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white hover:bg-black transition-all shadow-xl shadow-gray-900/20 active:scale-95">
            Coba Lagi
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="payments.length === 0" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center px-8 space-y-8">
          <div class="p-8 bg-gray-50 rounded-full text-gray-200 relative">
            <Icon name="heroicons:receipt-percent" class="h-20 w-20" />
            <div class="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-md">
              <Icon name="heroicons:question-mark-circle" class="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <div class="space-y-3">
            <h3 class="text-xl font-extrabold text-gray-900">Belum Ada Transaksi</h3>
            <p class="text-gray-400 font-medium max-w-md mx-auto leading-relaxed text-sm">
              Anda belum memiliki riwayat pembayaran. Silakan mendaftar pada batch ujian yang tersedia untuk memulai.
            </p>
          </div>
          <NuxtLink to="/" class="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95">
            <Icon name="heroicons:sparkles" class="w-5 h-5" />
            Lihat Jadwal Ujian
          </NuxtLink>
        </div>

        <!-- Payment List -->
        <div v-else class="space-y-4">
          <!-- Desktop Header -->
          <div class="hidden md:grid grid-cols-12 gap-8 px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            <div class="col-span-5">Invoice & Nominal</div>
            <div class="col-span-3">Keterangan</div>
            <div class="col-span-2">Tanggal</div>
            <div class="col-span-2">Status</div>
          </div>

          <!-- Payment Items -->
          <div v-for="payment in payments" :key="payment.id" 
               class="group relative bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-emerald-200/20 transition-all duration-500 overflow-hidden">
            
            <NuxtLink :to="`/payment/${payment.id}`" class="block w-full text-left">
              <!-- Mobile Layout -->
              <div class="md:hidden p-6 space-y-6">
                <div class="flex justify-between items-start">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                            {{ payment.method === 'manual' ? 'Manual' : 'Transfer' }}
                        </span>
                        <span class="text-[10px] font-mono font-bold text-gray-300 tracking-tighter">#{{ payment.invoiceNumber }}</span>
                    </div>
                    <h3 class="text-xl font-extrabold text-gray-900 tracking-tight">{{ formatCurrency(payment.amount) }}</h3>
                  </div>
                  <div :class="getStatusColor(payment.status)" class="px-3 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-widest flex items-center gap-1.5">
                     <Icon :name="getStatusIcon(payment.status)" class="w-3.5 h-3.5" />
                     {{ getStatusLabel(payment.status) }}
                  </div>
                </div>
                
                <div class="space-y-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors">
                  <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm border border-gray-50 text-emerald-500">
                        <Icon name="heroicons:academic-cap" class="w-5 h-5" />
                    </div>
                    <div>
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5 text-[9px]">Sesi Ujian</p>
                        <p class="text-sm font-bold text-gray-700 leading-tight">{{ payment.batchName }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 border-t border-gray-100 pt-3">
                     <div class="flex items-center gap-2 text-gray-400">
                       <Icon name="heroicons:calendar" class="w-4 h-4" />
                       <span class="text-xs font-bold">{{ formatDate(payment.createdAt) }}</span>
                     </div>
                     <span class="text-gray-200">•</span>
                     <div class="flex items-center gap-2 text-gray-400">
                       <Icon name="heroicons:clock" class="w-4 h-4" />
                       <span class="text-xs font-bold">{{ formatTime(payment.createdAt) }}</span>
                     </div>
                  </div>
                </div>
              </div>

              <!-- Desktop Layout -->
              <div class="hidden md:grid grid-cols-12 gap-8 items-center p-8">
                <!-- Invoice & Amount -->
                <div class="col-span-5">
                  <div class="flex items-center gap-6">
                    <div class="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Icon name="heroicons:receipt-percent" class="h-7 w-7" />
                    </div>
                    <div class="space-y-1">
                      <p class="text-lg font-extrabold text-gray-900 group-hover:text-emerald-600 transition-colors tracking-tight">{{ formatCurrency(payment.amount) }}</p>
                      <p class="text-[10px] font-mono font-bold text-gray-400 flex items-center gap-1.5 uppercase">
                        Invoice ID {{ payment.invoiceNumber }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div class="col-span-3">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama Batch</p>
                  <p class="text-sm font-bold text-gray-700 line-clamp-1 leading-tight">{{ payment.batchName }}</p>
                </div>

                <!-- Date -->
                <div class="col-span-2 space-y-1">
                  <p class="text-sm font-bold text-gray-700 tracking-tight">{{ formatDate(payment.createdAt) }}</p>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ formatTime(payment.createdAt) }} WIB</p>
                </div>

                <!-- Status -->
                <div class="col-span-2">
                   <div :class="getStatusColor(payment.status)" class="inline-flex px-4 py-2 rounded-full text-[10px] font-bold border uppercase tracking-widest items-center gap-2 group-hover:scale-105 transition-transform">
                     <Icon :name="getStatusIcon(payment.status)" class="w-3.5 h-3.5" />
                     {{ getStatusLabel(payment.status) }}
                  </div>
                </div>
              </div>
            </NuxtLink>
            
            <!-- Side Accent -->
            <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
        
        <!-- Footer Note -->
        <div v-if="payments.length > 0" class="pt-8 border-t border-gray-50 text-center">
          <p class="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] max-w-lg mx-auto leading-relaxed">
            Menampilkan {{ payments.length }} transaksi terakhir. Jika ada kendala, hubungi <a href="#" class="text-emerald-500 hover:text-emerald-600 transition-colors">Pusat Bantuan</a> Kami.
          </p>
        </div>
      </div>
    </main>
    <BottomNav class="z-50" />
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