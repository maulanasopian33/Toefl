<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- HEADER -->
    <header class="flex flex-col gap-4 rounded-[2.5rem] bg-white px-10 py-8 border border-gray-100 shadow-xl ring-1 ring-gray-900/5 sm:flex-row sm:items-center sm:justify-between transition-all hover:shadow-2xl">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          <div class="p-3 bg-indigo-100 rounded-[1.25rem] text-indigo-600">
            <Icon name="lucide:bar-chart-2" class="w-8 h-8" />
          </div>
          Analytics Dashboard
        </h1>
        <p class="mt-2 text-sm text-gray-500 font-medium">
          Pusat analisis data peserta, soal, dan performa batch (TOAFL & TOEFL).
        </p>
      </div>
    </header>

    <!-- TABS -->
    <div class="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm overflow-x-auto hide-scrollbar">
      <div class="flex items-center gap-2 min-w-max">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2',
            activeTab === tab.id 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          ]"
        >
          <Icon :name="tab.icon" class="w-4 h-4" />
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- DYNAMIC TAB CONTENT -->
    <div class="transition-all duration-500">
      <KeepAlive>
        <component :is="activeComponent" @switch-tab="handleSwitchTab" />
      </KeepAlive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ParticipantResults from '@/components/analytics/ParticipantResults.vue'
import AnswerDetails from '@/components/analytics/AnswerDetails.vue'
import QuestionQuality from '@/components/analytics/QuestionQuality.vue'
import OptionDistribution from '@/components/analytics/OptionDistribution.vue'
import ParticipantProgress from '@/components/analytics/ParticipantProgress.vue'
import BatchStatistics from '@/components/analytics/BatchStatistics.vue'
import DiagnosticReport from '@/components/analytics/DiagnosticReport.vue'
import { provide } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
})

const tabs = [
  { id: 'stats', name: 'Ringkasan Batch', icon: 'lucide:library', component: BatchStatistics },
  { id: 'results', name: 'Hasil Peserta', icon: 'lucide:users', component: ParticipantResults },
  { id: 'diagnostic', name: 'Rapor Diagnostik', icon: 'lucide:award', component: DiagnosticReport },
  { id: 'quality', name: 'Kualitas Soal', icon: 'lucide:target', component: QuestionQuality },
  { id: 'distribution', name: 'Distribusi Opsi', icon: 'lucide:pie-chart', component: OptionDistribution },
  { id: 'details', name: 'Detail Jawaban', icon: 'lucide:file-search', component: AnswerDetails },
  { id: 'progress', name: 'Riwayat Peserta', icon: 'lucide:trending-up', component: ParticipantProgress }
]

const activeTab = ref('stats')
const selectedParticipantId = ref('')
const selectedBatchId = ref('')

provide('selectedParticipantId', selectedParticipantId)
provide('selectedBatchId', selectedBatchId)

const handleSwitchTab = (tabId: string, payload?: { participantId?: string, batchId?: string }) => {
  if (payload) {
    if (payload.participantId) selectedParticipantId.value = payload.participantId
    if (payload.batchId) selectedBatchId.value = payload.batchId
  }
  activeTab.value = tabId
}

const activeComponent = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab?.component || BatchStatistics
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
