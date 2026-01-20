<template>
  <div class="register-content space-y-6">
    <div class="mb-4">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Daftar Akun</h1>
      <p class="text-gray-500 text-sm">Bergabunglah untuk memulai perjalanan Anda.</p>
    </div>

    <!-- Name Field -->
    <div class="space-y-1">
      <label for="full_name" class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:user" class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input v-model="name" type="text" id="full_name" class="auth-input !pl-10" placeholder="Masukkan nama lengkap">
      </div>
    </div>

    <!-- Email Field -->
    <div class="space-y-1">
      <label for="email" class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:envelope" class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input v-model="email" type="email" id="email" autocomplete="email" class="auth-input !pl-10" placeholder="nama@email.com">
      </div>
    </div>

    <!-- Password Field -->
    <div class="space-y-1">
      <label for="password" class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:lock-closed" class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input 
          :type="showPassword ? 'text' : 'password'" 
          v-model="password" 
          id="password" 
          autocomplete="new-password" 
          class="auth-input !px-10" 
          placeholder="••••••••"
        >
        <button 
          type="button" 
          @click="showPassword = !showPassword" 
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
        >
          <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Confirm Password Field -->
    <div class="space-y-1">
      <label for="confirm_password" class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Konfirmasi Password</label>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:shield-check" class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input 
          :type="showPassword ? 'text' : 'password'" 
          v-model="confirmPassword" 
          id="confirm_password" 
          autocomplete="new-password" 
          class="auth-input !pl-10" 
          placeholder="••••••••"
        >
      </div>
    </div>

    <!-- Error/Status Message -->
    <Transition name="fade">
      <div v-if="errorMsg" class="flex items-center space-x-2 text-red-500 text-xs font-medium bg-red-50 p-3 rounded-xl border border-red-100">
        <Icon name="heroicons:exclamation-circle" class="w-4 h-4" />
        <span>{{ errorMsg }}</span>
      </div>
    </Transition>

    <!-- Registration Button -->
    <button @click="handleRegister" :disabled="!isFormValid" class="register-btn group">
      <span class="relative z-10 flex items-center justify-center">
        Daftar Sekarang
        <Icon name="heroicons:sparkles" class="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
      </span>
    </button>
    <NotificationPopup />
  </div>
</template>

<script lang="ts" setup>
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';

const { setTitle, setDescription, NavLogin, NavRegister } = useLayoutStore();
const { showNotification: showAlert } = useNotification();
const { startLoading, stopLoading } = useLoading();
const { $auth } = useNuxtApp();

definePageMeta({ layout: 'auth' });
setTitle('Buat Akun Baru');
setDescription('Bergabunglah dengan komunitas ToaflArabi dan mulailah perjalanan belajar bahasa Arab Anda.');
NavLogin(true);
NavRegister(false);

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const errorMsg = ref('');

const isFormValid = computed(() => {
  return name.value.length >= 3 && 
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && 
         password.value.length >= 8 && 
         password.value === confirmPassword.value;
});

const handleRegister = async () => {
  if (!isFormValid.value) return;
  
  const config = useRuntimeConfig();
  startLoading();
  errorMsg.value = '';
  let firebaseUser = null;

  try {
    const userCredential = await createUserWithEmailAndPassword($auth, email.value, password.value);
    firebaseUser = userCredential.user;

    const idToken = await firebaseUser.getIdToken();
    await $fetch(`${config.public.API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: { name: name.value }
    });
    
    showAlert('Pendaftaran berhasil!');
    navigateTo('/');

  } catch (err: any) {
    if (firebaseUser) {
      await deleteUser(firebaseUser);
    }

    if (err.code) {
      switch (err.code) {
        case 'auth/email-already-in-use': errorMsg.value = 'Email sudah terdaftar.'; break;
        case 'auth/invalid-email': errorMsg.value = 'Format email tidak valid.'; break;
        case 'auth/weak-password': errorMsg.value = 'Password minimal 6 karakter.'; break;
        default: errorMsg.value = 'Pendaftaran gagal. Silakan coba lagi.'; break;
      }
    } else {
      errorMsg.value = err.data?.message || 'Terjadi kesalahan pada server.';
    }
  } finally {
    stopLoading();
  }
};
</script>

<style scoped>
.register-content {
  animation: fade-in-up 0.6s ease-out;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.auth-input {
  @apply block w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 p-3 transition-all duration-300 outline-none;
}

.auth-input:focus {
  @apply bg-white shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20;
}

.register-btn {
  @apply relative w-full bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 overflow-hidden shadow-lg shadow-emerald-600/20;
}

.register-btn:disabled {
  @apply opacity-50 cursor-not-allowed grayscale;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>