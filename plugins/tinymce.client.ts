export default defineNuxtPlugin(() => {
  if (process.server) return
  if (!(window as any).__tinymceLoading) {
    (window as any).__tinymceLoading = new Promise<void>((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js'
      script.onload = () => resolve()
      document.head.appendChild(script)
    })
  }
  return {
    provide: {
      tinymceReady: () => (window as any).__tinymceLoading
    }
  }
})
