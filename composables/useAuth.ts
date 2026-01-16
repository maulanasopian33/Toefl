import { ref, readonly } from 'vue'
import type { User as FirebaseUser } from 'firebase/auth'
import { useLogger } from './useLogger'

// Definisikan tipe untuk custom claims yang kita harapkan
interface CustomClaims {
  role?: 'admin' | 'user' | 'proctor';
  // tambahkan claim lain jika ada
}

// State untuk menampung informasi user yang sedang login
const user = ref<FirebaseUser | null>(null)
const claims = ref<CustomClaims>({})
const isAuthenticated = ref(false)
const isLoading = ref(true)

/**
 * Composable terpusat untuk manajemen otentikasi dan state pengguna.
 */
export const useAuth = () => {
  const { $auth } = useNuxtApp()

  // Fungsi untuk menginisialisasi atau menyegarkan state pengguna
  const updateUserState = async (firebaseUser: FirebaseUser | null) => {
    isLoading.value = true
    if (firebaseUser) {
      const tokenResult = await firebaseUser.getIdTokenResult()
      user.value = firebaseUser
      claims.value = (tokenResult.claims as CustomClaims) || {}
      isAuthenticated.value = true
    } else {
      user.value = null
      claims.value = {}
      isAuthenticated.value = false
    }
    isLoading.value = false
  }

  // Listener yang hanya berjalan sekali di sisi client
  if (process.client && !$auth.currentUser) {
    $auth.onAuthStateChanged(updateUserState)
  } else if ($auth.currentUser) {
    // Jika user sudah ada, langsung update state
    updateUserState($auth.currentUser)
  } else {
    isLoading.value = false
  }

  return {
    user: readonly(user),
    claims: readonly(claims),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    // Fungsi untuk memaksa refresh token dan claims
    forceRefreshUserToken: async () => {
      try {
        if ($auth.currentUser) await $auth.currentUser.getIdToken(true)
        await updateUserState($auth.currentUser)
      } catch (e: any) {
        const { logToServer } = useLogger()
        logToServer({
          level: 'error',
          message: 'Failed to force refresh user token',
          metadata: { error: e.message }
        })
        throw e
      }
    }
  }
}