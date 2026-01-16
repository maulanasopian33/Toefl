<template>
  <div class="min-h-screen bg-gray-50/50 p-6 lg:p-10">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <div class="p-2 bg-blue-100 rounded-lg">
               <Icon name="heroicons:document-duplicate" class="w-8 h-8 text-blue-600" />
            </div>
            Generate Sertifikat
          </h1>
          <p class="text-gray-500 mt-2 text-lg">Kelola dan terbitkan sertifikat ujian peserta secara efisien.</p>
        </div>
        <NuxtLink
          to="/admin/certificates/history"
          class="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm font-medium"
        >
          <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          Riwayat Sertifikat
        </NuxtLink>
      </div>

      <!-- Stats Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 ring-1 ring-gray-900/5">
            <div class="flex items-center gap-4">
               <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Icon name="heroicons:users" class="w-6 h-6" />
               </div>
               <div>
                  <p class="text-sm font-medium text-gray-500">Total Peserta</p>
                  <p class="text-2xl font-bold text-gray-900">{{ summary.total_candidates }}</p>
               </div>
            </div>
         </div>
         <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 ring-1 ring-gray-900/5">
            <div class="flex items-center gap-4">
               <div class="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                  <Icon name="heroicons:clock" class="w-6 h-6" />
               </div>
               <div>
                  <p class="text-sm font-medium text-gray-500">Pending</p>
                  <p class="text-2xl font-bold text-gray-900">{{ summary.total_pending }}</p>
               </div>
            </div>
         </div>
         <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 ring-1 ring-gray-900/5">
            <div class="flex items-center gap-4">
               <div class="p-3 bg-green-50 text-green-600 rounded-xl">
                  <Icon name="heroicons:check-badge" class="w-6 h-6" />
               </div>
               <div>
                  <p class="text-sm font-medium text-gray-500">Generated</p>
                  <p class="text-2xl font-bold text-gray-900">{{ summary.total_generated }}</p>
               </div>
            </div>
         </div>
         <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 ring-1 ring-gray-900/5">
            <div class="flex items-center gap-4">
               <div class="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Icon name="heroicons:chart-bar" class="w-6 h-6" />
               </div>
               <div>
                  <p class="text-sm font-medium text-gray-500">Rata-rata Skor</p>
                  <p class="text-2xl font-bold text-gray-900">{{ summary.average_score }}</p>
               </div>
            </div>
         </div>
      </div>

      <!-- Main Content Card -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
        
        <!-- Toolbar Section -->
        <div class="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
          
          <!-- Filters & Search -->
          <div class="flex flex-col sm:flex-row gap-3 w-full xl:w-auto flex-1 flex-wrap">
            <!-- Search -->
            <div class="relative w-full sm:w-64 group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Cari nama / NIM..."
                class="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm"
              />
            </div>

            <!-- Batch Filter -->
            <div class="w-full sm:w-48">
              <select
                v-model="selectedBatchId"
                @change="handleFilterChange"
                class="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm cursor-pointer"
              >
                <option value="">Semua Batch</option>
                <option v-for="batch in batches" :key="batch.id" :value="batch.id">
                  {{ batch.name }}
                </option>
              </select>
            </div>

            <!-- Status Filter -->
             <div class="w-full sm:w-40">
              <select
                v-model="selectedStatus"
                @change="handleFilterChange"
                class="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="generated">Generated</option>
              </select>
            </div>

            <!-- Sort By -->
            <div class="flex items-center gap-2 w-full sm:w-auto">
               <select
                  v-model="sortBy"
                  @change="handleFilterChange"
                  class="w-full sm:w-36 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm cursor-pointer"
               >
                  <option value="name">Nama</option>
                  <option value="score">Skor</option>
                  <option value="date">Tanggal</option>
               </select>
               <button 
                  @click="toggleSortOrder"
                  class="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 text-gray-500 hover:text-blue-600 transition-all shadow-sm"
                  :title="sortOrder === 'asc' ? 'Urutkan A-Z / Terkecil' : 'Urutkan Z-A / Terbesar'"
               >
                  <Icon v-if="sortOrder === 'asc'" name="heroicons:bars-arrow-up" class="w-5 h-5" />
                  <Icon v-else name="heroicons:bars-arrow-down" class="w-5 h-5" />
               </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 w-full xl:w-auto justify-end">
             <transition name="fade">
                <button
                v-if="selectedCandidates.length > 0"
                @click="processBulkGenerate"
                :disabled="isGenerating"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95 text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                >
                <Icon v-if="isGenerating" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
                <Icon v-else name="heroicons:bolt" class="w-5 h-5" />
                Generate Terpilih ({{ selectedCandidates.length }})
                </button>
             </transition>
             <button
                @click="fetchData"
                class="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                title="Refresh Data"
             >
                <Icon name="heroicons:arrow-path" class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
             </button>
          </div>
        </div>

        <!-- Table Section -->
        <div class="overflow-x-auto relative">
           <div v-if="isLoading && results.length === 0" class="p-20 text-center">
              <Icon name="heroicons:arrow-path" class="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
              <p class="text-gray-500">Memuat data peserta...</p>
           </div>
           
           <table v-else class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th class="px-6 py-4 w-12 text-center">
                   <input 
                    type="checkbox" 
                    :checked="isAllSelected" 
                    @change="toggleSelectAll"
                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                   />
                </th>
                <th class="px-6 py-4">Peserta</th>
                <th class="px-6 py-4">Info Akademik</th>
                <th class="px-6 py-4">Skor Ujian</th>
                <th class="px-6 py-4">Detail Batch</th>
                <th class="px-6 py-4 text-center">Status</th>
                <th class="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
               <tr v-if="results.length === 0" class="group hover:bg-gray-50/50 transition-colors">
                  <td colspan="7" class="px-6 py-16 text-center text-gray-500">
                     <div class="flex flex-col items-center">
                        <Icon name="heroicons:inbox" class="w-12 h-12 text-gray-300 mb-2" />
                        <p class="text-sm">Tidak ada data peserta ditemukan.</p>
                     </div>
                  </td>
               </tr>
               <tr 
                v-for="(candidate, index) in results" 
                :key="candidate.id" 
                class="group hover:bg-gray-50 transition-colors"
                :class="{ 'bg-blue-50/30': isSelected(candidate.id) }"
               >
                 <td class="px-6 py-4 text-center">
                   <div class="flex items-center justify-center h-full">
                     <input 
                      type="checkbox" 
                      :value="candidate.id"
                      :checked="isSelected(candidate.id)"
                      @change="toggleSelect(candidate)"
                      :disabled="candidate.certificateStatus === 'generated'"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                     />
                   </div>
                 </td>
                 <td class="px-6 py-4">
                   <div class="flex flex-col">
                     <span class="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{{ candidate.name }}</span>
                     <span class="text-xs text-gray-400 mt-0.5">ID: {{ candidate.nim }}</span>
                   </div>
                 </td>
                 <td class="px-6 py-4">
                    <div class="text-sm text-gray-600">
                       <div class="flex items-center gap-1.5 mb-1">
                          <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                          {{ candidate.prodi }}
                       </div>
                       <div class="text-xs text-gray-400 pl-3">Original NIM: {{ candidate.nim }}</div>
                    </div>
                 </td>
                 <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                       <span class="text-lg font-bold text-gray-800 tabular-nums">{{ candidate.score }}</span>
                       <button 
                         @click="openEditScore(candidate)"
                         class="text-gray-300 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50"
                         title="Edit Nilai"
                       >
                          <Icon name="heroicons:pencil-square" class="w-4 h-4" />
                       </button>
                    </div>
                 </td>
                 <td class="px-6 py-4">
                    <div class="flex flex-col text-sm">
                       <span class="font-medium text-gray-700">{{ candidate.batch }}</span>
                       <span class="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Icon name="heroicons:calendar" class="w-3 h-3" />
                          {{ formatDate(candidate.date) }}
                       </span>
                    </div>
                 </td>
                 <td class="px-6 py-4 text-center">
                    <span 
                      v-if="candidate.certificateStatus === 'generated'"
                      class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200"
                    >
                       <Icon name="heroicons:check-circle" class="w-3.5 h-3.5" />
                       Generated
                    </span>
                    <span 
                      v-else
                      class="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold border border-yellow-200"
                    >
                       <Icon name="heroicons:clock" class="w-3.5 h-3.5" />
                       Pending
                    </span>
                 </td>
                 <td class="px-6 py-4 text-center">
                    <div class="flex justify-center gap-2">
                       <button
                          v-if="candidate.certificateStatus === 'pending'"
                          @click="processSingleGenerate(candidate)"
                          :disabled="isGenerating"
                          class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                          title="Generate Sertifikat"
                       >
                          <Icon name="heroicons:bolt" class="w-5 h-5" />
                       </button>
                       <button
                          v-else
                          class="p-2 text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed border border-gray-200"
                          title="Sudah digenerate"
                          disabled
                       >
                          <Icon name="heroicons:check" class="w-5 h-5" />
                       </button>
                    </div>
                 </td>
               </tr>
            </tbody>
           </table>
        </div>
        
        <!-- Pagination (Mock) -->
        <div class="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
           <span>Menampilkan {{ results.length }} data</span>
           <div class="flex gap-2">
              <button disabled class="px-3 py-1 rounded bg-white border border-gray-200 opacity-50 cursor-not-allowed">Previous</button>
              <button disabled class="px-3 py-1 rounded bg-white border border-gray-200 opacity-50 cursor-not-allowed">Next</button>
           </div>
        </div>

      </div>
    </div>

    <!-- Edit Score Modal -->
    <TransitionRoot appear :show="isEditModalOpen" as="template">
      <Dialog as="div" @close="closeEditModal" class="relative z-50">
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
                <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900 flex items-center gap-2">
                  <div class="p-1.5 bg-blue-100 rounded-lg">
                      <Icon name="heroicons:pencil" class="w-5 h-5 text-blue-600" />
                  </div>
                  Edit Nilai Peserta
                </DialogTitle>
                <div class="mt-4 space-y-4">
                  <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <p class="text-sm text-gray-500 mb-1">Peserta</p>
                     <p class="font-bold text-gray-800">{{ editingCandidate?.name }}</p>
                     <p class="text-xs text-gray-400">{{ editingCandidate?.nim }}</p>
                  </div>
                   <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Nilai Baru</label>
                      <input 
                         v-model.number="editFormScore" 
                         type="number"
                         class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-allOutline-none bg-gray-50/50 text-lg font-semibold"
                         min="0"
                         max="700"
                      />
                   </div>
                </div>

                <div class="mt-8 flex gap-3 justify-end">
                  <button
                    type="button"
                    class="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                    @click="closeEditModal"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                    @click="saveScore"
                    :disabled="isSavingScore"
                  >
                    <Icon v-if="isSavingScore" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
                    Simpan Perubahan
                  </button>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useAdminBatches } from '@/composables/useAdminResults' // Use existing if available, or imports
