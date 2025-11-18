<template>
  <div class="space-y-8">
    <!-- HEADER + RINGKASAN -->
    <PaymentsHeader
      :total-items="totalItems"
      :paid-count="paidCount"
      :non-paid-count="nonPaidCount"
    />

    <!-- FILTER + TABEL -->
    <section
      class="card overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm"
    >
      <!-- Toolbar filter -->
      <div class="border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-6">
        <PaymentsToolbar
          v-model:q="q"
          v-model:selectedStatus="selectedStatus"
          v-model:selectedBatch="selectedBatch"
          :batch-options="batchOptions"
        />
      </div>

      <!-- Loading & Error -->
      <div v-if="loading" class="flex flex-col items-center justify-center gap-3 py-16 text-sm text-slate-500">
        <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-slate-400" />
        <span class="font-medium">Memuat data pembayaran...</span>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Icon name="lucide:alert-triangle" class="h-9 w-9 text-rose-400" />
        <p class="text-sm font-semibold text-rose-600">
          Terjadi kesalahan saat memuat data.
        </p>
        <p class="max-w-md text-xs text-slate-500">
          {{ error.message }}
        </p>
      </div>

      <!-- Tabel -->
      <div v-else class="px-4 pb-4 pt-3 sm:px-6">
        <div class="overflow-x-auto rounded-xl border border-slate-100 bg-white">
          <PaymentsTable
            :payments="paginatedPayments"
            :sort-key="sortKey"
            :sort-order="sortOrder"
            @sort="sortBy"
            @detail="openDetail"
          />
        </div>

        <!-- Pagination (global dari API) -->
        <div
          v-if="totalPages > 1"
          class="mt-5 flex flex-col items-center justify-between gap-3 text-xs text-slate-600 sm:flex-row sm:text-sm"
        >
          <div class="flex items-center gap-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1 || loading"
              class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="lucide:chevron-left" class="h-4 w-4" />
              Sebelumnya
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages || loading"
              class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Berikutnya
              <Icon name="lucide:chevron-right" class="h-4 w-4" />
            </button>
          </div>

          <div class="flex items-center gap-1">
            <span>Halaman</span>
            <span class="font-semibold text-slate-900">
              {{ currentPage }}
            </span>
            <span>dari</span>
            <span class="font-semibold text-slate-900">
              {{ totalPages }}
            </span>
            <span class="hidden sm:inline">
              • Total
              <span class="font-semibold text-slate-900">{{ totalItems }}</span>
              pembayaran
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal detail global -->
    <PaymentDetailModal
      v-model="selectedPayment"
      @mark-as-paid="markAsPaid"
      @mark-as-pending="markAsPending"
      @save-edit="handleSaveEdit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { usePayments } from '@/composables/usePayments';
import { useNotification } from '@/composables/useNotification';
import PaymentsHeader from '@/components/payments/PaymentsHeader.vue';
import PaymentsToolbar from '@/components/payments/PaymentsToolbar.vue';
import PaymentsTable from '@/components/payments/PaymentsTable.vue';
import PaymentDetailModal from '@/components/payments/PaymentDetailModal.vue';

definePageMeta({
  title: 'Payment - Admin Panel',
  layout: 'admin',
});

const { showNotification } = useNotification();

const {
  loading,
  error,
  q,
  selectedStatus,
  selectedBatch,
  sortKey,
  sortOrder,
  currentPage,
  totalPages,
  totalItems,
  fetchPayments,
  batchOptions,
  sortedPayments,
  paidCount,
  nonPaidCount,
  sortBy,
  updatePaymentStatus,
  updatePayment,
} = usePayments();

// detail modal
const selectedPayment = ref(null);

// Pagination client-side (jika diperlukan)
const itemsPerPage = ref(20);
const clientCurrentPage = ref(1);

// Reset halaman client-side jika filter berubah
watch([q, selectedStatus, selectedBatch], () => {
  clientCurrentPage.value = 1;
});

const paginatedPayments = computed(() => {
  // Jika nanti full server-side pagination:
  // return sortedPayments.value;
  const start = (clientCurrentPage.value - 1) * itemsPerPage.value;
  return sortedPayments.value.slice(start, start + itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value && !loading.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1 && !loading.value) {
    currentPage.value--;
  }
};

const openDetail = (payment) => {
  selectedPayment.value = payment;
};

const markAsPaid = async (payment) => {
  if (!payment) return;

  try {
    await updatePaymentStatus(payment.id, 'paid');
    showNotification('Status pembayaran berhasil diubah menjadi Lunas.', 'success');
    selectedPayment.value = null;
    await fetchPayments();
  } catch (err) {
    console.error('Gagal mengubah status pembayaran:', err);
    showNotification(err.message || 'Gagal mengubah status pembayaran.', 'error');
  }
};

const markAsPending = async (payment) => {
  if (!payment) return;

  try {
    await updatePaymentStatus(payment.id, 'pending');
    showNotification('Status pembayaran berhasil diubah menjadi Pending.', 'success');
    selectedPayment.value = null;
    await fetchPayments();
  } catch (err) {
    console.error('Gagal mengubah status pembayaran:', err);
    showNotification(err.message || 'Gagal mengubah status pembayaran.', 'error');
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
    await fetchPayments();
  } catch (err) {
    console.error('Gagal memperbarui pembayaran:', err);
    showNotification(err.message || 'Gagal memperbarui pembayaran.', 'error');
  }
};
</script>
