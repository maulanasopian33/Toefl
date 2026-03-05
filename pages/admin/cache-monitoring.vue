<template>
  <div class="min-h-screen bg-[#F8FAFC] p-4 lg:p-10">
    <!-- Header -->
    <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <div class="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
            <Icon name="lucide:database" class="w-8 h-8 text-white" />
          </div>
          Cache Monitoring
        </h1>
        <p class="text-slate-500 font-medium text-lg">
          Pantau performa dan kelola Redis Centralized Cache secara real-time.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="fetchStatus"
          class="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
        >
          <Icon name="lucide:refresh-cw" class="w-5 h-5" :class="{ 'animate-spin': loading }" />
          Refresh Stats
        </button>
      </div>
    </header>

    <!-- Error Banner -->
    <div v-if="error" class="mb-8 bg-red-50 border border-red-200 rounded-2xl px-6 py-4 text-sm text-red-700 font-semibold flex items-center gap-3">
      <Icon name="lucide:alert-circle" class="w-5 h-5 flex-shrink-0" />
      {{ error }}
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <!-- Memory Usage Card -->
      <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Icon name="lucide:cpu" class="w-6 h-6" />
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Memory Usage</span>
        </div>
        <div class="text-3xl font-black text-slate-900 mb-2">
          {{ cacheData?.memory?.used_memory_human || '0B' }}
        </div>
        <div class="flex items-center gap-2">
          <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              class="h-full bg-blue-500 transition-all duration-1000" 
              :style="{ width: `${memoryPercentage}%` }"
            ></div>
          </div>
          <span class="text-xs font-bold text-slate-500">{{ memoryPercentage.toFixed(1) }}%</span>
        </div>
        <div class="mt-2 text-[10px] text-slate-400 font-bold">Max: {{ cacheData?.memory?.maxmemory_human || '128MB' }}</div>
      </div>

      <!-- Hit Rate Card -->
      <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-green-50 text-green-600 rounded-2xl">
            <Icon name="lucide:target" class="w-6 h-6" />
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Hit Rate</span>
        </div>
        <div class="text-3xl font-black text-slate-900 mb-1">
          {{ cacheData?.stats?.keyspace_hit_rate || '0%' }}
        </div>
        <p class="text-xs text-slate-400 font-medium">Efisiensi pengambilan data dari cache.</p>
      </div>

      <!-- Total Keys Card -->
      <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Icon name="lucide:key" class="w-6 h-6" />
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Keys</span>
        </div>
        <div class="text-3xl font-black text-slate-900 mb-1">
          {{ totalKeys }}
        </div>
        <p class="text-xs text-slate-400 font-medium">Jumlah entri data tersimpan saat ini.</p>
      </div>

      <!-- Uptime Card -->
      <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <Icon name="lucide:clock" class="w-6 h-6" />
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Redis Uptime</span>
        </div>
        <div class="text-2xl font-black text-slate-900 mb-1 truncate">
          {{ formatUptime(cacheData?.server?.uptime_in_seconds) }}
        </div>
        <p class="text-xs text-slate-400 font-medium">Waktu sejak Redis server dijalankan.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recommendations & Recommendations -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
              <Icon name="lucide:zap" class="w-5 h-5 text-amber-500" />
              Rekomendasi Optimal (VPS 1GB)
            </h3>
          </div>
          <div class="p-8 pb-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="(rec, key) in cacheData?.recommendations" :key="key" class="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ key.replace(/_/g, ' ') }}</div>
                <div class="font-bold text-slate-700 mb-2 truncate">{{ rec.value }}</div>
                <div class="flex items-start gap-2">
                  <Icon 
                    :name="rec.status === 'optimal' ? 'lucide:check-circle' : 'lucide:alert-triangle'" 
                    class="w-4 h-4 mt-0.5 flex-shrink-0"
                    :class="rec.status === 'optimal' ? 'text-green-500' : 'text-amber-500'"
                  />
                  <p class="text-xs text-slate-500 leading-relaxed">{{ rec.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
          <h3 class="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <Icon name="lucide:settings" class="w-5 h-5 text-indigo-500" />
            Manajemen Cache
          </h3>

          <div class="space-y-6">
            <!-- Pattern Flush -->
            <div class="space-y-3">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Hapus per Pola (Pattern)</label>
              <div class="flex gap-2">
                <input 
                  v-model="pattern" 
                  type="text" 
                  placeholder="e.g. batch:*" 
                  class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <button 
                  @click="handleFlushPattern" 
                  :disabled="!pattern || flushing"
                  class="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <Icon name="lucide:trash-2" class="w-5 h-5" />
                </button>
              </div>
              <p class="text-[10px] text-slate-400 font-medium">Gunakan <b>batch:*</b> untuk batch, <b>scoring:*</b> untuk scoring.</p>
            </div>

            <hr class="border-slate-100" />

            <!-- Global Flush -->
            <div class="space-y-4">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Tindakan Berbahaya</label>
              <button 
                @click="confirmFlushAll"
                class="w-full flex items-center justify-center gap-2 py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm border border-rose-100 hover:bg-rose-100 transition-all active:scale-95 shadow-sm shadow-rose-100/50"
              >
                <Icon name="lucide:flame" class="w-5 h-5" />
                Clear All Cache (FLUSHDB)
              </button>
              <p class="text-[10px] text-rose-400 font-bold leading-relaxed px-1">
                <Icon name="lucide:info" class="w-3 h-3 inline mr-1" />
                Semua data cache akan terhapus. Database akan menerima beban query langsung kembali sementara cache dibangun ulang.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog 
      v-model="showConfirm"
      title="Hapus Semua Cache?"
      message="Tindakan ini akan menghapus seluruh entri di Redis. Pastikan beban database aman."
      type="danger"
      @confirm="handleFlushAll"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useCacheMonitoring } from '@/composables/useCacheMonitoring'
import { useNotification } from '@/composables/useNotification'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
})

