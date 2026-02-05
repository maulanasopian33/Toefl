<script setup lang="ts">
const { $pwa } = useNuxtApp()

const showInstallPrompt = computed(() => $pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh)
const showUpdatePrompt = computed(() => $pwa?.needRefresh)

const installPwa = async () => {
  await $pwa?.install()
}

const updatePwa = async () => {
  await $pwa?.updateServiceWorker()
}

const close = async () => {
    $pwa?.cancelInstall()
}
</script>

<template>
  <ClientOnly>
    <div v-if="showUpdatePrompt" class="fixed bottom-4 right-4 z-[9999] max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300 animate-slide-up">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Icon name="heroicons:arrow-path" class="w-5 h-5 animate-spin-slow" />
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Pembaruan Tersedia</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Versi baru aplikasi tersedia. Muat ulang untuk menerapkan pembaruan.</p>
          <div class="mt-3 flex gap-2">
            <button @click="updatePwa" class="text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
              Muat Ulang
            </button>
            <button @click="$pwa?.cancelPrompt()" class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1.5 transition-colors">
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showInstallPrompt" class="fixed bottom-4 left-4 z-[9999] max-w-xs w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300 animate-slide-up">
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0">
           <img src="/icons/pwa-192x192.png" alt="App Icon" class="w-10 h-10 rounded-lg shadow-sm" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Toefl Exam App</p>
          <p class="text-xs text-gray-500 truncate">Install aplikasi untuk akses lebih cepat</p>
        </div>
        <button @click="installPwa" class="flex-shrink-0 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
          Install
        </button>
        <button @click="close" class="flex-shrink-0 text-gray-400 hover:text-gray-500 p-1">
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
