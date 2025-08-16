<template>
  <div>
    <!-- Ikon peringatan -->
        <div class="flex justify-center mb-6">
            <svg class="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>

        <!-- Judul halaman -->
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Akun Anda Dinonaktifkan</h1>
        
        <!-- Deskripsi/pesan untuk pengguna -->
        <p class="text-gray-600 mb-6 leading-relaxed text-center">
            Mohon maaf, akun Anda saat ini tidak aktif. Hal ini mungkin disebabkan oleh beberapa alasan.
            Silakan hubungi tim dukungan kami untuk informasi lebih lanjut dan untuk mengajukan permohonan pengaktifan kembali.
        </p>

        <!-- Informasi kontak dan tombol -->
        <div class="flex flex-col gap-5">
            <a href="#" class="bg-green-600 text-center text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300">
                Hubungi Dukungan
            </a>
            <nuxt-link to="/" class="bg-gray-100 text-gray-700 text-center px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition duration-300">
                Kembali ke Halaman Utama
            </nuxt-link>
        </div>
  </div>
</template>

<script lang="ts" setup>
const { setTitle, setDescription, NavLogin, NavRegister } = useLayoutStore();
definePageMeta({
    layout: 'auth'
});
setTitle('Pembuatan Akun');
setDescription('Bergabunglah dengan komunitas ToaflArabi dan mulailah perjalanan belajar bahasa Arab Anda.');
NavLogin(false);
NavRegister(false);
</script>

<style>

</style>