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
    public: {
      // Variabel yang tersedia di client dan server
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      API_URL: process.env.API_URL,
      MEDIA_URL: process.env.MEDIA_URL
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

  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@pinia/nuxt', '@vite-pwa/nuxt'],
  pwa: {
    manifest: {
      name: 'Toefl Exam App',
      short_name: 'ToeflApp',
      description: 'Aplikasi TOEFL Nuxt 3 dengan fitur PWA',
      theme_color: '#3b82f6',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'icons/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'icons/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})