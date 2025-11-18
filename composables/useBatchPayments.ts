import { ref, computed } from 'vue';
import type { Payment } from './usePayments';

interface Batch {
  id: string;
  namaBatch: string;
}

interface BatchApiResponse {
  data: Batch[];
}

interface PaymentApiResponse {
  data: any[]; // Data mentah dari API
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Composable untuk mengelola pembayaran per batch.
 */
export const useBatchPayments = () => {
  const config = useRuntimeConfig();
  const selectedBatchId = ref<string | null>(null);

  // 1. Ambil daftar semua batch untuk dropdown
  const { data: batchesData, pending: batchesLoading, error: batchesError } = useAsyncData<BatchApiResponse>(
    'all-batches',
    async () => {
      const authToken = await useFirebaseToken();
      if (!authToken) throw new Error('User not authenticated.');
      return $fetch(`${config.public.API_URL}/batch`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }
  );

  const batches = computed(() => batchesData.value?.data ?? []);

  // 2. Ambil data pembayaran untuk batch yang dipilih
  const { data: paymentsData, pending: paymentsLoading, error: paymentsError, refresh: refreshPayments } = useAsyncData<PaymentApiResponse>(
    'batch-payments',
    async () => {
      if (!selectedBatchId.value) return { data: [], totalItems: 0, totalPages: 1, currentPage: 1 };

      const authToken = await useFirebaseToken();
      if (!authToken) throw new Error('User not authenticated.');

      return $fetch(`${config.public.API_URL}/payments/batch/${selectedBatchId.value}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    },
    {
      watch: [selectedBatchId], // Otomatis fetch ulang saat batch berubah
    }
  );

  // 3. Proses dan petakan data pembayaran
  const payments = computed<Payment[]>(() => {
    return (paymentsData.value?.data ?? []).map((p: any) => ({
      id: p.id,
      name: p.participant?.user?.name ?? 'Nama Tidak Tersedia',
      email: p.participant?.user?.email ?? 'Email Tidak Tersedia',
      batchName: selectedBatchId.value || '-', // Gunakan ID batch yang dipilih
      amount: parseFloat(p.amount) || 0,
      status: p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Unpaid',
      date: p.createdAt,
      payment_proof: p.payment_proof,
    }));
  });

  // 4. Hitung statistik ringkasan
  const summary = computed(() => {
    const total = payments.value.length;
    const paid = payments.value.filter(p => p.status === 'Paid').length;
    const pending = total - paid;
    const totalAmount = payments.value.reduce((sum, p) => sum + p.amount, 0);
    return { total, paid, pending, totalAmount };
  });

  return {
    // Data Batch
    batches,
    batchesLoading,
    batchesError,
    selectedBatchId,

    // Data Pembayaran
    payments,
    paymentsLoading,
    paymentsError,
    refreshPayments,

    // Statistik
    summary,
  };
};