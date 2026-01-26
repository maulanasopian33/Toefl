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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-[2rem] bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
              <DialogTitle as="h3" class="text-lg font-extrabold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                 <div class="p-1.5 bg-teal-100 rounded-lg">
                    <Icon name="lucide:upload-cloud" class="w-5 h-5 text-teal-600" />
                 </div>
                 Upload Media Baru
              </DialogTitle>
              
              <form @submit.prevent="handleUpload" class="space-y-6">
                <!-- Dropzone -->
                <div
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                  :class="[
                    'relative group border-2 border-dashed rounded-[2rem] p-12 text-center cursor-pointer transition-all duration-300',
                    isDragging ? 'border-teal-500 bg-teal-50/50 scale-[1.01]' : 'border-gray-200 bg-gray-50/50 hover:border-teal-300 hover:bg-white hover:shadow-lg',
                  ]"
                  @click="openFilePicker"
                >
                  <div class="p-5 bg-white rounded-2xl shadow-sm inline-block mb-4 ring-1 ring-gray-900/5 group-hover:scale-110 transition-transform duration-300">
                    <Icon name="lucide:upload-cloud" class="w-10 h-10 text-teal-600" />
                  </div>
                  <p class="text-sm font-extrabold text-gray-900">
                    Tarik & Lepas file di sini, atau <span class="text-teal-600 decoration-teal-600/30 decoration-2 underline-offset-4 hover:underline">klik untuk memilih</span>
                  </p>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 leading-none">
                    Mendukung Gambar dan Audio (Maks. 5MB per file)
                  </p>
                  <input type="file" ref="fileInput" @change="handleFileSelect" multiple class="hidden" />
                </div>

                <!-- Daftar File Terpilih -->
                <div v-if="selectedFiles.length > 0" class="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">File Terpilih ({{ selectedFiles.length }})</p>
                  <div
                    v-for="(file, index) in selectedFiles"
                    :key="index"
                    class="group flex items-center justify-between bg-white border border-gray-100 rounded-[1.25rem] p-3 transition-all hover:bg-gray-50 hover:shadow-sm"
                  >
                    <div class="flex items-center gap-4 truncate min-w-0">
                      <!-- Image Preview -->
                      <div class="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                        <img v-if="file.previewUrl" :src="file.previewUrl" :alt="file.file.name" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                          <Icon name="lucide:file-check-2" class="w-6 h-6 text-teal-600" />
                        </div>
                      </div>
                      
                      <div class="truncate min-w-0">
                        <span class="font-bold text-gray-800 text-sm truncate block">{{ file.file.name }}</span>
                        <div class="flex items-center gap-2 mt-0.5">
                           <span class="text-[10px] font-medium text-gray-400 leading-none">{{ formatSize(file.file.size) }}</span>
                           <span v-if="file.status === 'error'" class="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full leading-none">{{ file.error || 'Gagal' }}</span>
                           <span v-else-if="file.status === 'success'" class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full leading-none">Berhasil</span>
                        </div>
                      </div>
                    </div>

                    <!-- Status Upload per File -->
                    <div class="flex items-center gap-2 ml-4">
                      <template v-if="isUploading && file.status !== 'error'">
                        <Icon v-if="file.status === 'uploading'" name="lucide:loader-2" class="w-5 h-5 text-teal-600 animate-spin" />
                        <Icon v-else-if="file.status === 'success'" name="lucide:check-circle-2" class="w-5 h-5 text-emerald-500" />
                        <Icon v-else name="lucide:clock" class="w-5 h-5 text-gray-400" />
                      </template>
                      <template v-else>
                        <button
                          v-if="file.status === 'error'"
                          type="button"
                          @click="retryFile(index)"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Coba Lagi"
                        >
                          <Icon name="lucide:refresh-cw" class="w-4 h-4" />
                        </button>
                        <button v-if="file.status !== 'success'" type="button" @click="removeFile(index)" class="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                          <Icon name="lucide:trash-2" class="w-4 h-4" />
                        </button>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- Pesan Error -->
                <div v-if="error" class="text-xs font-bold text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-100 flex justify-between items-center">
                  <div class="flex items-center gap-2">
                     <Icon name="lucide:alert-circle" class="w-4 h-4" />
                     <span>{{ error }}</span>
                  </div>
                  <button v-if="hasFailedUploads" @click="retryAllFailed" type="button" class="text-xs text-rose-700 bg-white px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-100 transition-colors shadow-sm">
                    Coba Lagi Semua
                  </button>
                </div>

                <!-- Progress Bar -->
                <div v-if="isUploading" class="space-y-2">
                  <div class="flex items-center justify-between px-1">
                    <span class="text-[10px] font-bold text-teal-600 uppercase tracking-widest leading-none">Mengunggah...</span>
                    <span class="text-[10px] font-black text-teal-700 tabular-nums leading-none">{{ uploadProgress }}%</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div class="bg-teal-500 h-full rounded-full transition-all duration-300 shadow-sm" :style="{ width: `${uploadProgress}%` }"></div>
                  </div>
                </div>

                <div class="mt-8 flex justify-end gap-3">
                  <button 
                    type="button" 
                    @click="closeModal" 
                    :disabled="isUploading"
                    class="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    :disabled="(pendingFilesCount === 0 && !isUploading) || isCancelling"
                    @click="isUploading ? cancelUpload() : null"
                    :class="[
                      'px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center gap-2 text-sm',
                      isUploading ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200'
                    ]"
                  >
                    <Icon v-if="isUploading && !isCancelling" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                    <Icon v-else-if="isCancelling" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                    <Icon v-else-if="!isUploading" name="lucide:upload" class="w-4 h-4" />
                    <span>{{ buttonText }}</span>
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, onBeforeUnmount, computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useMediaUpload } from '@/composables/media/upload';
import { useNotification } from '@/composables/useNotification';

