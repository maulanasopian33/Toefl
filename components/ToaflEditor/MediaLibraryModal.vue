<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import { useMediaGet } from '../../composables/media/get';
import { useMediaDelete } from '../../composables/media/delete';
import { useMediaUpload } from '../../composables/media/upload';
import { useNotification } from '@/composables/useNotification'; // Added missing import for useNotification
import { useNotificationPopup } from '@/composables/NotificationPopup';

const { showNotification } = useNotification(); // Now this is valid
const props = defineProps<{ modelValue: boolean, mediaType: 'image' | 'file' | 'audio' }>();
const emit = defineEmits(['update:modelValue', 'select']);

const isUploading = ref(false)
const isLoadingMedia = ref(false)
const config = useRuntimeConfig()

const playingAudio = ref<HTMLAudioElement | null>(null);
const activeTab = ref('library')

const selectedMediaUrl = ref<string | null>(null)
const selectedMediaMimeType = ref<string | null>(null)
const selectedFileName = ref<string | null>(null)
const { data: allMediaItems, refresh } = await useMediaGet()
const { showConfirm } = useNotificationPopup()

const mediaItems = computed(() => {
  if (!allMediaItems.value) return []
  const allItems = allMediaItems.value

  if (props.mediaType === 'image') {
    return allItems.filter(item => item.mimeType?.startsWith('image/'))
  } else if (props.mediaType === 'audio') {
    return allItems.filter(item => item.mimeType?.startsWith('audio/'))
  } else if (props.mediaType === 'file') {
    // Filter for anything that is NOT an image and NOT an audio
    return allItems.filter(item => !item.mimeType?.startsWith('image/') && !item.mimeType?.startsWith('audio/'))
  }
  return allItems // Should not be reached given strict prop type
})
// --- FUNGSI API ---

async function fetchMedia() {
  // Always refresh to get the latest media when the modal opens
  isLoadingMedia.value = true;
  try {
    await refresh(); // This will update the `allMediaItems` ref
    // No direct assignment to allMediaItems.value is needed here, as `refresh` updates the ref.

  } catch (error) {
    console.error('Gagal mengambil media:', error);
    showNotification('Gagal memuat pustaka media dari server.', 'error');
  } finally {
    isLoadingMedia.value = false;
  }
}

async function deleteMedia(id: string) {
  // Using the global confirm dialog for better UX
  const confirmed = await showConfirm(
    'File ini akan dihapus secara permanen dan tidak dapat dikembalikan.',
    { type: 'danger', title: 'Hapus File Permanen?' }
  );

  if (!confirmed) {
    return;
  }
  try {
    await useMediaDelete(id); // Assuming useMediaDelete takes the URL or ID
    await refresh(); // Refresh the list after deletion
    showNotification('File berhasil dihapus.', 'success');
  } catch (error) {
    // @ts-ignore - error might be a custom object, so we ignore type checking for message
    console.error('Gagal menghapus media:', error);
    showNotification('Gagal menghapus file dari server.', 'error');
  }
}

// --- FUNGSI UI ---

function selectMedia(item: { url: string, mimeType: string, originalName: string }) {
  selectedMediaUrl.value = item.url
  selectedMediaMimeType.value = item.mimeType
  selectedFileName.value = item.originalName
}

function confirmSelection() {
  if (selectedMediaUrl.value) {
    emit('select', selectedMediaUrl.value)
    closeModal()
  }
}

function closeModal() {
  emit('update:modelValue', false);
  selectedMediaUrl.value = null; // Clear selection on close
  selectedMediaMimeType.value = null;
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
            await refresh(); // Refresh the list after successful upload
            selectMedia({ url: response.url, mimeType: file.type, originalName: file.name }); // Select the newly uploaded item
            activeTab.value = 'library'; // Pindah ke tab library
            showNotification('File berhasil diunggah.', 'success');
            selectedFileName.value = null; // Clear after successful upload
            target.value = null; // Clear the input field
        } catch (error: any) {
            console.error('Gagal mengunggah file:', error);
            showNotification('Gagal mengunggah file.', 'error');
        } finally {
            isUploading.value = false;
        }
    } else {
        selectedFileName.value = null; // Ensure the selectedFileName is cleared when no file is selected
    }
}

