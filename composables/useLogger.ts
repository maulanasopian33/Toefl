import { useFirebaseToken } from './FirebaseToken'

export interface LogPayload {
  action: string;
  module: string;
  details?: any;
  level?: 'info' | 'warn' | 'error';
}

export function useLogger() {
  const config = useRuntimeConfig()

  const log = async (payload: LogPayload) => {
    try {
      // In Nuxt client side, we can get UI context
      const route = useRoute()
      
      const enrichedPayload = {
        ...payload,
        source: 'frontend',
        details: {
          ...payload.details,
          path: route.fullPath,
          userAgent: window.navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      }

      // We send this to a dedicated logging endpoint
      // No need to wait for it (fire and forget)
      const token = await useFirebaseToken()
      
      $fetch(`${config.public.API_URL}/logs/audit`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: enrichedPayload
      }).catch(err => {
        // Silently fail to not interrupt UX
        console.error('Failed to send audit log:', err)
      })

    } catch (error) {
      // Avoid infinite loop if logging fails
    }
  }

  return {
    log,
    // Helper methods
    logNavigation: (to: string) => log({ action: 'NAVIGATE', module: 'navigation', details: { to } }),
    logError: (error: string, context?: any) => log({ action: 'ERROR', module: 'system', level: 'error', details: { error, ...context } }),
    logAdminAction: (action: string, details?: any) => log({ action, module: 'admin', details })
  }
}
