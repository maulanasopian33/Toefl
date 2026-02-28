<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      <div v-for="i in 3" :key="i" class="h-32 bg-gray-100 rounded-3xl border border-gray-100"></div>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Revenue Card -->
      <div class="bg-emerald-600 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden group">
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10 flex flex-col justify-between h-full">
          <div class="flex justify-between items-start">
            <div class="p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
              <Icon name="lucide:banknote" class="w-6 h-6" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-2 py-1 rounded-lg border border-white/30">Lunas</span>
          </div>
          <div class="mt-4">
            <h4 class="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Total Pendapatan</h4>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black tabular-nums">{{ formatCurrency(summary.totalRevenue) }}</span>
            </div>
            <p class="text-emerald-100/80 text-[10px] font-bold mt-2 flex items-center gap-1">
              <Icon name="lucide:check-circle" class="w-3 h-3" />
              {{ summary.paidCount }} Transaksi Berhasil
            </p>
          </div>
        </div>
      </div>

      <!-- Total Pending Card -->
      <div class="bg-amber-500 rounded-[2rem] p-6 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden group">
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10 flex flex-col justify-between h-full">
          <div class="flex justify-between items-start">
            <div class="p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
              <Icon name="lucide:clock" class="w-6 h-6" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-2 py-1 rounded-lg border border-white/30">Pending</span>
          </div>
          <div class="mt-4">
            <h4 class="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Menunggu Pembayaran</h4>
            <div class="text-3xl font-black tabular-nums">{{ formatCurrency(summary.totalPending) }}</div>
            <p class="text-amber-50/80 text-[10px] font-bold mt-2 flex items-center gap-1">
              <Icon name="lucide:alert-circle" class="w-3 h-3" />
              {{ summary.pendingCount }} Menunggu Konfirmasi
            </p>
          </div>
        </div>
      </div>

      <!-- Total Projection Card -->
      <div class="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10 flex flex-col justify-between h-full">
          <div class="flex justify-between items-start">
            <div class="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
              <Icon name="lucide:trending-up" class="w-6 h-6 text-slate-400" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-2 py-1 rounded-lg border border-white/10 text-slate-400">Proyeksi</span>
          </div>
          <div class="mt-4">
            <h4 class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Proyeksi (Lunas + Pending)</h4>
            <div class="text-3xl font-black tabular-nums">{{ formatCurrency(Number(summary.totalRevenue) + Number(summary.totalPending)) }}</div>
            <p class="text-slate-500 text-[10px] font-bold mt-2 flex items-center gap-1">
              <Icon name="lucide:info" class="w-3 h-3" />
              Estimasi Total Keseluruhan
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Visualizations could go here (Trend chart, etc.) -->
    <div v-if="!isLoading && trend.length > 0" class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
       <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-lg font-black text-gray-900 tracking-tight">Tren Pendapatan</h3>
            <p class="text-xs font-medium text-gray-400 mt-0.5">Statistik pendapatan harian</p>
          </div>
          <div class="flex gap-2">
            <!-- Time Range Selectors could go here -->
          </div>
       </div>

       <div class="flex items-end gap-3 h-48">
          <div v-for="(item, idx) in trend" :key="idx" 
               class="flex-1 bg-emerald-100/50 rounded-t-xl relative group"
               :style="{ height: `${(Number(item.amount) / maxTrendAmount) * 100}%` }">
             <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                {{ formatCurrency(item.amount) }}
             </div>
             <div class="absolute inset-0 bg-emerald-500 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
          </div>
       </div>
       <div class="flex mt-4 pt-4 border-t border-gray-50">
          <div v-for="(item, idx) in trend" :key="idx" class="flex-1 text-center text-[8px] font-heavy text-gray-400 uppercase tracking-tighter truncate px-0.5">
             {{ item.date }}
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useFinancialReport } from '@/composables/useFinancialReport';

const { summary, trend, isLoading, fetchReport } = useFinancialReport();

const maxTrendAmount = computed(() => {
  if (!trend.value.length) return 1;
  return Math.max(...trend.value.map(t => Number(t.amount)), 1);
});

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0);

onMounted(() => {
  fetchReport();
});
</script>
