<template>
  <div class="relative z-10 space-y-8">
    <div class="space-y-4">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-100">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Dashboard Peserta
      </div>
      <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
        <template v-if="settings?.heroTitle">
          {{ settings.heroTitle.split(' ').slice(0, -2).join(' ') }}
          <span class="text-emerald-600">{{ ' ' + settings.heroTitle.split(' ').slice(-2).join(' ') }}</span>
        </template>
        <template v-else>
          Siap untuk <span class="text-emerald-600">Tes TOEFL</span> Anda?
        </template>
      </h2>
      <p class="text-gray-500 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
        {{ settings?.heroSubtitle || 'Uji kemampuan Bahasa Inggris Anda di bagian Reading, Listening, Speaking, dan Writing. Mulai tes baru atau lanjutkan dari progres terakhir Anda.' }}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4">
      <button 
        @click="handleStartNewClick" 
        class="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 transition-all active:scale-95"
      >
        <Icon name="heroicons:play-circle" class="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span class="text-lg">Mulai Tes Baru</span>
      </button>
      
      <button 
        @click="resumeTest"
        :disabled="!testSessionStore.testId"
        :class="[
          testSessionStore.testId 
            ? 'bg-gray-900 text-white hover:bg-black hover:scale-105 shadow-xl' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
        ]"
        class="flex items-center justify-center gap-3 px-8 py-4 font-bold rounded-2xl transition-all active:scale-95"
      >
        <Icon name="heroicons:arrow-path" class="w-5 h-5" />
        <span class="text-lg">Lanjutkan Tes</span>
      </button>
    </div>

    <!-- Confirmation Modal -->
    <TransitionRoot as="template" :show="showConfirmModal">
      <Dialog as="div" class="relative z-[100]" @close="showConfirmModal = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-[2.5rem] bg-white px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-10 border border-gray-100">
                <div class="flex flex-col items-center text-center">
                  <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 mb-6">
                    <Icon name="heroicons:question-mark-circle" class="h-10 w-10 text-emerald-600" />
                  </div>
                  <div class="mt-3 sm:mt-0">
                    <DialogTitle as="h3" class="text-2xl font-black leading-6 text-gray-900 mb-4">
                      Ada Sesi yang Berlangsung
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm font-medium text-gray-500 leading-relaxed">
                        Kami menemukan riwayat tes yang belum selesai. Apakah Anda ingin melanjutkan progres terakhir atau memulai tes yang baru?
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button type="button" class="inline-flex w-full justify-center rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95" @click="resumeTest">
                    Lanjutkan History
                  </button>
                  <button type="button" class="inline-flex w-full justify-center rounded-2xl bg-white px-6 py-4 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all active:scale-95" @click="startFresh">
                    Mulai Baru
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAppSettings } from '@/composables/useAppSettings';
import { useTestSessionStore } from '@/stores/testSessionStore';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';

const emit = defineEmits(['mulai-tes']);

const { settings } = useAppSettings();
const testSessionStore = useTestSessionStore();
const showConfirmModal = ref(false);

const handleStartNewClick = () => {
  if (testSessionStore.testId) {
    showConfirmModal.value = true;
  } else {
    emit('mulai-tes');
  }
};

const startFresh = () => {
  testSessionStore.clearSession();
  showConfirmModal.value = false;
  emit('mulai-tes');
};

const resumeTest = () => {
  if (testSessionStore.testId) {
    navigateTo(`/test/${testSessionStore.testId}`);
  }
  showConfirmModal.value = false;
};
</script>

<style>

</style>