const { getCacheStatus, clearAllCache, clearCacheByPattern } = useCacheMonitoring()
const { showNotification } = useNotification()

const cacheData = ref<any>(null)
const loading = ref(false)
const flushing = ref(false)
const error = ref('')
const pattern = ref('')
const showConfirm = ref(false)

const fetchStatus = async () => {
  loading.value = true
  error.value = ''
  try {
    const res: any = await getCacheStatus()
    if (res.status) {
      cacheData.value = res.data
    }
  } catch (err: any) {
    error.value = err.message || 'Gagal mengambil status Redis'
    showNotification(
      'Gagal mengambil status Redis. Pastikan server backend berjalan.',
      'error'
    )
  } finally {
    loading.value = false
  }
}

const memoryPercentage = computed(() => {
  if (!cacheData.value?.memory) return 0
  const used = parseInt(cacheData.value.memory.used_memory) || 0
  const max = parseInt(cacheData.value.memory.maxmemory) || 134217728 // Default 128MB
  return (used / max) * 100
})

const totalKeys = computed(() => {
  const keyspace = cacheData.value?.keyspace?.db0 || ''
  const match = keyspace.match(/keys=(\d+)/)
  return match ? match[1] : 0
})

const formatUptime = (seconds: number) => {
  if (!seconds) return '-'
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  
  if (d > 0) return `${d} Hari, ${h} Jam`
  if (h > 0) return `${h} Jam, ${m} Menit`
  return `${m} Menit`
}

const handleFlushPattern = async () => {
  if (!pattern.value) return
  flushing.value = true
  try {
    const res: any = await clearCacheByPattern(pattern.value)
    if (res.status) {
      showNotification(
        `${res.data.deleted_count} entri dengan pola "${pattern.value}" berhasil dihapus.`,
        'success'
      )
      pattern.value = ''
      fetchStatus()
    }
  } catch (err: any) {
    showNotification(err.message, 'error')
  } finally {
    flushing.value = false
  }
}

const confirmFlushAll = () => {
  showConfirm.value = true
}

const handleFlushAll = async () => {
  showConfirm.value = false
  loading.value = true
  try {
    const res: any = await clearAllCache()
    if (res.status) {
      showNotification(
        'Seluruh database cache telah dibersihkan.',
        'success'
      )
      fetchStatus()
    }
  } catch (err: any) {
    showNotification(err.message, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStatus()
})
</script>

<style scoped>
.group:hover .transition-all {
  filter: brightness(1.1);
}
</style>
