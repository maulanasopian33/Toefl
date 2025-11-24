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
                <div class="card bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
                    <h3 class="text-xl font-semibold text-slate-800 mb-4">Riwayat Tes Terakhir</h3>
                    <div id="lastTestDetails" class="text-center py-8">
                        <div class="flex justify-center mb-4">
                            <div class="bg-slate-100 rounded-full p-3">
                                <Icon name="lucide:history" class="w-8 h-8 text-slate-500" />
                            </div>
                        </div>
                        <p class="text-slate-600 font-medium">Belum ada tes yang diselesaikan</p>
                        <p class="text-sm text-slate-500 mt-1">Hasil tes terakhir Anda akan muncul di sini.</p>
                    </div>
                    <div class="mt-4 border-t border-slate-200 pt-4 flex justify-end">
                        <button id="viewAllHistoryButton" class="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors duration-200">
                            Lihat Semua Riwayat
                            <Icon name="lucide:arrow-right" class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sidebar dengan Link Cepat -->
            <div class="lg:col-span-1 h-fit lg:sticky top-6">
                <h2 class="text-xl font-semibold mb-4 text-slate-800">Menu Cepat</h2>
                <nav class="space-y-3">
                    <a href="#" class="quick-link-card group bg-emerald-50 border-emerald-200 hover:border-emerald-400">
                        <div class="quick-link-icon bg-emerald-100 text-emerald-600">
                            <Icon name="lucide:book-open-check" class="w-6 h-6" />
                        </div>
                        <div>
                            <h4 class="font-semibold text-emerald-900">Materi Belajar</h4>
                            <p class="text-sm text-emerald-800/80">Pelajari konsep penting sebelum tes.</p>
                        </div>
                        <Icon name="lucide:chevron-right" class="quick-link-arrow text-emerald-500" />
                    </a>

                    <a href="#" class="quick-link-card group bg-sky-50 border-sky-200 hover:border-sky-400">
                        <div class="quick-link-icon bg-sky-100 text-sky-600">
                            <Icon name="lucide:file-question" class="w-6 h-6" />
                        </div>
                        <div>
                            <h4 class="font-semibold text-sky-900">Latihan Soal</h4>
                            <p class="text-sm text-sky-800/80">Asah kemampuan dengan soal latihan.</p>
                        </div>
                        <Icon name="lucide:chevron-right" class="quick-link-arrow text-sky-500" />
                    </a>

                    <a href="#" class="quick-link-card group bg-indigo-50 border-indigo-200 hover:border-indigo-400">
                        <div class="quick-link-icon bg-indigo-100 text-indigo-600">
                            <Icon name="lucide:bar-chart-3" class="w-6 h-6" />
                        </div>
                        <div>
                            <h4 class="font-semibold text-indigo-900">Riwayat Skor</h4>
                            <p class="text-sm text-indigo-800/80">Lihat progres dan hasil tes Anda.</p>
                        </div>
                        <Icon name="lucide:chevron-right" class="quick-link-arrow text-indigo-500" />
                    </a>

                    <a href="#" class="quick-link-card group bg-slate-50 border-slate-200 hover:border-slate-400">
                        <div class="quick-link-icon bg-slate-100 text-slate-600">
                            <Icon name="lucide:help-circle" class="w-6 h-6" />
                        </div>
                        <div>
                            <h4 class="font-semibold text-slate-900">Bantuan & FAQ</h4>
                            <p class="text-sm text-slate-800/80">Temukan jawaban dari pertanyaan Anda.</p>
                        </div>
                        <Icon name="lucide:chevron-right" class="quick-link-arrow text-slate-500" />
                    </a>
                </nav>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import notifPembayaran from '@/components/DashboardUser/notifPembayaran.vue';
import HeroSection from '@/components/DashboardUser/heroSection.vue';
import notifSertifikat from '@/components/DashboardUser/notifSertifikat.vue';
import BatchSelectionModal from '@/components/DashboardUser/BatchSelectionModal.vue';
import BatchRegistrationModal from '@/components/DashboardUser/BatchRegistrationModal.vue';
import { useActiveBatches } from '@/composables/useActiveBatches';
import { usePublicBatches } from '@/composables/usePublicBatches';

definePageMeta({
  middleware: ['auth', 'finish-register', 'role-check'],
  roles: ['user'],
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