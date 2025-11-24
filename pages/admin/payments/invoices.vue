<template>
  <div class="space-y-8">
    <!-- HEADER -->
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
          Tagihan per Batch
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Pilih batch untuk melihat daftar tagihan, status pembayaran, dan detail peserta.
        </p>
      </div>

      <button
        v-if="selectedBatchId"
        @click="refreshPayments"
        class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <Icon name="lucide:refresh-cw" class="h-4 w-4" />
        Segarkan Data
      </button>
    </header>

    <!-- BATCH SELECTOR -->
    <section
      class="card relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm"
    >
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex items-start gap-3">
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"
          >
            <Icon name="lucide:layers" class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-sm font-semibold text-slate-900">
              Pilih Batch
            </h2>
            <p class="mt-1 text-xs text-slate-500">
              Semua data pembayaran akan difilter berdasarkan batch yang dipilih.
            </p>
          </div>
        </div>

        <div class="w-full md:w-1/2 lg:w-1/3">
          <label
            for="batch-selector"
            class="mb-1 block text-xs font-medium text-slate-600"
          >
            Batch yang ditampilkan
          </label>
          <select
            id="batch-selector"
            v-model="selectedBatchId"
            class="input w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option :value="null" disabled>— Pilih salah satu batch —</option>
            <option v-for="batch in batches" :key="batch.id" :value="batch.id">
              {{ batch.namaBatch }}
            </option>
          </select>
          <p
            v-if="batchesLoading"
            class="mt-1 text-xs text-slate-500"
          >
            Memuat daftar batch...
          </p>
        </div>
      </div>
    </section>

    <!-- PAYMENT DETAILS -->
    <section
      v-if="selectedBatchId"
      class="card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <!-- Header Batch -->
      <div
        class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4"
      >
        <div>
          <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Ringkasan Pembayaran
          </p>
          <p class="text-sm font-semibold text-slate-900">
            {{ selectedBatchName || 'Batch terpilih' }}
          </p>
        </div>
        <p class="text-xs text-slate-500">
          Terakhir diperbarui:
          <span class="font-medium text-slate-700">
            {{ lastUpdatedLabel }}
          </span>
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="paymentsLoading"
        class="flex flex-col items-center justify-center gap-3 py-16 text-sm text-slate-500"
      >
        <Icon
          name="lucide:loader-2"
          class="mb-1 h-10 w-10 animate-spin text-slate-400"
        />
        <span class="font-medium">Memuat data pembayaran batch...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="paymentsError"
        class="flex flex-col items-center justify-center gap-3 py-16 text-center"
      >
        <Icon
          name="lucide:server-crash"
          class="h-12 w-12 text-rose-400"
        />
        <div>
          <h4 class="text-lg font-semibold text-slate-900">
            Gagal Memuat Data
          </h4>
          <p class="mt-1 text-sm text-slate-500">
            Terjadi masalah saat mengambil data dari server.
          </p>
        </div>
        <button
          @click="refreshPayments"
          class="btn-secondary mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Icon name="lucide:refresh-cw" class="h-4 w-4" />
          Coba Lagi
        </button>
      </div>

      <!-- Data Display -->
      <div v-else>
        <!-- Summary Cards -->
        <div
          class="grid grid-cols-1 gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:grid-cols-3"
        >
          <div
            class="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
          >
            <div>
              <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Total Peserta
              </p>
              <p class="mt-1 text-lg font-semibold text-slate-900">
                {{ summary.total }} orang
              </p>
            </div>
            <Icon
              name="lucide:users"
              class="h-6 w-6 text-slate-300"
            />
          </div>

          <div
            class="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
          >
            <div>
              <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Sudah Lunas
              </p>
              <p class="mt-1 text-lg font-semibold text-emerald-600">
                {{ summary.paid }} orang
              </p>
            </div>
            <Icon
              name="lucide:badge-check"
              class="h-6 w-6 text-emerald-400/70"
            />
          </div>

          <div
            class="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
          >
            <div>
              <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Belum Lunas / Pending
              </p>
              <p class="mt-1 text-lg font-semibold text-amber-600">
                {{ summary.pending }} orang
              </p>
            </div>
            <Icon
              name="lucide:clock"
              class="h-6 w-6 text-amber-400/80"
            />
          </div>
        </div>

        <!-- No Data State -->
        <div
          v-if="payments.length === 0"
          class="flex flex-col items-center justify-center gap-3 py-16 text-center"
        >
          <Icon
            name="lucide:archive"
            class="h-12 w-12 text-slate-300"
          />
          <div>
            <h4 class="text-lg font-semibold text-slate-900">
              Belum Ada Peserta
            </h4>
            <p class="mt-1 text-sm text-slate-500">
              Tidak ada data pembayaran yang ditemukan untuk batch ini.
            </p>
          </div>
        </div>

        <!-- Payments Table -->
        <div v-else class="px-5 py-4">
          <PaymentsTable
            :payments="payments"
            @detail="openDetail"
          />
        </div>
      </div>
    </section>

    <!-- MODAL -->
    <PaymentDetailModal
      v-model="selectedPayment"
      @mark-as-paid="handleMarkAsPaid"
      @mark-as-pending="handleMarkAsPending"
      @save-edit="handleSaveEdit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBatchPayments } from '@/composables/useBatchPayments';
