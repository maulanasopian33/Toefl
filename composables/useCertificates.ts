import { ref } from 'vue'
import { useFirebaseToken } from './FirebaseToken'
import { useLogger } from './useLogger'
import { useNotification } from './useNotification'

// =============================================================================
// INTERFACES
// =============================================================================

export interface Certificate {
  id: string
  certificateNumber: string
  userId: string
  name: string
  event: string
  date: string
  score: number
  qrToken: string
  verifyUrl: string
  pdfUrl: string
  externalPdfUrl?: string | null
  batchId?: string
  userResultId?: number
  templateFormatId?: number
  createdAt: string
  updatedAt: string
  user?: {
    name: string
    email: string
  }
}

export interface GenerateParticipantPayload {
  userResultId: number
  templateFormatId?: number
}

export interface GenerateBatchPayload {
  batchId: string
  templateFormatId?: number
}

export interface BatchGenerateOutcome {
  userResultId: number
  userId?: string
  success: boolean
  pdfUrl?: string
  error?: string
}

export interface BatchGenerateResult {
  summary: { successCount: number; failCount: number; total: number }
  results: BatchGenerateOutcome[]
}

export interface CertificateVerifyResult {
  valid: boolean
  data?: {
    certificateNumber: string
    name: string
    event: string
    date: string
    score: number
    verifyUrl: string
    issuedAt: string
  }
}

interface FetchParams {
  page?: number
  limit?: number
  search?: string
  userId?: string
  batchId?: string
  startDate?: string
  endDate?: string
}

// =============================================================================
// COMPOSABLE
// =============================================================================