import { useCandidateResults, type CandidateResult } from '@/composables/useCandidateResults'
import { useCertificates, type GenerateRequest } from '@/composables/useCertificates'

// Simple debounce utility
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutID: ReturnType<typeof setTimeout> | undefined
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => fn.apply(this, args), delay)
  } as T
}

definePageMeta({
  title: 'Generate Certificate - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: "batch.read"
})

// Composables
const { batches } = useAdminBatches()
const { results, summary, isLoading, fetchCandidateResults, updateCandidateScore } = useCandidateResults()
const { generateCertificates } = useCertificates()

// State
const searchQuery = ref('')
const selectedBatchId = ref('')
const selectedStatus = ref('')
const sortBy = ref('name')
const sortOrder = ref<'asc'|'desc'>('asc')

const selectedCandidates = ref<string[]>([]) // Array of IDs
const isGenerating = ref(false)

// Edit Modal State
const isEditModalOpen = ref(false)
const editingCandidate = ref<CandidateResult | null>(null)
const editFormScore = ref(0)
const isSavingScore = ref(false)

// Initial Data
onMounted(() => {
   fetchData()
})

const fetchData = () => {
   // Reset selections on new fetch, or keep them? Resetting is safer to avoid selecting items no longer visible if we implement pagination properly later.
   selectedCandidates.value = []
   fetchCandidateResults({
      search: searchQuery.value,
      batchId: selectedBatchId.value,
      status: selectedStatus.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
   })
}

