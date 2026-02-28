<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <header class="mb-8">
        <NuxtLink to="/admin/penilaian/scoring-tables" class="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 mb-6 group transition-colors">
          <div class="p-1.5 bg-gray-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
             <Icon name="lucide:arrow-left" class="h-4 w-4" />
          </div>
          Kembali ke Daftar Tabel
        </NuxtLink>
        <div class="flex items-center gap-3">
           <div class="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
              <Icon name="lucide:plus-circle" class="w-6 h-6" />
           </div>
           <div>
              <h1 class="text-3xl font-black tracking-tight text-slate-900">Tambah Tabel Baru</h1>
              <p class="text-slate-500 font-medium text-sm">Buat dataset konversi nilai baru untuk pengerjaan ujian.</p>
           </div>
        </div>
      </header>

      <!-- Form -->
      <TableForm 
        :is-saving="isSaving" 
        @save="handleSave" 
        @cancel="navigateTo('/admin/penilaian/scoring-tables')" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TableForm from '@/components/admin/scoring/TableForm.vue';
import { useScoring, type ScoringTable } from '@/composables/useScoring';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'setting.manage'
});

const { createTable } = useScoring();
const { showNotification } = useNotification();
const isSaving = ref(false);

const handleSave = async (data: ScoringTable) => {
  isSaving.value = true;
  try {
    await createTable(data);
    showNotification('Tabel scoring berhasil dibuat.', 'success');
    navigateTo('/admin/penilaian/scoring-tables');
  } catch (err: any) {
    showNotification(err.message || 'Gagal membuat tabel scoring.', 'error');
  } finally {
    isSaving.value = false;
  }
};
</script>
