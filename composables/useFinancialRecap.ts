import { ref, computed, watch } from 'vue';
import type { Payment } from './usePayments';
import { useLogger } from './useLogger';
import { useFirebaseToken } from './FirebaseToken';

interface RecapStats {
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  totalFailed: number;
  totalRefunded: number;
}

interface StatsApiResponse {
  data: RecapStats;
  message: string;
  status: boolean;
}

interface PaymentsApiResponse {
  data: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
interface Batch {
  id: string;
  namaBatch: string;
}

export const useFinancialRecap = () => {
  const config = useRuntimeConfig();
  const { logToServer } = useLogger();

  // --- STATE ---
  const startDate = ref<string | null>(null);
  const endDate = ref<string | null>(null);
  const selectedBatch = ref<string | null>(null);
  const statusFilter = ref<string>('');
  const currentPage = ref(1);
  const itemsPerPage = ref(15);

  // --- API 1: RECAP STATS ---
  const { data: statsData, pending: statsLoading, error: statsError, refresh: refreshStats } = useAsyncData<StatsApiResponse>(
    'financial-recap-stats',
    async () => {
      const authToken = await useFirebaseToken();
      if (!authToken) throw new Error('User not authenticated.');

      const params: Record<string, string> = {};
      if (startDate.value) params.startDate = startDate.value;
      if (endDate.value) params.endDate = endDate.value;
      if (selectedBatch.value) params.batchId = selectedBatch.value;

      return $fetch(`${config.public.API_URL}/admin/financial-recap`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params,
      });
    },
    {
      watch: [startDate, endDate, selectedBatch],
      default: () => ({
        data: {
          totalRevenue: 0,
          totalPaid: 0,
          totalPending: 0,
          totalFailed: 0,
          totalRefunded: 0,
        },
        message: '',
        status: false,
      }),
    }
  );

  // --- API to fetch batches for the filter dropdown
  const { data: batchesData } = useAsyncData<{ data: Batch[] }>(
    'all-batches-for-recap',
    async () => {
      const authToken = await useFirebaseToken();
      if (!authToken) return { data: [] };
      return $fetch(`${config.public.API_URL}/batch`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }
  );

  // --- API 2: PAYMENTS TABLE ---
  const { data: paymentsData, pending: paymentsLoading, error: paymentsError, refresh: refreshPayments } = useAsyncData<PaymentsApiResponse>(
    'financial-recap-payments',
    async () => {
      const authToken = await useFirebaseToken();
      if (!authToken) throw new Error('User not authenticated.');

      const params: Record<string, any> = {
        page: currentPage.value,
        limit: itemsPerPage.value,
      };
      if (startDate.value) params.startDate = startDate.value;
      if (endDate.value) params.endDate = endDate.value;
      if (selectedBatch.value) params.batchId = selectedBatch.value;
      if (statusFilter.value) params.status = statusFilter.value;

      return $fetch(`${config.public.API_URL}/payments`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params,
      });
    },
    {
      watch: [currentPage, startDate, endDate, statusFilter, selectedBatch],
      default: () => ({ data: [], totalItems: 0, totalPages: 1, currentPage: 1 }),
    }
  );

  // --- WATCHERS FOR LOGGING ---
  watch(statsError, (newErr) => {
    if (newErr) {
      logToServer({
        level: 'error',
        message: 'Failed to fetch financial recap stats',
        metadata: { error: newErr.message, startDate: startDate.value, endDate: endDate.value }
      });
    }
  });

  watch(paymentsError, (newErr) => {
    if (newErr) {
      logToServer({
        level: 'error',
        message: 'Failed to fetch financial recap payments',
        metadata: { error: newErr.message, page: currentPage.value }
      });
    }
  });

  // --- COMPUTED PROPERTIES ---
  const stats = computed<RecapStats>(() => {
    return statsData.value?.data ?? { totalRevenue: 0, totalPaid: 0, totalPending: 0, totalFailed: 0, totalRefunded: 0 };
  });

  const payments = computed<Payment[]>(() => {
    return (paymentsData.value?.data ?? []).map((p: any) => ({
      id: p.id,
      name: p.participant?.user?.name ?? 'N/A',
      email: p.participant?.user?.email ?? 'N/A',
      batchName: p.participant?.batch?.namaBatch ?? '-',
      amount: parseFloat(p.amount) || 0,
      status: p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Unpaid' as any,
      date: p.createdAt,
      payment_proof: p.payment_proof,
    }));
  });

  const totalItems = computed(() => paymentsData.value?.totalItems ?? 0);
  const totalPages = computed(() => paymentsData.value?.totalPages ?? 1);
  const batches = computed(() => batchesData.value?.data ?? []);

  // --- METHODS ---
  const refreshAll = async () => {
    await refreshStats();
    await refreshPayments();
  };

  // Reset page when filters change
  watch([startDate, endDate, statusFilter, selectedBatch], () => {
    currentPage.value = 1;
  });

  return {
    batches,
    stats,
    statsLoading,
    statsError,
    payments,
    paymentsLoading,
    paymentsError,
    currentPage,
    totalItems,
    totalPages,
    selectedBatch,
    startDate,
    endDate,
    statusFilter,
    refreshAll,
  };
};