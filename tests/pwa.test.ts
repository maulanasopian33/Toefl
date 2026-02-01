import { describe, it, expect } from 'vitest'
import { loadNuxtConfig } from '@nuxt/kit'

describe('PWA Configuration', async () => {
  const config = await loadNuxtConfig({})

  it('should have @vite-pwa/nuxt in modules', () => {
    expect(config.modules).toContain('@vite-pwa/nuxt')
  })

  it('should have manifest with correct name', () => {
    // @ts-ignore
    expect(config.pwa.manifest.name).toBe('Toefl Exam App')
  })

  it('should have icons configured', () => {
    // @ts-ignore
    expect(config.pwa.manifest.icons.length).toBeGreaterThan(0)
  })
})
