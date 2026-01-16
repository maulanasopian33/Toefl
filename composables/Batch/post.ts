import type { Batch } from '@/types/batch';
import { useLogger } from '../useLogger';
export const useBatchPost = async (batchData: Batch) => {
  // Dapatkan token otorisasi dari composable yang sudah ada
  const authToken = await useFirebaseToken();
  const config = useRuntimeConfig();

  // Hentikan proses jika token tidak ada
  if (!authToken) {
    return {
      data: null,
      pending: false,
      error: new Error('User not authenticated.'),
      refresh: () => {},
    };
  }

  // Lanjutkan dengan useFetch untuk mengirim data
  const { data, pending, error, refresh } = await useFetch<Batch>(`${config.public.API_URL}/batch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: batchData, // Data yang akan dikirim dalam body permintaan
  });

  const { logToServer } = useLogger();
  watch(error, (newErr) => {
    if (newErr) {
      logToServer({
        level: 'error',
        message: 'Failed to create batch',
        metadata: { error: newErr.message }
      });
    }
  });

  return {
    data,
    pending,
    error,
    refresh,
  };
}
