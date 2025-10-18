import type { Batch } from '@/types/batch';
export const useBatchDelete = async (idBatch: string) => {
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
  const { data, pending, error, refresh } = await useFetch<Batch>(`${config.public.API_URL}/batch/${idBatch}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    }
  });

  return {
    data,
    pending,
    error,
    refresh,
  };
}
