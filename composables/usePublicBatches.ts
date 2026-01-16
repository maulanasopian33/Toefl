import { ref } from 'vue'
import { useFirebaseToken } from './FirebaseToken'
import { useLogger } from './useLogger'
import type { Batch } from './useActiveBatches' // Menggunakan interface Batch yang sama

export function usePublicBatches() {
  const config = useRuntimeConfig()
  const API_URL = `${config.public.API_URL}/batch`

  const publicBatches = ref<Batch[]>([])
  const isPublicLoading = ref(false)
  const publicError = ref<Error | null>(null)

  const fetchPublicBatches = async () => {
    isPublicLoading.value = true
    publicError.value = null
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      // Mengambil batch yang 'published' (aktif untuk umum)
      const response = await $fetch<{ data: Batch[] }>(API_URL, {
        params: { status: 'OPEN' },
        headers: { Authorization: `Bearer ${token}` },
      })
      publicBatches.value = response.data
    } catch (e: any) {
      publicError.value = e
      const { logToServer } = useLogger()
      logToServer({
        level: 'error',
        message: 'Failed to fetch public batches',
        metadata: { error: e.message }
      })
    } finally {
      isPublicLoading.value = false
    }
  }

  // Tidak memanggil onMounted agar tidak otomatis fetch, hanya saat dibutuhkan

  return { publicBatches, isPublicLoading, publicError, fetchPublicBatches }
}