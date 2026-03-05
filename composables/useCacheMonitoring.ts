import { useFirebaseToken } from './FirebaseToken'

export const useCacheMonitoring = () => {
  const config = useRuntimeConfig()
  const { $auth } = useNuxtApp()

  const getCacheStatus = async () => {
    const token = await useFirebaseToken()
    if (!token) throw new Error('User not authenticated.')

    return $fetch(`${config.public.API_URL}/admin/cache/status`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  const clearAllCache = async () => {
    const token = await useFirebaseToken()
    if (!token) throw new Error('User not authenticated.')

    return $fetch(`${config.public.API_URL}/admin/cache/clear`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  const clearCacheByPattern = async (pattern: string) => {
    const token = await useFirebaseToken()
    if (!token) throw new Error('User not authenticated.')

    return $fetch(`${config.public.API_URL}/admin/cache/clear/${pattern}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  return {
    getCacheStatus,
    clearAllCache,
    clearCacheByPattern
  }
}
