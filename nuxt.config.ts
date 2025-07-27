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