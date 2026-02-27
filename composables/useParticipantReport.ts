
export const useParticipantReport = () => {
    const config = useRuntimeConfig()
    const isLoading = ref(false)
    const participants = ref<any[]>([])
    const totalItems = ref(0)
    const totalPages = ref(0)
    const currentPage = ref(1)

    const fetchReport = async (params: { batchId?: string, search?: string, page?: number, limit?: number } = {}) => {
        isLoading.value = true
        try {
            const { data } = await useFetch<any>(`${config.public.API_URL}/reports/participant`, {
                headers: {
                    Authorization: `Bearer ${useCookie('token').value}`
                },
                query: params
            })

            if (data.value?.status) {
                participants.value = data.value.data.participants
                totalItems.value = data.value.data.totalItems
                totalPages.value = data.value.data.totalPages
                currentPage.value = data.value.data.currentPage
            }
        } catch (error) {
            console.error('Failed to fetch participant report', error)
        } finally {
            isLoading.value = false
        }
    }

    const exportCSV = async (params: { batchId?: string, search?: string } = {}) => {
        try {
            const token = useCookie('token').value
            if (!token) throw new Error('Unauthenticated')

            const response = await $fetch<Blob>(`${config.public.API_URL}/reports/participant/export`, {
                headers: { Authorization: `Bearer ${token}` },
                params: params,
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `participant-report-${params.batchId || 'all'}.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Failed to export CSV', error)
        }
    }

    return {
        isLoading,
        participants,
        totalItems,
        totalPages,
        currentPage,
        fetchReport,
        exportCSV
    }
}
