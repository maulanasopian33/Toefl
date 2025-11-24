<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-800 mb-6 rounded-md">Registrasi</h2>
    <div class="mb-4">
        <label for="full_name" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Nama Lengkap</label>
        <input v-model="name" type="text" id="full_name" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Masukkan nama lengkap Anda">
    </div>
    <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Alamat Email</label>
        <input v-model="email" type="email" id="email" autocomplete="email" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Masukkan email Anda">
    </div>
    <div class="mb-4">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Kata Sandi</label>
        <input v-model="password" type="password" id="password" autocomplete="new-password" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Masukkan kata sandi">
    </div>
    <div class="mb-6">
        <label for="confirm_password" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Konfirmasi Kata Sandi</label>
        <input v-model="confirmPassword" type="password" id="confirm_password" autocomplete="new-password" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Konfirmasi kata sandi Anda">
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
  
  import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
const { showNotification: showAlert } = useNotification(); // Menggunakan useNotification dan alias sebagai showAlert
const { startLoading, stopLoading } = useLoading();
// Dapatkan instance autentikasi dari plugin
const { $auth } = useNuxtApp();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleRegister = async () => {
  const config = useRuntimeConfig();

  // 1. Validasi Input Frontend
  if (!name.value || !email.value || !password.value) {
    return showAlert('Semua kolom wajib diisi.', 'error');
  }
  if (password.value !== confirmPassword.value) {
    return showAlert('Konfirmasi kata sandi tidak cocok.', 'error');
  }

  startLoading();
  let firebaseUser = null;

  try {
    // 2. Buat pengguna di Firebase Auth
    const userCredential = await createUserWithEmailAndPassword($auth, email.value, password.value);
    firebaseUser = userCredential.user;

    // 3. Sinkronisasi ke backend Anda
    const idToken = await firebaseUser.getIdToken();
    await $fetch(`${config.public.API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: { name: name.value }
    });
    
    // 4. Jika semua berhasil
    showAlert('Pendaftaran berhasil!');
    navigateTo('/'); // Arahkan ke halaman utama, middleware akan mengurus sisanya

  } catch (err: any) {
    // 5. Penanganan Error
    if (firebaseUser) {
      // Jika error terjadi SETELAH user Firebase dibuat (misal: backend gagal),
      // hapus user di Firebase untuk rollback.
      await deleteUser(firebaseUser);
      console.error("Backend sync failed. Rolled back Firebase user creation.");
    }

    // Tampilkan pesan error yang lebih spesifik
    if (err.code) { // Error dari Firebase
      switch (err.code) {
        case 'auth/email-already-in-use':
          showAlert('Email sudah terdaftar. Silakan gunakan email lain.', 'error');
          break;
        case 'auth/invalid-email':
          showAlert('Format email tidak valid.');
          break;
        case 'auth/weak-password':
          showAlert('Kata sandi terlalu lemah (minimal 6 karakter).', 'error');
          break;
        default:
          showAlert('Pendaftaran gagal. Silakan coba lagi.', 'error');
          break;
      }
    } else { // Error dari backend ($fetch) atau lainnya
      showAlert(err.data?.message || 'Terjadi kesalahan pada server. Coba lagi nanti.', 'error');
    }
  } finally {
    stopLoading();
  }
};
</script>

<style>

</style>