<template>
  <div v-if="batch" class="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
    <!-- Breadcrumb / Back Navigation -->
    <div class="flex items-center gap-2 text-sm text-slate-500 mb-2">
      <button @click="router.back()" class="hover:text-blue-600 flex items-center gap-1 transition-colors focus:outline-none">
        <Icon name="lucide:arrow-left" class="w-4 h-4" />
        Kembali
      </button>
      <span class="text-slate-300">/</span>
      <span class="font-medium text-slate-700">Detail Batch</span>
    </div>

    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div class="space-y-3">
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{{ batch.name }}</h1>
          <span :class="statusBadgeClass" class="px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide">
            {{ batch.status }}
          </span>
        </div>
        <div class="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
          <div class="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            <Icon name="lucide:calendar-range" class="w-3.5 h-3.5 text-slate-400" />
            <span class="font-medium">{{ formattedDateRange }}</span>
          </div>
          <div class="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
             <Icon name="lucide:tag" class="w-3.5 h-3.5 text-slate-400" />
             <span class="font-medium">{{ batch.type || 'Program Reguler' }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="goToEdit" 
          class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 focus:ring-4 focus:ring-slate-100 transition-all shadow-sm"
        >
          <Icon name="lucide:pencil" class="w-4 h-4" />
          <span>Edit Batch</span>
        </button>
        <button 
          @click="confirmDelete" 
          class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 text-sm font-medium rounded-lg hover:bg-rose-50 hover:border-rose-300 focus:ring-4 focus:ring-rose-100 transition-all shadow-sm"
        >
          <Icon name="lucide:trash-2" class="w-4 h-4" />
          <span>Hapus</span>
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Total Peserta -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow duration-200">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Peserta</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ batch.participants?.length || 0 }}</h3>
        </div>
        <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
          <Icon name="lucide:users" class="w-6 h-6" />
        </div>
      </div>

      <!-- Section -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow duration-200">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Session</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ batch.sessions?.length || 0 }}</h3>
        </div>
        <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
          <Icon name="lucide:layers" class="w-6 h-6" />
        </div>
      </div>

      <!-- Group Soal -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow duration-200">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Group Soal</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ groupCount }}</h3>
        </div>
        <div class="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
          <Icon name="lucide:file-question" class="w-6 h-6" />
        </div>
      </div>

      <!-- Total Pembayaran -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow duration-200">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendapatan</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ formatCurrency(batch.paymentsTotal || 0) }}</h3>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
          <Icon name="lucide:wallet" class="w-6 h-6" />
        </div>
      </div>

      <!-- Total Pending -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow duration-200">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ formatCurrency(batch.paymentsPending || 0) }}</h3>
        </div>
        <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
          <Icon name="lucide:hourglass" class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
      <div class="border-b border-slate-100 overflow-x-auto scrollbar-hide">
        <nav class="flex px-4" aria-label="Tabs">
          <button
            v-for="t in tabs"
            :key="t"
            @click="activeTab = t"
            :class="[
              'whitespace-nowrap py-4 px-5 border-b-2 font-medium text-sm transition-all duration-200',
              activeTab === t
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            ]"
          >
            {{ t }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6 flex-1 bg-slate-50/30">
        <Transition name="fade" mode="out-in">
          <component 
            :is="tabComponent" 
            :batch="batch" 
            :title="activeTab" 
            @requestAddParticipant="isAddParticipantModalOpen = true" 
          />
        </Transition>
      </div>
    </div>

    <!-- Modal Tambah Peserta -->
    <AddParticipantModal v-model="isAddParticipantModalOpen" @save="handleSaveParticipant" />
  </div>
  
  <!-- Loading State -->
  <div v-else class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="flex flex-col items-center gap-3">
      <Icon name="lucide:loader-2" class="w-10 h-10 text-blue-600 animate-spin" />
      <p class="text-slate-500 text-sm font-medium animate-pulse">Memuat data batch...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBatchDetails } from '@/composables/useBatchDetails';

// Import komponen tab
import OverviewTab from '@/components/batch/tabs/OverviewTab.vue';
import ParticipantsTab from '@/components/batch/tabs/ParticipantsTab.vue';
import SessionsTab from '@/components/batch/tabs/SessionsTab.vue';
import PlaceholderTab from '@/components/batch/tabs/PlaceholderTab.vue';
import SettingsTab from '@/components/batch/tabs/SettingsTab.vue';
import SoalTab from '@/components/batch/tabs/SoalTab.vue';
import ResultsTab from '@/components/batch/tabs/ResultsTab.vue';
import AddParticipantModal from '@/components/batch/modals/AddParticipantModal.vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
definePageMeta({
  title: 'Detail Batch - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "batch.update",
})

// -------------------------------------------------
// Mengambil data menggunakan composable
// -------------------------------------------------
const { batch } = useBatchDetails(id);


console.log(batch);

// --- Modal State ---
const isAddParticipantModalOpen = ref(false);


// -------------------------------------------------
// Tabs
// -------------------------------------------------
const tabs = ["Overview", "Peserta", "Session", "Soal", "Results", "Settings"];
const activeTab = ref("Overview");

// -------------------------------------------------
// Tab Switching
const tabComponent = computed(() => {
  switch (activeTab.value) {
    case "Peserta":
      return ParticipantsTab;
    case "Session":
      return SessionsTab;
    case "Soal":
      return SoalTab;
    case "Results":
      return ResultsTab;
    case "Settings":
      return SettingsTab;
    default:
      return OverviewTab;
  }
});

// -------------------------------------------------
// Extra computed helpers
// -------------------------------------------------

const formattedDateRange = computed(() => {
  if (!batch.value) return '-';
  return `${batch.value.startDate} - ${batch.value.endDate}`;
});

const statusBadgeClass = computed(() => {
  const s = batch.value?.status?.toLowerCase();
  switch (s) {
    case 'open':
    case 'upcoming':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'closed':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'full':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'ongoing':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
});

const groupCount = computed(() =>
  batch.value?.sections?.reduce((n, s) => n + (s.groups?.length || 0), 0) || 0
);

function goToEdit() {
  router.push(`/admin/batch/edit/${id}`);
}

function confirmDelete() {
  // Implementasi konfirmasi delete yang lebih proper bisa menggunakan modal
  if(confirm("Apakah Anda yakin ingin menghapus batch ini?")) {
    // Logic hapus
    alert("Konfirmasi delete (dummy)");
  }
}

function handleSaveParticipant(newParticipant) {
  if (!batch.value.participants) batch.value.participants = [];
  const newId = batch.value.participants.length + 1;
  batch.value.participants.push({
    id: newId,
    ...newParticipant,
    paymentStatus: 'Unpaid', // Default status untuk peserta baru
  });
  // Di aplikasi nyata, Anda akan memanggil API untuk menyimpan data
}

function formatCurrency(v) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);
}
</script>

<!-- Reusable Styles -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>
