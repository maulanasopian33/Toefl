import type { Batch } from '@/types/batch'
import { useLogger } from '../useLogger'

export const useBatchUpdate = async (id: number, batchData: Batch) => {
  // Ambil token autentikasi dari composable Firebase
  const authToken = await useFirebaseToken()
  const config = useRuntimeConfig()

  // Jika belum login / token kosong
  if (!authToken) {
    return {
      data: null,
      pending: false,
      error: new Error('User not authenticated.'),
      refresh: () => {},
    }
  }

  // Kirim request PUT untuk update batch
  const { data, pending, error, refresh } = await useFetch<Batch>(`${config.public.API_URL}/batch/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: batchData,
  })

  const { logToServer } = useLogger()
  watch(error, (newErr) => {
    if (newErr) {
      logToServer({
        level: 'error',
        message: 'Failed to update batch',
        metadata: { id, error: newErr.message }
      })
    }
  })

  return {
    data,
    pending,
    error,
    refresh,
  }
}
