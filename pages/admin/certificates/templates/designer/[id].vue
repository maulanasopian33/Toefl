<template>
  <div class="designer-shell">
    <!-- Top Bar -->
    <div class="designer-topbar">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/certificate-templates"
          class="p-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          title="Kembali ke Template"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NuxtLink>
        <div class="w-px h-5 bg-white/20" />
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 3h12a2 2 0 0 1 2 2v10.5l-3-1.5-3 1.5-3-1.5-3 1.5-3-1.5V5a2 2 0 0 1 2-2zm3 4v2h6V7z"/>
            </svg>
          </div>
          <div>
            <p class="text-white text-sm font-bold leading-none">{{ templateName }}</p>
            <p class="text-white/50 text-[10px] font-medium">NexaplotEditor — Desain Template</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Status Indikator -->
        <span
          v-if="lastSavedAt"
          class="text-[10px] text-white/40 font-medium"
        >
          Tersimpan {{ formatTime(lastSavedAt) }}
        </span>

        <!-- Save Button -->
        <button
          @click="triggerSave"
          :disabled="isSaving"
          class="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
        >
          <svg v-if="isSaving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" stroke-linecap="round"/>
          </svg>
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="17,21 17,13 7,13 7,21" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7,3 7,8 15,8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ isSaving ? 'Menyimpan...' : 'Simpan Desain' }}
        </button>
      </div>
    </div>

    <!-- Editor Container -->
    <div class="designer-canvas">
      <!-- Loading state saat ambil template data -->
      <div v-if="isLoadingTemplate" class="flex flex-col items-center justify-center h-full gap-4 text-white/50">
        <svg class="w-10 h-10 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" stroke-linecap="round"/>
        </svg>
        <p class="text-sm font-medium">Memuat template...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="loadError" class="flex flex-col items-center justify-center h-full gap-4 text-rose-400">
        <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p class="text-sm font-bold">{{ loadError }}</p>
        <NuxtLink to="/admin/certificate-templates" class="px-4 py-2 bg-rose-500/20 rounded-xl text-rose-300 text-sm font-bold hover:bg-rose-500/30">
          Kembali
        </NuxtLink>
      </div>

      <!-- NexaplotEditor -->
      <ClientOnly v-else>
        <NexaplotDesigner
          :license-key="runtimeConfig.public.NEXAPLOT_LICENSE"
          :initial-config="initialConfig"
          :base-pdf-buffer="basePdfBuffer"
          @save="handleDesignerSave"
          @change="handleDesignerChange"
        />
        <template #fallback>
          <div class="flex items-center justify-center h-full text-white/40">
            <p class="text-sm">Memuat editor...</p>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCertificateTemplates } from '@/composables/useCertificateTemplates'
import { useNotification } from '@/composables/useNotification'

import 'nexaplot/style.css'

// Lazy import NexaplotEditor (hanya di client side)
const NexaplotDesigner = defineAsyncComponent(() =>
  import('nexaplot/editor').catch(() => {
    // Fallback jika nexaplot belum terinstall atau key tidak valid
    return {
      template: `
        <div class="flex flex-col items-center justify-center h-full gap-4 text-white/60">
          <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6M9 12h6M9 15h4"/>
          </svg>
          <p class="text-sm font-bold">NexaplotEditor tidak tersedia</p>
          <p class="text-xs text-white/40">Pastikan package nexaplot sudah terinstall dan license key sudah dikonfigurasi.</p>
        </div>
      `
    }
  })
)

definePageMeta({
  layout: 'blank',
  middleware: ['auth', 'role-check'],
  permission: 'system.app'
})

const route         = useRoute()
const runtimeConfig = useRuntimeConfig()
const { getTemplateById, saveNexaplotConfig, isSaving } = useCertificateTemplates()
const { showNotification } = useNotification()

const templateId       = computed(() => route.params.id as string)
const templateName     = ref('Template Sertifikat')
const isLoadingTemplate = ref(true)
const loadError        = ref('')
const initialConfig     = ref<string | undefined>(undefined)
const basePdfBuffer     = ref<Uint8Array | null>(null)
const lastSavedAt       = ref<Date | null>(null)

// Referensi ke instance editor untuk trigger save dari luar
const editorRef = ref<any>(null)

onMounted(async () => {
  try {
    const template = await getTemplateById(templateId.value)
    if (!template) {
      loadError.value = `Template dengan ID ${templateId.value} tidak ditemukan.`
      return
    }

    templateName.value = template.name

    const format = template.formats?.[0]
    if (format && format.file_pdf) {
      initialConfig.value = format.nexaplot_config || undefined
      
      const pdfUrl = `${runtimeConfig.public.API_URL?.replace('/api', '')}/storage/${format.file_pdf}`
      
      // Fetch PDF as buffer
      const token = await useFirebaseToken()
      const response = await $fetch<ArrayBuffer>(pdfUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      basePdfBuffer.value = new Uint8Array(response)
    }
  } catch (err: any) {
    loadError.value = err.message || 'Gagal memuat template.'
  } finally {
    isLoadingTemplate.value = false
  }
})

// Handler: NexaplotEditor memancarkan event @save
const handleDesignerSave = async (payload: { configString: string }) => {
  const success = await saveNexaplotConfig(templateId.value, payload.configString)
  if (success) {
    lastSavedAt.value = new Date()
  }
}

// Handler: auto-save hook (opsional, bisa di-ignore jika editor tidak support)
const handleDesignerChange = (_payload: any) => {
  // Could implement auto-save here with debounce
}

// Trigger save dari tombol di topbar (emit ke editor)
const triggerSave = () => {
  if (editorRef.value?.save) {
    editorRef.value.save()
  } else {
    showNotification(
      'Gunakan tombol simpan di dalam editor untuk menyimpan desain.',
      'error'
    )
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.designer-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #0f1117;
}

.designer-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  height: 52px;
  background: #1a1d27;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
  z-index: 10;
}

.designer-canvas {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>
