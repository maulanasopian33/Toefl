<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-7xl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
           <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-200">
                 <Icon name="lucide:database" class="w-6 h-6" />
              </div>
              <h1 class="text-3xl font-black tracking-tight text-slate-900">Bank Soal (Sections)</h1>
           </div>
           <p class="text-slate-500 font-medium">Kelola pustaka section/bagian ujian yang dapat digunakan berulang kali di berbagai batch.</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <!-- Button placeholder for Creating Template directly if needed later -->
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
             Gunakan "Promote" dari Batch Editor untuk menambah Bank Soal
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse">
        <Icon name="lucide:loader-2" class="h-12 w-12 animate-spin text-gray-200 mb-4" />
        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Memuat data bank soal...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-[2.5rem] bg-white p-12 text-center shadow-xl border border-rose-100 flex flex-col items-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-50 text-rose-600 mb-6 ring-4 ring-rose-50/50">
          <Icon name="lucide:alert-circle" class="h-10 w-10" />
        </div>
        <h3 class="text-xl font-black text-slate-900">Gagal Memuat Data</h3>
        <p class="mt-2 text-slate-500 max-w-xs mx-auto font-medium">{{ error }}</p>
        <button @click="() => fetchTemplates()" class="mt-8 px-6 py-2.5 bg-rose-100 text-rose-700 font-bold rounded-xl hover:bg-rose-200 transition-colors">Coba Lagi</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="templates.length === 0" class="rounded-[2.5rem] bg-white p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gray-50 text-gray-300 mb-6">
          <Icon name="lucide:database-zap" class="h-10 w-10" />
        </div>
        <h3 class="text-xl font-black text-slate-900">Bank Soal Masih Kosong</h3>
        <p class="mt-2 text-slate-400 max-w-xs mx-auto font-medium">Promosikan section dari Batch yang sudah ada untuk menjadikannya template di sini.</p>
      </div>

      <!-- Content Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="template in templates" :key="template.idSection" class="group rounded-[2.5rem] bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1 border border-slate-100 flex flex-col transition-all duration-300 overflow-hidden ring-1 ring-gray-900/5">
          <div class="p-8">
            <div class="flex justify-between items-start mb-6">
              <div class="bg-rose-50 p-3 rounded-2xl group-hover:bg-rose-100 transition-colors">
                 <Icon name="lucide:file-text" class="w-6 h-6 text-rose-600" />
              </div>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openDeleteConfirmation(template)" class="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <h3 class="text-xl font-black text-slate-900 mb-1">{{ template.namaSection }}</h3>
            <p class="text-xs font-mono text-gray-400 mb-4">{{ template.idSection }}</p>
            <div v-if="template.deskripsi" class="text-sm text-slate-500 font-medium line-clamp-2 min-h-[2.5rem] bg-gray-50 p-3 rounded-xl border border-gray-100 italic" v-html="template.deskripsi"></div>
            <p v-else class="text-sm text-slate-400 font-medium italic">Tidak ada deskripsi.</p>
          </div>

          <div class="px-8 py-6 bg-gray-50/50 border-t border-slate-50 flex-grow">
            <div class="flex items-center justify-between">
               <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <h4 class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Status: Ready</h4>
               </div>
               <span class="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100/50">Template Master</span>
            </div>
          </div>
          
          <div class="px-8 py-5 bg-white border-t border-slate-50">
             <NuxtLink :to="`/admin/bank/soal/${template.idSection}`" class="w-full flex items-center justify-center gap-2 py-2 text-xs font-black text-rose-600 hover:text-rose-700 transition-colors">
                Pratinjau & Edit Soal <Icon name="lucide:chevron-right" class="w-4 h-4" />
             </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation placeholder -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'bank.view' // Adjust as needed
});

const config = useRuntimeConfig();
const { $auth } = useNuxtApp();


// Fetch Data using useFetch for better SSR and state management
const { data: response, pending: isLoading, error: fetchError, refresh: fetchTemplates } = await useFetch(`${config.public.API_URL}/bank/templates`, {
  lazy: true,
  async onRequest({ options }) {
    const token = await $auth.currentUser?.getIdToken();
    if (token) {
      options.headers = { ...options.headers, Authorization: `Bearer ${token}` } as any;
    }
  }
});

const templates = computed(() => (response.value as any)?.data || []);
const error = computed(() => fetchError.value?.message || null);

// No need for onMounted fetch


const openDeleteConfirmation = (template: any) => {
  // Logic to delete section master
  if(confirm(`Hapus Master Section "${template.namaSection}"? Ini tidak akan menghapus section yang sudah di-import ke batch.`)) {
      // API call to delete
  }
};
</script>
