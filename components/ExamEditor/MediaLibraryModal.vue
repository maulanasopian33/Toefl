<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useMediaGet } from '../../composables/media/get';
import { useMediaDelete } from '../../composables/media/delete';
import { useMediaUpload } from '../../composables/media/upload';
import { useNotification } from '@/composables/useNotification';
import { useNotificationPopup } from '@/composables/NotificationPopup';

const { showNotification } = useNotification();
const props = defineProps<{ modelValue: boolean, mediaType: 'image' | 'file' | 'audio' }>();
const emit = defineEmits(['update:modelValue', 'select']);

const isUploading = ref(false)
const isLoadingMedia = ref(false)
const config = useRuntimeConfig()

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
    return allItems.filter(item => !item.mimeType?.startsWith('image/') && !item.mimeType?.startsWith('audio/'))
  }
  return allItems
})

async function fetchMedia() {
  isLoadingMedia.value = true;
  try {
    await refresh();
  } catch (error) {
    console.error('Gagal mengambil media:', error);
    showNotification('Gagal memuat pustaka media.', 'error');
  } finally {
    isLoadingMedia.value = false;
  }
}

async function deleteMedia(id: string) {
  const confirmed = await showConfirm(
    'File ini akan dihapus secara permanen dari server.',
    { type: 'danger', title: 'Hapus File?' }
  );

  if (!confirmed) return;
  
  try {
    await useMediaDelete(id);
    await refresh();
    showNotification('File berhasil dihapus.', 'success');
  } catch (error) {
    showNotification('Gagal menghapus file.', 'error');
  }
}

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
  selectedMediaUrl.value = null;
  selectedMediaMimeType.value = null;
  selectedFileName.value = null;
}

async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        selectedFileName.value = file.name;
        isUploading.value = true;
        const formData = new FormData();
        formData.append('media', file);

        try {
            const response = await useMediaUpload(formData);
            await refresh();
            selectMedia({ url: response.url, mimeType: file.type, originalName: file.name });
            activeTab.value = 'library';
            showNotification('Berhasil diunggah.', 'success');
            selectedFileName.value = null;
            target.value = '';
        } catch (error: any) {
            showNotification('Gagal mengunggah file.', 'error');
        } finally {
            isUploading.value = false;
        }
    }
}

