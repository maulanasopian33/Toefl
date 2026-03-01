import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useAdminResults } from '../../composables/useAdminResults'

// Mock FirebaseToken
vi.mock('../../composables/FirebaseToken', () => ({
    useFirebaseToken: () => Promise.resolve('mock-token')
}))

// Mock useLogger
vi.mock('../../composables/useLogger', () => ({
    useLogger: () => ({
        logToServer: vi.fn()
    })
}))

// Mock Nuxt runtime config
const mockUseRuntimeConfig = vi.fn(() => ({
    public: { API_URL: 'http://test-api.com' }
}))
vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig)

// Mock $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

describe('useAdminResults', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('maps idResult to id correctly', async () => {
        const batchId = ref('batch-123')
        
        mockFetch.mockResolvedValue([
            { idResult: '123', userId: 'user1', userName: 'User One', score: 80, submittedAt: '2024-01-01T00:00:00Z' },
            { id: '456', userId: 'user2', userName: 'User Two', score: 90, submittedAt: '2024-01-01T00:00:00Z' }
        ])

        const { results, isLoading } = useAdminResults(batchId)
        
        // Wait for fetchData (mocking the immediate watch)
        await nextTick()
        // fetchData is async, let's wait for it to complete
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(results.value).toHaveLength(2)
        expect(results.value[0].id).toBe('123') // Mapped from idResult
        expect(results.value[1].id).toBe('456') // Existing id preserved
    })

    it('handles nested data property in API response', async () => {
        const batchId = ref('batch-123')
        
        mockFetch.mockResolvedValue({
            data: [
                { idResult: '789', userId: 'user3', userName: 'User Three', score: 70, submittedAt: '2024-01-01T00:00:00Z' }
            ]
        })

        const { results } = useAdminResults(batchId)
        
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(results.value).toHaveLength(1)
        expect(results.value[0].id).toBe('789')
    })
    
    it('generates fallback ID if both id and idResult are missing', async () => {
        const batchId = ref('batch-123')
        const submittedAt = '2024-01-01T00:00:00Z'
        const time = new Date(submittedAt).getTime()
        
        mockFetch.mockResolvedValue([
            { userId: 'user-fallback', userName: 'Fallback User', score: 50, submittedAt }
        ])

        const { results } = useAdminResults(batchId)
        
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(results.value).toHaveLength(1)
        expect(results.value[0].id).toBe(`res-user-fallback-${time}`)
    })
})
