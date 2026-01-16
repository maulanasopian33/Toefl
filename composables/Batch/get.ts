import { type Ref } from 'vue';
import type { Batch, BatchRes } from "@/types/batch";
import { useFirebaseToken } from '../FirebaseToken';
import { useLogger } from '../useLogger';

// Gunakan tipe yang lebih spesifik untuk composable
interface BatchGetResult {
  data: Ref<Batch[] | null>;
  pending: Ref<boolean>;
  error: Ref<Error | null>;
  refresh: () => void;
}

export const useBatchGet = async (): Promise<BatchGetResult> => {
  const authToken = await useFirebaseToken();
  const config = useRuntimeConfig();

  if (!authToken) {
    return {
      data: ref<Batch[] | null>(null),
      pending: ref(false),
      error: ref(new Error('User not authenticated.')),
      refresh: () => {},
    };
  }

  // Perhatikan perubahan tipe di sini: useFetch<Batch[]>
  const { data, pending, error, refresh } = await useFetch<BatchRes>(`${config.public.API_URL}/batch`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });

  const { logToServer } = useLogger();
  watch(error, (newErr) => {
    if (newErr) {
      logToServer({
        level: 'error',
        message: 'Failed to fetch batches (useBatchGet)',
        metadata: { error: newErr.message }
      });
    }
  });

  const dataValue = computed(() => {
    if (data.value) {
      const datas = data.value;
      return datas?.data;
    }
    return null;
  });

  // Pastikan properti yang dikembalikan adalah ref
  return {
    data: dataValue as Ref<Batch[] | null>,
    pending: pending as Ref<boolean>,
    error: error as Ref<Error | null>,
    refresh,
  };
};