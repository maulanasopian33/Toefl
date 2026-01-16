<template>
  <div class="p-6 sm:p-8">
    <!-- Header Page -->
    <header class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Media Library</h1>
        <p class="mt-1 text-slate-600">Kelola atur semua aset media (gambar & audio) dalam satu tempat.</p>
      </div>
      <button 
        @click="openUploadModal"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-200"
      >
        <Icon name="lucide:upload-cloud" class="w-4 h-4" />
        Upload Media
      </button>
    </header>

    <!-- Main Card -->
    <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
      
      <!-- Toolbar & Filters -->
      <div class="p-6 border-b border-gray-100 bg-gray-50/50 space-y-4">
        <!-- Top Row: Stats & Search -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
           <!-- Left: Stats -->
           <div class="flex items-center gap-4">
              <div class="flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                 <div class="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Icon name="lucide:image" class="w-4 h-4" />
                 </div>
                 <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gambar</p>
                    <p class="text-sm font-bold text-gray-800">{{ imageCount }}</p>
                 </div>
              </div>
              <div class="flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                 <div class="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                    <Icon name="lucide:volume-2" class="w-4 h-4" />
                 </div>
                 <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Audio</p>
                    <p class="text-sm font-bold text-gray-800">{{ audioCount }}</p>
                 </div>
              </div>
           </div>

           <!-- Right: Filters -->
           <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <!-- Type Filter -->
              <div class="relative">
                 <select 
                   v-model="selectedType" 
                   class="w-full sm:w-40 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-600 appearance-none pl-10"
                 >
                    <option value="">Semua Tipe</option>
                    <option value="image">Gambar</option>
                    <option value="audio">Audio</option>
                 </select>
                 <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Icon name="lucide:filter" class="w-4 h-4" />
                 </div>
                 <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <Icon name="lucide:chevron-down" class="w-4 h-4" />
                 </div>
              </div>

              <!-- Search -->
              <div class="relative group w-full sm:w-64">
                 <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Icon name="lucide:search" class="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                 </div>
                 <input 
                   type="text" 
                   v-model="q" 
                   placeholder="Cari file..." 
                   class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                 />
              </div>

              <!-- View Mode Toggle -->
              <div class="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                 <button 
                    @click="viewMode = 'grid'"
                    class="p-1.5 rounded-lg transition-colors flex items-center justify-center w-8 h-8"
                    :class="viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'"
                    title="Grid View"
                 >
                    <Icon name="lucide:layout-grid" class="w-4 h-4" />
                 </button>
                 <button 
                    @click="viewMode = 'list'"
                    class="p-1.5 rounded-lg transition-colors flex items-center justify-center w-8 h-8"
                    :class="viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'"
                    title="List View"
                 >
                    <Icon name="lucide:list" class="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="bg-white min-h-[400px]">
         <!-- Loading -->
         <div v-if="pending" class="flex flex-col items-center justify-center py-24 text-center">
            <Icon name="lucide:loader-2" class="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <h3 class="text-sm font-semibold text-gray-700">Memuat Media...</h3>
         </div>

         <!-- Error -->
         <div v-else-if="error" class="flex flex-col items-center justify-center py-16 text-center m-6 p-8 bg-red-50 rounded-2xl border border-red-100">
           <Icon name="lucide:server-crash" class="w-12 h-12 text-red-400 mb-4" />
           <h4 class="font-semibold text-lg text-gray-800">Gagal Memuat Media</h4>
           <button @click="refresh" class="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
             <Icon name="lucide:refresh-cw" class="w-4 h-4" /> Coba Lagi
           </button>
         </div>

         <!-- Empty -->
         <div v-else-if="filteredMedia.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
            <div class="p-4 bg-gray-50 rounded-full mb-4">
               <Icon name="lucide:image-off" class="w-10 h-10 text-gray-400" />
            </div>
            <h4 class="font-semibold text-lg text-gray-900">Tidak Ada Media</h4>
            <p class="text-sm text-gray-500 mt-2">Belum ada file media yang cocok dengan filter kriteria.</p>
         </div>

         <!-- Grid/List View -->
         <div v-else class="p-6">
            <MediaGrid
               v-if="viewMode === 'grid'"
               :media="paginatedMedia"
               :format-size="formatSize"
               :format-date="formatDate"
               :get-full-url="getFullUrl"
               @preview="openPreview"
               @download="download"
            />
            <MediaList
               v-else
               :media="paginatedMedia"
               :format-size="formatSize"
               :format-date="formatDate"
               :get-full-url="getFullUrl"
               @preview="openPreview"
               @download="download"
            />
         </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-sm text-gray-500">
           Halaman <span class="font-bold text-gray-800">{{ currentPage }}</span> dari <span class="font-bold text-gray-800">{{ totalPages }}</span>
        </span>
        <div class="flex gap-2">
           <button 
             @click="prevPage" 
             :disabled="currentPage === 1 || pending" 
             class="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
           >
             Sebelumnya
           </button>
           <button 
             @click="nextPage" 
             :disabled="currentPage === totalPages || pending" 
             class="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
           >
             Berikutnya
           </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <MediaPreviewModal
      v-if="previewItem"
      :item="previewItem"
      :format-size="formatSize"
      :format-date="formatDate"
      @close="previewItem = null"
      @download="download"
      @delete="deleteItem"
      :get-full-url="getFullUrl"
    />

    <MediaUploadModal v-model="showUpload" @upload-success="refresh" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMediaGet } from '@/composables/media/get';
