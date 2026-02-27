<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- HEADER -->
    <header class="flex flex-col gap-4 rounded-[2.5rem] bg-white px-10 py-8 border border-gray-100 shadow-xl ring-1 ring-gray-900/5 sm:flex-row sm:items-center sm:justify-between transition-all hover:shadow-2xl">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          <div class="p-3 bg-emerald-100 rounded-[1.25rem] text-emerald-600">
            <Icon name="lucide:bar-chart-3" class="w-8 h-8" />
          </div>
          Laporan Keuangan
        </h1>
        <p class="mt-2 text-sm text-gray-500 font-medium">
          Pantau pendapatan, transaksi, dan performa keuangan program.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3 no-print">
        <!-- Date Filters -->
        <div class="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100 shadow-sm">
           <input 
            v-model="filters.startDate" 
            type="date" 
            class="bg-transparent border-none text-xs font-bold text-gray-600 focus:ring-0 px-3 cursor-pointer"
           />
           <span class="text-gray-300 font-black px-1">/</span>
           <input 
            v-model="filters.endDate" 
            type="date" 
            class="bg-transparent border-none text-xs font-bold text-gray-600 focus:ring-0 px-3 cursor-pointer"
           />
        </div>
        
        <button
          @click="fetchReport(filters)"
          class="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-6 py-3.5 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all transform active:scale-95 whitespace-nowrap"
        >
          <Icon name="lucide:refresh-cw" class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
          Update
        </button>

        <button
          @click="exportCSV(filters)"
          class="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all transform active:scale-95 whitespace-nowrap"
        >
          <Icon name="lucide:file-spreadsheet" class="w-5 h-5" />
          CSV
        </button>

        <button
          @click="handlePrint()"
          class="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all transform active:scale-95 whitespace-nowrap"
        >
          <Icon name="lucide:printer" class="w-5 h-5" />
          Cetak
        </button>
      </div>
    </header>

    <!-- SUMMARY CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Revenue -->
      <div class="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div class="relative">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Pendapatan</p>
          <h3 class="text-3xl font-black text-gray-900 mb-2 truncate">
            {{ formatCurrency(summary.totalRevenue) }}
          </h3>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-full">{{ summary.paidCount }} Transaksi</span>
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">Lunas</span>
          </div>
        </div>
      </div>

      <!-- Total Pending -->
      <div class="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div class="relative">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Dalam Peninjauan</p>
          <h3 class="text-3xl font-black text-gray-900 mb-2 truncate">
            {{ formatCurrency(summary.totalPending) }}
          </h3>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] font-black rounded-full">{{ summary.pendingCount }} Transaksi</span>
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">Pending</span>
          </div>
        </div>
      </div>

       <!-- Total Loss -->
      <div class="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div class="relative">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Gagal / Refund</p>
          <h3 class="text-3xl font-black text-gray-900 mb-2 truncate">
            {{ formatCurrency(summary.totalLoss) }}
          </h3>
          <div class="flex items-center gap-2 text-rose-500 font-bold text-[10px]">
            <Icon name="lucide:alert-circle" class="w-3.5 h-3.5" />
            Tidak Masuk Kas
          </div>
        </div>
      </div>

      <!-- Quick Action Card -->
      <div class="bg-indigo-600 rounded-[2.5rem] p-8 shadow-lg shadow-indigo-600/30 flex flex-col justify-between items-start text-white relative overflow-hidden group">
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
        <div class="relative z-10 w-full">
          <div class="p-3 bg-white/20 rounded-2xl inline-block mb-6">
            <Icon name="lucide:download" class="w-6 h-6" />
          </div>
          <p class="text-xs font-bold text-indigo-100 mb-1">Butuh data lengkap?</p>
          <h4 class="text-lg font-black leading-tight mb-4">Unduh Laporan Excel</h4>
          <button @click="exportCSV(filters)" class="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-colors shadow-sm">
             Download CSV
          </button>
        </div>
      </div>
    </div>

    <!-- CHARTS SECTION -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Trend Area Chart -->
      <div class="lg:col-span-8 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl overflow-hidden group">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h4 class="text-lg font-black text-gray-900">Trend Pendapatan</h4>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Pendapatan Lunas Harian</p>
          </div>
          <div class="flex gap-2">
            <div class="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
              <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span class="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Live Data</span>
            </div>
          </div>
        </div>
        
        <RevenueTrendChart 
          v-if="trend.length > 0"
          :categories="trend.map(t => t.date)"
          :data="trend.map(t => parseFloat(t.amount as string))"
        />
        <div v-else class="h-[260px] flex items-center justify-center text-gray-300 font-bold text-sm bg-slate-50 rounded-3xl border border-dashed border-gray-200">
           Tidak ada data trend untuk periode ini
        </div>
      </div>

      <!-- Status Donut Chart -->
      <div class="lg:col-span-4 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl overflow-hidden">
        <h4 class="text-lg font-black text-gray-900 mb-2">Proporsi Status</h4>
        <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">Perbandingan Lunas vs Lainnya</p>
        
        <div class="flex flex-col h-full justify-between">
          <RevenueStatusDonut 
            :paid="parseFloat(summary.totalRevenue as string)"
            :pending="parseFloat(summary.totalPending as string)"
            :failed="parseFloat(summary.totalLoss as string)"
          />

          <div class="mt-8 space-y-3">
             <div class="flex items-center justify-between px-4 py-3 bg-emerald-50 rounded-2xl border border-emerald-100/50">
               <span class="text-xs font-black text-emerald-700">LUNAS</span>
               <span class="text-xs font-black text-emerald-900">{{ Math.round((parseFloat(summary.totalRevenue as string) / (parseFloat(summary.totalRevenue as string) + parseFloat(summary.totalPending as string) + 0.1)) * 100) }}%</span>
             </div>
             <div class="flex items-center justify-between px-4 py-3 bg-amber-50 rounded-2xl border border-amber-100/50">
               <span class="text-xs font-black text-amber-700">PENDING</span>
               <span class="text-xs font-black text-amber-900">{{ Math.round((parseFloat(summary.totalPending as string) / (parseFloat(summary.totalRevenue as string) + parseFloat(summary.totalPending as string) + 0.1)) * 100) }}%</span>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLES SECTION -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Batch Breakdown Table -->
      <div class="lg:col-span-12 bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
        <div class="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
           <div>
             <h4 class="text-xl font-black text-gray-900">Breakdown per Batch</h4>
             <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Performa keuangan berdasarkan kelompok ujian</p>
           </div>
           <Icon name="lucide:layers" class="w-8 h-8 text-gray-100" />
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50/50">
                <th class="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Batch</th>
                <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Transaksi</th>
                <th class="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Pendapatan Bruto</th>
                <th class="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="item in batchBreakdown" :key="item.batchName" class="hover:bg-indigo-50/20 transition-colors group">
                <td class="px-10 py-6 font-black text-gray-700">{{ item.batchName }}</td>
                <td class="px-6 py-6 text-center font-bold text-gray-500">{{ item.transactionCount }}</td>
                <td class="px-6 py-6 text-right font-black text-gray-900">{{ formatCurrency(item.revenue) }}</td>
                <td class="px-10 py-6 text-right">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                     Terverifikasi
                  </div>
                </td>
              </tr>
              <tr v-if="batchBreakdown.length === 0">
                <td colspan="4" class="px-10 py-12 text-center text-gray-400 font-medium italic">Belum ada data batch untuk ditampilkan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

       <!-- Method Breakdown -->
       <div class="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="method in methodBreakdown" :key="method.method" class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all border-l-4" :class="getMethodBorder(method.method)">
             <div class="flex justify-between items-start mb-4">
                <div class="p-2.5 bg-gray-50 rounded-xl text-gray-500 font-black text-[10px] uppercase tracking-widest">
                   {{ method.method }}
                </div>
                <Icon :name="getMethodIcon(method.method)" class="w-5 h-5 text-gray-300" />
             </div>
             <p class="text-2xl font-black text-gray-900 mb-1">{{ formatCurrency(method.revenue) }}</p>
             <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{{ method.count }} Transaksi Berhasil</p>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useFinancialReport } from '@/composables/useFinancialReport'
