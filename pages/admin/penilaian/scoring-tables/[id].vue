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
              <Icon name="lucide:edit-3" class="w-6 h-6" />
           </div>
           <div>
              <h1 class="text-3xl font-black tracking-tight text-slate-900">Edit Tabel Skor</h1>
              <p v-if="initialData" class="text-slate-500 font-medium text-sm">Mengedit tabel <span class="text-indigo-600 font-black">{{ initialData.name }}</span></p>
              <p v-else class="text-slate-500 font-medium text-sm">Memuat data tabel...</p>
           </div>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse">
        <Icon name="lucide:loader-2" class="h-12 w-12 animate-spin text-gray-200 mb-4" />
        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Mengambil rincian tabel...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="fetchError" class="rounded-[2.5rem] bg-white p-12 text-center shadow-xl border border-rose-100 flex flex-col items-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-50 text-rose-600 mb-6 font-medium">
          <Icon name="lucide:alert-circle" class="h-10 w-10" />
        </div>
        <h3 class="text-xl font-black text-slate-900">Gagal Memuat Tabel</h3>
        <p class="mt-2 text-slate-500 max-w-xs mx-auto font-medium">{{ fetchError.message }}</p>
        <button @click="loadTable" class="mt-8 px-6 py-2.5 bg-rose-100 text-rose-700 font-bold rounded-xl hover:bg-rose-200 transition-colors">Coba Lagi</button>
      </div>

      <!-- Form -->
      <TableForm 
        v-if="initialData"
        :initial-data="initialData"
        :is-saving="isSaving" 
        @save="handleSave" 
        @cancel="navigateTo('/admin/penilaian/scoring-tables')" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TableForm from '@/components/admin/scoring/TableForm.vue';
import { useScoring, type ScoringTable } from '@/composables/useScoring';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'setting.manage'
});

const route = useRoute();
const tableId = route.params.id as string;

const { getTable, updateTable } = useScoring();
const { showNotification } = useNotification();

const initialData = ref<ScoringTable | null>(null);
const isLoading = ref(true);
const fetchError = ref<any>(null);
const isSaving = ref(false);

const loadTable = async () => {
  isLoading.value = true;
  fetchError.value = null;
  try {
    initialData.value = await getTable(tableId);
  } catch (err: any) {
    fetchError.value = err;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadTable();
});

const handleSave = async (data: ScoringTable) => {
  isSaving.value = true;
  try {
    await updateTable(tableId, data);
    showNotification('Tabel scoring berhasil diperbarui.', 'success');
    navigateTo('/admin/penilaian/scoring-tables');
  } catch (err: any) {
    showNotification(err.message || 'Gagal memperbarui tabel scoring.', 'error');
  } finally {
    isSaving.value = false;
  }
};
</script>
