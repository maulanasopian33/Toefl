<template>
  <div>
    <button @click="signInWithGoogle" class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition duration-300">
      <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" alt="Google Logo" class="google-logo mr-4">
      Login dengan Google
    </button>
    <NotificationPopup />
  </div>
</template>

<script setup>
import { signInWithPopup } from 'firebase/auth';
const { showAlert, showConfirm } = useNotificationPopup();
// Dapatkan instance auth dan googleProvider dari plugin
// Gunakan useNuxtApp() untuk mengakses provide dari plugin
const { $auth, $googleProvider } = useNuxtApp();
const router = useRouter(); // Nuxt 3 menggunakan useRouter()

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup($auth, $googleProvider);
    // Autentikasi berhasil!
    const user = result.user;
    console.log('User logged in:', user);

    // Redirect ke halaman dashboard atau beranda setelah login berhasil
    router.push('/'); // Ganti dengan path halaman beranda kamu
  } catch (err) {
    if (err.code === 'auth/popup-closed-by-user') {
      showAlert('Login dibatalkan oleh pengguna.');
    }
  }
};

// Mengecek apakah pengguna sudah login saat komponen dimuat
// Gunakan onMounted untuk lifecycle hook
onMounted(() => {
  $auth.onAuthStateChanged(user => {
    if (user) {
      console.log('User already logged in:', user);
      router.push('/');
    }
  });
});
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

.google-button {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s ease;
}

.google-button:hover {
  background-color: #357ae8;
}

.google-logo {
  width: 20px;
  height: 20px;
}

.error-message {
  color: red;
  margin-top: 20px;
}
</style>