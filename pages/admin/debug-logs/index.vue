<template>
  <div class="min-h-screen bg-[#F8FAFC] p-4 lg:p-10">
    <!-- Header -->
    <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <div class="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
            <Icon name="lucide:bug" class="w-8 h-8 text-white" />
          </div>
          Debug Logs
        </h1>
        <p class="text-slate-500 font-medium text-lg">
          Pantau aktivitas real-time dari Frontend & Backend.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="handleClear"
          class="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-red-600 shadow-sm border border-slate-100 hover:bg-red-50 transition-all active:scale-95"
        >
          <Icon name="lucide:trash-2" class="w-5 h-5" />
          Hapus Semua
        </button>
        <button
          @click="() => fetchLogs(1)"
          class="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Icon name="lucide:refresh-cw" class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
          Refresh
        </button>
      </div>
    </header>

    <!-- Filters -->
    <div class="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
      <div class="relative">
        <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          v-model="search" 
          @input="debouncedFetch"
          placeholder="Cari pesan..." 
          class="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all"
        />
      </div>
      <select v-model="level" @change="fetchLogs(1)" class="bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all">
         <option value="">Semua Level</option>
         <option value="INFO">INFO</option>
         <option value="DEBUG">DEBUG</option>
         <option value="WARN">WARN</option>
         <option value="ERROR">ERROR</option>
      </select>
      <select v-model="source" @change="fetchLogs(1)" class="bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all">
         <option value="">Semua Sumber</option>
         <option value="FE">Frontend (FE)</option>
         <option value="BE">Backend (BE)</option>
      </select>
      <div class="flex items-center px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
         {{ totalItems }} Logs ditemukan
      </div>
    </div>

    <!-- Logs Table/List -->
    <div class="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black tracking-widest text-slate-400">
              <th class="px-6 py-4 w-20">Level</th>
              <th class="px-6 py-4 w-24">Sumber</th>
              <th class="px-6 py-4">Pesan & Konteks</th>
              <th class="px-6 py-4 w-40">Pengguna</th>
              <th class="px-6 py-4 w-48">Waktu</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <template v-if="isLoading && logs.length === 0">
              <tr v-for="i in 5" :key="i" class="animate-pulse">
                <td colspan="5" class="px-6 py-8"><div class="h-4 bg-slate-100 rounded-lg w-full"></div></td>
              </tr>
            </template>
            <tr v-for="log in logs" :key="log.id" class="group hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-5">
                <span 
                  class="px-2 py-1 rounded-lg text-[10px] font-black tracking-tighter"
                  :class="getLevelClass(log.level)"
                >
                  {{ log.level }}
                </span>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <span class="text-[11px] font-bold text-slate-400 border border-slate-100 px-2 py-0.5 rounded-md">
                  {{ log.source }}
                </span>
              </td>
              <td class="px-6 py-5">
                <p class="text-sm font-bold text-slate-800 mb-1.5">{{ log.message }}</p>
                <!-- Context Viewer (JSON) -->
                <div v-if="log.context" class="relative group/json">
                  <pre class="text-[10px] bg-slate-900 text-slate-300 p-3 rounded-xl overflow-x-auto max-w-xl font-mono leading-relaxed ring-1 ring-slate-800 shadow-inner">
{{ formatJSON(log.context) }}
                  </pre>
                  <button @click="copy(log.context)" class="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white opacity-0 group-hover/json:opacity-100 transition-opacity">
                    <Icon name="lucide:copy" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <div v-if="log.user" class="flex flex-col gap-0.5">
                  <p class="text-xs font-bold text-slate-800">{{ log.user.name }}</p>
                  <p class="text-[10px] text-slate-400 font-medium">{{ log.userId.substring(0,8) }}...</p>
                </div>
                <span v-else class="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Guest</span>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="text-xs font-bold text-slate-600">{{ formatDate(log.createdAt) }}</div>
                <div class="text-[10px] text-slate-400 mt-0.5">{{ formatTime(log.createdAt) }}</div>
              </td>
            </tr>

            <tr v-if="!isLoading && logs.length === 0">
               <td colspan="5" class="px-6 py-20 text-center">
                  <div class="p-5 bg-slate-50 rounded-3xl inline-block mb-4 text-slate-300">
                    <Icon name="lucide:ghost" class="w-12 h-12" />
                  </div>
                  <h3 class="text-lg font-black text-slate-800">Tidak ada log ditemukan</h3>
                  <p class="text-slate-400 text-sm font-medium mt-1">Gunakan filter yang berbeda atau tunggu aktivitas sistem.</p>
               </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
         <p class="text-xs font-bold text-slate-400">Halaman {{ currentPage }} dari {{ totalPages }}</p>
         <div class="flex items-center gap-2">
            <button 
              @click="fetchLogs(currentPage - 1)" 
              :disabled="currentPage === 1 || isLoading"
              class="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 transition-all hover:bg-slate-50 shadow-sm"
            >
              <Icon name="lucide:chevron-left" class="w-5 h-5" />
            </button>
            <button 
              @click="fetchLogs(currentPage + 1)" 
              :disabled="currentPage === totalPages || isLoading"
              class="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 transition-all hover:bg-slate-50 shadow-sm"
            >
              <Icon name="lucide:chevron-right" class="w-5 h-5" />
            </button>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminDebugLogs } from '@/composables/useAdminDebugLogs'
import { useNotificationPopup } from '@/composables/NotificationPopup'
import { useNotification } from '@/composables/useNotification'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
})

const {
  logs,
  totalItems,
  totalPages,
  currentPage,
  isLoading,
  error,
  search,
  level,
  source,
  fetchLogs,
  clearLogs
} = useAdminDebugLogs()

const { showConfirm } = useNotificationPopup()
const { showNotification } = useNotification()

const handleClear = async () => {
    const confirmed = await showConfirm(
        'Semua log debug (BE & FE) akan dihapus secara permanen. Lanjutkan?',
        {
            title: 'Hapus Semua Debug Logs',
            type: 'danger',
            confirmText: 'Ya, Hapus Semua'
        }
    )
    if (confirmed) {
        await clearLogs()
        showNotification('Debug logs berhasil dikosongkan.', 'success')
    }
}

let debounceTimer: any
const debouncedFetch = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        fetchLogs(1)
    }, 500)
}

const getLevelClass = (level: string) => {
  switch (level) {
    case 'INFO': return 'bg-blue-50 text-blue-600 border border-blue-100'
    case 'DEBUG': return 'bg-slate-100 text-slate-600 border border-slate-200'
    case 'WARN': return 'bg-amber-50 text-amber-600 border border-amber-100'
    case 'ERROR': return 'bg-red-50 text-red-600 border border-red-100'
    default: return 'bg-slate-50 text-slate-500'
  }
}

const formatJSON = (json: any) => {
  try {
    return JSON.stringify(json, null, 2)
  } catch (e) {
    return json
  }
}

const copy = (json: any) => {
  navigator.clipboard.writeText(JSON.stringify(json, null, 2))
  showNotification('JSON disalin ke clipboard.', 'success')
}

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const formatTime = (iso: string) => {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

onMounted(() => {
  fetchLogs(1)
})
</script>

<style scoped>
pre::-webkit-scrollbar {
  height: 4px;
}
pre::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
}
</style>
