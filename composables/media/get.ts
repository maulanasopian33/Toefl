import { computed } from 'vue';

interface MediaItem {
  url: string;
  filename: string;
  createdAt: string;
  mimeType: string;
  size: number;
  id: string;
  originalName: string;
}

interface ApiResponse {
  data: MediaItem[];
}

/**
 * Composable untuk mengambil daftar media dari server.
 * @returns Objek reaktif yang berisi data, pending, error, dan fungsi refresh.
 */
export const useMediaGet = async () => {
  const config = useRuntimeConfig();
  const apiUrl = `${config.public.API_URL}/media`;
  
  const authToken = await useFirebaseToken();

  if (!authToken) {
    throw new Error('User not authenticated. Delete failed.');
  }
  // Gunakan useFetch untuk mendapatkan state reaktif (data, pending, error)
  const { data, pending, error, refresh } = useFetch<ApiResponse>(apiUrl, {
    // Lazy fetch agar tidak memblokir rendering
    lazy: true,
    // Sediakan nilai default untuk mencegah error saat data belum ada
    default: () => ({ data: [] }),
    headers: {
        'Authorization': `Bearer ${authToken}`,
      },
  });

  // Buat computed property untuk langsung mengakses array 'data' dari respons API
  const mediaList = computed(() => data.value?.data ?? []);

  return { data: mediaList, pending, error, refresh };
};