// Watch filters using debounce for search
const handleSearch = debounce(() => {
   fetchData()
}, 500)

const handleFilterChange = () => {
   fetchData()
}

const toggleSortOrder = () => {
   sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
   fetchData()
}

// Selection Logic
const isAllSelected = computed(() => {
   const pendingCandidates = results.value.filter(c => c.certificateStatus === 'pending')
   if (pendingCandidates.length === 0) return false
   return pendingCandidates.every(c => selectedCandidates.value.includes(c.id))
})

const isSelected = (id: string) => selectedCandidates.value.includes(id)

const toggleSelectAll = (e: Event) => {
   const checked = (e.target as HTMLInputElement).checked
   if (checked) {
      // Select all PENDING candidates
      selectedCandidates.value = results.value
         .filter(c => c.certificateStatus === 'pending')
         .map(c => c.id)
   } else {
      selectedCandidates.value = []
   }
}

const toggleSelect = (candidate: CandidateResult) => {
   if (candidate.certificateStatus === 'generated') return

   const index = selectedCandidates.value.indexOf(candidate.id)
   if (index === -1) {
      selectedCandidates.value.push(candidate.id)
   } else {
      selectedCandidates.value.splice(index, 1)
   }
}

// Formatting
const formatDate = (dateStr: string) => {
   if(!dateStr) return '-'
   return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
   })
}

