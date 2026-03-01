<template>
  <div class="min-h-screen bg-[#F8FAFC] p-4 lg:p-10">
    <!-- Header -->
    <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <div class="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-600/20">
            <Icon name="lucide:terminal" class="w-8 h-8 text-white" />
          </div>
          System File Logs
        </h1>
        <p class="text-slate-500 font-medium text-lg">
          Baca log teknis server secara langsung dari file Winston.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/audit-logs"
          class="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
        >
          <Icon name="lucide:clipboard-list" class="w-5 h-5" />
          Audit DB Logs
        </NuxtLink>
        <button
          @click="handleRefresh"
          class="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
        >
          <Icon name="lucide:refresh-cw" class="w-5 h-5" :class="{ 'animate-spin': isLoadingFiles }" />
          Refresh
        </button>
      </div>
    </header>

    <!-- Error Banner -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-2xl px-6 py-4 text-sm text-red-700 font-semibold flex items-center gap-3">
      <Icon name="lucide:alert-circle" class="w-5 h-5 flex-shrink-0" />
      {{ error }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: File List -->
      <div class="lg:col-span-1 space-y-3">
        <div class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">
          File Log Tersedia ({{ logFiles.length }})
        </div>

        <!-- Loading skeleton -->
        <template v-if="isLoadingFiles">
          <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-2xl p-5 border border-slate-100">
            <div class="h-4 bg-slate-100 rounded-lg w-3/4 mb-2"></div>
            <div class="h-3 bg-slate-100 rounded-lg w-1/2"></div>
          </div>
        </template>

        <!-- File cards -->
        <template v-else-if="logFiles.length > 0">
          <button
            v-for="file in logFiles"
            :key="file.filename"
            @click="openFile(file)"
            class="w-full text-left bg-white rounded-2xl p-5 border transition-all hover:shadow-md active:scale-[0.98]"
            :class="selectedFile?.filename === file.filename
              ? 'border-rose-400 shadow-md shadow-rose-100 ring-2 ring-rose-400/30'
              : 'border-slate-100 hover:border-slate-200'"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="p-2 rounded-xl flex-shrink-0"
                  :class="file.type === 'HTTP Traffic' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'"
                >
                  <Icon :name="file.type === 'HTTP Traffic' ? 'lucide:activity' : 'lucide:file-text'" class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <div class="text-sm font-bold text-slate-800 truncate">{{ file.filename }}</div>
                  <div class="text-xs text-slate-400 font-medium">{{ file.sizeFormatted }}</div>
                </div>
              </div>
              <span
                class="flex-shrink-0 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider"
                :class="file.type === 'HTTP Traffic' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'"
              >
                {{ file.type === 'HTTP Traffic' ? 'HTTP' : 'App' }}
              </span>
            </div>
            <div class="mt-3 text-[10px] text-slate-400 font-medium">
              Modified: {{ formatDate(file.lastModified) }}
            </div>
          </button>
        </template>

        <div v-else class="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 font-bold text-sm">
          <Icon name="lucide:inbox" class="w-10 h-10 mx-auto mb-3 text-slate-200" />
          Tidak ada file log ditemukan.
        </div>
      </div>

      <!-- Right: Log Content Viewer -->
      <div class="lg:col-span-2">
        <!-- Placeholder when nothing selected -->
        <div
          v-if="!selectedFile"
          class="h-full min-h-[400px] bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12"
        >
          <div class="p-5 bg-slate-50 rounded-3xl mb-6">
            <Icon name="lucide:file-search" class="w-12 h-12 text-slate-300" />
          </div>
          <div class="text-xl font-black text-slate-400">Pilih file log</div>
          <p class="text-slate-400 text-sm font-medium mt-2 max-w-xs">
            Klik salah satu file di kiri untuk membaca isinya di sini.
          </p>
        </div>

        <!-- Content Viewer -->
        <div v-else class="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <!-- Viewer Header -->
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <div class="p-2 bg-slate-900 rounded-xl">
                <Icon name="lucide:terminal" class="w-4 h-4 text-green-400" />
              </div>
              <div class="min-w-0">
                <div class="text-sm font-black text-slate-800 truncate">{{ selectedFile.filename }}</div>
                <div class="text-xs text-slate-400 font-medium">
                  {{ logContent.length }} baris ditampilkan
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <div class="flex items-center gap-2">
                <label class="text-xs font-bold text-slate-400">Baris:</label>
                <select
                  v-model="lines"
                  @change="fetchLogContent(selectedFile!)"
                  class="bg-slate-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-rose-500 transition-all"
                >
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                  <option :value="200">200</option>
                  <option :value="500">500</option>
                </select>
              </div>
              <button
                @click="clearSelection"
                class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Loading log content -->
          <div v-if="isLoadingContent" class="p-8 flex items-center justify-center gap-3 text-slate-400">
            <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
            <span class="text-sm font-bold">Membaca file log...</span>
          </div>

          <!-- Log Lines -->
          <div v-else class="bg-slate-950 max-h-[65vh] overflow-y-auto">
            <div v-if="logContent.length === 0" class="p-8 text-center text-slate-500 font-bold text-sm">
              File kosong atau tidak ada data.
            </div>
            <div v-else class="p-4 font-mono text-xs leading-6 space-y-0.5">
              <div
                v-for="(line, idx) in logContent"
                :key="idx"
                class="flex gap-3 hover:bg-slate-900 rounded px-2 py-0.5 transition-colors group"
              >
                <span class="text-slate-600 select-none w-10 text-right flex-shrink-0 group-hover:text-slate-400">
                  {{ logContent.length - logContent.length + idx + 1 }}
                </span>
                <span :class="getLineClass(line)" class="break-all whitespace-pre-wrap">{{ line }}</span>
              </div>
            </div>
          </div>

          <!-- Footer info -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>{{ selectedFile.sizeFormatted }} · {{ selectedFile.type }}</span>
            <span>Diperbarui: {{ formatDate(selectedFile.lastModified) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSystemLogs } from '@/composables/useSystemLogs'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
})

const {
  logFiles,
  logContent,
  selectedFile,
  isLoadingFiles,
  isLoadingContent,
  error,
  lines,
  fetchLogFiles,
  fetchLogContent,
  clearSelection
} = useSystemLogs()

const openFile = async (file: any) => {
  await fetchLogContent(file)
}

const handleRefresh = async () => {
  clearSelection()
  await fetchLogFiles()
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const getLineClass = (line: string) => {
  const lower = line.toLowerCase()
  if (lower.includes('"level":"error"') || lower.includes(' error ') || lower.includes('[error]')) {
    return 'text-red-400'
  }
  if (lower.includes('"level":"warn"') || lower.includes(' warn ') || lower.includes('[warn]')) {
    return 'text-yellow-400'
  }
  if (lower.includes('"level":"info"') || lower.includes(' info ') || lower.includes('[info]')) {
    return 'text-green-400'
  }
  if (lower.includes('" 4') || lower.includes('" 5')) {
    return 'text-orange-400'
  }
  return 'text-slate-300'
}

onMounted(() => {
  fetchLogFiles()
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s cubic-bezier(0.2, 0, 0.2, 1) forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
