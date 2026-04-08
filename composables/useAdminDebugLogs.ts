import { ref } from 'vue'

export interface DebugLog {
  id: number
  message: string
  level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR'
  context: any
  source: 'FE' | 'BE'
  userId: string | null
  createdAt: string
  user?: {
    name: string
    email: string
  }
}

export const useAdminDebugLogs = () => {
  const config = useRuntimeConfig()
  const { $auth } = useNuxtApp()
  
  const logs = ref<DebugLog[]>([])
  const totalItems = ref(0)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const search = ref('')
  const level = ref('')
  const source = ref('')

  const fetchLogs = async (page = 1) => {
    isLoading.value = true
    error.value = null
    try {
      const token = await $auth?.currentUser?.getIdToken()
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        search: search.value,
        level: level.value,
        source: source.value
      })
      
      const response: any = await $fetch(`${config.public.API_URL}/debug?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.status) {
        logs.value = response.data
        totalItems.value = response.totalItems
        totalPages.value = response.totalPages
        currentPage.value = response.currentPage
      }
    } catch (e: any) {
      error.value = e.message || 'Gagal memuat log debug'
    } finally {
      isLoading.value = false
    }
  }

  const clearLogs = async () => {
    isLoading.value = true
    try {
      const token = await $auth?.currentUser?.getIdToken()
      await $fetch(`${config.public.API_URL}/debug/clear`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      logs.value = []
      totalItems.value = 0
      totalPages.value = 0
    } catch (e: any) {
      error.value = e.message || 'Gagal menghapus log debug'
    } finally {
      isLoading.value = false
    }
  }

  return {
    logs,
    totalItems,
    totalPages,
    currentPage,
    isLoading,
    error,
    search,
    level,
    source,
    fetchLogs,
    clearLogs
  }
}
