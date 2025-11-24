import { ref, onMounted } from 'vue'
import { useFirebaseToken } from './FirebaseToken'

export interface Batch {
  idBatch: string
  namaBatch: string
  deskripsi?: string // Deskripsi bersifat opsional
  tanggalMulai: string
  tanggalSelesai:string
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
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchActiveBatches)

  return { batches, isLoading, error, refresh: fetchActiveBatches }
}