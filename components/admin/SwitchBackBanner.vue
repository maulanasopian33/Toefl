<template>
  <div v-if="isAdminBack" class="fixed top-0 left-0 right-0 z-[100] bg-indigo-600 text-white px-4 py-2 flex items-center justify-between shadow-lg animate-slide-down border-b border-white/10">
    <div class="flex items-center gap-3">
      <div class="p-1.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/10">
        <Icon name="lucide:user-cog" class="w-5 h-5" />
      </div>
      <div>
        <p class="text-sm font-bold tracking-tight">Mode "Login Sebagai User" Aktif</p>
        <p class="text-[11px] opacity-70 font-medium">Anda sedang melihat aplikasi dari perspektif pengguna.</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
        <button 
        @click="switchBack" 
        class="bg-white text-indigo-600 px-5 py-1.5 rounded-full text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-md active:scale-95"
        :disabled="isSwitching"
        >
        <Icon v-if="isSwitching" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
        <Icon v-else name="lucide:log-out" class="w-3.5 h-3.5" />
        {{ isSwitching ? 'Memproses...' : 'Kembali ke Admin' }}
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { signInWithCustomToken } from 'firebase/auth';

const isAdminBack = ref(false);
const isSwitching = ref(false);
const { $auth } = useNuxtApp();

const checkStatus = () => {
  isAdminBack.value = !!localStorage.getItem('admin_token_backup');
};

let interval: any;
onMounted(() => {
  checkStatus();
  // Check periodically or via storage event if opened in another tab
  interval = setInterval(checkStatus, 2000);
  window.addEventListener('storage', checkStatus);
});

onUnmounted(() => {
    clearInterval(interval);
    window.removeEventListener('storage', checkStatus);
});

const switchBack = async () => {
  const adminToken = localStorage.getItem('admin_token_backup');
  if (!adminToken) return;

  isSwitching.value = true;
  try {
    // 1. Sign in kembali menggunakan token admin yang disimpan
    // @ts-ignore
    await signInWithCustomToken($auth, adminToken);
    
    // 2. Hapus backup
    localStorage.removeItem('admin_token_backup');
    
    // 3. Clear state pinia/auth jika diperlukan (biasanya reaktif lewat useAuth)
    // Untuk memastikan semua state bersih, reload adalah cara paling aman
    window.location.href = '/admin/peserta';
    
  } catch (error) {
    console.error('Failed to switch back:', error);
    // Jika gagal, setidaknya hapus backup agar banner hilang
    localStorage.removeItem('admin_token_backup');
    window.location.reload();
  } finally {
    isSwitching.value = false;
  }
};
</script>

<style scoped>
.animate-slide-down {
  animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
