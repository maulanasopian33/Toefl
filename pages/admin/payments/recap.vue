<template>
 <div class="space-y-8">
    <!-- HEADER -->
    <header
      class="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">
          Rekap Keuangan
        </h1>
        <p class="mt-1 text-sm text-slate-200/90">
          Analisis pendapatan dan daftar transaksi dalam rentang waktu tertentu.
        </p>
      </div>
      <button
        @click="refreshAll"
        class="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur hover:bg-white/15"
      >
        <Icon name="lucide:refresh-cw" class="h-4 w-4" />
        Segarkan Data
      </button>
    </header>
 
    <!-- FILTERS -->
    <section
      class="card rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm"
 >
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-semibold text-slate-900">
            Filter Data
          </h3>
          <p class="mt-1 text-xs text-slate-500">
            Sesuaikan periode dan status untuk mempersempit hasil transaksi.
          </p>
        </div>
        <!-- Quick range -->
        <div class="hidden items-center gap-2 text-[11px] text-slate-500 md:flex">
 <span class="uppercase tracking-wide">Rentang Cepat:</span>
          <button
            type="button"
            class="rounded-full border border-slate-200 px-2.5 py-1 hover:bg-slate-50"
            @click="setQuickRange('7d')"
          >
            7 hari terakhir
          </button>
          <button
            type="button"
            class="rounded-full border border-slate-200 px-2.5 py-1 hover:bg-slate-50"
            @click="setQuickRange('30d')"
          >
            30 hari terakhir
          </button>
          <button
            type="button"
            class="rounded-full border border-slate-200 px-2.5 py-1 hover:bg-slate-50"
            @click="setQuickRange('all')"
          >
            Semua waktu
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
 <!-- Start date -->
        <div>
          <label for="start-date" class="mb-1 text-xs font-medium text-slate-700">
            Tanggal Mulai
          </label>
          <div class="relative">
            <Icon
              name="lucide:calendar"
              class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="start-date"
              type="date"
              v-model="startDate"
              class="input w-full rounded-lg border-slate-200 pl-9"
            />
          </div>
        </div>

 <!-- End date -->
        <div>
          <label for="end-date" class="mb-1 text-xs font-medium text-slate-700">
            Tanggal Selesai
          </label>
          <div class="relative">
            <Icon
              name="lucide:calendar-clock"
              class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="end-date"
              type="date"
              v-model="endDate"
              class="input w-full rounded-lg border-slate-200 pl-9"
            />
          </div>
        </div>

 <!-- Status -->
        <div>
          <label for="status-filter" class="mb-1 text-xs font-medium text-slate-700">
            Status Transaksi
          </label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="input w-full rounded-lg border-slate-200 bg-slate-50/60 text-sm text-slate-800 focus:bg-white"
          >
            <option value="">Semua Status</option>
            <option value="paid">Lunas (Paid)</option>
            <option value="pending">Pending</option>
            <option value="failed">Gagal (Failed)</option>
            <option value="refunded">Dikembalikan (Refunded)</option>
          </select>
        </div>
         <!-- Batch Filter -->
        <div>
          <label for="batch-filter" class="mb-1 text-xs font-medium text-slate-700">Batch</label>
          <select id="batch-filter" v-model="selectedBatch" class="input w-full">
            <option value="">Semua Batch</option>
            <option v-for="batch in batches" :key="batch.id" :value="batch.id">
              {{ batch.namaBatch }}
            </option>
          </select>
        </div>



      </div>
    </section>

    <!-- STATS CARDS -->
    <section>
      <!-- Loading skeleton -->
      <div
 v-if="statsLoading"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="h-24 rounded-2xl bg-slate-100/80 animate-pulse"
        ></div>
      </div>

      <!-- Error -->
 <div
        v-else-if="statsError"
        class="card rounded-2xl border border-rose-100 bg-rose-50/80 p-6 text-center text-sm text-rose-700"
      >
        Gagal memuat data statistik.
      </div>

 <!-- Stats content -->
      <div
        v-else
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div
          class="card flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
 <div>
            <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Total Pendapatan
            </p>
            <p class="mt-1 text-lg font-semibold text-slate-900">
              {{ formatCurrency(stats.totalRevenue) }}
            </p>
            <p class="mt-0.5 text-[11px] text-slate-500">
              Semua transaksi sukses dalam periode
            </p>
 </div>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500"
          >
            <Icon name="lucide:wallet" class="h-5 w-5" />
          </div>
        </div>

        <div
          class="card flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
 >
          <div>
            <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Sudah Lunas
            </p>
            <p class="mt-1 text-lg font-semibold text-emerald-600">
              {{ formatCurrency(stats.totalAmount) }}
            </p>
            <p class="mt-0.5 text-[11px] text-emerald-700/80">
              {{ paidShareLabel }}
            </p>
 </div>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500"
          >
            <Icon name="lucide:check-circle-2" class="h-5 w-5" />
          </div>
        </div>

        <div
          class="card flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
 >
          <div>
            <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Pending
            </p>
            <p class="mt-1 text-lg font-semibold text-amber-600">
              {{ formatCurrency(stats.totalPending) }}
            </p>
            <p class="mt-0.5 text-[11px] text-amber-700/80">
              Menunggu konfirmasi / pembayaran
            </p>
 </div>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500"
          >
            <Icon name="lucide:clock" class="h-5 w-5" />
          </div>
        </div>

        <div
          class="card flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
 >
          <div>
            <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Gagal / Refund
            </p>
            <p class="mt-1 text-lg font-semibold text-rose-600">
              {{ formatCurrency(stats.totalFailed + stats.totalRefunded) }}
            </p>
            <p class="mt-0.5 text-[11px] text-rose-700/80">
              Perlu peninjauan & follow-up
            </p>
 </div>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500"
          >
            <Icon name="lucide:x-circle" class="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>

 <!-- GRAFIK (REKOMENDASI UTAMA) -->
    <section
      v-if="!statsLoading && !statsError"
      class="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]"
    >
      <!-- Tren pendapatan -->
      <div class="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">
              Tren Pendapatan
            </h3>
            <p class="mt-1 text-xs text-slate-500">
              Pergerakan pendapatan per hari dalam periode yang dipilih.
            </p>
          </div>
        </div>
        <RevenueTrendChart
          :categories="trendDates"
          :data="trendValues"
        />
      </div>

      <!-- Donut status -->
      <div class="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">
              Distribusi Status
            </h3>
            <p class="mt-1 text-xs text-slate-500">
              Komposisi nilai transaksi berdasarkan status.
            </p>
          </div>
        </div>
        <RevenueStatusDonut
          :paid="stats.totalPaid || 0"
          :pending="stats.totalPending || 0"
          :failed="(stats.totalFailed || 0) + (stats.totalRefunded || 0)"
        />
      </div>
    </section>

 <!-- TRANSACTIONS TABLE -->
    <section class="card rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 class="text-sm font-semibold text-slate-900">
            Daftar Transaksi
          </h2>
          <p class="mt-1 text-xs text-slate-500">
            Menampilkan transaksi yang sesuai dengan filter di atas.
          </p>
        </div>
        <!-- contoh tombol export (wire ke backend nanti) -->
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          <Icon name="lucide:download" class="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <!-- Loading State -->
      <div
        v-if="paymentsLoading"
        class="flex flex-col items-center justify-center py-16 text-sm text-slate-500"
      >
        <Icon
          name="lucide:loader-2"
          class="mb-3 h-10 w-10 animate-spin text-slate-400"
        />
        <span class="font-medium">Memuat transaksi...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="paymentsError"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <Icon
          name="lucide:server-crash"
          class="mb-3 h-12 w-12 text-rose-400"
        />
        <h4 class="text-lg font-semibold text-slate-900">
          Gagal Memuat Transaksi
        </h4>
        <p class="mt-1 text-sm text-slate-500">
          Silakan coba ubah filter atau segarkan halaman.
        </p>
      </div>

      <!-- No Data State -->
      <div
        v-else-if="payments.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <Icon
          name="lucide:search-x"
          class="mb-3 h-12 w-12 text-slate-300"
        />
        <h4 class="text-lg font-semibold text-slate-900">
          Tidak Ada Transaksi
        </h4>
        <p class="mt-1 text-sm text-slate-500">
          Tidak ada transaksi yang cocok dengan kriteria filter Anda.
        </p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto px-5 py-4">
        <PaymentsTable :payments="payments" />
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-600 sm:flex-row sm:text-sm"
      >
        <div class="flex items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1 || paymentsLoading"
            class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="lucide:chevron-left" class="h-4 w-4" />
            Sebelumnya
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages || paymentsLoading"
            class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Berikutnya
            <Icon name="lucide:chevron-right" class="h-4 w-4" />
          </button>
        </div>
        <span>
          Halaman
          <span class="font-semibold text-slate-900">{{ currentPage }}</span>
          dari
          <span class="font-semibold text-slate-900">{{ totalPages }}</span>
          • Total
          <span class="font-semibold text-slate-900">{{ totalItems }}</span>
          transaksi
        </span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useFinancialRecap } from '@/composables/useFinancialRecap';
