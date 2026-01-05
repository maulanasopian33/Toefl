<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Bank Soal</h1>
        <p class="text-slate-500 text-sm mt-1">Kelola paket soal ujian TOAFL dan TOEFL.</p>
      </div>
      <div>
        <NuxtLink to="/admin/exam/edit/new" class="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95">
          <Icon name="lucide:plus" class="w-5 h-5" />
          <span class="font-medium">Buat Paket Soal Baru</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Filters & Search -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="relative w-full md:w-96">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari paket soal..." 
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>
      
      <div class="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
          :class="activeFilter === filter.value ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-slate-50'"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Content Grid -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
       <!-- Loading Skeletons -->
       <div v-for="i in 6" :key="i" class="bg-white rounded-xl border border-slate-200 p-6 h-48 animate-pulse">
          <div class="flex gap-4">
            <div class="w-10 h-10 bg-slate-200 rounded-lg"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-slate-200 rounded w-3/4"></div>
              <div class="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
       </div>
    </div>

    <div v-else-if="filteredExams.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <Icon name="lucide:file-question" class="w-10 h-10 text-slate-300" />
      </div>
      <h3 class="text-lg font-semibold text-slate-900">Belum ada paket soal</h3>
      <p class="text-slate-500 mt-1 max-w-sm mx-auto">Mulailah dengan membuat paket soal pertama Anda untuk kategori yang dipilih.</p>
       <NuxtLink to="/admin/exam/edit/new" class="mt-6 text-indigo-600 font-medium hover:underline text-sm">
          Buat Paket Soal Baru &rarr;
       </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ExamCard 
        v-for="exam in filteredExams" 
        :key="exam.id" 
        :exam="exam"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ExamCard from '@/components/BankSoal/ExamCard.vue';
import { useNotificationPopup } from '@/composables/NotificationPopup'; // Assuming this exists global confirm
// import { useExamData } from '@/composables/useExamData'; // Might need a list fetcher

definePageMeta({
  title: 'Bank Soal - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "batch.read" // Adjust permission key
})

const { showConfirm } = useNotificationPopup()
const config = useRuntimeConfig()
const { $auth } = useNuxtApp()
const { showNotification } = useNotification()

// State
const searchQuery = ref('')
const activeFilter = ref('ALL')
const filters = [
  { label: 'Semua', value: 'ALL' },
  { label: 'TOAFL (Arab)', value: 'TOAFL' },
  { label: 'TOEFL (Inggris)', value: 'TOEFL' },
]

// Fetch Data (Custom implementation since useExamData fetches single detail)
const { data: exams, pending, refresh } = await useFetch(`${config.public.API_URL}/exams`, {
    headers: { Authorization: `Bearer ${await $auth.currentUser?.getIdToken()}` }
})

const filteredExams = computed(() => {
  let result = exams.value || [];
  
  if (activeFilter.value !== 'ALL') {
    result = result.filter((e: any) => e.type?.toUpperCase().includes(activeFilter.value));
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((e: any) => e.name?.toLowerCase().includes(q));
  }

  return result;
});

async function handleDelete(id: string) {
  const confirmed = await showConfirm(
    'Paket soal ini akan dihapus permanen. Lanjutkan?',
    { type: 'danger', title: 'Hapus Paket Soal?' }
  );

  if (confirmed) {
    try {
        await $fetch(`${config.public.API_URL}/exams/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${await $auth.currentUser?.getIdToken()}` }
        });
        showNotification('Paket soal berhasil dihapus.', 'success');
        refresh();
    } catch (e) {
        console.error(e);
        showNotification('Gagal menghapus paket soal.', 'error');
    }
  }
}
</script>
