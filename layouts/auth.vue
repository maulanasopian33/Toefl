<template>
  <HeaderPrimary/>
  <div class="auth-wrapper min-h-screen w-full flex items-center justify-center p-4">
    <!-- Animated Background Mesh -->
    <div class="bg-mesh"></div>

    <div class="glass-card flex flex-col lg:flex-row max-w-4xl w-full">
      <!-- Left Section (Illustration and Intro Text) -->
      <div class="lg:w-1/2 p-10 flex-col justify-between text-white relative overflow-hidden hidden lg:flex">
        <div class="relative z-10">
          <h2 class="text-4xl font-bold mb-4 tracking-tight">{{ state.title }}</h2>
          <p class="text-lg opacity-90 leading-relaxed font-light">{{ state.description }}</p>
        </div>
        
        <div class="illustration-container relative z-10 my-8">
           <div class="blob-animation"></div>
           <div class="illustration-placeholder"></div>
        </div>

        <div class="relative z-10">
          <!-- Removed hardcoded profiles -->
        </div>
      </div>

      <!-- Right Section (Login Form) -->
      <div class="flex-1 p-10 flex flex-col bg-white/95 backdrop-blur-sm lg:rounded-r-2xl rounded-2xl lg:rounded-l-none">
        <div class="flex justify-end text-sm mb-8" v-if="state.navlogin || state.navregister">
          <span class="text-gray-500" v-if="!state.navlogin">Belum punya akun?</span>
          <span class="text-gray-500" v-if="!state.navregister">Sudah punya akun?</span>
          <nuxt-link to="/auth/register" class="text-emerald-600 font-bold ml-2 hover:text-emerald-700 transition-colors" v-if="!state.navlogin">Daftar</nuxt-link>
          <nuxt-link to="/auth/login" class="text-emerald-600 font-bold ml-2 hover:text-emerald-700 transition-colors" v-if="!state.navregister">Login</nuxt-link>
        </div>
        <NuxtPage/>
      </div>
    </div>
    <LoadingPopup/>
  </div>
</template>

<script lang="ts" setup>
const { state } = useLayoutStore();
</script>

<style scoped>
.auth-wrapper {
  background: #f8fafc;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.bg-mesh {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 20%, #effaf5 0%, transparent 25%),
              radial-gradient(circle at 70% 60%, #f0fdf4 0%, transparent 25%),
              radial-gradient(circle at 40% 80%, #ecfdf5 0%, transparent 25%);
  animation: mesh-float 20s ease-in-out infinite alternate;
  z-index: 0;
}

@keyframes mesh-float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-5%, -5%) rotate(5deg); }
}

.glass-card {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25);
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.user-chip {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-chip:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.illustration-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blob-animation {
  position: absolute;
  width: 150px;
  height: 150px;
  background: white;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  opacity: 0.15;
  animation: blob-float 8s infinite alternate;
}

@keyframes blob-float {
  0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: scale(1); }
  100% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; transform: scale(1.2); }
}

.illustration-placeholder {
  width: 100%;
  height: 100%;
  background: url('https://illustrations.popsy.co/white/startup-launch.svg') no-repeat center;
  background-size: contain;
}
</style>