// Actions
const processSingleGenerate = async (candidate: CandidateResult) => {
   if (!confirm(`Generate sertifikat untuk ${candidate.name}?`)) return
   
   const request: GenerateRequest = {
      data: {
         name: candidate.name,
         event: candidate.batch,
         date: candidate.date,
         score: candidate.score,
         certificate_number: `CERT-${candidate.nim}-${Math.floor(Math.random() * 1000)}`, // Logic generator number
         qr_token: Math.random().toString(36).substring(7),
         verify_url: 'https://verify.lbaiuqi.com/', 
         user_id: candidate.userId
      },
      callback_url: 'https://api.lbaiuqi.com/callback'
   }

   await callGenerateAPI([request])
}

const processBulkGenerate = async () => {
   if (selectedCandidates.value.length === 0) return
   if (!confirm(`Generate ${selectedCandidates.value.length} sertifikat terpilih?`)) return

   // Map selected IDs to candidate objects
   const candidates = results.value.filter(c => selectedCandidates.value.includes(c.id))
   
   const requests: GenerateRequest[] = candidates.map(c => ({
      data: {
         name: c.name,
         event: c.batch,
         date: c.date,
         score: c.score,
         certificate_number: `CERT-${c.nim}-${Math.floor(Math.random() * 1000)}`,
         qr_token: Math.random().toString(36).substring(7),
         verify_url: 'https://verify.lbaiuqi.com/',
         user_id: c.userId
      },
      callback_url: 'https://api.lbaiuqi.com/callback'
   }))

   await callGenerateAPI(requests)
}

const callGenerateAPI = async (requests: GenerateRequest[]) => {
   isGenerating.value = true
   try {
      await generateCertificates(requests)
      alert('Berhasil mengirim permintaan generate sertifikat!')
      
      // Update local state to reflect generated status (Optimistic UI or re-fetch)
      // For now, let's re-fetch to keep it simple, or update manually if detailed response
      fetchData() 
      selectedCandidates.value = []
   } catch (error: any) {
      alert('Gagal: ' + (error.message || 'Unknown error'))
   } finally {
      isGenerating.value = false
   }
}

// Edit Score
const openEditScore = (candidate: CandidateResult) => {
   editingCandidate.value = candidate
   editFormScore.value = candidate.score
   isEditModalOpen.value = true
}

const closeEditModal = () => {
   isEditModalOpen.value = false
   editingCandidate.value = null
}

const saveScore = async () => {
   if (!editingCandidate.value) return
   
   isSavingScore.value = true
   try {
      await updateCandidateScore(editingCandidate.value.id, editFormScore.value)
      // Update local data
      editingCandidate.value.score = editFormScore.value
      closeEditModal()
      // alert('Nilai berhasil diperbarui') // Optional feedback
   } catch (error: any) {
      alert('Gagal update nilai: ' + error.message)
   } finally {
      isSavingScore.value = false
   }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
