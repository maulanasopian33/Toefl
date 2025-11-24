<template>
  <div class="space-y-6">
    <!-- HEADER + RINGKASAN -->
    <MediaHeader
      :total-items="totalItems"
      :image-count="imageCount"
      :audio-count="audioCount"
      @open-upload="openUploadModal"
    />

    <!-- FILTER + LIST MEDIA -->
    <div class="card">
      <!-- Filter toolbar -->
      <MediaToolbar
        v-model:q="q"
        v-model:selectedType="selectedType"
        v-model:viewMode="viewMode"
      />

      <!-- LOADING / ERROR -->
      <div v-if="pending" class="py-10 flex flex-col items-center justify-center text-sm text-gray-500">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin mb-2" />
        <span>Memuat media...</span>
      </div>
      <div v-else-if="error" class="py-6 text-center text-sm text-red-500">
        Terjadi kesalahan saat memuat media: {{ error.message }}
      </div>

      <MediaGrid
        v-if="viewMode === 'grid'"
        :media="paginatedMedia"
        :format-size="formatSize"
        :format-date="formatDate"
        @preview="openPreview"
        @download="download"
      />
      <MediaList
        v-else
        :media="paginatedMedia"
        :format-size="formatSize"
        :format-date="formatDate"
        @preview="openPreview"
        @download="download"
      />

      <!-- Pagination dari API -->
      <div
        v-if="totalPages > 1"
        class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-xs sm:text-sm"
      >
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1 || pending"
            class="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages || pending"
            class="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Berikutnya
          </button>
        </div>
        <span class="text-gray-600">
          Halaman
          <span class="font-semibold">{{ currentPage }}</span>
          dari
          <span class="font-semibold">{{ totalPages }}</span>
        </span>
      </div>
    </div>

    <MediaPreviewModal
      :item="previewItem"
      :format-size="formatSize"
      :format-date="formatDate"
      @close="previewItem = null"
      @download="download"
      @delete="deleteItem"
    />

    <MediaUploadModal v-model="showUpload" @upload-success="refresh" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMediaGet } from '@/composables/media/get';
import { useMediaDelete } from '@/composables/media/delete'; // Asumsi composable delete sudah ada
import { useNotificationPopup } from '@/composables/NotificationPopup';
import { useNotification } from '@/composables/useNotification';
import MediaHeader from '@/components/media/MediaHeader.vue';
import MediaToolbar from '@/components/media/MediaToolbar.vue';
import MediaGrid from '@/components/media/MediaGrid.vue';
import MediaList from '@/components/media/MediaList.vue';
import MediaPreviewModal from '@/components/media/MediaPreviewModal.vue';
import MediaUploadModal from '@/components/media/MediaUploadModal.vue';

// Menggunakan composable useMediaGet
const { data: allMediaItems, pending, error, refresh } = await useMediaGet();
const { showConfirm } = useNotificationPopup();
const { showNotification } = useNotification();
definePageMeta({
  title: 'Media Library - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  roles: ['admin'],
})
const q = ref('');
const selectedType = ref('');
const viewMode = ref('grid');

const previewItem = ref(null);
const showUpload = ref(false); // Ini untuk modal upload, bukan dari useMediaGet

// pagination dari API
const currentPage = ref(1);
const itemsPerPage = ref(10); // Jumlah item per halaman

// Computed property untuk menambahkan 'type' ke setiap item media
const processedMediaItems = computed(() => {
  return allMediaItems.value.map((item) => ({
    ...item,
    type: mapMimeToType(item.mimeType),
  }));
});

// Filter media berdasarkan query pencarian dan tipe
const filteredMedia = computed(() => {
  const query = q.value.toLowerCase();
  return processedMediaItems.value.filter((item) => {
    const typeMatch = !selectedType.value || item.type === selectedType.value;
    const queryMatch =
      !query ||
      item.originalName.toLowerCase().includes(query) ||
      item.filename.toLowerCase().includes(query);
    return typeMatch && queryMatch;
  });
});

// Reset halaman ke 1 setiap kali filter atau pencarian berubah
watch([q, selectedType], () => {
  currentPage.value = 1;
});

// Computed untuk total item setelah filter
const totalItems = computed(() => filteredMedia.value.length);

// Computed untuk total halaman
const totalPages = computed(() => Math.ceil(filteredMedia.value.length / itemsPerPage.value));

// Computed untuk media yang ditampilkan di halaman saat ini
const paginatedMedia = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredMedia.value.slice(start, end);
});

const imageCount = computed(
  () => processedMediaItems.value.filter((m) => m.type === 'image').length
);
const audioCount = computed(
  () => processedMediaItems.value.filter((m) => m.type === 'audio').length
);

const mapMimeToType = (mime) => {
  if (!mime) return 'file';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('audio/')) return 'audio';
  return 'file';
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

const openPreview = (item) => {
  previewItem.value = item;
};

const download = (item) => {
  if (!item?.url) return;
  // basic download, nanti bisa diganti dengan anchor yang lebih proper
  const link = document.createElement('a');
  link.href = item.url;
  link.download = item.originalName || item.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const deleteItem = async (item) => {
  const confirmed = await showConfirm(
    `File "${item.originalName}" akan dihapus secara permanen dan tidak dapat dikembalikan.`,
    {
      type: 'danger',
      title: 'Hapus File Permanen?'
    }
  );

  if (confirmed) {
    try {
      await useMediaDelete(item.id);
      await refresh(); // Refresh daftar media setelah penghapusan
      showNotification(`File "${item.originalName}" berhasil dihapus.`, 'success');
      previewItem.value = null; // Tutup modal preview
    } catch (e) {
      showNotification(`Gagal menghapus file: ${e.message}`, 'error');
      console.error('Gagal menghapus media:', e);
    }
  }
};

const openUploadModal = () => {
  showUpload.value = true;
};

const nextPage = () => { // Tidak perlu lagi parameter page
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>
