<template>
  <div class="disable-content space-y-8 py-4">
    <!-- Icon/Illustration -->
    <div class="text-center relative">
       <div class="inline-flex items-center justify-center p-5 bg-red-100 text-red-600 rounded-full mb-6 relative z-10">
         <Icon name="heroicons:no-symbol" class="w-12 h-12" />
       </div>
       <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-50 rounded-full animate-pulse-slow"></div>
    </div>

    <div class="text-center space-y-4">
      <h1 class="text-3xl font-extrabold text-gray-900 leading-tight">Akun Anda Dinonaktifkan</h1>
      <p class="text-gray-500 text-sm leading-relaxed px-2">
        Mohon maaf, akses akun Anda saat ini sedang dibatasi. Hal ini bisa disebabkan oleh pelanggaran kebijakan atau pemeliharaan keamanan.
      </p>
    </div>

    <!-- Actions -->
    <div class="space-y-4 pt-4">
      <a href="#" class="support-btn group">
        <span class="relative z-10 flex items-center justify-center">
          Hubungi Tim Dukungan
          <Icon name="heroicons:chat-bubble-left-right" class="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
        </span>
      </a>
      <nuxt-link to="/" class="back-home-btn group">
        <span class="relative z-10 flex items-center justify-center text-gray-600 font-bold text-sm">
          Kembali ke Beranda
        </span>
      </nuxt-link>
    </div>

    <!-- Help text -->
    <div class="text-center pt-6 text-xs text-gray-400">
      Butuh bantuan mendesak? <span class="text-emerald-600 font-bold cursor-pointer hover:underline">Klik di sini</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { setTitle, setDescription, NavLogin, NavRegister } = useLayoutStore();
definePageMeta({ layout: 'auth' });

setTitle('Akses Dibatasi');
setDescription('Keamanan akun Anda adalah prioritas kami.');
NavLogin(false);
NavRegister(false);
</script>

<style scoped>
.disable-content {
  animation: fade-in-up 0.6s ease-out;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.support-btn {
  @apply relative w-full bg-red-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all duration-300 shadow-lg shadow-red-600/20 overflow-hidden;
}

.back-home-btn {
  @apply relative w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl hover:bg-white hover:border-gray-300 transition-all duration-300 block;
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: .5; transform: translate(-50%, -50%) scale(1.2); }
}
</style>