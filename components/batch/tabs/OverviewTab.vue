<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- KOLUMEN KIRI (konten utama) -->
    <div class="col-span-2 space-y-5">
      <!-- CARD: Informasi Batch -->
      <section class="card">
        <div class="card-section-header">
          <div class="flex items-center gap-2">
            <Icon name="lucide:clipboard-list" class="w-4 h-4 text-teal-500" />
            <span class="section-title">Informasi Batch</span>
          </div>
          <span
            :class="statusClass"
            class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold border border-black/5"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-current" />
            {{ batch.status }}
          </span>
        </div>

        <div class="px-5 pb-4 pt-1 space-y-4">
          <!-- Nama Batch -->
          <div>
            <p class="text-base md:text-lg font-semibold text-gray-900 leading-snug">
              {{ batch.name }}
            </p>
          </div>

          <!-- Strip Status / Periode / Peserta -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="stat-item">
              <div class="stat-icon bg-emerald-50 ring-emerald-100">
                <Icon name="lucide:check-circle-2" class="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <p class="metric-label">Status</p>
                <p class="metric-value capitalize">{{ batch.status }}</p>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon bg-sky-50 ring-sky-100">
                <Icon name="lucide:calendar-days" class="w-4 h-4 text-sky-700" />
              </div>
              <div>
                <p class="metric-label">Periode</p>
                <p class="metric-value text-xs">
                  {{ batch.startDate }} – {{ batch.endDate }}
                </p>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon bg-indigo-50 ring-indigo-100">
                <Icon name="lucide:users" class="w-4 h-4 text-indigo-700" />
              </div>
              <div>
                <p class="metric-label">Peserta</p>
                <p class="metric-value">
                  {{ batch.participants.length }} Peserta
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CARD: Aktivitas Terbaru -->
      <section class="card">
        <div class="card-section-header">
          <div class="flex items-center gap-2">
            <Icon name="lucide:history" class="w-4 h-4 text-gray-400" />
            <span class="section-title">Aktivitas Terbaru</span>
          </div>
          <span class="text-[11px] text-gray-400">
            {{ batch.recentActivities?.length || 0 }} log
          </span>
        </div>

        <div class="px-5 pb-4 pt-2 relative">
          <!-- Vertical line timeline -->
          <div
            class="absolute left-7 top-5 bottom-6 w-px bg-gradient-to-b from-teal-200 via-gray-200 to-transparent"
          />

          <template v-if="batch.recentActivities && batch.recentActivities.length">
            <ul class="space-y-3">
              <li
                v-for="(activity, i) in batch.recentActivities"
                :key="i"
                class="flex items-start pl-8 relative"
              >
                <div class="timeline-dot">
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="i === 0 ? 'bg-teal-500' : 'bg-gray-300'"
                  />
                </div>
                <p
                  class="text-xs text-gray-700"
                  :class="i === 0 ? 'font-medium text-gray-900' : ''"
                >
                  {{ activity }}
                </p>
              </li>
            </ul>
          </template>

          <template v-else>
            <div class="pl-8 py-3 text-xs text-gray-400 italic">
              Belum ada aktivitas tercatat.
            </div>
          </template>
        </div>
      </section>

      <!-- CARD ROW: Keuangan & Struktur -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- CARD: Ringkasan Keuangan -->
        <section class="card">
          <div class="card-section-header">
            <div class="flex items-center gap-2">
              <Icon name="lucide:banknote" class="w-4 h-4 text-gray-400" />
              <span class="section-title">Ringkasan Keuangan</span>
            </div>
          </div>

          <div class="px-5 pb-4 pt-2 space-y-4">
            <div class="stat-item">
              <div class="stat-icon bg-emerald-50 ring-emerald-100">
                <Icon name="lucide:wallet" class="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <p class="metric-label">Total Pemasukan</p>
                <p class="metric-value text-sm">
                  {{ formatCurrency(batch.paymentsTotal) }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3">
              <div class="stat-item">
                <div class="stat-icon bg-sky-50 ring-sky-100">
                  <Icon name="lucide:user-check" class="w-4 h-4 text-sky-700" />
                </div>
                <div>
                  <p class="metric-label">Peserta Lunas</p>
                  <p class="metric-value text-sm">
                    {{ paidParticipantsCount }} / {{ batch.participants.length }}
                  </p>
                </div>
              </div>

              <div
                v-if="batch.participants.length"
                class="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5"
              >
                {{
                  Math.round((paidParticipantsCount / batch.participants.length) * 100)
                }}%
              </div>
            </div>
          </div>
        </section>

        <!-- CARD: Struktur Ujian -->
        <section class="card">
          <div class="card-section-header">
            <div class="flex items-center gap-2">
              <Icon name="lucide:file-text" class="w-4 h-4 text-gray-400" />
              <span class="section-title">Struktur Ujian</span>
            </div>
          </div>

          <div class="px-5 pb-4 pt-2 space-y-3">
            <div class="stat-item">
              <div class="stat-icon bg-indigo-50 ring-indigo-100">
                <Icon name="lucide:layout-panel-top" class="w-4 h-4 text-indigo-700" />
              </div>
              <div>
                <p class="metric-label">Section</p>
                <p class="metric-value">
                  {{ batch.sections.length }} Section
                </p>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon bg-teal-50 ring-teal-100">
                <Icon name="lucide:layers" class="w-4 h-4 text-teal-700" />
              </div>
              <div>
                <p class="metric-label">Group Soal</p>
                <p class="metric-value">
                  {{ groupCount }} Group
                </p>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon bg-amber-50 ring-amber-100">
                <Icon name="lucide:list-checks" class="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p class="metric-label">Total Soal</p>
                <p class="metric-value">
                  {{ totalQuestionsCount }} Soal
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- KOLUMEN KANAN (aksi & chart) -->
    <div class="space-y-5">
      <!-- CARD: Aksi Cepat -->
      <section class="card">
        <div class="card-section-header">
          <div class="flex items-center gap-2">
            <Icon name="lucide:zap" class="w-4 h-4 text-gray-400" />
            <span class="section-title">Aksi Cepat</span>
          </div>
        </div>

        <div class="px-5 pb-4 pt-3 space-y-2">
          <button class="btn-action">
            <div class="flex items-center gap-2">
              <span class="btn-icon">
                <Icon name="lucide:plus-circle" class="w-4 h-4" />
              </span>
              <span class="truncate text-xs">Tambah Soal</span>
            </div>
          </button>

          <button class="btn-action" @click="$emit('requestAddParticipant')">
            <div class="flex items-center gap-2">
              <span class="btn-icon">
                <Icon name="lucide:user-plus" class="w-4 h-4" />
              </span>
              <span class="truncate text-xs">Tambah Peserta</span>
            </div>
          </button>

          <button class="btn-action">
            <div class="flex items-center gap-2">
              <span class="btn-icon">
                <Icon name="lucide:layers" class="w-4 h-4" />
              </span>
              <span class="truncate text-xs">Kelola Section</span>
            </div>
          </button>

          <button class="btn-action">
            <div class="flex items-center gap-2">
              <span class="btn-icon">
                <Icon name="lucide:layout-grid" class="w-4 h-4" />
              </span>
              <span class="truncate text-xs">Kelola Group</span>
            </div>
          </button>
        </div>
      </section>

      <!-- CARD: Chart Pembayaran -->
      <section class="card">
        <div class="card-section-header">
          <div class="flex items-center gap-2">
            <Icon name="lucide:pie-chart" class="w-4 h-4 text-gray-400" />
            <span class="section-title">Status Pembayaran</span>
          </div>
        </div>

        <div class="px-4 pb-4 pt-3">
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

const statusClass = computed(() => {
  const status = props.batch.status.toLowerCase();
  switch (status) {
    case 'upcoming': // Direncanakan
      return 'bg-blue-50 text-blue-700';
    case 'ongoing': // Sedang Berjalan
      return 'bg-emerald-50 text-emerald-700';
    case 'selesai': // Selesai
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-amber-50 text-amber-700';
  }
});

const paidParticipantsCount = computed(() => {
  return props.batch.participants.filter((p) => p.paymentStatus === 'Paid').length;
});

const groupCount = computed(() => {
  return props.batch.sections.reduce((total, section) => total + section.groups.length, 0);
});

const totalQuestionsCount = computed(() => {
  return props.batch.sections.reduce((total, section) => {
    return total + section.groups.reduce((groupTotal, group) => groupTotal + group.questionsCount, 0);
  }, 0);
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};
</script>

<style scoped>
.card-section-header {
  @apply flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100;
}

.section-title {
  @apply text-xs font-semibold tracking-wider text-gray-600 uppercase;
}

.metric-label {
  @apply text-[11px] text-gray-500 uppercase tracking-wide;
}

.metric-value {
  @apply font-semibold text-gray-900;
}

.stat-item {
  @apply flex items-center gap-3;
}

.stat-icon {
  @apply flex h-9 w-9 items-center justify-center rounded-lg ring-1;
}

.timeline-dot {
  @apply absolute left-4 top-1.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center ring-2 ring-white shadow-sm;
}

.btn-action {
  @apply w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left text-xs font-medium text-gray-800 shadow-sm
    transition-all duration-150 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50/60 hover:shadow-md
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1;
}

.btn-icon {
  @apply flex h-7 w-7 items-center justify-center rounded-md bg-white/80 ring-1 ring-gray-200;
}
</style>
