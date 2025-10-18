import { ref, readonly } from 'vue'

// State notifikasi (singleton)
const show = ref(false)
const message = ref('')
const type = ref<'success' | 'warning' | 'error'>('success')

let timeoutId: NodeJS.Timeout | null = null

/**
 * Composable untuk menampilkan notifikasi popup global.
 * @returns {object} - State dan fungsi untuk mengontrol notifikasi.
 */
export function useNotification() {
  const showNotification = (
    newMessage: string,
    newType: 'success' | 'warning' | 'error' = 'success',
    duration: number = 4000
  ) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    message.value = newMessage
    type.value = newType
    show.value = true

    timeoutId = setTimeout(() => {
      show.value = false
    }, duration)
  }

  return {
    show: readonly(show),
    message: readonly(message),
    type: readonly(type),
    showNotification,
  }
}