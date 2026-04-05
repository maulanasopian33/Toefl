import { ref } from 'vue'
import { useFirebaseToken } from './FirebaseToken'
import { useNotification } from './useNotification'

// =============================================================================
// INTERFACES
// =============================================================================

export interface MappingItem {
  variable: string   // Nama variabel di NexaplotEditor (e.g. "namaPeserta")
  source: string     // Sumber data (e.g. "detailuser.namaLengkap")
  type: 'text' | 'image' | 'table' | 'qr'
  label: string      // Label UI untuk admin
}

export interface CertificateTemplateFormat {
  id?: number
  templateId?: number
  name: string
  file_pdf?: string          // Path PDF base template
  nexaplot_config?: string   // NXCFG-... string dari NexaplotEditor
  mapping_data?: MappingItem[]
  is_active: boolean
}

export interface CertificateTemplate {
  id?: number
  name: string
  status: boolean
  formats: CertificateTemplateFormat[]
  createdAt?: string
  updatedAt?: string
}

// =============================================================================
// AVAILABLE SOURCES — untuk autocomplete di UI mapping
// =============================================================================

export const AVAILABLE_SOURCES: Array<{ value: string; label: string; type: MappingItem['type'] }> = [
  { value: 'detailuser.namaLengkap', label: 'Nama Lengkap Peserta',     type: 'text' },
  { value: 'detailuser.nim',         label: 'NIM Peserta',              type: 'text' },
  { value: 'detailuser.fakultas',    label: 'Fakultas',                 type: 'text' },
  { value: 'detailuser.prodi',       label: 'Program Studi',            type: 'text' },
  { value: 'user.name',              label: 'Nama Akun',                type: 'text' },
  { value: 'user.email',             label: 'Email',                    type: 'text' },
  { value: 'userresult.score',       label: 'Nilai Total',              type: 'text' },
  { value: 'userresult.cefr_level',  label: 'Level CEFR',              type: 'text' },
  { value: 'userresult.passed',      label: 'Status Kelulusan',         type: 'text' },
  { value: 'userresult.submittedAt', label: 'Tanggal Ujian',            type: 'text' },
  { value: 'batch.name',             label: 'Nama Batch/Ujian',         type: 'text' },
  { value: 'batch.date',             label: 'Tanggal Batch',            type: 'text' },
  { value: 'section_scores_table',   label: 'Tabel Nilai per Section',  type: 'table' },
  { value: 'certificate.verifyUrl',  label: 'QR Code Verifikasi',       type: 'qr' },
  { value: 'certificate.number',     label: 'Nomor Sertifikat',         type: 'text' },
  { value: 'certificate.date',       label: 'Tanggal Terbit',           type: 'text' },
  { value: 'user.picture',           label: 'Foto Peserta',             type: 'image' },
]

// =============================================================================
// COMPOSABLE
// =============================================================================

export function useCertificateTemplates() {
  const config = useRuntimeConfig()
  const { showNotification } = useNotification()

  const templates   = ref<CertificateTemplate[]>([])
  const isLoading   = ref(false)
  const isSaving    = ref(false)
  const activeFormat = ref<CertificateTemplateFormat | null>(null)

  // ── Fetch All ──────────────────────────────────────────────────────────────

  const fetchTemplates = async () => {
    isLoading.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<{ status: boolean; data: CertificateTemplate[] }>(
        `${config.public.API_URL}/certificate-templates`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.status) templates.value = response.data
    } catch (error) {
      console.error('Error fetching templates:', error)
      showNotification('Gagal mengambil data template sertifikat', 'error')
    } finally {
      isLoading.value = false
    }
  }

  // ── Get By ID ─────────────────────────────────────────────────────────────

  const getTemplateById = async (id: number | string): Promise<CertificateTemplate | null> => {
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<{ status: boolean; data: CertificateTemplate }>(
        `${config.public.API_URL}/certificate-templates/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.status ? response.data : null
    } catch (error) {
      console.error('Error fetching template by ID:', error)
      showNotification('Gagal mengambil data template', 'error')
      return null
    }
  }

  // ── Get Active Template ────────────────────────────────────────────────────

  const getActiveTemplate = async (): Promise<CertificateTemplateFormat | null> => {
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<{ status: boolean; data: CertificateTemplateFormat }>(
        `${config.public.API_URL}/certificate-templates/active`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.status) {
        activeFormat.value = response.data
        return response.data
      }
      return null
    } catch (error: any) {
      if (error?.statusCode !== 404) {
        console.error('Error fetching active template:', error)
      }
      activeFormat.value = null
      return null
    }
  }

  // ── Save Template (Create / Update) ───────────────────────────────────────

  const saveTemplate = async (data: FormData) => {
    isSaving.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<{ status: boolean; message: string; data: CertificateTemplate }>(
        `${config.public.API_URL}/certificate-templates/save`,
        {
          method: 'POST',
          body: data,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.status) {
        showNotification(response.message, 'success')
        await fetchTemplates()
        return response.data
      }
    } catch (error) {
      console.error('Error saving template:', error)
      showNotification('Gagal menyimpan template sertifikat', 'error')
    } finally {
      isSaving.value = false
    }
  }

  // ── Save Nexaplot Config (dari NexaplotEditor @save event) ────────────────

  const saveNexaplotConfig = async (templateId: number | string, configString: string): Promise<boolean> => {
    isSaving.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<{ status: boolean; message: string }>(
        `${config.public.API_URL}/certificate-templates/${templateId}/config`,
        {
          method: 'POST',
          body: { nexaplot_config: configString },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.status) {
        showNotification('Konfigurasi desain berhasil disimpan!', 'success')
        return true
      }
      return false
    } catch (error) {
      console.error('Error saving nexaplot config:', error)
      showNotification('Gagal menyimpan konfigurasi desain', 'error')
      return false
    } finally {
      isSaving.value = false
    }
  }

  // ── Delete Template ────────────────────────────────────────────────────────

  const deleteTemplate = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus template ini?')) return

    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<{ status: boolean; message: string }>(
        `${config.public.API_URL}/certificate-templates/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.status) {
        showNotification(response.message, 'success')
        await fetchTemplates()
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      showNotification('Gagal menghapus template sertifikat', 'error')
    }
  }

  return {
    templates,
    isLoading,
    isSaving,
    activeFormat,
    fetchTemplates,
    getTemplateById,
    getActiveTemplate,
    saveTemplate,
    saveNexaplotConfig,
    deleteTemplate,
    AVAILABLE_SOURCES
  }
}
