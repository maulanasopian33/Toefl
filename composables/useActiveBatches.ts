import { ref, onMounted } from 'vue'
import { useFirebaseToken } from './FirebaseToken'
import { useLogger } from './useLogger'

export interface Batch {
  idBatch: string
  name: string
  description?: string // Deskripsi bersifat opsional
  start_date: string
  end_date:string
  price: number
  status: 'published' | 'draft' | 'archived'
}

export function useActiveBatches() {
  const config = useRuntimeConfig()
  const API_URL = `${config.public.API_URL}/users/me/batches`

  const batches = ref<Batch[]>([])
  const isLoading = ref(true)
  const error = ref<Error | null>(null)

  const fetchActiveBatches = async () => {
    isLoading.value = true
    error.value = null
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      // Mengambil batch yang 'published' (aktif)
      const response = await $fetch<{ data: Batch[] }>(API_URL, {        
        headers: { Authorization: `Bearer ${token}` },
      })
      batches.value = response.data
    } catch (e: any) {
      error.value = e
      const { logToServer } = useLogger()
      logToServer({
        level: 'error',
        message: 'Failed to fetch active batches',
        metadata: { error: e.message }
      })
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchActiveBatches)

  return { batches, isLoading, error, refresh: fetchActiveBatches }
}