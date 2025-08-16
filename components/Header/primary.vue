<template>
  <header class="bg-green-700 text-white p-4 shadow-md">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 class="text-3xl font-bold mb-2 md:mb-0">{{ AppConfig.appName }}</h1>
          <div v-if="user" class="flex items-center space-x-4">
            <img id="userImage" :src="imageURL" alt="User Avatar" class="w-10 h-10 rounded-full"></img>
              <span id="userName" class="text-lg">Selamat datang, {{ user.displayName || user.email }}!</span>
              <button @click="logout()" class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out">
                  Keluar
                </button>
          </div>
          <div v-else class="flex items-center space-x-4">
              <span id="userName" class="text-lg">Selamat datang, Pengguna!</span>
              <button @click="login()" class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out">
                  Masuk
              </button>
          </div>
      </div>
  </header>
</template>

<script lang="ts" setup>
import { AppConfig } from '@/data/AppConfig';
import { signOut } from 'firebase/auth';
const router = useRouter();
const { startLoading, stopLoading } = useLoading();
// Dapatkan instance auth dari plugin
const { $auth } = useNuxtApp();
const config = useRuntimeConfig()
const API_URL = config.public.API_URL 
const imageURL = ref('')
// Gunakan ref() untuk user object agar reaktif
const user = ref();

// Memantau perubahan status autentikasi
onMounted(() => {
  $auth.onAuthStateChanged(firebaseUser => {
    user.value = firebaseUser;
    console.log(user.value)
    imageURL.value = API_URL + '/images/avatar/' + user.value.uid + '.png'

  });
});

const logout = async () => {
  try {
    startLoading();
    await signOut($auth);
    router.push('/auth/login'); // Redirect ke halaman login setelah logout
  } catch (error) {
    stopLoading();
  } finally {
    stopLoading();
  }
};

const login = () => {
  router.push('/auth/login'); // Redirect ke halaman login
};

</script>

<style>

</style>