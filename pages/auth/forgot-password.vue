<template>
  <div class="m-auto">
    <h1 class="text-3xl font-bold text-gray-800 text-center mb-2">Lupa Kata Sandi?</h1>

    <p class="text-gray-600 text-center mb-6 leading-relaxed">
      Masukkan alamat email yang terdaftar pada akun Anda. Kami akan mengirimkan email berisi tautan untuk mengatur ulang kata sandi Anda.
    </p>

    <div class="mb-4">
      <label for="email" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Masukkan alamat email Anda</label>
      <input type="email" v-model="email" required autocomplete="email" id="email"
        class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        placeholder="Alamat Email">
    </div>

    <button @click="handleResetPassword"
      class="bg-green-600 text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300">
      Masuk
    </button>
    <div v-if="success" class="mt-4 text-center">
      <p class="text-green-500">Tautan reset kata sandi telah dikirim!</p>
      <p class="text-sm text-gray-500 mt-2">
        Kirim ulang kode verifikasi dalam: {{ countdown }} detik
      </p>
      <button @click="handleResendCode" :disabled="isResendDisabled"
        :class="{ 'bg-gray-400 cursor-not-allowed': isResendDisabled, 'bg-green-600 hover:bg-green-700': !isResendDisabled }"
        class="mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300">
        {{ isResendDisabled ? `Kirim Ulang (${countdown})` : 'Kirim Ulang Kode Verifikasi' }}
      </button>
    </div>

    <NuxtLink to="/" class="mt-4 block text-center text-gray-500 hover:text-green-600 transition duration-300">
      Kembali ke Beranda
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuth } from '../../composables/Auth';
const { startLoading, stopLoading } = useLoading();
const { setTitle, setDescription, NavLogin, NavRegister } = useLayoutStore();
const email = ref('');
const success = ref(false);
const countdown = ref(300); // 5 minutes in seconds
const isResendDisabled = ref(false);
let countdownInterval: any = null;
const { resetPassword, error } = useAuth();

definePageMeta({
  layout: 'auth'
});

setTitle('Lupa Kata Sandi');
setDescription('Kami akan mengirimkan email berisi tautan untuk mengatur ulang kata sandi Anda');
NavLogin(false);
NavRegister(false);

const startCountdown = () => {
  isResendDisabled.value = true;
  countdown.value = 300; // Reset countdown to 5 minutes
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      isResendDisabled.value = false;
      clearInterval(countdownInterval);
    }
  }, 1000);
};

const handleResetPassword = async () => {
  startLoading();
  success.value = false;
  await resetPassword(email.value);
  if (!error.value) {
    success.value = true;
    stopLoading();
    startCountdown();
  }
};

const handleResendCode = async () => {
  await handleResetPassword();
};

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style>
/* You can add custom styles here if needed */
</style>