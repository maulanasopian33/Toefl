import { type Ref } from 'vue';
import type { Batch, BatchRes } from "@/types/batch";
import { useFirebaseToken } from '../FirebaseToken';

interface BatchDetailResult {
  data: Ref<Batch[] | null>;
  pending: Ref<boolean>;
  error: Ref<Error | null>;
  refresh: () => void;
}

export const useBatchGetById = async (idBatch: string): Promise<BatchDetailResult> => {
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

  // Ambil detail batch berdasarkan ID
  const { data, pending, error, refresh } = await useFetch<BatchRes>(`${config.public.API_URL}/batch/${idBatch}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });

  const dataValue = computed(() => {
    if (data.value) {
      const datas = data.value;
      return datas?.data;// asumsi API return { data: {...} }
    }
    return null;
  });

  return {
    data: dataValue as Ref<Batch[] | null>,
    pending: pending as Ref<boolean>,
    error: error as Ref<Error | null>,
    refresh,
  };
};