import { useMediaDelete } from '@/composables/media/delete';
import { useNotificationPopup } from '@/composables/NotificationPopup';
import { useNotification } from '@/composables/useNotification';
import MediaGrid from '@/components/media/MediaGrid.vue';
import MediaList from '@/components/media/MediaList.vue';
import MediaPreviewModal from '@/components/media/MediaPreviewModal.vue';
import MediaUploadModal from '@/components/media/MediaUploadModal.vue';

// Page Meta
definePageMeta({
  title: 'Media Library - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'media.read',
})

// Config
const config = useRuntimeConfig();
const MEDIA_BASE_URL = config.public.MEDIA_URL || '';

// Composables
const { data: allMediaItems, pending, error, refresh } = await useMediaGet();
const { showConfirm } = useNotificationPopup();
const { showNotification } = useNotification();

// State
const q = ref('');
const selectedType = ref('');
const viewMode = ref('grid');
const previewItem = ref(null);
const showUpload = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(12); // Slightly increased for grid view density

// Logic
const processedMediaItems = computed(() => {
  if (!allMediaItems.value) return [];
  return allMediaItems.value.map((item) => ({
    ...item,
    type: mapMimeToType(item.mimeType), // Ensure your API returns 'mimeType'
  }));
});

const filteredMedia = computed(() => {
  const query = q.value.toLowerCase();
  return processedMediaItems.value.filter((item) => {
    const typeMatch = !selectedType.value || item.type === selectedType.value;
    const queryMatch =
      !query ||
      (item.originalName && item.originalName.toLowerCase().includes(query)) ||
      (item.filename && item.filename.toLowerCase().includes(query));
    return typeMatch && queryMatch;
  });
});

const totalItems = computed(() => filteredMedia.value.length);
const totalPages = computed(() => Math.ceil(filteredMedia.value.length / itemsPerPage.value));

const paginatedMedia = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredMedia.value.slice(start, start + itemsPerPage.value);
});

console.log(paginatedMedia);

const imageCount = computed(() => processedMediaItems.value.filter((m) => m.type === 'image').length);
const audioCount = computed(() => processedMediaItems.value.filter((m) => m.type === 'audio').length);

// Watchers
watch([q, selectedType], () => {
  currentPage.value = 1;
});

// Helpers
const mapMimeToType = (mime) => {
  if (!mime) return 'file';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('audio/')) return 'audio';
  return 'file';
};

const getFullUrl = (path) => {
   if (!path) return '';
   if (path.startsWith('http')) return path; // Already full URL
   // Clean up path slashes if needed, assuming simple concatenation for now
   return `${MEDIA_BASE_URL}/${path}`;
};

const formatSize = (size) => {
  if (!size && size !== 0) return '-';
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const formatDate = (isoString) => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
};

// Actions
const openPreview = (item) => {
  previewItem.value = item;
};

const openUploadModal = () => {
  showUpload.value = true;
};

const download = (item) => {
  const url = getFullUrl(item.url);
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.download = item.originalName || item.filename;
  link.target = "_blank"; // Safer for external links
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const deleteItem = async (item) => {
  const confirmed = await showConfirm(
    `File "${item.originalName}" akan dihapus secara permanen.`,
    { type: 'danger', title: 'Hapus File?' }
  );

  if (confirmed) {
    try {
      await useMediaDelete(item.id);
      await refresh();
      showNotification('File berhasil dihapus.', 'success');
      previewItem.value = null;
    } catch (e) {
      showNotification(`Gagal: ${e.message}`, 'error');
    }
  }
};

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
</script>
