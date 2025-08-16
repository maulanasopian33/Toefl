import { getAuth } from 'firebase/auth';

export const useFirebaseToken = async () => {
  const auth = getAuth();
  
  if (!auth.currentUser) {
    // Jika tidak ada pengguna yang login, kembalikan null atau throw error
    return null;
  }
  
  try {
    const token = await auth.currentUser.getIdToken(true);
    return token;
  } catch (error) {
    console.error('Gagal mendapatkan Firebase ID Token:', error);
    return null;
  }
};