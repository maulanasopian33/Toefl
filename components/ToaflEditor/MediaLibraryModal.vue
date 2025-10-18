<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['update:modelValue', 'select']);

const activeTab = ref('library');

// Dummy data untuk pustaka media
const dummyAudio = ref([
  { name: 'percakapan-1.mp3', url: '/audio/dummy/percakapan-1.mp3' },
  { name: 'instruksi-qiraah.mp3', url: '/audio/dummy/instruksi-qiraah.mp3' },
  { name: 'dialog-pasar.mp3', url: '/audio/dummy/dialog-pasar.mp3' },
  { name: 'pengumuman-cuaca.mp3', url: '/audio/dummy/pengumuman-cuaca.mp3' },
  { name: 'cerita-pendek.mp3', url: '/audio/dummy/cerita-pendek.mp3' },
  { name: 'latihan-istima-5.mp3', url: '/audio/dummy/latihan-istima-5.mp3' },
]);

const selectedAudioUrl = ref<string | null>(null);

function selectAudio(url: string) {
  selectedAudioUrl.value = url;
}

function confirmSelection() {
  if (selectedAudioUrl.value) {
    emit('select', selectedAudioUrl.value);
    closeModal();
  }
}

function closeModal() {
  emit('update:modelValue', false);
  selectedAudioUrl.value = null;
}

// Simulasi unggah file
function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        // Dalam aplikasi nyata, Anda akan mengunggah file ini ke server
        // dan mendapatkan URL kembali. Di sini kita hanya simulasi.
        const dummyUrl = `/audio/uploads/${file.name}`;
        dummyAudio.value.unshift({ name: file.name, url: dummyUrl });
        selectAudio(dummyUrl);
        activeTab.value = 'library'; // Pindah ke tab library untuk melihat file yang baru diunggah
    }
}
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[70vh] flex flex-col overflow-hidden">
        <header class="p-4 border-b flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">Pustaka Media</h2>
          <button @click="closeModal" class="p-2 rounded-full hover:bg-gray-100">&times;</button>
        </header>

        <main class="flex-grow flex overflow-hidden">
          <aside class="w-48 bg-gray-50 border-r p-4">
            <nav class="space-y-2">
              <button @click="activeTab = 'library'" :class="{'bg-indigo-100 text-indigo-700': activeTab === 'library'}" class="w-full text-left p-2 rounded-md font-semibold">Pustaka</button>
              <button @click="activeTab = 'upload'" :class="{'bg-indigo-100 text-indigo-700': activeTab === 'upload'}" class="w-full text-left p-2 rounded-md font-semibold">Unggah File</button>
            </nav>
          </aside>

          <div class="flex-grow p-6 overflow-y-auto">
            <div v-if="activeTab === 'library'">
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="audio in dummyAudio" :key="audio.url" @click="selectAudio(audio.url)"
                     class="border-2 rounded-lg p-3 cursor-pointer flex flex-col items-center justify-center text-center aspect-square"
                     :class="selectedAudioUrl === audio.url ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'">
                  <svg class="w-10 h-10 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2zm12-3c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2z"></path></svg>
                  <span class="text-xs font-medium text-gray-600 break-all">{{ audio.name }}</span>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'upload'" class="flex items-center justify-center h-full">
                <label class="w-full max-w-md flex flex-col items-center px-4 py-12 bg-white text-indigo-600 rounded-lg shadow-sm tracking-wide border-2 border-dashed border-indigo-200 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                    <svg class="w-12 h-12 mb-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3v-3h2v3z" /></svg>
                    <span class="text-base leading-normal">Pilih file untuk diunggah</span>
                    <input type='file' class="hidden" accept="audio/*" @change="handleFileUpload" />
                </label>
            </div>
          </div>
        </main>

        <footer class="p-4 border-t bg-gray-50 flex justify-end">
          <button @click="confirmSelection" :disabled="!selectedAudioUrl" class="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
            Pilih Audio
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>