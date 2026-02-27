<template>
  <button @click="handleGoogleLogin" class="google-login-btn group">
    <div class="bg-white p-1.5 rounded-lg mr-3 shadow-sm group-hover:shadow transition-shadow">
      <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" alt="Google Logo" class="w-5 h-5">
    </div>
    <span class="text-sm font-bold text-gray-700">Google</span>
    <NotificationPopup />
  </button>
</template>

<script setup lang="ts">
const { signInWithGoogle } = useAuthActions()
const { log } = useLogger()

const handleGoogleLogin = async () => {
  try {
    await log({ action: 'GOOGLE_LOGIN_ATTEMPT', module: 'auth' })
    await signInWithGoogle()
    // Success is usually handled via redirect or the auth listener, 
    // but at least we log the attempt.
  } catch (error: any) {
    await log({ action: 'GOOGLE_LOGIN_FAILURE', module: 'auth', level: 'error', details: { error: error.message } })
  }
}
</script>

<style scoped>
.google-login-btn {
  @apply flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm w-full;
}
</style>