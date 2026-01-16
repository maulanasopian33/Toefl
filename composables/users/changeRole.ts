import { useNuxtApp } from '#app'
import { useLogger } from '../useLogger'

/**
 * Composable untuk mengubah role pengguna.
 * @param uid - UID pengguna yang akan diubah.
 * @param role - Role baru ('admin' atau 'user').
 * @throws Akan melempar error jika token tidak ditemukan atau jika API call gagal.
 */
export const useUserChangeRole = async (uid: string, role: string) => {
  const { $auth } = useNuxtApp()
  const config = useRuntimeConfig()

  const token = await $auth.currentUser?.getIdToken()
  if (!token) {
    throw new Error('Sesi Anda tidak valid. Silakan login kembali.')
  }

  try {
    await $fetch(`${config.public.API_URL}/users/${uid}/role`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: { role },
    })
  } catch (error: any) {
    const { logToServer } = useLogger()
    logToServer({
      level: 'error',
      message: 'Failed to change user role',
      metadata: { uid, role, error: error.message }
    })
    throw new Error(error.data?.message || 'Terjadi kesalahan saat mengubah role pengguna.')
  }
}