watch(() => props.modelValue, (isShowing) => {
  if (isShowing && activeTab.value === 'library') {
    fetchMedia();
  }
});
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-5xl h-[85vh] transform overflow-hidden rounded-[2.5rem] bg-white p-0 text-left align-middle shadow-2xl transition-all border border-gray-100 flex flex-col">
              <!-- Header -->
              <div class="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between flex-shrink-0">
                <div class="flex items-center gap-3">
                   <div class="p-2 bg-indigo-100 rounded-xl">
                      <Icon name="lucide:library" class="w-6 h-6 text-indigo-600" />
                   </div>
                   <DialogTitle as="h3" class="text-xl font-extrabold text-gray-900">Pustaka Media</DialogTitle>
                </div>
                <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                  <Icon name="lucide:x" class="w-5 h-5" />
                </button>
              </div>

              <main class="flex-grow flex flex-col overflow-hidden bg-white">
                <!-- Navigation Tabs -->
                <div class="px-8 pt-4 border-b border-gray-50 flex-shrink-0 bg-white">
                  <div class="flex gap-2">
                    <button 
                      @click="() => { activeTab = 'library'; fetchMedia(); }" 
                      :class="['px-5 py-2.5 text-xs font-bold rounded-t-2xl transition-all flex items-center gap-2', activeTab === 'library' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50']"
                    >
                      <Icon name="lucide:layout-grid" class="w-4 h-4" />
                      Pustaka
                    </button>
                    <button 
                      @click="activeTab = 'upload'" 
                      :class="['px-5 py-2.5 text-xs font-bold rounded-t-2xl transition-all flex items-center gap-2', activeTab === 'upload' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50']"
                    >
                      <Icon name="lucide:upload-cloud" class="w-4 h-4" />
                      Unggah Baru
                    </button>
                  </div>
                </div>

                <!-- Tab Content -->
                <div class="flex-grow p-8 overflow-y-auto custom-scrollbar">
                  <div v-if="activeTab === 'library'" class="h-full">
                    <div v-if="isLoadingMedia" class="flex flex-col items-center justify-center h-full text-gray-400 animate-pulse">
                      <Icon name="lucide:loader-2" class="w-12 h-12 animate-spin mb-4 opacity-20" />
                      <span class="text-xs font-bold uppercase tracking-widest">Memuat Media...</span>
                    </div>
                    <div v-else-if="mediaItems.length === 0" class="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                      <div class="p-6 bg-white rounded-3xl shadow-sm mb-6 ring-1 ring-gray-900/5">
                         <Icon name="lucide:folder-search" class="w-16 h-16 text-gray-300" />
                      </div>
                      <h3 class="text-xl font-black text-gray-700">Pustaka Kosong</h3>
                      <p class="mt-2 text-sm text-gray-400 font-medium">Belum ada {{ props.mediaType === 'image' ? 'gambar' : 'file' }} yang tersedia.</p>
                      <button @click="activeTab = 'upload'" class="mt-8 px-6 py-3 bg-white border-2 border-indigo-100 text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-sm transform active:scale-95 flex items-center gap-2 text-sm">
                        <Icon name="lucide:plus" class="w-4 h-4" />
                        Unggah File Pertama
                      </button>
                    </div>
                    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      <div 
                        v-for="item in mediaItems" 
                        :key="item.id" 
                        @click="selectMedia(item)"
                        class="group relative aspect-square rounded-[1.5rem] overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ring-1 ring-gray-200"
                        :class="selectedMediaUrl === item.url ? 'ring-4 ring-indigo-500 ring-offset-2' : 'hover:ring-indigo-300'"
                      >
                        <!-- Media Display -->
                        <div class="w-full h-full bg-gray-50 flex items-center justify-center overflow-hidden">
                          <img v-if="item.mimeType?.startsWith('image/')" :src="`${config.public.MEDIA_URL}${item.url}`" :alt="item.originalName" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                          <div v-else class="flex flex-col items-center gap-2">
                             <div class="p-3 bg-white rounded-2xl shadow-sm">
                                <Icon :name="item.mimeType?.startsWith('audio/') ? 'lucide:music' : 'lucide:file'" class="w-8 h-8 text-indigo-400" />
                             </div>
                             <span class="text-[9px] font-bold text-gray-400 uppercase tracking-tight px-2 text-center truncate w-full">{{ item.originalName }}</span>
                          </div>
                        </div>

                        <!-- Selection Overlay -->
                        <div v-if="selectedMediaUrl === item.url" class="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                           <div class="bg-indigo-600 text-white p-2 rounded-xl shadow-lg ring-4 ring-white">
                              <Icon name="lucide:check" class="w-5 h-5" />
                           </div>
                        </div>

                        <!-- Delete Button (Hover) -->
                        <button 
                          @click.stop="deleteMedia(item.id)" 
                          class="absolute top-2 right-2 p-2 bg-rose-500/90 text-white rounded-xl opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-all transform scale-75 group-hover:scale-100 shadow-lg backdrop-blur-sm"
                        >
                          <Icon name="lucide:trash-2" class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Upload Tab Content -->
                  <div v-if="activeTab === 'upload'" class="h-full flex items-center justify-center">
                    <label 
                      :class="['w-full max-w-xl aspect-video relative group flex flex-col items-center justify-center p-12 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden', isUploading ? 'bg-gray-50 border-gray-200 pointer-events-none' : 'bg-gray-50/50 border-gray-200 hover:bg-white hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-100/50 hover:scale-[1.02]']"
                    >
                      <div class="relative z-10 flex flex-col items-center">
                         <div :class="['p-6 rounded-3xl shadow-sm mb-6 transition-all duration-500 ring-1 ring-gray-900/5', isUploading ? 'bg-gray-100 animate-pulse' : 'bg-white group-hover:scale-110 group-hover:rotate-3']">
                            <Icon v-if="isUploading" name="lucide:loader-2" class="w-12 h-12 text-indigo-400 animate-spin" />
                            <Icon v-else name="lucide:upload-cloud" class="w-12 h-12 text-indigo-600" />
                         </div>
                         <h4 class="text-xl font-black text-gray-900 leading-tight">
                            {{ isUploading ? 'Mengunggah File...' : (selectedFileName || 'Pilih File Unggah') }}
                         </h4>
                         <p class="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">{{ isUploading ? 'Mohon tunggu sebentar' : 'Tarik & lepas file di sini atau klik' }}</p>
                      </div>
                      <input type='file' class="hidden" :accept="props.mediaType === 'image' ? 'image/*' : '*'" @change="handleFileUpload" />
                    </label>
                  </div>
                </div>
              </main>

              <!-- Footer with Preview -->
              <footer class="px-8 py-6 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between gap-8 flex-shrink-0">
                <div class="flex-1 min-w-0">
                   <div v-if="selectedMediaUrl" class="flex items-center gap-4 group">
                      <div class="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm flex-shrink-0 flex items-center justify-center">
                         <img v-if="selectedMediaMimeType?.startsWith('image/')" :src="`${config.public.MEDIA_URL}${selectedMediaUrl}`" alt="Preview" class="w-full h-full object-cover">
                         <div v-else class="p-3 bg-indigo-50 rounded-xl">
                            <Icon name="lucide:file-check-2" class="w-6 h-6 text-indigo-600" />
                         </div>
                      </div>
                      <div class="truncate">
                         <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-0.5 leading-none">File Terpilih</p>
                         <p class="text-sm font-black text-gray-800 truncate" :title="selectedFileName">{{ selectedFileName }}</p>
                      </div>
                   </div>
                   <div v-else class="flex items-center gap-3 text-gray-300">
                      <div class="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                         <Icon name="lucide:mouse-pointer-click" class="w-5 h-5 opacity-30" />
                      </div>
                      <span class="text-xs font-bold text-gray-400 italic">Silakan pilih media untuk melanjutkan</span>
                   </div>
                </div>
                
                <button 
                  @click="confirmSelection" 
                  :disabled="!selectedMediaUrl" 
                  class="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all transform active:scale-95 disabled:opacity-30 disabled:grayscale disabled:scale-100 text-sm whitespace-nowrap"
                >
                  Konfirmasi Pilihan
                </button>
              </footer>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}
</style>