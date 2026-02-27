<template>
  <div class="space-y-6">
    <!-- Email Field -->
    <div class="space-y-2">
      <label for="email" class="text-sm font-semibold text-gray-700 ml-1">Email</label>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:envelope" class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input 
          type="email" 
          v-model="email" 
          required 
          autocomplete="email" 
          id="email" 
          class="auth-input !pl-10" 
          placeholder="nama@email.com"
        >
      </div>
    </div>

    <!-- Password Field -->
    <div class="space-y-2">
      <div class="flex justify-between items-center ml-1">
        <label for="password" class="text-sm font-semibold text-gray-700">Password</label>
        <nuxt-link to="/auth/forgot-password" class="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Lupa Password?</nuxt-link>
      </div>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:lock-closed" class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input 
          :type="showPassword ? 'text' : 'password'" 
          v-model="password" 
          id="password" 
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

    <!-- Error/Status Message (Optional) -->
    <Transition name="fade">
      <div v-if="password.length > 0 && !isPasswordValid" class="flex items-center space-x-2 text-red-500 text-xs font-medium bg-red-50 p-2 rounded-lg border border-red-100">
        <Icon name="heroicons:exclamation-circle" class="w-4 h-4" />
        <span>Password minimal 8 karakter.</span>
      </div>
    </Transition>

    <!-- Sign In Button -->
    <button 
      :disabled="!isValid" 
      @click="handleLogin()" 
      class="login-btn group"
    >
      <span class="relative z-10 flex items-center justify-center">
        Masuk
        <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </span>
    </button>
  </div>
</template>

<script lang="ts" setup>
const { startLoading, stopLoading } = useLoading();
const { loginEmailPassword } = useAuthActions();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const isPasswordValid = computed(() => password.value.length >= 8);
const isValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value) && isPasswordValid.value;
});

const { log } = useLogger();

const handleLogin = async () => {
  if (!isValid.value) return;
  try {
    startLoading();
    await log({ action: 'LOGIN_ATTEMPT', module: 'auth', details: { email: email.value } });
    await loginEmailPassword(email.value, password.value);
    await log({ action: 'LOGIN_SUCCESS', module: 'auth', details: { email: email.value } });
  } catch (error: any) {
    console.error('[Login] Error:', error);
    await log({ action: 'LOGIN_FAILURE', module: 'auth', level: 'error', details: { email: email.value, error: error.message } });
  } finally {
    stopLoading();
  }
}
</script>

<style scoped>
.auth-input {
  @apply block w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 p-3 transition-all duration-300 outline-none;
}

.auth-input:focus {
  @apply bg-white shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20;
}

.login-btn {
  @apply relative w-full bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 overflow-hidden shadow-lg shadow-emerald-600/20;
}

.login-btn:disabled {
  @apply opacity-50 cursor-not-allowed grayscale;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>