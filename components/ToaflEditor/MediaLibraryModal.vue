<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMediaGet } from '../../composables/media/get';
import { useMediaDelete } from '../../composables/media/delete';
import { useMediaUpload } from '../../composables/media/upload';

const { showNotification } = useNotification();
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['update:modelValue', 'select']);

const isUploading = ref(false);
const isLoadingMedia = ref(false);

const activeTab = ref('library');

// Data media dari server
const mediaItems = ref<{ name: string; url: string }[]>([]);

const selectedAudioUrl = ref<string | null>(null);
const selectedFileName = ref<string | null>(null); // New ref for selected file name

// --- FUNGSI API ---

async function fetchMedia() {
  if (mediaItems.value.length > 0) return; // Jangan fetch ulang jika sudah ada
  isLoadingMedia.value = true;
  try {
    // Menggunakan composable baru
    const dataApi = await useMediaGet();
    console.log("media", dataApi.data);
    mediaItems.value = ataApi.data;
    
  } catch (error) {
    console.error('Gagal mengambil media:', error);
    showNotification('Gagal memuat pustaka media dari server.', 'error');
  } finally {
    isLoadingMedia.value = false;
  }
}

async function deleteMedia(url: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus file ini secara permanen? Tindakan ini tidak dapat dibatalkan.')) {
    return;
  }
  try {
    // Menggunakan composable baru
    await useMediaDelete(url);
    // Hapus dari daftar lokal
    mediaItems.value = mediaItems.value.filter(item => item.url !== url);
    showNotification('File berhasil dihapus.', 'success');
  } catch (error) {
    console.error('Gagal menghapus media:', error);
    showNotification('Gagal menghapus file dari server.', 'error');
  }
}

// --- FUNGSI UI ---

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
  selectedFileName.value = null; // Clear selected file name on close
}

// Simulasi unggah file
async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        selectedFileName.value = file.name; // Store the selected file name
        isUploading.value = true;
        const formData = new FormData();
        // Menggunakan key 'media' sesuai spesifikasi API Anda
        formData.append('media', file);

        try {
            // Menggunakan composable baru
            const response = await useMediaUpload(formData);
            mediaItems.value.unshift({ name: file.name, url: response.url });
            selectAudio(response.url);
            activeTab.value = 'library'; // Pindah ke tab library
            showNotification('File audio berhasil diunggah.', 'success');
            selectedFileName.value = null; // Clear after successful upload
            target.value = ''; // Clear the input field
        } catch (error) {
            console.error('Gagal mengunggah audio:', error);
            showNotification('Gagal mengunggah file audio.', 'error');
        } finally {
            isUploading.value = false;
        }
    } else {
        selectedFileName.value = null; // Clear if no file is selected (e.g., user cancels)
    }
}

// Watcher untuk membuka modal dan fetch data
watch(() => props.modelValue, (isShowing) => {
  if (isShowing && activeTab.value === 'library') {
    fetchMedia();
  }
});
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
              <button @click="() => { activeTab = 'library'; fetchMedia(); }" :class="{'bg-indigo-100 text-indigo-700': activeTab === 'library'}" class="w-full text-left p-2 rounded-md font-semibold">Pustaka</button>
              <button @click="activeTab = 'upload'" :class="{'bg-indigo-100 text-indigo-700': activeTab === 'upload'}" class="w-full text-left p-2 rounded-md font-semibold">Unggah File</button>
            </nav>
          </aside>

          <div class="flex-grow p-6 overflow-y-auto">
            <div v-if="activeTab === 'library'">
              <div v-if="isLoadingMedia" class="flex items-center justify-center h-full text-gray-500">
                <svg class="w-8 h-8 animate-spin mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Memuat Pustaka...</span>
              </div>
              <div v-else-if="mediaItems.length === 0" class="flex items-center justify-center h-full text-gray-500">
                <span>Pustaka media kosong.</span>
              </div>
              <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="audio in mediaItems" :key="audio.url" @click="selectAudio(audio.url)"
                     class="relative group border-2 rounded-lg p-3 cursor-pointer flex flex-col items-center justify-center text-center aspect-square"
                     :class="selectedAudioUrl === audio.url ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'">
                  <svg class="w-10 h-10 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2zm12-3c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2z"></path></svg>
                  <span class="text-xs font-medium text-gray-600 break-all">{{ audio.originalName }}</span>
                  <button @click.stop="deleteMedia(audio.url)" class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'upload'" class="flex items-center justify-center h-full" :class="{'opacity-50 pointer-events-none': isUploading}">
                <label class="w-full max-w-md flex flex-col items-center px-4 py-12 bg-white text-indigo-600 rounded-lg shadow-sm tracking-wide border-2 border-dashed border-indigo-200 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                    <svg v-if="isUploading" class="w-12 h-12 mb-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-12 h-12 mb-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3v-3h2v3z" />
                    </svg>
                    <span class="text-base leading-normal">
                        {{ isUploading ? 'Mengunggah...' : (selectedFileName || 'Pilih file untuk diunggah') }}
                    </span>
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