import { usePayments } from '@/composables/usePayments';
import { useNotification } from '@/composables/useNotification';
import PaymentsTable from '@/components/payments/PaymentsTable.vue';
import PaymentDetailModal from '@/components/payments/PaymentDetailModal.vue';

definePageMeta({
  title: 'Invoices by Batch - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  roles: ['admin'],
});

const {
  batches,
  batchesLoading,
  selectedBatchId,
  payments,
  paymentsLoading,
  paymentsError,
  refreshPayments,
  summary,
} = useBatchPayments();

const { updatePaymentStatus, updatePayment } = usePayments();
const { showNotification } = useNotification();

const selectedPayment = ref(null);

const openDetail = (payment) => {
  selectedPayment.value = payment;
};

const selectedBatchName = computed(() => {
  if (!selectedBatchId || !batches?.value) return '';
  const found = batches.value.find((b) => b.idBatch === selectedBatchId.value);
  return found?.namaBatch || '';
});

const lastUpdatedLabel = computed(() => {
  // placeholder label; bisa dihubungkan ke timestamp real kalau ada
  return 'Baru saja';
});

// Handler untuk menandai lunas
const handleMarkAsPaid = async (payment) => {
  if (!payment) return;
  try {
    await updatePaymentStatus(payment.id, 'paid');
    showNotification('Status pembayaran berhasil diubah menjadi Lunas.', 'success');
    selectedPayment.value = null;
    await refreshPayments();
  } catch (err) {
    showNotification(err.data?.message || 'Gagal mengubah status menjadi Lunas.', 'error');
  }
};

// Handler untuk menandai pending
const handleMarkAsPending = async (payment) => {
  if (!payment) return;
  try {
    await updatePaymentStatus(payment.id, 'pending');
    showNotification('Status pembayaran berhasil diubah menjadi Pending.', 'success');
    selectedPayment.value = null;
    await refreshPayments();
  } catch (err) {
    showNotification(err.data?.message || 'Gagal mengubah status menjadi Pending.', 'error');
  }
};

const handleSaveEdit = async (editedPayment) => {
  if (!editedPayment) return;
  try {
    const payload = {
      amount: editedPayment.amount,
      status: editedPayment.status.toLowerCase(),
      method: 'manual',
      payment_proof: editedPayment.payment_proof,
    };
    await updatePayment(editedPayment.id, payload);
    showNotification('Detail pembayaran berhasil diperbarui.', 'success');
    selectedPayment.value = null;
    await refreshPayments();
  } catch (err) {
    showNotification(err.data?.message || 'Gagal memperbarui pembayaran.', 'error');
  }
};
</script>