import RevenueTrendChart from '@/components/analytics/RevenueTrendChart.vue'
import RevenueStatusDonut from '@/components/analytics/RevenueStatusDonut.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
})

const { isLoading, summary, trend, batchBreakdown, methodBreakdown, fetchReport, exportCSV } = useFinancialReport()

const handlePrint = () => {
  if (process.client) {
    window.print()
  }
}

// Default filters: Current month
const now = new Date()
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

const filters = reactive({
  startDate: firstDay,
  endDate: lastDay,
  batchId: ''
})

const formatCurrency = (val: number | string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(val) || 0)
}

const getMethodIcon = (method: string) => {
  method = method.toLowerCase()
  if (method.includes('bank') || method.includes('transfer')) return 'lucide:building-2'
  if (method.includes('qris')) return 'lucide:qr-code'
  if (method.includes('manual')) return 'lucide:user-check'
  return 'lucide:credit-card'
}

const getMethodBorder = (method: string) => {
  method = method.toLowerCase()
  if (method.includes('bank')) return 'border-l-blue-500'
  if (method.includes('qris')) return 'border-l-indigo-500'
  if (method.includes('manual')) return 'border-l-emerald-500'
  return 'border-l-slate-400'
}

onMounted(() => {
  fetchReport(filters)
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}
@media print {
  .no-print, header .flex-wrap, .group button {
    display: none !important;
  }
  .animate-fade-in-up {
    animation: none !important;
  }
  .bg-white {
    box-shadow: none !important;
    border: none !important;
  }
  .grid {
    display: block !important;
  }
  div[class*="lg:col-span-"] {
    width: 100% !important;
    margin-bottom: 2rem !important;
  }
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
