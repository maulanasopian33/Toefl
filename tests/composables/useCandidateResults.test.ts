import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCandidateResults } from '../../composables/useCandidateResults'

// Mock useRed
vi.mock('vue', async () => {
    const actual = await vi.importActual('vue') as any
    return {
        ...actual,
        ref: actual.ref,
        computed: actual.computed
    }
})

// Mock Nuxt composables
const mockUseRuntimeConfig = vi.fn(() => ({
    public: { API_URL: 'http://test-api.com' }
}))
const mockUseFirebaseToken = vi.fn().mockResolvedValue('mock-token')
const mockFetch = vi.fn()

vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig)
vi.stubGlobal('useFirebaseToken', mockUseFirebaseToken) // In the file it imports useFirebaseToken, but let's try assuming auto-import or mock the import
vi.stubGlobal('$fetch', mockFetch)

// Since `useFirebaseToken` is imported in the source file, we might need to mock that module specifically if it's not an auto-import
// Based on file content: import { useFirebaseToken } from './FirebaseToken'
vi.mock('../../composables/FirebaseToken', () => ({
    useFirebaseToken: () => Promise.resolve('mock-token')
}))


describe('useCandidateResults', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('initializes with default state', () => {
        const { results, summary, isLoading, error } = useCandidateResults()
        
        expect(results.value).toEqual([])
        expect(summary.value).toEqual({
            total_pending: 0,
            total_generated: 0,
            average_score: 0,
            total_candidates: 0
        })
        expect(isLoading.value).toBe(false)
        expect(error.value).toBe(null)
    })

    it('fetchCandidateResults calls API with correct parameters', async () => {
        const { fetchCandidateResults, results, summary, isLoading } = useCandidateResults()
        
        const mockResponse = {
            data: [
                { id: '1', name: 'Test User', score: 500 }
            ],
            meta: {
                summary: {
                    total_pending: 1,
                    total_generated: 2,
                    average_score: 500,
                    total_candidates: 3
                }
            }
        }
        
        mockFetch.mockResolvedValue(mockResponse)

        const params = {
            search: 'test',
            sortBy: 'name',
            sortOrder: 'asc' as const // explicitly type as const
        }

        await fetchCandidateResults(params)

        expect(mockFetch).toHaveBeenCalledWith('http://test-api.com/admin/results/candidates', {
            params: {
                search: 'test',
                sortBy: 'name', // should match params passed
                sortOrder: 'asc',
                batchId: undefined,
                sort_by: 'name',
                order: 'asc',
                batch_id: undefined
            },
            headers: { Authorization: 'Bearer mock-token' }
        })

        expect(results.value).toEqual(mockResponse.data)
        expect(summary.value).toEqual(mockResponse.meta.summary)
        expect(isLoading.value).toBe(false)
    })

    it('handles API errors correctly', async () => {
        const { fetchCandidateResults, error, isLoading, results } = useCandidateResults()
        
        const mockError = new Error('API Error')
        mockFetch.mockRejectedValue(mockError)

        await fetchCandidateResults()

        expect(error.value).toEqual(mockError)
        expect(isLoading.value).toBe(false)
        expect(results.value).toEqual([])
    })
})
