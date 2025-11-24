<template>
  <div>
    <!-- Login Form Fields -->
    <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Masukkan alamat email Anda</label>
        <input type="email" v-model="email" required autocomplete="email" id="email" class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Nama pengguna atau email">
    </div>
    <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2 rounded-md">Masukkan Kata Sandi Anda</label>
        <input type="password" @focus="showPasswordStrength = true" @blur="showPasswordStrength = false" v-model="password" id="password" class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Kata sandi">
        <strength-password @PassedPassword="handlePasswordStatus" :password="password" :showPasswordStrength="showPasswordStrength"/>
        <p v-show="password.length > 0" :class="PassedPassword ? 'text-green-600 border-green-600 bg-green-200' : 'text-red-600 border-red-600 bg-red-200'" class="px-3 py-2 rounded-md border">
          {{ PassedPassword ? 'Kata sandi memenuhi syarat!' : 'Kata sandi tidak valid.' }}
        </p>
        <nuxt-link to="/auth/forgot-password" class="inline-block align-baseline font-bold text-sm text-green-600 hover:text-green-800 rounded-md mt-5">Lupa Kata Sandi?</nuxt-link>
    </div>


    <!-- Sign In Button -->
    <button :disabled="!PassedPassword" :class="{'opacity-50 cursor-not-allowed': !PassedPassword}" @click="handleLogin()" class="bg-green-600 text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300">
        Masuk
    </button>
  </div>
</template>

<script lang="ts" setup>
const { startLoading, stopLoading } = useLoading();
const { loginEmailPassword} = useAuthActions();
const email = ref('');
const password = ref('');
const showPasswordStrength = ref(false);
const PassedPassword = ref(false);

const handleLogin = async () => {
  try {
    startLoading();
    await loginEmailPassword(email.value, password.value);
  } catch (error) {
    stopLoading();
    console.log(error)
  } finally {
    stopLoading();
  }
}

const handlePasswordStatus = (status : boolean) => {
  PassedPassword.value = status;
};
</script>

<style>

</style>