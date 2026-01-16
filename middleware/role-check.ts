export default defineNuxtRouteMiddleware(async (to, from) => {
  // Middleware ini hanya berjalan di sisi klien, di mana state otentikasi sudah tersedia.
  if (process.server) return

  const requiredPermission = to.meta.permission as string | undefined

  // Jika rute tidak memerlukan permission spesifik, izinkan akses.
  if (!requiredPermission) {
    return
  }

  const { showNotification } = useNotification()
  const config = useRuntimeConfig()
  
  // 1. Tunggu hingga status otentikasi Firebase benar-benar siap (menghindari race condition)
  const token = await useFirebaseToken()
  const { claims, forceRefreshUserToken } = useAuth()

  // 1. Pastikan pengguna sudah login. Jika tidak, arahkan ke login.
  if (!token) {
    return navigateTo('/auth/login')
  }

  // 2. Pastikan data claims (role) sudah terisi. 
  // Jika token ada tapi claims masih kosong (karena useAuth belum update), paksa refresh.
  if (!claims.value?.role) {
    await forceRefreshUserToken()
  }


  // Cek Permission (Dinamis dari API)
  // Gunakan useState untuk cache data role agar tidak fetch berulang kali per navigasi
  const rbacRoles = useState<any[]>('rbacRoles', () => [])
  
  // Jika cache kosong, fetch dari API
  if (rbacRoles.value.length === 0) {
    try {
      // Mengambil konfigurasi role & permission dari backend
      const { data } = await $fetch<any>(`${config.public.API_URL}/rbac/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data) {
        rbacRoles.value = data
      }
    } catch (e: any) {
      const { logToServer } = useLogger();
      logToServer({
        level: 'error',
        message: 'Failed to fetch RBAC roles in role-check middleware',
        metadata: { error: e.message }
      });
      showNotification('Gagal memverifikasi izin akses.', 'error')
      return navigateTo('/forbidden')
    }
  }

  // Ambil role terbaru dari claims (setelah potensi await di atas selesai)
  // Gunakan optional chaining (?.) untuk keamanan jika claims belum siap
  const userRole = claims.value?.role || ''

  // Cari konfigurasi untuk role user saat ini
  const currentUserConfig = rbacRoles.value.find((r: any) => r.name === userRole)
  // Ambil daftar permission yang dimiliki role tersebut
  const userPermissions = currentUserConfig?.permissions?.map((p: any) => p.name) || []
  
  if (!userPermissions.includes(requiredPermission)) {
    showNotification('Anda tidak memiliki izin (permission) untuk mengakses halaman ini.', 'error')
    return navigateTo('/forbidden')
  }
  
  // Jika lolos permission check, return (izinkan akses)
  return
})