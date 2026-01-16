import type { ReqUserDetails, ResUserDetail } from '@/types/UserDetails';
import { v4 as uuidv4 } from 'uuid';
import { useLogger } from '../useLogger';
export const useUserDetailsPost = async (userData: Omit<ReqUserDetails, 'uid'>) => {
  // Dapatkan token otorisasi dari composable yang sudah ada
  const authToken = await useFirebaseToken();
  const config = useRuntimeConfig();

  // Hentikan proses jika token tidak ada
  if (!authToken) {
    return {
      data: null,
      pending: false,
      error: new Error('User not authenticated.'),
      refresh: () => {},
    };
  }

  // Buat objek data yang akan dikirim, tambahkan UID acak
  const postData: ReqUserDetails = {
    ...userData,
    uid: uuidv4(), // Menambahkan UID acak
  };

  // Lanjutkan dengan useFetch untuk mengirim data
  const { data, pending, error, refresh } = await useFetch<ResUserDetail>(`${config.public.API_URL}/user/detail`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: postData, // Data yang akan dikirim dalam body permintaan
  });

  const { logToServer } = useLogger();
  watch(error, (newErr) => {
    if (newErr) {
      logToServer({
        level: 'error',
        message: 'Failed to post user details',
        metadata: { error: newErr.message }
      });
    }
  });

  return {
    data,
    pending,
    error,
    refresh,
  };
}
