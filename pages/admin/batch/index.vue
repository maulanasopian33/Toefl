<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <BatchTable
      :batches="data"
      @add="goAdd"
      @edit="goEdit"
      @delete="confirmDelete"
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
  roles: ['admin'],
})

const { data, pending, refresh } = await useBatchGet();
const { showConfirm, showAlert } = useNotificationPopup();

const goAdd = () => navigateTo('/admin/batch/add');
const goEdit = (batch) => navigateTo(`/admin/batch/edit/${batch.idBatch}`);
const confirmDelete = async (batch : any) => {
  const confirmed = await showConfirm(`Hapus batch "${batch.namaBatch}"?`);
  if (confirmed) {
    await useBatchDelete(batch.idBatch);
    showAlert('Batch berhasil dihapus');
    refresh();
  }
};
</script>
