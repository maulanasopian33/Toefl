<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-black text-gray-900 tracking-tight">Tagihan Per Batch</h3>
        <p class="text-sm font-medium text-gray-400 mt-1">Rekapitulasi pendapatan berdasarkan batch ujian</p>
      </div>
      <button 
        @click="fetchReport()" 
        class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
        title="Refresh Data"
      >
        <Icon name="lucide:refresh-cw" :class="['w-5 h-5', isLoading ? 'animate-spin' : '']" />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-16 bg-gray-50 rounded-2xl animate-pulse border border-gray-100"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!batchBreakdown.length" class="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
      <div class="p-4 bg-white rounded-3xl shadow-sm mb-4">
        <Icon name="lucide:folder-open" class="w-10 h-10 text-gray-300" />
      </div>
      <p class="text-gray-500 font-bold">Belum ada data batch tersedia</p>
      <p class="text-gray-400 text-xs mt-1">Data akan muncul setelah ada transaksi lunas</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50/50 border-b border-gray-50 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
            <th class="px-8 py-5">Nama Batch</th>
            <th class="px-8 py-5 text-center">Jumlah Transaksi</th>
            <th class="px-8 py-5 text-right">Total Pendapatan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="batch in batchBreakdown" :key="batch.batchName" class="hover:bg-gray-50/50 transition-colors group">
            <td class="px-8 py-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <Icon name="lucide:layers" class="w-5 h-5" />
                </div>
                <span class="font-black text-gray-800 tracking-tight">{{ batch.batchName }}</span>
              </div>
            </td>
            <td class="px-8 py-5 text-center">
              <span class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black border border-blue-100">
                {{ batch.transactionCount }} Transaksi
              </span>
            </td>
            <td class="px-8 py-5 text-right">
              <span class="text-lg font-black text-slate-900 tabular-nums">
                {{ formatCurrency(batch.revenue) }}
              </span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-gray-50/30 font-black">
            <td class="px-8 py-6 text-gray-400 uppercase text-[10px] tracking-widest">Total Keseluruhan</td>
            <td class="px-8 py-6 text-center text-gray-900">{{ totalTransactions }} Transaksi</td>
            <td class="px-8 py-6 text-right text-emerald-600 text-xl">{{ formatCurrency(totalRevenue) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useFinancialReport } from '@/composables/useFinancialReport';

const { batchBreakdown, isLoading, fetchReport } = useFinancialReport();

const totalTransactions = computed(() => 
  batchBreakdown.value.reduce((sum, b) => sum + Number(b.transactionCount), 0)
);

const totalRevenue = computed(() => 
  batchBreakdown.value.reduce((sum, b) => sum + Number(b.revenue), 0)
);

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
