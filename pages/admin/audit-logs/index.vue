<template>
  <div class="min-h-screen bg-[#F8FAFC] p-4 lg:p-10">
    <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <div class="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
            <Icon name="lucide:clipboard-list" class="w-8 h-8 text-white" />
          </div>
          System Audit Logs
        </h1>
        <p class="text-slate-500 font-medium text-lg">
          Monitor all administrative and system activities in real-time.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchLogs()"
          class="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
        >
          <Icon name="lucide:refresh-cw" class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
          Refresh
        </button>
      </div>
    </header>

    <!-- Filters -->
    <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-8 flex flex-wrap gap-4 items-end">
      <div class="space-y-2">
        <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Module</label>
        <select v-model="filters.module" class="w-48 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all">
          <option value="">All Modules</option>
          <option value="auth">Auth</option>
          <option value="batch">Batch</option>
          <option value="payment">Payment</option>
          <option value="frontend">Frontend</option>
        </select>
      </div>
      <div class="space-y-2">
        <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Action</label>
        <input v-model="filters.action" type="text" placeholder="Search action..." class="w-64 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all" />
      </div>
      <button @click="fetchLogs(1)" class="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
        Apply Filters
      </button>
    </div>

    <!-- Logs Table -->
    <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
              <th class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">User</th>
              <th class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
              <th class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Module</th>
              <th class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Source</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="isLoading" v-for="i in 5" :key="i" class="animate-pulse">
              <td colspan="5" class="px-8 py-6"><div class="h-4 bg-slate-100 rounded-lg w-full"></div></td>
            </tr>
            <tr v-else-if="logs.length === 0">
              <td colspan="5" class="px-8 py-20 text-center text-slate-400 font-bold">No logs found.</td>
            </tr>
            <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/50 transition-colors group cursor-pointer" @click="selectedLog = log">
              <td class="px-8 py-6">
                <div class="text-sm font-bold text-slate-700">{{ formatDate(log.createdAt) }}</div>
                <div class="text-[10px] text-slate-400 font-medium">{{ formatTime(log.createdAt) }}</div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">
                    {{ log.user?.name?.[0] || 'S' }}
                  </div>
                  <div>
                    <div class="text-sm font-bold text-slate-700">{{ log.user?.name || 'System / Guest' }}</div>
                    <div class="text-xs text-slate-400 font-medium">{{ log.ipAddress }}</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-8 py-6">
                <span :class="getModuleClass(log.module)" class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {{ log.module }}
                </span>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <Icon :name="log.source === 'backend' ? 'lucide:server' : 'lucide:monitor'" class="w-4 h-4 text-slate-400" />
                  <span class="text-xs font-bold text-slate-500 uppercase">{{ log.source }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div class="text-xs font-bold text-slate-400">
          Showing page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="flex gap-2">
          <button @click="fetchLogs(currentPage - 1)" :disabled="currentPage === 1" class="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 transition-all hover:bg-slate-50">
            <Icon name="lucide:chevron-left" class="w-5 h-5" />
          </button>
          <button @click="fetchLogs(currentPage + 1)" :disabled="currentPage === totalPages" class="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 transition-all hover:bg-slate-50">
            <Icon name="lucide:chevron-right" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Log Details Modal -->
    <div v-if="selectedLog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="selectedLog = null"></div>
      <div class="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up">
        <div class="p-8 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-2xl font-black text-slate-900">Log Details</h2>
          <button @click="selectedLog = null" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>
        <div class="p-8 max-h-[70vh] overflow-y-auto space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</label>
              <div class="text-sm font-bold text-slate-700">{{ selectedLog.action }}</div>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Module</label>
              <div class="text-sm font-bold text-slate-700">{{ selectedLog.module }}</div>
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">IP Address & User Agent</label>
            <div class="text-sm font-medium text-slate-600">{{ selectedLog.ipAddress }}</div>
            <div class="text-xs text-slate-400 leading-relaxed">{{ selectedLog.userAgent }}</div>
          </div>
          <div class="space-y-3">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payload / Details</label>
            <pre class="bg-slate-900 text-indigo-300 p-6 rounded-2xl text-xs overflow-x-auto font-mono leading-relaxed">{{ JSON.stringify(selectedLog.details, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFirebaseToken } from '@/composables/FirebaseToken'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.view_logs'
})

const config = useRuntimeConfig()
const logs = ref<any[]>([])
const isLoading = ref(false)
const selectedLog = ref<any>(null)
const totalPages = ref(1)
const currentPage = ref(1)

const filters = ref({
  module: '',
  action: '',
  startDate: '',
  endDate: ''
})

const fetchLogs = async (page = 1) => {
  isLoading.value = true
  try {
    const token = await useFirebaseToken()
    const response = await $fetch<any>(`${config.public.API_URL}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { 
        page, 
        limit: 20,
        ...filters.value
      }
    })

    if (response.status) {
      logs.value = response.data.logs
      totalPages.value = response.data.totalPages
      currentPage.value = response.data.currentPage
    }
  } catch (error) {
    console.error('Failed to fetch logs:', error)
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

const getModuleClass = (module: string) => {
  const base = 'bg-opacity-10 border'
  switch (module.toLowerCase()) {
    case 'auth': return `${base} bg-blue-500 text-blue-600 border-blue-100`
    case 'batch': return `${base} bg-purple-500 text-purple-600 border-purple-100`
    case 'payment': return `${base} bg-emerald-500 text-emerald-600 border-emerald-100`
    case 'frontend': return `${base} bg-amber-500 text-amber-600 border-amber-100`
    default: return `${base} bg-slate-500 text-slate-600 border-slate-100`
  }
}

onMounted(() => {
  fetchLogs()
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.2, 0, 0.2, 1) forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
