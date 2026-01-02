export default defineNuxtRouteMiddleware(async (to, from) => {
  // Middleware ini hanya berjalan di sisi klien, di mana state otentikasi sudah tersedia.
  if (process.server) return

  const requiredRoles = to.meta.roles as string[] | undefined

  // Jika rute tidak memerlukan role spesifik, izinkan akses.
  if (!requiredRoles || requiredRoles.length === 0) {
    return
  }

  const { claims, isAuthenticated, isLoading } = useAuth()
  const { showNotification } = useNotification()

  // Tunggu hingga state otentikasi selesai dimuat
  if (isLoading.value) {
    // Anda bisa menambahkan logika loading di sini jika perlu,
    // tapi untuk sekarang kita tunggu saja.
    await new Promise(resolve => setTimeout(resolve, 50)) // simple delay
  }
  
  // Jika pengguna terotentikasi dan rolenya tidak termasuk dalam yang diizinkan, tangani pengalihan.
  if (isAuthenticated.value && !requiredRoles.includes(claims.value.role || '')) {
    const userRole = claims.value.role
    
    // Jika pengguna yang tidak diizinkan memiliki role selain 'user' (misal: admin, proctor),
    // arahkan mereka ke dashboard admin.
    if (userRole !== 'user') {
      return navigateTo('/admin')
    }

    // Jika pengguna dengan role 'user' mencoba mengakses halaman terlarang, arahkan ke 'forbidden'.
    showNotification('Anda tidak memiliki izin untuk mengakses halaman ini.', 'error')
    return navigateTo('/forbidden')
  }
})