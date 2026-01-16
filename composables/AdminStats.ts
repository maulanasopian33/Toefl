import { useFirebaseToken } from './FirebaseToken'
import { useLogger } from './useLogger'

export const useAdminStats = () => {
  const config = useRuntimeConfig()

  // Menggunakan useAsyncData untuk penanganan state (pending, error) dan token asinkron
  const { data, pending, error, refresh } = useAsyncData(
    'admin-stats',
    async () => {
      const token = await useFirebaseToken()
      if (!token) {
        throw new Error('User not authenticated.')
      }
      return $fetch(`${config.public.API_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }
  )

  const { logToServer } = useLogger()
  watch(error, (newErr) => {
    if (newErr) {
      logToServer({
        level: 'error',
        message: 'Failed to fetch admin stats',
        metadata: { error: newErr.message }
      })
    }
  })

  return { data, pending, error, refresh }
}
