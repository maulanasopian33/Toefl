<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main class="lg:col-span-8 xl:col-span-9">
          <!-- Loading State -->
          <div v-if="pending" class="flex h-[60vh] flex-col items-center justify-center rounded-xl bg-white p-10 text-center shadow-sm border border-gray-200">
            <Icon name="lucide:loader-2" class="h-12 w-12 animate-spin text-gray-300" />
            <p class="mt-4 text-lg font-semibold text-gray-700">Memuat Detail Batch...</p>
          </div>
          
          <!-- Not Found State -->
          <div v-else-if="!batch" class="flex h-[60vh] flex-col items-center justify-center rounded-xl bg-white p-10 text-center shadow-sm border border-gray-200">
            <Icon name="lucide:file-search-2" class="h-20 w-20 text-red-400" />
            <p class="mt-6 text-2xl font-bold text-red-600">Batch Tidak Ditemukan</p>
            <p class="mt-2 max-w-sm text-gray-500">Maaf, batch yang Anda cari tidak ada atau mungkin telah dihapus.</p>
            <NuxtLink to="/" class="mt-8 inline-flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 transition-colors">
              <Icon name="lucide:arrow-left" class="h-4 w-4" />
              Kembali ke Dashboard
            </NuxtLink>
          </div>
          
          <!-- Content -->
          <div v-else class="space-y-6">
            <BatchDetailHeader :batch="batch" />
            <BatchDetailParticipation :batch="batch" @update-batch="updateBatch" />

            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BatchDetailSchedule :sessions="batch.sessions" />
              <BatchDetailInstructions :instruksi="batch.special_instructions" />
            </div>

            <BatchDetailParticipants :participants="batch.participants" />
          </div>
        </main>

        <!-- Sidebar -->
        <aside class="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-8 h-fit">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Akses Cepat</h2>
          <nav class="space-y-3">
            <NuxtLink to="/" class="quick-link-card group bg-slate-50 border-slate-200 hover:border-slate-400">
              <div class="quick-link-icon bg-slate-100 text-slate-600">
                <Icon name="lucide:layout-dashboard" class="w-6 h-6" />
              </div>
              <div>
                <h4 class="font-semibold text-slate-900">Dashboard</h4>
                <p class="text-sm text-slate-800/80">Kembali ke halaman utama.</p>
              </div>
              <Icon name="lucide:chevron-right" class="quick-link-arrow text-slate-500" />
            </NuxtLink>

            <a href="#" class="quick-link-card group bg-emerald-50 border-emerald-200 hover:border-emerald-400">
              <div class="quick-link-icon bg-emerald-100 text-emerald-600">
                <Icon name="lucide:book-open-check" class="w-6 h-6" />
              </div>
              <div>
                <h4 class="font-semibold text-emerald-900">Materi Belajar</h4>
                <p class="text-sm text-emerald-800/80">Lihat materi pendukung tes.</p>
              </div>
              <Icon name="lucide:chevron-right" class="quick-link-arrow text-emerald-500" />
            </a>

            <a href="#" class="quick-link-card group bg-sky-50 border-sky-200 hover:border-sky-400">
              <div class="quick-link-icon bg-sky-100 text-sky-600">
                <Icon name="lucide:help-circle" class="w-6 h-6" />
              </div>
              <div>
                <h4 class="font-semibold text-sky-900">Pusat Bantuan</h4>
                <p class="text-sm text-sky-800/80">Temukan jawaban pertanyaan Anda.</p>
              </div>
              <Icon name="lucide:chevron-right" class="quick-link-arrow text-sky-500" />
            </a>
          </nav>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBatchGetById } from '@/composables/Batch/getbyid';
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BatchDetailHeader from '@/components/batch/detail/BatchHeader.vue';
import BatchDetailParticipation from '@/components/batch/detail/BatchParticipation.vue';
import BatchDetailSchedule from '@/components/batch/detail/BatchSchedule.vue';
import BatchDetailInstructions from '@/components/batch/detail/BatchInstructions.vue';
import BatchDetailParticipants from '@/components/batch/detail/BatchParticipants.vue';

const route = useRoute();
const batchId = route.params.id;

// Fetch data on client-side to show loading state properly
const { data, pending, error, refresh } = await useBatchGetById(batchId, { immediate: false });

definePageMeta({
  middleware: ['auth', 'role-check'],
  permission: "batch.user",
  title: 'Detail Batch'
});
const batch = ref(data.value);
onMounted(() => { refresh(); });

watch(data, (newData) => {
  batch.value = newData;
});

const updateBatch = (updatedData) => {
  if (batch.value) {
    batch.value = { ...batch.value, ...updatedData };
  }
};
</script>

<style>
.quick-link-card {
    @apply flex items-center p-4 rounded-xl border-2 transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg;
}

.quick-link-icon {
    @apply flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4;
}

.quick-link-arrow {
    @apply w-5 h-5 ml-auto transform transition-transform duration-200 group-hover:translate-x-1;
}
</style>