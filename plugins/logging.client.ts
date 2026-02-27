export default defineNuxtPlugin((nuxtApp) => {
  const { log, logNavigation, logError } = useLogger()

  // 1. Capture Lifecycle events (Client side only)
  if (process.client) {
    // Audit Navigation
    const router = useRouter()
    router.afterEach((to) => {
      // Avoid logging every single sub-route change if it's too noisy,
      // but usually good for audit.
      logNavigation(to.fullPath)
    })

    // Capture Unhandled Errors
    nuxtApp.hook('app:error', (error) => {
      logError(error.message || 'Unhandled Client Error', { 
        stack: error.stack,
        url: window.location.href 
      })
    })

    // Capture Vue Errors
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
      logError(error.message || 'Vue Component Error', { 
        info,
        component: instance?.$options?.__name,
        stack: error.stack
      })
      // Still log to console for dev
      console.error('Vue Error:', error, info)
    }
  }

  return {
    provide: {
      logger: { log, logNavigation, logError }
    }
  }
})
