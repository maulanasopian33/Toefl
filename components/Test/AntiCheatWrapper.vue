<template>
  <div class="select-none" @contextmenu.prevent="handleContextMenu">
    <slot />

    <!-- Popup Peringatan -->
    <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div class="bg-white p-8 rounded-lg shadow-2xl text-center max-w-sm w-full transform transition-all duration-300 scale-105">
        <Icon name="lucide:alert-triangle" class="mx-auto mb-4 h-16 w-16 text-red-500" />
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Tindakan Tidak Diizinkan!</h2>
        <p class="text-gray-700 mb-6">
          {{ warningMessage }}
        </p>
        <button @click="closePopup"
                class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200">
          Saya Mengerti
        </button>
      </div>
    </div>
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
.select-none {
  user-select: none;
}
</style>