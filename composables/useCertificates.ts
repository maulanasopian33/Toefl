import { ref } from 'vue'
import { useFirebaseToken } from './FirebaseToken'
import { useLogger } from './useLogger'

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
  externalPdfUrl: string | null
  createdAt: string
  updatedAt: string
  user?: {
    name: string
    email: string
  }
}

export interface GenerateCertificateData {
  name: string
  event: string
  date: string
  certificate_number: string
  qr_token: string
  verify_url: string
  score: number
  user_id: string
}

export interface GenerateRequest {
  data: GenerateCertificateData
  callback_url: string
}

export function useCertificates() {
  const config = useRuntimeConfig()
  const API_URL = config.public.API_URL

  const certificates = ref<Certificate[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const totalItems = ref(0)
  const totalPages = ref(0)
  const currentPage = ref(1)

  const { logToServer } = useLogger()

  const fetchCertificates = async (page = 1, limit = 10) => {
    isLoading.value = true
    error.value = null
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      const response = await $fetch<{
        status: boolean
        message: string
        data: Certificate[]
        totalItems: number
        totalPages: number
        currentPage: number
      }>(`${API_URL}/certificates`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status) {
        certificates.value = response.data
        totalItems.value = response.totalItems
        totalPages.value = response.totalPages
        currentPage.value = response.currentPage
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

  const generateCertificates = async (requests: GenerateRequest[]) => {
    isLoading.value = true
    error.value = null
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      const response = await $fetch<{
        status: boolean
        message: string
      }>(`${API_URL}/test-generate`, {
        method: 'POST',
        body: requests,
        headers: { Authorization: `Bearer ${token}` }
      })

      return response
    } catch (e: any) {
      error.value = e
      console.error('Failed to generate certificates:', e)
      logToServer({
        level: 'error',
        message: 'Failed to generate certificates',
        metadata: { requestCount: requests.length, error: e.message }
      })
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    certificates,
    isLoading,
    error,
    totalItems,
    totalPages,
    currentPage,
    fetchCertificates,
    generateCertificates
  }
}
