<template>
  <div v-if="batch" class="p-6 w-full bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">{{ batch.name }}</h1>
        <p class="text-gray-500 text-sm mt-1">
          {{ formattedDateRange }} • Batch Status:
          <span :class="statusClass" class="font-semibold">{{ batch.status }}</span>
        </p>
      </div>

      <div class="flex gap-3">
        <button @click="goToEdit" class="px-5 py-2.5 bg-teal-600 text-white rounded-lg font-medium shadow hover:bg-teal-700 transition">Edit Batch</button>
        <button @click="confirmDelete" class="px-5 py-2.5 bg-red-500 text-white rounded-lg font-medium shadow hover:bg-red-600 transition">Hapus</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="stat-card">
        <p class="stat-label">Total Peserta</p>
        <h2 class="stat-value">{{ batch.participants.length }}</h2>
      </div>

      <div class="stat-card">
        <p class="stat-label">Section</p>
        <h2 class="stat-value">{{ batch.sections.length }}</h2>
      </div>

      <div class="stat-card">
        <p class="stat-label">Group Soal</p>
        <h2 class="stat-value">{{ groupCount }}</h2>
      </div>

      <div class="stat-card">
        <p class="stat-label">Total Pembayaran</p>
        <h2 class="stat-value">{{ formatCurrency(batch.paymentsTotal) }}</h2>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b mb-8 text-gray-600 text-sm gap-8 font-medium overflow-x-auto">
      <button
        v-for="t in tabs"
        :key="t"
        @click="activeTab = t"
        :class="['pb-3 transition', activeTab === t ? 'border-b-2 border-teal-600 text-teal-600' : 'hover:text-teal-600']"
      >
        {{ t }}
      </button>
    </div>

    <!-- Content -->
    <div>
      <component :is="tabComponent" :batch="batch" :title="activeTab" @requestAddParticipant="isAddParticipantModalOpen = true" />
    </div>

    <!-- Modal Tambah Peserta -->
    <AddParticipantModal v-model="isAddParticipantModalOpen" @save="handleSaveParticipant" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBatchDetails } from '@/composables/useBatchDetails';

// Import komponen tab
import OverviewTab from '@/components/batch/tabs/OverviewTab.vue';
import ParticipantsTab from '@/components/batch/tabs/ParticipantsTab.vue';
import SectionsTab from '@/components/batch/tabs/SectionsTab.vue';
import PlaceholderTab from '@/components/batch/tabs/PlaceholderTab.vue';
import PaymentsTab from '@/components/batch/tabs/PaymentsTab.vue';
import SettingsTab from '@/components/batch/tabs/SettingsTab.vue';
import SoalTab from '@/components/batch/tabs/SoalTab.vue';
import ResultsTab from '@/components/batch/tabs/ResultsTab.vue';
import AddParticipantModal from '@/components/batch/modals/AddParticipantModal.vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
definePageMeta({
  title: 'dashboard Batch - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  roles: ['admin'],
})

// -------------------------------------------------
// Mengambil data menggunakan composable
// -------------------------------------------------
const { batch } = useBatchDetails(id);

// --- Modal State ---
const isAddParticipantModalOpen = ref(false);


// -------------------------------------------------
// Tabs
// -------------------------------------------------
const tabs = ["Overview", "Peserta", "Section & Group", "Soal", "Payments", "Results", "Settings"];
const activeTab = ref("Overview");

// -------------------------------------------------
// Tab Switching
const tabComponent = computed(() => {
  switch (activeTab.value) {
    case "Peserta":
      return ParticipantsTab;
    case "Section & Group":
      return SectionsTab;
    case "Payments":
      return PaymentsTab;
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

const formattedDateRange = computed(() => `${batch.value.startDate} - ${batch.value.endDate}`);

const statusClass = computed(() => {
  let s = batch.value.status.toLowerCase();
  return s === "upcoming"
    ? "text-teal-600"
    : s === "ongoing"
    ? "text-amber-500"
    : "text-gray-500";
});

const groupCount = computed(() =>
  batch.value.sections.reduce((n, s) => n + s.groups.length, 0)
);

function goToEdit() {
  router.push(`/admin/batch/edit/${id}`);
}

function confirmDelete() {
  alert("Konfirmasi delete (dummy)");
}

function handleSaveParticipant(newParticipant) {
  const newId = batch.value.participants.length + 1;
  batch.value.participants.push({
    id: newId,
    ...newParticipant,
    paymentStatus: 'Unpaid', // Default status untuk peserta baru
  });
  // Di aplikasi nyata, Anda akan memanggil API untuk menyimpan data
}

function formatCurrency(v) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(v);
}
</script>

<!-- Reusable Styles -->
<style scoped>
.stat-card {
  @apply bg-white p-5 rounded-2xl shadow hover:shadow-md border border-gray-200 transition;
}
.stat-label {
  @apply text-gray-500 text-sm;
}
.stat-value {
  @apply text-3xl font-extrabold text-gray-800 mt-1;
}

.card {
  @apply bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition;
}
.card-title {
  @apply text-xl font-semibold text-gray-800 mb-4;
}
.dot {
  @apply w-2 h-2 rounded-full bg-teal-500;
}
.btn-primary {
  @apply px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow transition;
}
.btn-small {
  @apply px-2 py-1 bg-teal-600 text-white rounded;
}
.btn-gray {
  @apply px-2 py-1 bg-gray-100 rounded;
}
.input {
  @apply w-full border p-2 rounded-md;
}
.section-box {
  @apply mb-4 border rounded-lg p-4;
}
.group-box {
  @apply border rounded p-3 flex justify-between items-center;
}
</style>
