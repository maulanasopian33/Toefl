<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-800 mb-6 rounded-md">Registrasi</h2>
    <div class="mb-4">
        <label for="full_name" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Nama Lengkap</label>
        <input type="text" id="full_name" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Masukkan nama lengkap Anda">
    </div>
    <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Alamat Email</label>
        <input v-model="email" type="email" id="email" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Masukkan email Anda">
    </div>
    <div class="mb-4">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Kata Sandi</label>
        <input v-model="password" type="password" id="password" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Masukkan kata sandi">
    </div>
    <div class="mb-6">
        <label for="confirm_password" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Konfirmasi Kata Sandi</label>
        <input type="password" id="confirm_password" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Konfirmasi kata sandi Anda">
    </div>
    <!-- Registration Button -->
    <button @click="handleRegister" class="bg-green-600 text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300">
        Registrasi
    </button>
    <NotificationPopup />
  </div>
</template>

<script lang="ts" setup>
  const { setTitle, setDescription, NavLogin, NavRegister } = useLayoutStore();
  definePageMeta({
    layout: 'auth'
  })
  setTitle('Buat Akun Baru');
  setDescription('Bergabunglah dengan komunitas ToaflArabi dan mulailah perjalanan belajar bahasa Arab Anda.');
  NavLogin(true);
  NavRegister(false);
  
  import { createUserWithEmailAndPassword } from 'firebase/auth';
const { showAlert } = useNotificationPopup();
// Dapatkan instance autentikasi dari plugin
const { $auth } = useNuxtApp();

const email = ref('');
const password = ref('');
const error = ref(null);
const handleRegister = async () => {
  const config = useRuntimeConfig();
  try {
    error.value = null; // Reset error
    const userCredential = await createUserWithEmailAndPassword($auth, email.value, password.value);
    const user = userCredential.user;

    // Setelah registrasi Firebase berhasil, panggil backend untuk sinkronisasi
    const idToken = await user.getIdToken();
    await $fetch(`${config.public.API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: {
        // Kirim data tambahan jika diperlukan oleh backend
        name: 'Pengguna Baru' // Contoh, bisa diambil dari form
      }
    });
    
    // Pendaftaran berhasil, Anda bisa mengarahkan pengguna ke halaman lain
    showAlert('Pendaftaran berhasil!');
    navigateTo('/'); // Arahkan ke halaman utama, middleware akan mengurus sisanya
  } catch (err : any) {
    console.log(err);
    switch (err.code) {
      case 'auth/email-already-in-use':
        showAlert('Email sudah terdaftar. Silakan gunakan email lain.');
        break;
      case 'auth/invalid-email':
        showAlert('Email tidak valid. Silakan coba lagi.');
        break;
      case 'auth/weak-password':
        showAlert('Kata sandi terlalu lemah. Silakan gunakan kata sandi yang lebih kuat.');
        break;
      default:
        showAlert('Pendaftaran gagal. Silakan coba lagi.');
        break;
    }
  }
};
</script>

<style>

</style>