import type { Batch } from '@/types/batch';
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

  return {
    data,
    pending,
    error,
    refresh,
  };
}
