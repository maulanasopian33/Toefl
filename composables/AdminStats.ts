import { useFirebaseToken } from './FirebaseToken'

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

  return { data, pending, error, refresh }
}
