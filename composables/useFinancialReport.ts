import { ref, computed } from 'vue'
import { useFirebaseToken } from './FirebaseToken'
import { useNotification } from './useNotification'

export interface FinancialSummary {
  totalRevenue: number | string;
  totalPending: number | string;
  totalLoss: number | string;
  paidCount: number;
  pendingCount: number;
}

export interface RevenueTrend {
  date: string;
  amount: number | string;
}

export interface BatchBreakdown {
  batchName: string;
  revenue: number | string;
  transactionCount: number;
}

export interface MethodBreakdown {
  method: string;
  revenue: number | string;
  count: number;
}

export interface FinancialReportData {
  summary: FinancialSummary;
  trend: RevenueTrend[];
  batchBreakdown: BatchBreakdown[];
  methodBreakdown: MethodBreakdown[];
}

export function useFinancialReport() {
  const config = useRuntimeConfig()
  const { showNotification } = useNotification()
  
  const reportData = ref<FinancialReportData | null>(null)
  const isLoading = ref(false)

  const fetchReport = async (filters: { startDate?: string, endDate?: string, batchId?: string } = {}) => {
    isLoading.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<{ status: boolean, data: FinancialReportData }>(`${config.public.API_URL}/admin/financial-recap`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      })

      if (response.status) {
        reportData.value = response.data
      }
    } catch (error) {
      console.error('Error fetching financial report:', error)
      showNotification('Gagal mengambil laporan keuangan', 'error')
    } finally {
      isLoading.value = false
    }
  }

  const summary = computed(() => reportData.value?.summary || {
    totalRevenue: 0,
    totalPending: 0,
    totalLoss: 0,
    paidCount: 0,
    pendingCount: 0
  })

  const trend = computed(() => reportData.value?.trend || [])
  const batchBreakdown = computed(() => reportData.value?.batchBreakdown || [])
  const methodBreakdown = computed(() => reportData.value?.methodBreakdown || [])

  const exportCSV = async (filters: { startDate?: string, endDate?: string, batchId?: string } = {}) => {
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<Blob>(`${config.public.API_URL}/reports/finance/export`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `financial-report.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      showNotification('Laporan keuangan berhasil diunduh', 'success')
    } catch (error) {
      console.error('Error exporting financial CSV:', error)
      showNotification('Gagal mengunduh laporan keuangan', 'error')
    }
  }

  return {
    reportData,
    isLoading,
    summary,
    trend,
    batchBreakdown,
    methodBreakdown,
    fetchReport,
    exportCSV
  }
}
