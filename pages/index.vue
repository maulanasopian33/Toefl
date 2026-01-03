<template>
  <div class="bg-slate-50 min-h-screen">
    
    <main class="container mx-auto px-4 py-6 sm:px-6 lg:py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            <!-- Bagian Utama Dashboard -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Hero Section & Notifikasi -->
                <HeroSection @mulai-tes="openBatchModal" />
                <notifPembayaran/>
                <notifSertifikat/>

                <!-- Riwayat Tes Terakhir -->
                <LatestTestHistory />
            </div>

            <!-- Sidebar dengan Link Cepat -->
            <div class="hidden lg:block lg:col-span-1 h-fit lg:sticky top-6">
              <QuickLinksSidebar />
            </div>
        </div>

        <!-- Modal Pemilihan Batch -->
        <BatchSelectionModal 
            v-model="showBatchModal"
            :batches="myBatches"
            :is-loading="isMyBatchesLoading"
            :error="myBatchesError"
            @start-test="handleStartTest"
            @open-registration="openRegistrationModal"
        />

        <!-- Modal Pendaftaran Batch Baru -->
        <BatchRegistrationModal
            v-model="showRegistrationModal"
            :batches="publicBatches"
            :is-loading="isPublicLoading"
            :error="publicError"
            @join-batch="handleJoinBatch"
        />
    </main>

    <!-- Bottom Navigation (Hanya untuk Mobile) -->
    <BottomNav />

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