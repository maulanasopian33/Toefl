<template>
  <div class="select-none" @contextmenu.prevent="handleContextMenu">
    <slot />

    <!-- Popup Peringatan Modern -->
    <Transition name="fade">
      <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm z-[100] px-4">
        <div class="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl shadow-red-500/10 text-center max-w-sm w-full border border-white transform transition-all duration-500 scale-100 animate-bounce-in">
          <div class="mb-6 relative inline-flex">
            <div class="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div class="relative w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
              <Icon name="heroicons:exclamation-triangle-solid" class="h-10 w-10 text-red-500" />
            </div>
          </div>
          
          <h2 class="text-2xl font-black text-gray-900 mb-3 tracking-tight">Eits, Gak Boleh!</h2>
          <p class="text-gray-500 mb-8 font-medium leading-relaxed">
            {{ warningMessage }}
          </p>
          
          <button @click="closePopup"
                  class="w-full px-6 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center space-x-2">
            <Icon name="heroicons:check-badge" class="w-5 h-5" />
            <span>Saya Mengerti</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits(['action-detected']);

const showPopup = ref(false);
const warningMessage = ref('');
const lastHiddenTime = ref(0);

/**
 * Menangani deteksi aksi, menampilkan popup, dan memancarkan event.
 * @param type Tipe aksi yang terdeteksi (e.g., 'context_menu', 'devtools_key', 'visibility_change').
 * @param details Detail tambahan tentang aksi tersebut.
 */
const handleAction = (type: string, details: object = {}) => {
  emit('action-detected', { type, ...details });

  // Set pesan peringatan berdasarkan tipe aksi
  switch (type) {
    case 'context_menu':
      warningMessage.value = 'Klik kanan dinonaktifkan selama ujian.';
      break;
    case 'devtools_key':
      warningMessage.value = 'Pintasan keyboard untuk developer tools dinonaktifkan.';
      break;
    case 'visibility_change':
      warningMessage.value = 'Meninggalkan tab atau beralih aplikasi tidak diizinkan.';
      break;
    default:
      warningMessage.value = 'Aksi ini tidak diizinkan selama ujian.';
  }

  showPopup.value = true;
  console.warn(`Tindakan tidak diizinkan terdeteksi: ${type}`, details);
};

const closePopup = () => {
  showPopup.value = false;
};

const handleContextMenu = () => {
  handleAction('context_menu');
};

/**
 * Menonaktifkan pintasan keyboard umum untuk membuka developer tools.
 */
const handleKeyDown = (event: KeyboardEvent) => {
  // F12
  if (event.key === 'F12' || event.keyCode === 123) {
    handleAction('devtools_key', { key: 'F12' });
    event.preventDefault();
  }
  // Ctrl+Shift+I (atau Cmd+Option+I di Mac)
  if ((event.ctrlKey && event.shiftKey && event.key === 'I') || (event.metaKey && event.altKey && event.key === 'i')) {
    handleAction('devtools_key', { key: 'Ctrl+Shift+I' });
    event.preventDefault();
  }
  // Ctrl+Shift+J (atau Cmd+Option+J di Mac)
  if ((event.ctrlKey && event.shiftKey && event.key === 'J') || (event.metaKey && event.altKey && event.key === 'j')) {
    handleAction('devtools_key', { key: 'Ctrl+Shift+J' });
    event.preventDefault();
  }
  // Ctrl+U
  if (event.ctrlKey && event.key === 'U') {
    handleAction('devtools_key', { key: 'Ctrl+U' });
    event.preventDefault();
  }
};

/**
 * Mendeteksi ketika pengguna beralih dari tab atau aplikasi.
 */
const handleVisibilityChange = () => {
  if (document.hidden) {
    // Tab menjadi tidak terlihat
    lastHiddenTime.value = Date.now();
    handleAction('visibility_change', { status: 'hidden' });
  } else {
    // Tab kembali terlihat
    if (lastHiddenTime.value > 0) {
      const duration = Date.now() - lastHiddenTime.value;
      emit('action-detected', { type: 'visibility_change', status: 'visible', duration });
      lastHiddenTime.value = 0;
    }
  }
};

// Lifecycle hooks untuk menambahkan dan menghapus event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0.9); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.select-none {
  user-select: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>