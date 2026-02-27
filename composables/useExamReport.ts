import { ref, computed } from 'vue'
import { useFirebaseToken } from './FirebaseToken'
import { useNotification } from './useNotification'

export interface ExamSummary {
  totalParticipants: number;
  avgScore: number;
  maxScore: number;
  minScore: number;
}

export interface ScoreDistribution {
  range: string;
  count: number;
}

export interface SectionStat {
  sectionName: string;
  avgCorrectPercentage: number | string;
}

export interface QuestionPerf {
  id: string;
  text: string;
  correctPercentage: number | string;
  totalAttempts: number;
}

export interface ExamReportData {
  summary: ExamSummary;
  distribution: ScoreDistribution[];
  sectionStats: SectionStat[];
  difficulty: {
    hardest: QuestionPerf[];
    easiest: QuestionPerf[];
  }
}

export function useExamReport() {
  const config = useRuntimeConfig()
  const { showNotification } = useNotification()
  
  const reportData = ref<ExamReportData | null>(null)
  const isLoading = ref(false)

  const fetchReport = async (batchId?: string) => {
    isLoading.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<{ status: boolean, data: ExamReportData }>(`${config.public.API_URL}/reports/exam`, {
        headers: { Authorization: `Bearer ${token}` },
        params: batchId ? { batchId } : {}
      })

      if (response.status) {
        reportData.value = response.data
      }
    } catch (error) {
      console.error('Error fetching exam report:', error)
      showNotification('Gagal mengambil laporan ujian', 'error')
    } finally {
      isLoading.value = false
    }
  }

  const summary = computed(() => reportData.value?.summary || {
    totalParticipants: 0,
    avgScore: 0,
    maxScore: 0,
    minScore: 0
  })

  const distribution = computed(() => reportData.value?.distribution || [])
  const sectionStats = computed(() => reportData.value?.sectionStats || [])
  const difficulty = computed(() => reportData.value?.difficulty || { hardest: [], easiest: [] })

  const exportCSV = async (batchId?: string) => {
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<Blob>(`${config.public.API_URL}/reports/exam/export`, {
        headers: { Authorization: `Bearer ${token}` },
        params: batchId ? { batchId } : {},
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `exam-report-${batchId || 'all'}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      showNotification('Laporan CSV berhasil diunduh', 'success')
    } catch (error) {
      console.error('Error exporting CSV:', error)
      showNotification('Gagal mengunduh CSV', 'error')
    }
  }

  return {
    reportData,
    isLoading,
    summary,
    distribution,
    sectionStats,
    difficulty,
    fetchReport,
    exportCSV
  }
}
