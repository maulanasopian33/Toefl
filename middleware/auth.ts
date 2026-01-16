// middleware/auth.js
// Pastikan nama file ini adalah auth.js atau serupa
// tidak perlu .client.js atau .server.js di nama middleware
// karena Nuxt akan menentukannya secara otomatis
import { getAuth } from 'firebase/auth'; // Import getAuth langsung
import { useLogger } from '@/composables/useLogger';
const { startLoading, stopLoading } = useLoading()
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Pastikan kode ini hanya dijalankan di sisi klien
  startLoading();
  if (process.client) {
    const auth = getAuth(); // Ambil instance auth di sini

    return new Promise((resolve) => {
      // Firebase onAuthStateChanged bersifat asinkron dan berjalan di client
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        stopLoading();
        if (!user) {
          // Pengguna belum login, redirect ke halaman login
          return resolve(navigateTo('/auth/login')); // Gunakan navigateTo dari Nuxt 3
        }

        // Jika pengguna mengakses halaman root ('/') dan memiliki role selain 'user', arahkan ke /admin
        if (to.path === '/') {
          try {
            const tokenResult = await user.getIdTokenResult();
            const role = tokenResult.claims.role;
            if (role && role !== 'user') {
              unsubscribe();
              return resolve(navigateTo('/admin'));
            }
          } catch (e: any) {
            const { logToServer } = useLogger();
            logToServer({
              level: 'error',
              message: 'Failed to get ID token result in auth middleware',
              metadata: { error: e.message }
            });
          }
        }

        unsubscribe(); // Berhenti mendengarkan setelah status diketahui
        resolve();
      });
    });
  }
});