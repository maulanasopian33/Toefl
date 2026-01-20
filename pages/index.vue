<template>
  <div class="min-h-screen bg-gray-50/50 flex flex-col relative overflow-hidden">
    <!-- Decorative Elements -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full opacity-50 blur-3xl -z-10"></div>
    <div class="absolute top-1/2 -left-24 w-64 h-64 bg-emerald-50 rounded-full opacity-40 blur-3xl -z-10"></div>
    
    <main class="flex-grow container mx-auto px-4 py-8 md:px-6 lg:py-12 relative z-10 pb-24 lg:pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <!-- Bagian Utama Dashboard -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Hero Section -->
          <div class="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10 relative overflow-hidden group">
            <div class="absolute -top-12 -right-12 w-48 h-48 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
            <HeroSection @mulai-tes="openBatchModal" />
          </div>

          <div class="space-y-6">
            <notifPembayaran />
            <notifSertifikat />
          </div>

          <!-- Riwayat Tes Terakhir -->
          <div class="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <LatestTestHistory />
          </div>
        </div>

        <!-- Sidebar dengan Link Cepat -->
        <aside class="hidden lg:block lg:col-span-4 space-y-6">
          <div class="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-24">
            <QuickLinksSidebar />
          </div>
        </aside>
      </div>

      <!-- Modal selection components stay same but styled via their own files -->
      <BatchSelectionModal 
          v-model="showBatchModal"
          :batches="myBatches"
          :is-loading="isMyBatchesLoading"
          :error="myBatchesError"
          @start-test="handleStartTest"
          @open-registration="openRegistrationModal"
      />

      <BatchRegistrationModal
          v-model="showRegistrationModal"
          :batches="publicBatches"
          :is-loading="isPublicLoading"
          :error="publicError"
          @join-batch="handleJoinBatch"
      />
    </main>

    <!-- Bottom Navigation (Hanya untuk Mobile) -->
    <BottomNav class="z-50" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import notifPembayaran from '@/components/DashboardUser/notifPembayaran.vue';
import HeroSection from '@/components/DashboardUser/heroSection.vue';
import notifSertifikat from '@/components/DashboardUser/notifSertifikat.vue';
import LatestTestHistory from '@/components/DashboardUser/LatestTestHistory.vue';
import QuickLinksSidebar from '@/components/DashboardUser/QuickLinksSidebar.vue'; // Import komponen baru
import BottomNav from '@/components/DashboardUser/BottomNav.vue';
import BatchSelectionModal from '@/components/DashboardUser/BatchSelectionModal.vue';
import BatchRegistrationModal from '@/components/DashboardUser/BatchRegistrationModal.vue';
import { useActiveBatches } from '@/composables/useActiveBatches';
import { usePublicBatches } from '@/composables/usePublicBatches';

definePageMeta({
  middleware: ['auth', 'finish-register', 'role-check'],
  permission: "dashboard.user",
});

// --- State untuk Modal ---
const showBatchModal = ref(false);
const showRegistrationModal = ref(false);

// --- Data Batch ---
// Batch yang sudah diikuti pengguna
const { batches: myBatches, isLoading: isMyBatchesLoading, error: myBatchesError, refresh: refreshMyBatches } = useActiveBatches();
// Batch yang tersedia untuk umum
const { publicBatches, isPublicLoading, publicError, fetchPublicBatches } = usePublicBatches();

const openBatchModal = () => {
  refreshMyBatches(); // Selalu ambil data terbaru saat modal dibuka
  showBatchModal.value = true;
};

const openRegistrationModal = () => {
  showBatchModal.value = false; // Tutup modal sebelumnya
  fetchPublicBatches(); // Ambil data batch publik
  showRegistrationModal.value = true;
};

const handleStartTest = (batchId: string) => {
  console.log('Mulai tes untuk batch:', batchId);
  // Arahkan ke halaman ujian dengan ID batch
  navigateTo(`/test/${batchId}`);
};

const handleJoinBatch = (batchId: string) => {
  console.log('Join batch dipilih:', batchId);
  // Arahkan pengguna ke halaman detail batch
  navigateTo(`/batch/${batchId}`);
};
</script>