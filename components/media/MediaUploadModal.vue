<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="closeModal"
  >
    <form
      @submit.prevent="handleUpload"
      class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden"
    >
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <p class="text-base font-semibold text-gray-900">Upload Media Baru</p>
        <button type="button" class="text-gray-400 hover:text-gray-700" @click="closeModal">
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>

      <div class="p-5 space-y-4">
        <!-- Dropzone -->
        <div
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          :class="[
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400',
          ]"
          @click="openFilePicker"
        >
          <Icon name="lucide:upload-cloud" class="w-10 h-10 mx-auto text-gray-400 mb-2" />
          <p class="text-sm font-medium text-gray-700">
            Tarik & Lepas file di sini, atau <span class="text-teal-600">klik untuk memilih</span>
          </p>
          <p class="text-xs text-gray-500 mt-1">Mendukung Gambar dan Audio (Maks. 5MB per file)</p>
          <input type="file" ref="fileInput" @change="handleFileSelect" multiple class="hidden" />
        </div>

        <!-- Daftar File Terpilih -->
        <div v-if="selectedFiles.length > 0" class="space-y-2 max-h-48 overflow-y-auto pr-2">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2 text-xs"
          >
            <div class="flex items-center gap-3 truncate min-w-0">
              <!-- Image Preview -->
              <img v-if="file.previewUrl" :src="file.previewUrl" :alt="file.file.name" class="w-10 h-10 object-cover rounded-md bg-gray-100" />
              <!-- Generic Icon -->
              <div v-else class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md">
                <Icon name="lucide:file-check-2" class="w-5 h-5 text-teal-600 flex-shrink-0" />
              </div>
              <div class="truncate min-w-0">
                <span class="font-medium text-gray-800 truncate block">{{ file.file.name }}</span>
                <span class="text-gray-500">({{ formatSize(file.file.size) }})</span>
                <div v-if="file.status === 'error'" class="text-red-600 truncate text-[10px]">{{ file.error }}</div>
              </div>
            </div>
            <!-- Status Upload per File -->
            <div v-if="isUploading && file.status !== 'error'" class="flex-shrink-0">
              <Icon v-if="file.status === 'uploading'" name="lucide:loader-2" class="w-4 h-4 text-gray-500 animate-spin" />
              <Icon v-else-if="file.status === 'success'" name="lucide:check-circle-2" class="w-4 h-4 text-green-600" />
              <Icon v-else name="lucide:clock" class="w-4 h-4 text-gray-400" />
            </div>
            <!-- Tombol Aksi per File -->
            <div v-else class="flex-shrink-0">
              <button
                v-if="file.status === 'error'"
                type="button"
                @click="retryFile(index)"
                class="text-blue-600 hover:text-blue-800 p-1 rounded-full text-xs flex items-center gap-1"
              >
                <Icon name="lucide:refresh-cw" class="w-3 h-3" /> Coba Lagi
              </button>
              <button v-else-if="file.status !== 'success'" type="button" @click="removeFile(index)" class="text-gray-400 hover:text-red-600 p-1 rounded-full">
                <Icon name="lucide:x-circle" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Pesan Error -->
        <div v-if="error" class="text-xs text-red-600 bg-red-50 p-3 rounded-lg flex justify-between items-center">
          <span>{{ error }}</span>
          <button v-if="hasFailedUploads" @click="retryAllFailed" type="button" class="font-semibold text-red-700 hover:underline">
            Coba Lagi Semua
          </button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="isUploading" class="px-5 pb-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-teal-600 h-2 rounded-full transition-all duration-300" :style="{ width: `${uploadProgress}%` }"></div>
        </div>
      </div>


      <div class="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
        <button type="button" class="btn-small" @click="closeModal" :disabled="isUploading">Batal</button>
        <button
          type="submit"
          :disabled="(pendingFilesCount === 0 && !isUploading) || isCancelling"
          @click="isUploading ? cancelUpload() : null"
          :class="[
            'px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait transition-colors',
            isUploading ? 'btn-danger' : 'btn-primary'
          ]"
        >
          <Icon v-if="isUploading && !isCancelling" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <Icon v-else-if="isCancelling" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <Icon v-else-if="!isUploading" name="lucide:upload" class="w-4 h-4" />
          <span>{{ buttonText }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, computed } from 'vue';
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
    return `Mengunggah ${uploadCount.value} dari ${selectedFiles.value.length}...`;
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
    // Buat URL pratinjau hanya untuk file gambar
    let previewUrl = null;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
    }
    selectedFiles.value.push({
      file,
      previewUrl,
      status: 'pending', // 'pending', 'uploading', 'success', 'error'
      progress: 0,
      error: null,
    });
  }
};

const removeFile = (index) => {
  const fileToRemove = selectedFiles.value[index];
  // Hapus object URL dari memori jika ada
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
    // Jika tidak ada file yang pending dan ada yang gagal, tombol berfungsi sebagai tombol tutup
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
      fileObject.status = 'pending'; // Reset status file yang belum diunggah
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
        fileObject.status = 'pending'; // Reset status file yang dibatalkan
      } else {
        const errorMessage = e.data?.message || e.message || 'Error tidak diketahui';
        fileObject.status = 'error';
        fileObject.error = errorMessage;
      }
    }
    // Update progress setelah setiap file (berhasil atau gagal)
    uploadCount.value = selectedFiles.value.filter(f => f.status === 'success').length;
    const processedCount = selectedFiles.value.filter(f => f.status === 'success' || f.status === 'error').length;
    uploadProgress.value = Math.round((processedCount / selectedFiles.value.length) * 100);
  }

  isUploading.value = false;
  isCancelling.value = false;
  abortController = null;

  const successCount = selectedFiles.value.filter(f => f.status === 'success').length;
  const failedCount = selectedFiles.value.filter(f => f.status === 'error').length;

  if (hasFailedUploads.value) {
    error.value = 'Beberapa file gagal diunggah. Silakan coba lagi.';
    showNotification(`${failedCount} file gagal diunggah. Silakan coba lagi.`, 'error');
  } else {
    emit('upload-success');
    closeModal();
    showNotification(`${successCount} file berhasil diunggah.`, 'success');
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
  // Hapus semua object URL dari memori sebelum menutup
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