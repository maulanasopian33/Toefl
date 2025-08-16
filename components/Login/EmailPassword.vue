<template>
  <div>
    <!-- Login Form Fields -->
    <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Masukkan alamat email Anda</label>
        <input type="email" v-model="email" required autocomplete="email" id="email" class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Nama pengguna atau email">
    </div>
    <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Masukkan Kata Sandi Anda</label>
        <input type="password" v-model="password" id="password" class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Kata sandi">
        <a href="#" class="inline-block align-baseline font-bold text-sm text-green-600 hover:text-green-800 rounded-md">Lupa Kata Sandi?</a>
    </div>

    <!-- Sign In Button -->
    <button @click="handleLogin()" class="bg-green-600 text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300">
        Masuk
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from '../../composables/Auth';

const { loginEmailPassword, error} = useAuth();
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    await loginEmailPassword(email.value, password.value);
  } catch (error) {
    console.log(error)
  }
}
</script>

<style>

</style>