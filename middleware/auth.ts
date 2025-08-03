// middleware/auth.js
// Pastikan nama file ini adalah auth.js atau serupa
// tidak perlu .client.js atau .server.js di nama middleware
// karena Nuxt akan menentukannya secara otomatis
import { getAuth } from 'firebase/auth'; // Import getAuth langsung

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Pastikan kode ini hanya dijalankan di sisi klien
  if (process.client) {
    const auth = getAuth(); // Ambil instance auth di sini

    return new Promise((resolve) => {
      // Firebase onAuthStateChanged bersifat asinkron dan berjalan di client
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          // Pengguna belum login, redirect ke halaman login
          return resolve(navigateTo('/login')); // Gunakan navigateTo dari Nuxt 3
        }
        unsubscribe(); // Berhenti mendengarkan setelah status diketahui
        resolve();
      });
    });
  }
});