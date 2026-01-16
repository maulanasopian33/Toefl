/**
 * Composable untuk menghapus file media dari server.
 * @param {string} id - ID unik media yang akan dihapus.
 */
export const useMediaDelete = async (id: string) => {
  const authToken = await useFirebaseToken();
  const config = useRuntimeConfig();

  if (!authToken) {
    throw new Error('User not authenticated. Delete failed.');
  }

  try {
    await $fetch(`${config.public.API_URL}/media/${id}`, { // Menggunakan ID di URL
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
  } catch (error: any) {
    console.error('Error deleting media:', error);
    
    const { logToServer } = useLogger();
    logToServer({
      level: 'error',
      message: 'Failed to delete media',
      metadata: {
        id,
        error: error.message,
        stack: error.stack
      }
    });

    throw error;
  }
}
