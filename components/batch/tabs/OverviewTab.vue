<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <!-- LEFT COLUMN (Main Content) -->
    <div class="xl:col-span-2 space-y-6">
      <!-- CARD: Informasi Batch -->
      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Icon name="lucide:info" class="w-4 h-4" />
            </div>
            <h3 class="font-semibold text-slate-800">Informasi Batch</h3>
          </div>
          <span :class="statusBadgeClass" class="px-2.5 py-1 rounded-full text-xs font-medium border uppercase tracking-wide">
            {{ batch.status }}
          </span>
        </div>

        <div class="p-6 space-y-6">
          <div>
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">Nama Batch</label>
            <p class="text-lg font-bold text-slate-900">{{ batch.name }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Status -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Icon name="lucide:activity" class="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p class="text-xs font-medium text-slate-500">Status</p>
                <p class="font-semibold text-slate-700 capitalize">{{ batch.status }}</p>
              </div>
            </div>

            <!-- Periode -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Icon name="lucide:calendar" class="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p class="text-xs font-medium text-slate-500">Periode</p>
                <p class="font-semibold text-slate-700 text-sm">{{ batch.startDate }} - {{ batch.endDate }}</p>
              </div>
            </div>

            <!-- Peserta -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Icon name="lucide:users" class="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p class="text-xs font-medium text-slate-500">Total Peserta</p>
                <p class="font-semibold text-slate-700">{{ batch.participants?.length || 0 }} Orang</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CARD ROW: Keuangan & Struktur -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Keuangan -->
        <section class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <div class="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Icon name="lucide:wallet" class="w-4 h-4" />
            </div>
            <h3 class="font-semibold text-slate-800">Keuangan</h3>
          </div>
          <div class="p-6 flex-1 flex flex-col justify-center gap-6">
            <div>
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm text-slate-500">Total Pemasukan</p>
                <div v-if="batch.paymentsPending > 0" class="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  <Icon name="lucide:hourglass" class="w-3 h-3" />
                  <span>{{ formatCurrency(batch.paymentsPending) }}</span>
                </div>
              </div>
              <p class="text-2xl font-bold text-slate-900">{{ formatCurrency(batch.paymentsTotal || 0) }}</p>
            </div>
            
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-slate-600">Peserta Lunas</span>
                <span class="font-medium text-slate-900">{{ batch.paymentsUserPaid || 0 }} / {{ batch.participants?.length || 0 }}</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div class="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" :style="{ width: `${paymentPercentage}%` }"></div>
              </div>
              <p v-if="batch.paymentsUserPending > 0" class="mt-2 text-xs text-amber-600 flex items-center gap-1.5">
                <Icon name="lucide:alert-circle" class="w-3.5 h-3.5" />
                <span>{{ batch.paymentsUserPending }} peserta menunggu pembayaran</span>
              </p>
            </div>
          </div>
        </section>

        <!-- Struktur -->
        <section class="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <div class="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Icon name="lucide:layers" class="w-4 h-4" />
            </div>
            <h3 class="font-semibold text-slate-800">Struktur Ujian</h3>
          </div>
          <div class="p-6 flex-1 space-y-4">
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Icon name="lucide:layout-list" class="w-4 h-4" />
                </div>
                <span class="text-sm font-medium text-slate-700">Section</span>
              </div>
              <span class="font-bold text-slate-900">{{ batch.sections?.length || 0 }}</span>
            </div>

            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <Icon name="lucide:folder-open" class="w-4 h-4" />
                </div>
                <span class="text-sm font-medium text-slate-700">Group Soal</span>
              </div>
              <span class="font-bold text-slate-900">{{ groupCount }}</span>
            </div>

            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Icon name="lucide:file-question" class="w-4 h-4" />
                </div>
                <span class="text-sm font-medium text-slate-700">Total Soal</span>
              </div>
              <span class="font-bold text-slate-900">{{ totalQuestionsCount }}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- CARD: Aktivitas Terbaru -->
      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Icon name="lucide:history" class="w-4 h-4" />
            </div>
            <h3 class="font-semibold text-slate-800">Aktivitas Terbaru</h3>
          </div>
          <span class="text-xs text-slate-400">{{ batch.recentActivities?.length || 0 }} log</span>
        </div>
        <div class="p-6">
          <div v-if="batch.recentActivities?.length" class="relative pl-4 border-l border-slate-200 space-y-6">
            <div v-for="(activity, i) in batch.recentActivities" :key="i" class="relative">
              <div class="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white" :class="i === 0 ? 'bg-blue-500 ring-2 ring-blue-100' : 'bg-slate-300'"></div>
              <p class="text-sm text-slate-600" :class="{ 'font-medium text-slate-900': i === 0 }">{{ activity }}</p>
            </div>
          </div>
          <div v-else class="text-center py-8 text-slate-400 text-sm italic">
            Belum ada aktivitas tercatat.
          </div>
        </div>
      </section>
    </div>

    <!-- RIGHT COLUMN (Actions & Charts) -->
    <div class="space-y-6">
      <!-- Aksi Cepat -->
      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <div class="p-2 bg-rose-50 rounded-lg text-rose-600">
            <Icon name="lucide:zap" class="w-4 h-4" />
          </div>
          <h3 class="font-semibold text-slate-800">Aksi Cepat</h3>
        </div>

        <div class="p-4 grid grid-cols-1 gap-3">
          <button class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group text-left">
            <div class="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors">
              <Icon name="lucide:plus" class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Tambah Soal</p>
              <p class="text-xs text-slate-500">Buat pertanyaan baru</p>
            </div>
          </button>

          <button @click="$emit('requestAddParticipant')" class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group text-left">
            <div class="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors">
              <Icon name="lucide:user-plus" class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Tambah Peserta</p>
              <p class="text-xs text-slate-500">Undang siswa baru</p>
            </div>
          </button>

          <button class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group text-left">
            <div class="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors">
              <Icon name="lucide:settings-2" class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Pengaturan</p>
              <p class="text-xs text-slate-500">Konfigurasi batch</p>
            </div>
          </button>
        </div>
      </section>

      <!-- CARD: Chart Pembayaran -->
      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <div class="p-2 bg-purple-50 rounded-lg text-purple-600">
            <Icon name="lucide:pie-chart" class="w-4 h-4" />
          </div>
          <h3 class="font-semibold text-slate-800">Status Pembayaran</h3>
        </div>
        <div class="p-6">
          <PaymentStatusChart :participants="batch.participants" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import PaymentStatusChart from '@/components/batch/charts/PaymentStatusChart.vue';

const props = defineProps({
  batch: {
    type: Object,
    required: true,
  },
});

const statusBadgeClass = computed(() => {
  const s = props.batch?.status?.toLowerCase();
  switch (s) {
    case 'open':
    case 'upcoming':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'closed':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'full':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'ongoing':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
});

const paymentPercentage = computed(() => {
  const total = props.batch.participants?.length || 0;
  if (!total) return 0;
  return Math.round(((props.batch.paymentsUserPaid || 0) / total) * 100);
});

const groupCount = computed(() => {
  return props.batch.sections?.reduce((total, section) => total + (section.groups?.length || 0), 0) || 0;
});

const totalQuestionsCount = computed(() => {
  return props.batch.sections?.reduce((total, section) => {
    return total + (section.groups?.reduce((groupTotal, group) => groupTotal + (group.questionsCount || 0), 0) || 0);
  }, 0) || 0;
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};
</script>