// Watcher untuk membuka modal dan fetch data
watch(() => props.modelValue, (isShowing) => {
  if (isShowing && activeTab.value === 'library') {
    fetchMedia(); // Call fetchMedia to load data when modal opens
  }
});
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" @click.self="closeModal">
      <div class="bg-gray-50 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <header class="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 class="text-lg font-semibold text-gray-800">Pilih Media</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </header>

        <main class="flex-grow flex flex-col overflow-hidden">
          <!-- Tabs -->
          <div class="px-6 pt-4 border-b border-gray-200 flex-shrink-0">
            <div class="flex space-x-4">
              <button @click="() => { activeTab = 'library'; fetchMedia(); }" :class="['px-3 py-2 text-sm font-medium rounded-t-md', activeTab === 'library' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700']">
                <Icon name="lucide:library" class="w-4 h-4 mr-1.5 inline-block" />
                Pustaka
              </button>
              <button @click="activeTab = 'upload'" :class="['px-3 py-2 text-sm font-medium rounded-t-md', activeTab === 'upload' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700']">
                <Icon name="lucide:upload-cloud" class="w-4 h-4 mr-1.5 inline-block" />
                Unggah File
              </button>
            </div>
          </div>

          <div class="flex-grow p-6 overflow-y-auto bg-white">
            <div v-if="activeTab === 'library'">
              <div v-if="isLoadingMedia" class="flex items-center justify-center h-full text-gray-500">
                <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin mr-3" />
                <span>Memuat Pustaka...</span>
              </div>
              <div v-else-if="mediaItems.length === 0" class="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
                <Icon name="lucide:folder-search" class="w-16 h-16 text-gray-300 mb-4" />
                <h3 class="text-lg font-semibold text-gray-700">Pustaka {{ props.mediaType === 'image' ? 'Gambar' : 'File' }} Kosong</h3>
                <p class="mt-1 text-sm">Belum ada {{ props.mediaType === 'image' ? 'gambar' : 'file' }} yang diunggah.</p>
                <button @click="activeTab = 'upload'" class="btn-primary-small mt-6">
                  <Icon name="lucide:upload" class="w-4 h-4 mr-2" />
                  Unggah File Pertama Anda
                </button>
              </div>
              <div v-else class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="item in mediaItems" :key="item.id" @click="selectMedia(item)"
                     class="relative group border rounded-lg cursor-pointer flex flex-col text-center aspect-square transition-all duration-200"
                     :class="selectedMediaUrl === item.url ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50' : 'border-gray-200 hover:shadow-md hover:border-indigo-300'">                  <div class="flex-grow flex items-center justify-center overflow-hidden bg-gray-100">
                    <img v-if="item.mimeType?.startsWith('image/')" :src="`${config.public.MEDIA_URL}${item.url}`" :alt="item.originalName" class="w-full h-20 object-cover overflow-hidden">
                    <Icon v-else-if="item.mimeType?.startsWith('audio/')" name="lucide:file-audio" class="w-10 h-10 text-indigo-400" />
                    <audio v-else-if="item.mimeType?.startsWith('audio/')" ref="playingAudio" :src="`${config.public.MEDIA_URL}${item.url}`" controls class="w-full"></audio>
                    <Icon v-else name="lucide:file" class="w-10 h-10 text-gray-400" /> <!-- Generic file icon -->
                  </div>
                  <div class="flex-shrink-0 border-t border-gray-200 p-2 w-full">
                    <span class="text-xs font-medium text-gray-600 break-all truncate block">{{ item.originalName }}</span>
                  </div>
                  <button @click.stop="deleteMedia(item.id)" class="absolute top-1.5 right-1.5 p-1 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-200 transition-opacity">
                    <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'upload'" class="flex items-center justify-center h-full" :class="{'opacity-50 pointer-events-none': isUploading}">
                <label class="w-full max-w-lg flex flex-col items-center px-4 py-12 bg-gray-50 text-gray-600 rounded-lg shadow-inner tracking-wide border-2 border-dashed border-gray-300 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors">
                    <Icon v-if="isUploading" name="lucide:loader-2" class="w-12 h-12 mb-4 animate-spin" />
                    <Icon v-else name="lucide:upload-cloud" class="w-12 h-12 mb-4" />
                    <span class="text-base leading-normal">
                        {{ isUploading ? 'Mengunggah...' : (selectedFileName || 'Pilih file untuk diunggah') }}
                    </span>                    
                    <span class="text-xs mt-1 text-gray-400">Tarik & lepas file di sini</span>
                    <input type='file' class="hidden" :accept="props.mediaType === 'image' ? 'image/*' : '*'" @change="handleFileUpload" />
                </label>
            </div>
          </div>
        </main>

        <footer class="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
          <!-- Preview Area -->
          <div class="w-full max-w-xs h-16 flex items-center">
            <template v-if="selectedMediaUrl">
              <img v-if="selectedMediaMimeType?.startsWith('image/')" :src="`${config.public.MEDIA_URL}${selectedMediaUrl}`" alt="Preview" class="max-h-16 rounded-md object-contain shadow-sm border border-slate-200">
              <audio v-else-if="selectedMediaMimeType?.startsWith('audio/')" :src="`${config.public.MEDIA_URL}${selectedMediaUrl}`" controls class="w-full h-10"></audio>
              <div v-else class="flex items-center gap-2 text-slate-600">
                <Icon name="lucide:file-check-2" class="h-8 w-8 text-slate-400" />
                <span class="text-xs font-medium truncate">{{ selectedFileName }}</span>
              </div>
            </template>
          </div>
          <button @click="confirmSelection" :disabled="!selectedMediaUrl" class="btn-primary">
            Pilih Media
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