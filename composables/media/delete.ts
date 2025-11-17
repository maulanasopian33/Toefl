/**
 * Composable untuk menghapus file media dari server.
 * @param {string} url - URL media yang akan dihapus.
 */
export const useMediaDelete = async (url: string) => {
  const authToken = await useFirebaseToken();
  const config = useRuntimeConfig();

  if (!authToken) {
    throw new Error('User not authenticated. Delete failed.');
  }

  try {
    await $fetch(`${config.public.API_URL}/media/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: { url }
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
}

