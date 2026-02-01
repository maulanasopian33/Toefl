import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTestSessionStore } from '../stores/testSessionStore'

describe('Test Session Persistence Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const store = useTestSessionStore()
    expect(store.testId).toBeNull()
    expect(store.quizState).toBe('intro')
  })

  it('should save progress correctly', () => {
    const store = useTestSessionStore()
    store.setTestId('test-123')
    store.saveProgress({
      currentSectionIndex: 1,
      timeLeft: 300,
      quizState: 'questions'
    })

    expect(store.testId).toBe('test-123')
    expect(store.currentSectionIndex).toBe(1)
    expect(store.timeLeft).toBe(300)
    expect(store.quizState).toBe('questions')
  })

  it('should clear session correctly', () => {
    const store = useTestSessionStore()
    store.setTestId('test-123')
    store.saveProgress({ currentSectionIndex: 1 })
    
    store.clearSession()
    
    expect(store.testId).toBeNull()
    expect(store.currentSectionIndex).toBe(0)
    expect(store.isRestored).toBe(false)
  })

  it('should track restoration state', () => {
    const store = useTestSessionStore()
    expect(store.isRestored).toBe(false)
    store.setRestored(true)
    expect(store.isRestored).toBe(true)
  })
})
