// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  alias: {
    '~': './', // Secara default, '~' juga menunjuk ke root proyek
    '~~': './', // Secara default, '~~' juga menunjuk ke root proyek
    '@components': './components', // Contoh alias kustom
    '@utils': './utils', // Contoh alias kustom lainnya
  },

  runtimeConfig: {
    // Variabel yang hanya tersedia di server (untuk API keys sensitif, dll.)
    // Tidak diperlukan untuk Firebase config karena akan diakses di client
    test: '123',
    public: {
      // Variabel yang tersedia di client dan server
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    }
  },
  nitro: {
    prerender: {
      // Tambahkan rute default jika Anda ingin index.html dibuat saat generate
      // Ini akan menghasilkan index.html untuk '/'
      routes: ['/']
    },
    output: {
      // Pastikan output directory public ada jika menggunakan preset 'static'
      publicDir: './.output/public'
    },
    // *** Bagian penting untuk shared hosting tanpa server Node.js ***
    preset: 'static' // Ini akan memaksa Nitro untuk menghasilkan file statis
  },

  modules: ['@nuxtjs/tailwindcss']
})