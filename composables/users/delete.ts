import { useNuxtApp } from '#app'
import { useLogger } from '../useLogger'

/**
 * Composable untuk menghapus pengguna berdasarkan UID.
 * @param uid - UID pengguna yang akan dihapus.
 * @throws Akan melempar error jika token tidak ditemukan atau jika API call gagal.
 */
export const useUserDelete = async (uid: string) => {
  const { $auth } = useNuxtApp()
  const config = useRuntimeConfig()

  const token = await $auth.currentUser?.getIdToken()
  if (!token) {
    throw new Error('Sesi Anda tidak valid. Silakan login kembali.')
  }

  try {
    await $fetch(`${config.public.API_URL}/users/${uid}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  } catch (error: any) {
    const { logToServer } = useLogger()
    logToServer({
      level: 'error',
      message: 'Failed to delete user',
      metadata: { uid, error: error.message }
    })
    throw new Error(error.data?.message || 'Terjadi kesalahan saat menghapus pengguna dari server.')
  }
}