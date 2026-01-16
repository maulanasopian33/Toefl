
import { ref } from 'vue'
import { useFirebaseToken } from './FirebaseToken'
import { useLogger } from './useLogger'

export interface CandidateResult {
  id: string
  userId: string
  name: string
  nim: string
  prodi: string
  score: number
  date: string
  batch: string
  batchId: string
  certificateStatus: 'generated' | 'pending'
  certificateId?: string // If generated
}

export interface CandidateSummary {
   total_pending: number
   total_generated: number
   average_score: number
   total_candidates: number
}

interface FetchParams {
   search?: string
   batchId?: string
   status?: string
   sortBy?: string // 'name' | 'score' | 'date'
   sortOrder?: 'asc' | 'desc'
   page?: number
}

export function useCandidateResults() {
  const config = useRuntimeConfig()
  const API_URL = config.public.API_URL

  const results = ref<CandidateResult[]>([])
  const summary = ref<CandidateSummary>({
     total_pending: 0,
     total_generated: 0,
     average_score: 0,
     total_candidates: 0
  })
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  
  // Mock Data
  const mockCandidates: CandidateResult[] = [
    {
      id: 'res-001',
      userId: 'user-001',
      name: 'Budi Santoso',
      nim: '123456789',
      prodi: 'Teknik Informatika',
      score: 550,
      date: '2023-11-15',
      batch: 'TOAFL September',
      batchId: 'toafl-september',
      certificateStatus: 'generated',
      certificateId: 'cert-001'
    },
    {
      id: 'res-002',
      userId: 'user-002',
      name: 'Siti Aminah',
      nim: '987654321',
      prodi: 'Sastra Inggris',
      score: 480,
      date: '2023-11-15',
      batch: 'TOAFL September',
      batchId: 'toafl-september',
      certificateStatus: 'pending'
    },
    {
      id: 'res-003',
      userId: 'user-003',
      name: 'Ahmad Rizki',
      nim: '112233445',
      prodi: 'Manajemen',
      score: 600,
      date: '2023-10-20',
      batch: 'TOAFL Oktober',
      batchId: 'toafl-oktober',
      certificateStatus: 'pending'
    },
    {
      id: 'res-004',
      userId: 'user-004',
      name: 'Dewi Lestari',
      nim: '556677889',
      prodi: 'Akuntansi',
      score: 510,
      date: '2023-10-20',
      batch: 'TOAFL Oktober',
      batchId: 'toafl-oktober',
      certificateStatus: 'pending'
    },
    {
      id: 'res-005',
      userId: 'user-005',
      name: 'Eko Prasetyo',
      nim: '998877665',
      prodi: 'Hukum',
      score: 450,
      date: '2023-11-01',
      batch: 'TOEFL Prediction November',
      batchId: 'toefl-prediction-nov',
      certificateStatus: 'generated',
      certificateId: 'cert-003'
    }
  ]

  const { logToServer } = useLogger()

  const fetchCandidateResults = async (params: FetchParams = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')
      
      const response = await $fetch<{ data: CandidateResult[], meta: { summary: CandidateSummary } }>(`${API_URL}/admin/results/candidates`, {
        params: {
            ...params,
            sort_by: params.sortBy,
            order: params.sortOrder,
            batch_id: params.batchId
        },
        headers: { Authorization: `Bearer ${token}` }
      })
      results.value = response.data
      summary.value = response.meta.summary
      
    } catch (e: any) {
      error.value = e
      console.error('Failed to fetch candidate results:', e)
      
      logToServer({
        level: 'error',
        message: 'Failed to fetch candidate results',
        metadata: {
          error: e.message,
          stack: e.stack,
          params
        }
      })
    } finally {
      isLoading.value = false
    }
  }

  const updateCandidateScore = async (resultId: string, newScore: number) => {
    isLoading.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const index = results.value.findIndex(r => r.id === resultId)
        if (index !== -1) {
            results.value[index].score = newScore
            // Re-calculate summary if needed, but simplest is to just let next fetch handle it or manually adjust local summary
            // For now, let's keep it simple.
        }
        
        /*
        // REAL API
        const token = await useFirebaseToken()
        await $fetch(`${API_URL}/admin/results/${resultId}`, {
             method: 'PATCH',
             body: { score: newScore },
             headers: { Authorization: `Bearer ${token}` }
        })
        */
       return true
    } catch (e: any) {
        error.value = e
        throw e
    } finally {
        isLoading.value = false
    }
  }

  return {
    results,
    summary,
    isLoading,
    error,
    fetchCandidateResults,
    updateCandidateScore
  }
}
