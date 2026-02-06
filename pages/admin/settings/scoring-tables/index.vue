<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-7xl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
           <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                 <Icon name="lucide:table-properties" class="w-6 h-6" />
              </div>
              <h1 class="text-3xl font-black tracking-tight text-slate-900">Tabel Conversi Skor</h1>
           </div>
           <p class="text-slate-500 font-medium">Kelola tabel konversi skor TOEFL/TOAFL untuk perhitungan nilai otomatis.</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <NuxtLink to="/admin/settings/scoring-tables/new" class="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-black text-white hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 transform active:scale-95">
            <Icon name="lucide:plus-circle" class="h-5 w-5" />
            Tambah Tabel Baru
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse">
        <Icon name="lucide:loader-2" class="h-12 w-12 animate-spin text-gray-200 mb-4" />
        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Memuat data tabel...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-[2.5rem] bg-white p-12 text-center shadow-xl border border-rose-100 flex flex-col items-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-50 text-rose-600 mb-6 ring-4 ring-rose-50/50">
          <Icon name="lucide:alert-circle" class="h-10 w-10" />
        </div>
        <h3 class="text-xl font-black text-slate-900">Gagal Memuat Data</h3>
        <p class="mt-2 text-slate-500 max-w-xs mx-auto font-medium">{{ error.message }}</p>
        <button @click="fetchTables" class="mt-8 px-6 py-2.5 bg-rose-100 text-rose-700 font-bold rounded-xl hover:bg-rose-200 transition-colors">Coba Lagi</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="tables.length === 0" class="rounded-[2.5rem] bg-white p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gray-50 text-gray-300 mb-6">
          <Icon name="lucide:clipboard-list" class="h-10 w-10" />
        </div>
        <h3 class="text-xl font-black text-slate-900">Belum Ada Tabel Scoring</h3>
        <p class="mt-2 text-slate-400 max-w-xs mx-auto font-medium">Buat tabel konversi pertama Anda untuk mulai menggunakan sistem penilaian otomatis.</p>
        <NuxtLink to="/admin/settings/scoring-tables/new" class="mt-8 px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 transform active:scale-95">Mulai Buat Tabel</NuxtLink>
      </div>

      <!-- Content Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="table in tables" :key="table.id" class="group rounded-[2.5rem] bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1 border border-slate-100 flex flex-col transition-all duration-300 overflow-hidden ring-1 ring-gray-900/5">
          <div class="p-8">
            <div class="flex justify-between items-start mb-6">
              <div class="bg-indigo-50 p-3 rounded-2xl">
                 <Icon name="lucide:layout-template" class="w-6 h-6 text-indigo-600" />
              </div>
              <div class="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <NuxtLink :to="`/admin/settings/scoring-tables/${table.id}`" class="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  <Icon name="lucide:pencil" class="h-4 w-4" />
                </NuxtLink>
                <button @click="openDeleteConfirmation(table)" class="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-xl font-black text-slate-900 line-clamp-1">{{ table.name }}</h3>
              <span v-if="table.is_default" class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-tighter">
                Default
              </span>
            </div>
            <p class="text-sm text-slate-500 font-medium line-clamp-2 min-h-[2.5rem]">{{ table.description || "Tidak ada deskripsi." }}</p>
          </div>

          <div class="px-8 py-6 bg-gray-50/50 border-t border-slate-50 flex-grow">
            <div class="flex items-center justify-between mb-4">
               <h4 class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Rincian Data</h4>
               <span class="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100/50">{{ table.details?.length || 0 }} Baris Konversi</span>
            </div>
            
            <button 
              v-if="!table.is_default" 
              @click="setAsDefault(table)"
              :disabled="isUpdatingDefault === table.id"
              class="w-full py-2.5 px-4 bg-white border-2 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-slate-600 hover:text-indigo-600 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 group/btn active:scale-95 disabled:opacity-50"
            >
              <Icon v-if="isUpdatingDefault === table.id" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
              <Icon v-else name="lucide:star" class="w-3.5 h-3.5 group-hover/btn:fill-indigo-600 transition-all" />
              Set sebagai Default
            </button>
          </div>
          
          <div class="px-8 py-5 bg-white border-t border-slate-50">
             <NuxtLink :to="`/admin/settings/scoring-tables/${table.id}`" class="w-full flex items-center justify-center gap-2 py-2 text-xs font-black text-indigo-600 hover:text-indigo-700 transition-colors">
                Detail Tabel <Icon name="lucide:chevron-right" class="w-4 h-4" />
             </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="!!tableToDelete" as="template">
      <Dialog as="div" @close="tableToDelete = null" class="relative z-50">
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
              <DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-[2rem] bg-white p-8 text-center align-middle shadow-2xl transition-all border border-gray-100">
                <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-rose-50 text-rose-600 mb-6 ring-4 ring-rose-50/50">
                    <Icon name="lucide:trash-2" class="h-10 w-10" />
                </div>
                <DialogTitle as="h3" class="text-xl font-black text-slate-900 leading-tight">Hapus Tabel Skor?</DialogTitle>
                <p class="mt-3 text-sm text-slate-500 font-medium px-2">
                    Anda yakin ingin menghapus tabel <span class="text-slate-900 font-black">"{{ tableToDelete?.name }}"</span>? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div class="mt-8 flex flex-col gap-3">
                    <button @click="confirmDelete" :disabled="isDeleting" class="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all transform active:scale-95 disabled:opacity-50">
                        <Icon v-if="isDeleting" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
                        Ya, Hapus Tabel
                    </button>
                    <button @click="tableToDelete = null" class="w-full px-6 py-3.5 rounded-2xl bg-gray-50 text-gray-500 text-sm font-bold hover:bg-gray-100 transition-all">Batal</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { useScoring, type ScoringTable } from '@/composables/useScoring';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'setting.manage' // Assuming this permission exists or adjust accordingly
});

const { tables, isLoading, error, fetchTables, deleteTable, updateTable } = useScoring();
const { showNotification } = useNotification();

const tableToDelete = ref<ScoringTable | null>(null);
const isDeleting = ref(false);
const isUpdatingDefault = ref<number | null>(null);

onMounted(() => {
  fetchTables();
});

const setAsDefault = async (table: ScoringTable) => {
  if (!table.id) return;
  isUpdatingDefault.value = table.id;
  try {
    await updateTable(table.id, { ...table, is_default: true });
    showNotification(`Tabel "${table.name}" sekarang menjadi default.`, 'success');
    await fetchTables();
  } catch (err) {
    showNotification('Gagal mengatur tabel default.', 'error');
  } finally {
    isUpdatingDefault.value = null;
  }
};

const openDeleteConfirmation = (table: ScoringTable) => {
  tableToDelete.value = table;
};

const confirmDelete = async () => {
  if (!tableToDelete.value?.id) return;
  isDeleting.value = true;
  try {
    await deleteTable(tableToDelete.value.id);
    showNotification(`Tabel "${tableToDelete.value.name}" berhasil dihapus.`, 'success');
    tableToDelete.value = null;
    fetchTables();
  } catch (err) {
    showNotification('Gagal menghapus tabel scoring.', 'error');
  } finally {
    isDeleting.value = false;
  }
};
</script>
