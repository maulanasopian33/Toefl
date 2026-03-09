import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useFirebaseToken } from './FirebaseToken'
import { useNotification } from './useNotification'

export const useAnalytics = () => {
  const config = useRuntimeConfig()
  const { showNotification } = useNotification()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getHeaders = async () => {
    const token = await useFirebaseToken()
    if (!token) throw new Error('Unauthenticated')
    return { Authorization: `Bearer ${token}` }
  }

  const fetchParticipantResults = async (params: any = {}) => {
    isLoading.value = true
    try {
      const headers = await getHeaders()
      const { data } = await $fetch<any>(`${config.public.API_URL}/analytics/participant-results`, { params, headers })
      return data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchAnswerDetails = async (params: any = {}) => {
    isLoading.value = true
    try {
      const headers = await getHeaders()
      const { data } = await $fetch<any>(`${config.public.API_URL}/analytics/answer-details`, { params, headers })
      return data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchQuestionQuality = async (params: any = {}) => {
    isLoading.value = true
    try {
      const headers = await getHeaders()
      const { data } = await $fetch<any>(`${config.public.API_URL}/analytics/question-quality`, { params, headers })
      return data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchOptionDistribution = async (params: any = {}) => {
    isLoading.value = true
    try {
      const headers = await getHeaders()
      const { data } = await $fetch<any>(`${config.public.API_URL}/analytics/option-distribution`, { params, headers })
      return data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchParticipantProgress = async (params: any = {}) => {
    isLoading.value = true
    try {
      const headers = await getHeaders()
      const { data } = await $fetch<any>(`${config.public.API_URL}/analytics/participant-progress`, { params, headers })
      return data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchBatchStatistics = async (params: any = {}) => {
    isLoading.value = true
    try {
      const headers = await getHeaders()
      const { data } = await $fetch<any>(`${config.public.API_URL}/analytics/batch-statistics`, { params, headers })
      return data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchDiagnosticReport = async (participantId: string, batchId: string) => {
    isLoading.value = true
    try {
      const headers = await getHeaders()
      const { data } = await $fetch<any>(`${config.public.API_URL}/analytics/diagnostic-report`, { 
        params: { participantId, batchId }, 
        headers 
      })
      return data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const downloadCSV = async (endpoint: string, params: any = {}, filename: string) => {
    try {
      const headers = await getHeaders()
      const response = await $fetch<Blob>(`${config.public.API_URL}/analytics/${endpoint}`, {
        headers,
        params: { ...params, export: 'csv' },
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${filename}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      showNotification('Laporan CSV berhasil diunduh', 'success')
    } catch (err: any) {
      console.error('Error exporting CSV:', err)
      showNotification('Gagal mengunduh CSV', 'error')
    }
  }

  return {
    isLoading,
    error,
    fetchParticipantResults,
    fetchAnswerDetails,
    fetchQuestionQuality,
    fetchOptionDistribution,
    fetchParticipantProgress,
    fetchBatchStatistics,
    fetchDiagnosticReport,
    downloadCSV
  }
}
