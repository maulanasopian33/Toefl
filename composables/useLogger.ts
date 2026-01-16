import { useFirebaseToken } from './FirebaseToken'

interface LogPayload {
  level: 'error' | 'warn' | 'info';
  message: string;
  metadata?: any;
}

export const useLogger = () => {
  const config = useRuntimeConfig();
  const apiUrl = `${config.public.API_URL}/logs/client`;

  /**
   * Mengirim log ke server backend.
   * @param payload Objek berisi level, message, dan metadata optional.
   */
  const logToServer = async (payload: LogPayload) => {
    try {
      const authToken = await useFirebaseToken().catch(() => null);
      
      // Kita tetap kirim log meskipun token tidak ada (jika API mengizinkan)
      // atau log error tetap tercatat di console.
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      await $fetch(apiUrl, {
        method: 'POST',
        headers,
        body: payload,
      });
    } catch (err) {
      // Jika gagal kirim log ke server, jangan sampai menyebabkan loop error.
      // Cukup log ke console secara lokal.
      console.error('Failed to send log to server:', err);
    }
  };

  return {
    logToServer,
  };
};
