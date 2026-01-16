import { ref, computed, watch } from 'vue';
import { useLogger } from './useLogger';
import { useFirebaseToken } from './FirebaseToken';

export interface Payment {
  id: string;
  name: string;
  email: string;
  batchName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Unpaid';
  date: string;
  payment_proof?: string | null;
}

interface ApiResponse {
  data: Payment[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export const usePayments = () => {
  const config = useRuntimeConfig();
  const apiUrl = `${config.public.API_URL}/payments`;
  const { logToServer } = useLogger();

  // Filter & sorting state (moved inside the hook for better encapsulation if needed, or kept outside if global)
  const q = ref('');
  const selectedStatus = ref('');
  const selectedBatch = ref('');
  const sortKey = ref('date');
  const sortOrder = ref('desc');
  const currentPage = ref(1);
  const pageSize = ref(20);

  const { data, pending: loading, error, refresh: fetchPayments } = useAsyncData<ApiResponse>(
    'payments',
    async () => {
      const authToken = await useFirebaseToken();
      if (!authToken) throw new Error('User not authenticated.');

      return $fetch(apiUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: {
          page: currentPage.value,
          limit: pageSize.value,
        },
      });
    },
    { watch: [currentPage] }
  );

  watch(error, (newErr) => {
    if (newErr) {
      logToServer({
        level: 'error',
        message: 'Failed to fetch payments',
        metadata: { error: newErr.message, page: currentPage.value }
      });
    }
  });

  const payments = computed<Payment[]>(() => {
    return (data.value?.data ?? []).map((p: any) => ({
      id: p.id,
      name: p.participant?.user?.name ?? 'Nama Tidak Tersedia',
      email: p.participant?.user?.email ?? 'Email Tidak Tersedia',
      batchName: p.participant?.batch?.namaBatch ?? '-',
      amount: parseFloat(p.amount) || 0,
      status: p.status ? (p.status.charAt(0).toUpperCase() + p.status.slice(1)) as any : 'Unpaid',
      date: p.createdAt,
      payment_proof: p.payment_proof,
    }));
  });

  const totalItems = computed(() => data.value?.totalItems ?? payments.value.length);
  const totalPages = computed(() => data.value?.totalPages ?? 1);

  const batchOptions = computed(() => {
    const set = new Set(payments.value.map((p) => p.batchName).filter(Boolean));
    return Array.from(set);
  });

  const filteredPayments = computed(() => {
    if (!payments.value) return [];
    const query = q.value.toLowerCase();
    return payments.value.filter((p) => {
      const matchQuery = !query || p.name.toLowerCase().includes(query) || p.email?.toLowerCase().includes(query);
      const matchStatus = !selectedStatus.value || p.status === selectedStatus.value;
      const matchBatch = !selectedBatch.value || p.batchName === selectedBatch.value;
      return matchQuery && matchStatus && matchBatch;
    });
  });

  const sortedPayments = computed(() => {
    const sorted = [...filteredPayments.value];
    sorted.sort((a, b) => {
      let valA = a[sortKey.value as keyof Payment] as any;
      let valB = b[sortKey.value as keyof Payment] as any;
      if (sortKey.value === 'date') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  });

  const paidCount = computed(() => payments.value.filter((p) => p.status === 'Paid').length);
  const nonPaidCount = computed(() => payments.value.filter((p) => p.status !== 'Paid').length);

  const sortBy = (key: string) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortOrder.value = 'asc';
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: 'paid' | 'pending' | 'failed' | 'refunded') => {
    const updateUrl = `${apiUrl}/${paymentId}/status`;
    const authToken = await useFirebaseToken();
    if (!authToken) throw new Error('User not authenticated.');

    try {
      return await $fetch(updateUrl, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authToken}` },
        body: { status, method: 'manual', payment_proof: null },
      });
    } catch (e: any) {
      logToServer({
        level: 'error',
        message: 'Failed to update payment status',
        metadata: { paymentId, status, error: e.message }
      });
      throw e;
    }
  };

  const updatePayment = async (paymentId: string, payload: { amount: number; status: string; method: string; payment_proof: string | null }) => {
    const updateUrl = `${apiUrl}/${paymentId}`;
    const authToken = await useFirebaseToken();
    if (!authToken) throw new Error('User not authenticated.');

    try {
      return await $fetch(updateUrl, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authToken}` },
        body: payload,
      });
    } catch (e: any) {
      logToServer({
        level: 'error',
        message: 'Failed to update payment',
        metadata: { paymentId, error: e.message }
      });
      throw e;
    }
  };

  const createPayment = async (payload: { participantId: string; amount: number; method: string; }) => {
    const authToken = await useFirebaseToken();
    if (!authToken) throw new Error('User not authenticated.');

    try {
      return await $fetch(apiUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: { ...payload, status: 'pending' },
      });
    } catch (e: any) {
      logToServer({
        level: 'error',
        message: 'Failed to create payment',
        metadata: { error: e.message, participantId: payload.participantId }
      });
      throw e;
    }
  };

  return {
    payments,
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
    createPayment,
  };
};