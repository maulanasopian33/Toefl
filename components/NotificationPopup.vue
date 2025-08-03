<template>
  <!-- Modal Backdrop -->
  <div v-if="state.isOpen" class="modal-backdrop fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 z-[999]" @click.self="hide">
    <!-- Modal Container -->
    <div class="modal-container bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4 transform transition-transform duration-300 scale-100 opacity-100">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800 rounded-md">{{ state.title }}</h3>
        <button @click="hide" class="text-gray-500 hover:text-gray-700 transition duration-300">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p class="text-gray-600 mb-6 rounded-md">{{ state.message }}</p>
      <div class="flex justify-end space-x-2">
        <button
            v-for="(button, index) in state.buttons"
            :key="index"
            @click="button.action"
            :class="button.className"
            class="px-4 py-2 rounded-lg font-semibold transition duration-300"
        >
          {{ button.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Mengimpor state dari composable.
// Komponen ini akan bereaksi secara otomatis terhadap perubahan state tersebut.
const { state, hide } = useNotificationPopup();
</script>

<style scoped>
/* Transisi untuk opacity dan scale diatur langsung di template menggunakan class Tailwind */
</style>