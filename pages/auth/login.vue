<template>
  <div class="login-content">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Selamat Datang</h1>
      <p class="text-gray-500">Silakan masuk untuk melanjutkan.</p>
    </div>

    <!-- Social Login Buttons -->
    <div class="mb-8">
      <LoginGoogleMethod />
    </div>

    <!-- Separator -->
    <div class="relative flex py-4 items-center mb-6">
      <div class="flex-grow border-t border-gray-200"></div>
      <span class="flex-shrink mx-4 text-xs font-medium text-gray-400 uppercase tracking-widest">Atau</span>
      <div class="flex-grow border-t border-gray-200"></div>
    </div>

    <!-- Login Form -->
    <LoginEmailPassword />
  </div>
</template>

<script setup>
const { setTitle, setDescription, NavLogin, NavRegister } = useLayoutStore();
definePageMeta({
  layout: 'auth'
})
setTitle('Masuk Ke');
setDescription('ToaflArabi adalah platform pembelajaran bahasa Arab yang interaktif dan mudah digunakan.');
NavLogin(false);
NavRegister(true);
</script>

<style scoped>
.login-content {
  animation: fade-in-up 0.6s ease-out;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.social-btn {
  @apply flex items-center justify-center p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm;
}
</style>