const { showNotification } = useNotification();

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'upload-success']);

const fileInput = ref(null);
const selectedFiles = ref([]);
const isDragging = ref(false);
const isUploading = ref(false);
const uploadCount = ref(0);
const uploadProgress = ref(0);
const error = ref('');
const isCancelling = ref(false);
let abortController = null;

const pendingFilesCount = computed(() => selectedFiles.value.filter(f => f.status === 'pending').length);
const hasFailedUploads = computed(() => selectedFiles.value.some(f => f.status === 'error'));

const buttonText = computed(() => {
  if (isUploading.value) {
    return 'Batalkan Unggahan';
  }
  if (isCancelling.value) {
    return 'Membatalkan...';
  }
  if (pendingFilesCount.value > 0) {
    return `Upload ${pendingFilesCount.value} File`;
  }
  if (hasFailedUploads.value) {
    return 'Tutup';
  }
  return `Upload ${selectedFiles.value.length} File`;
});


const handleFileSelect = (event) => {
  addFiles(event.target.files);
};

const handleDrop = (event) => {
  isDragging.value = false;
  addFiles(event.dataTransfer.files);
};

const addFiles = (files) => {
  error.value = '';
  for (const file of files) {
    let previewUrl = null;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
    }
    selectedFiles.value.push({
      file,
      previewUrl,
      status: 'pending',
      progress: 0,
      error: null,
    });
  }
};

const removeFile = (index) => {
  const fileToRemove = selectedFiles.value[index];
  if (fileToRemove.previewUrl) {
    URL.revokeObjectURL(fileToRemove.previewUrl);
  }
  selectedFiles.value.splice(index, 1);
};

const openFilePicker = () => {
  fileInput.value.click();
};

const handleUpload = async () => {
  const filesToUpload = selectedFiles.value.filter(f => f.status === 'pending');
  if (isUploading.value || filesToUpload.length === 0) {
    if (!isUploading.value && hasFailedUploads.value) {
      closeModal();
    }
    return;
  }

  isUploading.value = true;
  error.value = '';
  abortController = new AbortController();

  for (const fileObject of filesToUpload) {
    if (abortController.signal.aborted) {
      fileObject.status = 'pending';
      continue;
    }

    try {
      fileObject.status = 'uploading';
      const formData = new FormData();
      formData.append('media', fileObject.file);

      await useMediaUpload(formData, abortController.signal);
      fileObject.status = 'success';
    } catch (e) {
      if (e.name === 'AbortError') {
        fileObject.status = 'pending';
      } else {
        const errorMessage = e.data?.message || e.message || 'Error tidak diketahui';
        fileObject.status = 'error';
        fileObject.error = errorMessage;
      }
    }
    uploadCount.value = selectedFiles.value.filter(f => f.status === 'success').length;
    const processedCount = selectedFiles.value.filter(f => f.status === 'success' || f.status === 'error').length;
    uploadProgress.value = Math.round((processedCount / selectedFiles.value.length) * 100);
  }

  isUploading.value = false;
  isCancelling.value = false;
  abortController = null;

  if (hasFailedUploads.value) {
    error.value = 'Beberapa file gagal diunggah. Silakan coba lagi.';
    showNotification(`Beberapa file gagal diunggah.`, 'error');
  } else {
    emit('upload-success');
    closeModal();
    showNotification(`Semua file berhasil diunggah.`, 'success');
  }
};

const retryFile = (index) => {
  const fileToRetry = selectedFiles.value[index];
  if (fileToRetry && fileToRetry.status === 'error') {
    fileToRetry.status = 'pending';
    fileToRetry.error = null;
    handleUpload();
  }
};

const retryAllFailed = () => {
  selectedFiles.value.forEach(file => {
    if (file.status === 'error') {
      file.status = 'pending';
      file.error = null;
    }
  });
  handleUpload();
};

const cancelUpload = () => {
  if (abortController) {
    isCancelling.value = true;
    error.value = 'Pembatalan unggahan sedang diproses...';
    abortController.abort();
  }
};

const closeModal = () => {
  if (isUploading.value) return;
  cleanupPreviewUrls();
  selectedFiles.value = [];
  error.value = '';
  uploadProgress.value = 0;
  uploadCount.value = 0;
  isCancelling.value = false;
  emit('update:modelValue', false);
};

const cleanupPreviewUrls = () => {
  selectedFiles.value.forEach(fileObject => {
    if (fileObject.previewUrl) {
      URL.revokeObjectURL(fileObject.previewUrl);
    }
  });
};

onBeforeUnmount(cleanupPreviewUrls);

const formatSize = (size) => {
  if (!size) return '0 KB';
  const kb = size / 1024;
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
};
</script>

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