import PaymentsTable from '@/components/payments/PaymentsTable.vue';
import RevenueTrendChart from '@/components/analytics/RevenueTrendChart.vue';
import { ref, computed, onMounted } from 'vue';
import RevenueStatusDonut from '@/components/analytics/RevenueStatusDonut.vue';

definePageMeta({
  title: 'Financial Recap - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  roles: ['admin'],
});


const {
  stats,
  statsLoading,
  statsError,
  payments,
  paymentsLoading,
  paymentsError,
  currentPage,
  batches,
  totalItems,
  totalPages,
  startDate,
  endDate,
  statusFilter,
  refreshAll,
} = useFinancialRecap();

// dummy data tren (nanti bisa diganti dari API)
const trendData = ref({
  trendDates: [],
  trendValues: [],
});

// Computed properties untuk grafik
const trendDates = computed(() => trendData.value.trendDates);
const trendValues = computed(() => trendData.value.trendValues);

const paidShareLabel = computed(() => {
  if (!stats?.totalRevenue || stats.totalRevenue === 0) return 'Belum ada data terverifikasi'; // Ensure stats is not null
  const ratio = (stats.totalPaid / stats.totalRevenue) * 100; // Corrected to totalPaid
  return `${ratio.toFixed(1)}% dari total pendapatan`;
});
const processPaymentsForChart = () => {
  const dailyRevenue = {};
  payments.value.forEach((payment) => {
    const date = payment.date.split('T')[0]; // Ambil hanya bagian tanggal
    dailyRevenue[date] = (dailyRevenue[date] || 0) + payment.amount;
  });
  trendData.value.trendDates = Object.keys(dailyRevenue);
  trendData.value.trendValues = Object.values(dailyRevenue);
};
watch(payments, () => {
  processPaymentsForChart();
});

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0);

// Quick range helper
const setQuickRange = (type) => {
  const today = new Date();
  const toISO = (d) => d.toISOString().slice(0, 10);

  if (type === '7d') {
    const start = new Date();
    start.setDate(today.getDate() - 6);
    startDate.value = toISO(start);
    endDate.value = toISO(today);
  } else if (type === '30d') {
    const start = new Date();
    start.setDate(today.getDate() - 29);
    startDate.value = toISO(start);
    endDate.value = toISO(today);
  } else if (type === 'all') {
    startDate.value = '';
    endDate.value = '';
  }
};

</script>