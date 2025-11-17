interface MediaItem {
  data : {
    url: string;
    filename: string;
    createdAt: string;
    mimeType: string;
    size: number;
    id: string;
    originalName : string;
  }
}

/**
 * Composable untuk mengambil daftar media dari server.
 * @returns {Promise<MediaItem[]>} Array dari objek media.
 */
export const useMediaGet = async (): Promise<MediaItem[]> => {
  const authToken = await useFirebaseToken();
  const config = useRuntimeConfig();

  if (!authToken) {
    // Mengembalikan array kosong jika tidak terautentikasi
    console.warn('User not authenticated. Cannot fetch media.');
    return [];
  }

  return await $fetch<MediaItem[]>(`${config.public.API_URL}/media`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });
}