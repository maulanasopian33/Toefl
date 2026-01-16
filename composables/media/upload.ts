/**
 * Composable untuk mengunggah file media ke server.
 * @param {FormData} formData - FormData yang berisi file dengan key 'media'.
 * @returns {Promise<{ url: string }>} Objek yang berisi URL media yang diunggah.
 */
export const useMediaUpload = async (formData: FormData, signal?: AbortSignal) => {
  const authToken = await useFirebaseToken();
  const config = useRuntimeConfig();

  if (!authToken) {
    throw new Error('User not authenticated. Upload failed.');
  }

  try {
    const response = await $fetch<{ url:string }>(`${config.public.API_URL}/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
      signal, // Menambahkan AbortSignal ke request
    });
    return response;
  } catch (error: any) {
    console.error('Error uploading media:', error);
    
    const { logToServer } = useLogger();
    logToServer({
      level: 'error',
      message: 'Failed to upload media',
      metadata: {
        error: error.message,
        stack: error.stack
      }
    });

    // Melempar kembali error agar bisa ditangani di komponen
    throw error;
  }
}
