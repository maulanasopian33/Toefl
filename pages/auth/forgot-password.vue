<template>
  <div class="forgot-password-content space-y-6">
    <div class="text-center mb-4">
      <div class="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-full mb-4">
        <Icon name="heroicons:key" class="w-8 h-8" />
      </div>
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Lupa Kata Sandi?</h1>
      <p class="text-gray-500 text-sm leading-relaxed px-4">
        Masukkan alamat email Anda, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
      </p>
    </div>

    <!-- Email Field -->
    <div class="space-y-1">
      <label for="email" class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Alamat Email</label>
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

    <button @click="handleResetPassword" class="forgot-btn group">
      <span class="relative z-10 flex items-center justify-center">
        Kirim Tautan Reset
        <Icon name="heroicons:paper-airplane" class="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </span>
    </button>

    <!-- Success Feedback -->
    <Transition name="fade">
      <div v-if="success" class="mt-4 text-center space-y-4">
        <div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-medium">
          <p>Tautan reset kata sandi telah dikirim!</p>
        </div>
        <div class="text-xs text-gray-500">
          Kirim ulang dalam: <span class="font-bold text-emerald-600">{{ Math.floor(countdown / 60) }}:{{ (countdown % 60).toString().padStart(2, '0') }}</span>
        </div>
        <button 
          @click="handleResendCode" 
          :disabled="isResendDisabled"
          class="resend-btn"
        >
          {{ isResendDisabled ? 'Tunggu Sejenak...' : 'Kirim Ulang Kode' }}
        </button>
      </div>
    </Transition>

    <div class="pt-4 border-t border-gray-100 mt-6">
      <NuxtLink to="/auth/login" class="flex items-center justify-center text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors group">
        <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Login
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { startLoading, stopLoading } = useLoading();
const { setTitle, setDescription, NavLogin, NavRegister } = useLayoutStore();
const { resetPassword } = useAuthActions();

definePageMeta({ layout: 'auth' });
setTitle('Lupa Kata Sandi');
setDescription('Kami akan mengirimkan email berisi tautan untuk mengatur ulang kata sandi Anda');
NavLogin(false);
NavRegister(false);

const email = ref('');
const success = ref(false);
const countdown = ref(300);
const isResendDisabled = ref(false);
let countdownInterval: any = null;

const startCountdown = () => {
  isResendDisabled.value = true;
  countdown.value = 300;
  if (countdownInterval) clearInterval(countdownInterval);
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
  if (!email.value) return;
  startLoading();
  success.value = false;
  try {
    await resetPassword(email.value);
    success.value = true;
    startCountdown();
  } finally {
    stopLoading();
  }
};

const handleResendCode = async () => {
  await handleResetPassword();
};

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});
</script>

<style scoped>
.forgot-password-content {
  animation: fade-in-up 0.6s ease-out;
}

.auth-input {
  @apply block w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 p-3 transition-all duration-300 outline-none;
}

.auth-input:focus {
  @apply bg-white shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20;
}

.forgot-btn {
  @apply relative w-full bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 overflow-hidden shadow-lg shadow-emerald-600/20;
}

.resend-btn {
  @apply text-xs font-bold text-emerald-600 hover:text-emerald-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-leave-to {
  opacity: 0;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>