<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center">
      <button class="mr-4 lg:hidden" @click="$emit('toggleSidebar')">
        <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
          Good morning {{ user?.displayName || user?.email }}
          <span class="ml-2">👋</span>
        </h1>
        <p class="text-gray-500 text-sm">Time to rise up for today's</p>
      </div>
    </div>
    
    <div class="flex items-center space-x-4">
      <div class="hidden sm:block text-right">
        <p class="text-xs text-gray-500">Your balance</p>
        <p class="text-lg font-semibold text-teal-600">$566.55</p>
      </div>
      <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['toggleSidebar']);
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