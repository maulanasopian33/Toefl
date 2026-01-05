<template>
  <div class="min-h-screen p-6 bg-slate-50 space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen Batch</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola jadwal, kapasitas, dan sesi program pelatihan.</p>
      </div>
      <button 
        @click="goAdd" 
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        Buat Batch Baru
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-blue-600 animate-spin" />
    </div>

    <BatchTable
      v-else
      :batches="data || []"
      @edit="goEdit"
      @delete="confirmDelete"
      @view="goView"
    />
  </div>
</template>

<script setup lang="ts">
import BatchTable from '@/components/batch/BatchTable.vue';
import { useBatchGet } from '@/composables/Batch/get';
import { useBatchDelete } from '@/composables/Batch/delete';
import { useNotificationPopup } from '@/composables/NotificationPopup';
definePageMeta({
  title: 'Tambah Batch - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "batch.read"
})

const { data, pending, refresh } = await useBatchGet();
const { showConfirm, showAlert } = useNotificationPopup();

const goAdd = () => navigateTo('/admin/batch/add');
const goEdit = (batch : string) => navigateTo(`/admin/batch/edit/${batch.idBatch}`);
const goView = (batch : string) => navigateTo(`/admin/batch/${batch.idBatch}`);
const confirmDelete = async (batch : any) => {
  const confirmed = await showConfirm(`Hapus batch "${batch.namaBatch}"?`);
  if (confirmed) {
    await useBatchDelete(batch.idBatch);
    showAlert('Batch berhasil dihapus');
    refresh();
  }
};
</script>
