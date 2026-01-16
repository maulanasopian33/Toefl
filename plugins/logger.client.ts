export default defineNuxtPlugin((nuxtApp) => {
  const { logToServer } = useLogger();

  // Menangkap error dari Vue (komponen)
  nuxtApp.vueApp.config.errorHandler = (err: any, instance, info) => {
    console.error('Captured by Vue Error Handler:', err);
    
    logToServer({
      level: 'error',
      message: err?.message || 'Vue Error caught in global handler',
      metadata: {
        info,
        stack: err?.stack,
        component: instance?.$options?.name || 'Unknown Component',
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    });

    // Tetap tampilkan di console agar dev tetap tahu
  };

  // Menangkap error aplikasi secara umum (promise rejection, dll)
  nuxtApp.hook('app:error', (err) => {
    console.error('Captured by App Error Hook:', err);

    logToServer({
      level: 'error',
      message: err?.message || 'App Error caught in global handler',
      metadata: {
        stack: err?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    });
  });

  // Opsional: Menangkap unhandled rejections
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      logToServer({
        level: 'error',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        metadata: {
          reason: event.reason,
          url: window.location.href
        }
      });
    });
  }
});
