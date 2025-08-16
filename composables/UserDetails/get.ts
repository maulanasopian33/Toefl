import type { ResUserDetail } from "@/types/UserDetails";

export const useUserDetailsGet = async () => {
  // Panggil composable untuk mendapatkan token
  const authToken = await useFirebaseToken();
  const config = useRuntimeConfig();
  // Hentikan proses jika token tidak ada
  if (!authToken) {
    // Anda bisa mengembalikan error atau objek kosong di sini
    return {
      data: null,
      pending: false,
      error: new Error('User not authenticated.'),
      refresh: () => {},
    };
  }

  // Lanjutkan dengan useFetch jika token tersedia
  const { data, pending, error, refresh } = await useFetch<ResUserDetail>(`${config.public.API_URL}/user/detail`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`, // Menggunakan token dari Firebase
      'Content-Type': 'application/json',
    },
  });

  return {
    data,
    pending,
    error,
    refresh,
  };
}
