import { useFirebaseToken } from './FirebaseToken'

export function useBatchDetails(batchId: string) {
  const config = useRuntimeConfig()
  const API_URL = `${config.public.API_URL}/batch/${batchId}`

  const { data: batch, pending: isLoading, error, refresh } = useAsyncData(
    `batch-details-${batchId}`,
    async () => {
      const token = await useFirebaseToken()
      const headers: Record<string, string> = {}
      
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await $fetch<any>(API_URL, { headers })
      const data = response.data || response

      // Transformasi data agar sesuai dengan komponen yang menggunakan camelCase
      return {
        ...data,
        startDate: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : null,
        endDate: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : null,
        registrationOpenAt: data.registration_open_at,
        registrationCloseAt: data.registration_close_at,
        maxParticipants: data.max_participants,
        minParticipants: data.min_participants,
        durationMinutes: data.duration_minutes,
        specialInstructions: data.special_instructions,
        // Pastikan properti array/objek aman diakses
        participants: data.participants || [],
        sessions: data.sessions || [],
        sections: data.sections || [],
        results: data.results || [],
        paymentsTotal: data.payments?.totalPaid || 0,
        paymentsPending: data.payments?.totalPending || 0,
        paymentsUserPaid: data.payments?.totalUserPaid || 0,
        paymentsUserPending: data.payments?.totalUserPending || 0,
        recentActivities: data.payments?.recentActivities || []
      }
    }
  )

  return { batch, isLoading, error, refresh }
}