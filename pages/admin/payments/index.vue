<template>
  <div class="space-y-8">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tight">Kelola Pembayaran</h1>
        <p class="text-sm font-medium text-gray-400 mt-2">Pantau transaksi, tagihan batch, dan rekapitulasi keuangan</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="showAddModal = true"
          class="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all transform active:scale-95"
        >
          <Icon name="lucide:plus-circle" class="h-5 w-5" />
          Tambah Pembayaran Manual
        </button>
      </div>
    </div>

    <!-- TABS -->
    <div class="flex gap-1 p-1 bg-gray-100 rounded-[1.5rem] w-fit">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['px-6 py-2.5 rounded-xl text-sm font-black transition-all', activeTab === tab.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- CONTENT BASED ON TAB -->
    <div v-if="activeTab === 'transactions'" class="space-y-8">
      <!-- RINGKASAN RINGKAS -->
      <PaymentsHeader
        :total-items="totalItems"
        :paid-count="paidCount"
        :non-paid-count="nonPaidCount"
      />

      <!-- FILTER + TABEL -->
      <section class="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
        <!-- Toolbar filter -->
        <div class="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
          <PaymentsToolbar
            v-model:q="q"
            v-model:selectedStatus="selectedStatus"
            v-model:selectedBatch="selectedBatch"
            :batch-options="batchOptions"
          />
        </div>

        <!-- Loading & Error -->
        <div v-if="loading" class="flex flex-col items-center justify-center gap-3 py-24 text-sm text-slate-500">
          <Icon name="lucide:loader-2" class="h-10 w-10 animate-spin text-emerald-500" />
          <span class="font-bold tracking-tight">Memuat data pembayaran...</span>
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <Icon name="lucide:alert-triangle" class="h-12 w-12 text-rose-400" />
          <p class="text-lg font-black text-rose-600">Terjadi kesalahan</p>
          <p class="max-w-md text-xs font-medium text-slate-500">{{ error.message }}</p>
        </div>

        <!-- Tabel -->
        <div v-else class="px-4 pb-4 pt-3 sm:px-6">
          <PaymentsTable
            :payments="sortedPayments"
            :sort-key="sortKey"
            :sort-order="sortOrder"
            @sort="sortBy"
            @detail="openDetail"
          />

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-8 mb-4 flex flex-col items-center justify-between gap-4 px-4 sm:flex-row text-xs">
            <div class="flex items-center gap-1 font-bold text-gray-400 uppercase tracking-widest">
              Halaman <span class="text-gray-900">{{ currentPage }}</span> dari {{ totalPages }}
            </div>
            
            <div class="flex items-center gap-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1 || loading"
                class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                <Icon name="lucide:chevron-left" class="h-4 w-4" />
                Sebelumnya
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages || loading"
                class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                Berikutnya
                <Icon name="lucide:chevron-right" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- REKAP KEUANGAN TAB -->
    <div v-else-if="activeTab === 'finance'" class="animate-in fade-in slide-in-from-bottom-4">
      <PaymentSummary />
    </div>

    <!-- TAGIHAN PER BATCH TAB -->
    <div v-else-if="activeTab === 'batch'" class="animate-in fade-in slide-in-from-bottom-4">
      <BatchBillingRekap />
    </div>

    <!-- Modals -->
    <PaymentDetailModal
      v-model="selectedPayment"
      @mark-as-paid="markAsPaid"
      @mark-as-failed="markAsFailed"
      @mark-as-pending="markAsPending"
      @save-edit="handleSaveEdit"
    />

    <AddManualPaymentModal
      v-model="showAddModal"
      @created="handlePaymentCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { usePayments } from '@/composables/usePayments';
import { useNotification } from '@/composables/useNotification';
import PaymentsHeader from '@/components/payments/PaymentsHeader.vue';
import PaymentsToolbar from '@/components/payments/PaymentsToolbar.vue';
import PaymentsTable from '@/components/payments/PaymentsTable.vue';
import PaymentDetailModal from '@/components/payments/PaymentDetailModal.vue';
import PaymentSummary from '@/components/payments/PaymentSummary.vue';
import BatchBillingRekap from '@/components/payments/BatchBillingRekap.vue';
import AddManualPaymentModal from '@/components/payments/AddManualPaymentModal.vue';

definePageMeta({
  title: 'Payment Management - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "payment.view_all"
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

// Tab state
const tabs = [
  { id: 'transactions', label: 'Daftar Transaksi' },
  { id: 'batch', label: 'Tagihan Per Batch' },
  { id: 'finance', label: 'Rekap Keuangan' }
];
const activeTab = ref('transactions');

// Modals state
const selectedPayment = ref(null);
const showAddModal = ref(false);

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

const handlePaymentCreated = async () => {
  showNotification('Pembayaran manual berhasil ditambahkan.', 'success');
  await fetchPayments();
};

const markAsPaid = async (payment) => {
  if (!payment) return;
  try {
    await updatePaymentStatus(payment.id, 'paid');
    showNotification('Status pembayaran berhasil diubah menjadi Lunas.', 'success');
    selectedPayment.value = null;
    await fetchPayments();
  } catch (err) {
    showNotification(err.message || 'Gagal mengubah status pembayaran.', 'error');
  }
};

const markAsFailed = async (payment) => {
  if (!payment) return;
  try {
    await updatePaymentStatus(payment.id, 'failed');
    showNotification('Pembayaran ditolak/gagal.', 'warning');
    selectedPayment.value = null;
    await fetchPayments();
  } catch (err) {
    showNotification(err.message || 'Gagal mengubah status pembayaran.', 'error');
  }
};

const markAsPending = async (payment) => {
  if (!payment) return;
  try {
    await updatePaymentStatus(payment.id, 'pending');
    showNotification('Status pembayaran diubah kembali ke Pending.', 'success');
    selectedPayment.value = null;
    await fetchPayments();
  } catch (err) {
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
    showNotification(err.message || 'Gagal memperbarui pembayaran.', 'error');
  }
};
</script>