export function useCertificates() {
  const config = useRuntimeConfig()
  const API_URL = config.public.API_URL

  const certificates  = ref<Certificate[]>([])
  const isLoading     = ref(false)
  const isGenerating  = ref(false)
  const error         = ref<Error | null>(null)
  const totalItems    = ref(0)
  const totalPages    = ref(0)
  const currentPage   = ref(1)

  const { logToServer }       = useLogger()
  const { showNotification }  = useNotification()

  // ── Fetch List (Admin) ─────────────────────────────────────────────────────

  const fetchCertificates = async (page = 1, limit = 10, params: FetchParams = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      const response = await $fetch<{
        status: boolean
        data: Certificate[]
        totalItems: number
        totalPages: number
        currentPage: number
      }>(`${API_URL}/certificates`, {
        params: { page, limit, ...params },
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status) {
        certificates.value = response.data
        totalItems.value   = response.totalItems
        totalPages.value   = response.totalPages
        currentPage.value  = response.currentPage
      }
    } catch (e: any) {
      error.value = e
      console.error('Failed to fetch certificates:', e)
      logToServer({
        level: 'error',
        message: 'Failed to fetch certificates',
        metadata: { page, limit, error: e.message }
      })
    } finally {
      isLoading.value = false
    }
  }

  // ── Generate: Single Participant ───────────────────────────────────────────

  const generateForParticipant = async (payload: GenerateParticipantPayload): Promise<{
    certificate: Certificate
    pdfUrl: string
  } | null> => {
    isGenerating.value = true
    error.value = null
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      const response = await $fetch<{
        status: boolean
        message: string
        data: { certificate: Certificate; pdfUrl: string }
      }>(`${API_URL}/certificates/generate/participant`, {
        method: 'POST',
        body: payload,
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status) {
        showNotification(response.message || 'Sertifikat berhasil di-generate!', 'success')
        return response.data
      }
      return null
    } catch (e: any) {
      error.value = e
      const errMsg = e?.data?.message || e.message || 'Generate gagal'
      showNotification(errMsg, 'error')
      logToServer({
        level: 'error',
        message: 'Failed to generate certificate for participant',
        metadata: { payload, error: e.message }
      })
      throw e
    } finally {
      isGenerating.value = false
    }
  }

  // ── Generate: Batch (All COMPLETED in a Batch) ────────────────────────────

  const generateForBatch = async (payload: GenerateBatchPayload): Promise<BatchGenerateResult | null> => {
    isGenerating.value = true
    error.value = null
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      const response = await $fetch<{
        status: boolean
        message: string
        data: BatchGenerateResult
      }>(`${API_URL}/certificates/generate/batch`, {
        method: 'POST',
        body: payload,
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status) {
        const { summary } = response.data
        showNotification(
          `Generate selesai. Berhasil: ${summary.successCount}, Gagal: ${summary.failCount}`,
          summary.failCount === 0 ? 'success' : 'error'
        )
        return response.data
      }
      return null
    } catch (e: any) {
      error.value = e
      const errMsg = e?.data?.message || e.message || 'Generate batch gagal'
      showNotification(errMsg, 'error')
      logToServer({
        level: 'error',
        message: 'Failed to generate batch certificates',
        metadata: { payload, error: e.message }
      })
      throw e
    } finally {
      isGenerating.value = false
    }
  }

  // ── Get Certificate by UserResult (for user's own view) ───────────────────

  const getCertificateByUserResult = async (userResultId: number | string): Promise<Certificate | null> => {
    isLoading.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      const response = await $fetch<{ status: boolean; data: Certificate }>(
        `${API_URL}/certificates/my/${userResultId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.status ? response.data : null
    } catch (e: any) {
      if (e?.statusCode !== 404) {
        console.error('Failed to get certificate by userResult:', e)
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  // ── Verify Certificate (Public) ───────────────────────────────────────────

  const verifyCertificate = async (qrToken: string): Promise<CertificateVerifyResult> => {
    isLoading.value = true
    try {
      const response = await $fetch<{ status: boolean; valid: boolean; data?: any }>(
        `${API_URL}/certificates/verify/${qrToken}`
      )
      return {
        valid: response.valid,
        data: response.data
      }
    } catch (e: any) {
      return { valid: false }
    } finally {
      isLoading.value = false
    }
  }

  // ── Download Certificate PDF ───────────────────────────────────────────────

  const downloadCertificate = async (certOrId: Certificate | string, fileName?: string) => {
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      let downloadUrl = ''
      let finalFileName = fileName

      if (typeof certOrId === 'string') {
        downloadUrl = `${API_URL}/certificates/download/${certOrId}`
        if (!finalFileName) finalFileName = `sertifikat-${certOrId}.pdf`
      } else {
        // Jika ada pdfUrl dari backend, prioritaskan itu
        // Namun biasanya kita tetap butuh endpoint download agar bisa kirim Auth header
        // Jadi kita tetap gunakan /certificates/download/{id} untuk keamanan file
        downloadUrl = `${API_URL}/certificates/download/${certOrId.id}`
        if (!finalFileName) {
          finalFileName = certOrId.certificateNumber 
            ? `sertifikat-${certOrId.certificateNumber}.pdf`
            : `sertifikat-${certOrId.id}.pdf`
        }
      }

      // Gunakan $fetch dengan responseType blob untuk konsistensi dan handling Nuxt
      const response = await $fetch<Blob>(downloadUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response]))
      const a = document.createElement('a')
      a.href = url
      a.download = finalFileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      console.error('Failed to download certificate:', e)
      showNotification('Gagal mengunduh sertifikat: ' + (e.data?.message || e.message), 'error')
    }
  }

  // ── Delete Certificate (Admin) ─────────────────────────────────────────────

  const deleteCertificate = async (id: string): Promise<boolean> => {
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      const response = await $fetch<{ status: boolean; message: string }>(
        `${API_URL}/certificates/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.status) {
        showNotification(response.message, 'success')
        // Update local state
        certificates.value = certificates.value.filter(c => c.id !== id)
        totalItems.value = Math.max(0, totalItems.value - 1)
        return true
      }
      return false
    } catch (e: any) {
      const errMsg = e?.data?.message || e.message || 'Hapus gagal'
      showNotification(errMsg, 'error')
      return false
    }
  }

  // ── Download Certificates ZIP (Bulk) ───────────────────────────────────────

  const downloadCertificatesZip = async (params: FetchParams = {}) => {
    isLoading.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      const response = await $fetch<Blob>(`${API_URL}/certificates/download-all/zip`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const fileName = `certificates-${timestamp}.zip`

      const url = window.URL.createObjectURL(new Blob([response]))
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      
      showNotification('Berhasil mengunduh kumpulan sertifikat.', 'success')
    } catch (e: any) {
      console.error('Failed to download certificates ZIP:', e)
      showNotification('Gagal mengunduh ZIP: ' + (e.data?.message || e.message), 'error')
    } finally {
      isLoading.value = false
    }
  }

  return {
    certificates,
    isLoading,
    isGenerating,
    error,
    totalItems,
    totalPages,
    currentPage,
    fetchCertificates,
    generateForParticipant,
    generateForBatch,
    getCertificateByUserResult,
    verifyCertificate,
    downloadCertificate,
    downloadCertificatesZip,
    deleteCertificate
  }
}
