import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  signInWithPopup
} from 'firebase/auth';
import { useAuth as useAuthState } from './useAuth'; // Impor state manager
import { useNotification } from './useNotification'; // Impor useNotification
import { useLogger } from './useLogger';

const { startLoading, stopLoading } = useLoading();
const { showNotification } = useNotification(); // Ganti showAlert dengan showNotification

/**
 * Composable ini berisi FUNGSI AKSI terkait otentikasi (login, logout, dll).
 * Untuk STATE pengguna (data, role, status login), gunakan `useAuth()`.
 */
export const useAuthActions = () => {
  const config = useRuntimeConfig(); // Tambahkan ini
  const { $auth, $googleProvider } = useNuxtApp();
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      startLoading();
      await signInWithPopup($auth, $googleProvider);
      
      // --- LANGKAH BARU: Panggil backend untuk konfirmasi/set custom claims ---
      const idToken = await $auth.currentUser?.getIdToken(); // Dapatkan token terbaru
      if (!idToken) throw new Error('Tidak dapat mengambil token otentikasi.');

      await $fetch(`${config.public.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        // Anda bisa mengirim data tambahan jika backend membutuhkannya
        body: { /* optional data */ }
      });
      // --- AKHIR LANGKAH BARU ---

      // Setelah backend selesai, baru redirect
      await redirectBasedOnRole(); 
    } catch (err: any) {
      errorHandler(err);
    } finally {
      stopLoading();
    }
  };

  // Fungsi untuk login
  const loginEmailPassword = async (email: string, password: string) => {
    try {
      startLoading();
      await signInWithEmailAndPassword($auth, email, password);

      // --- LANGKAH BARU: Panggil backend untuk konfirmasi/set custom claims ---
      const idToken = await $auth.currentUser?.getIdToken(); // Dapatkan token terbaru
      if (!idToken) throw new Error('Tidak dapat mengambil token otentikasi.');

      await $fetch(`${config.public.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: { /* optional data */ }
      });
      // --- AKHIR LANGKAH BARU ---

      await redirectBasedOnRole();
    } catch (e: any) {
      errorHandler(e);
    } finally {
      stopLoading();
    }
  };

  const redirectBasedOnRole = async () => {
    // Tunggu sesaat agar custom claims termuat
    // Delay ini mungkin tidak lagi diperlukan atau bisa diperpendek setelah backend call
    const { forceRefreshUserToken } = useAuthState();
    await forceRefreshUserToken(); // Paksa refresh token untuk mendapatkan claims terbaru

    const { claims } = useAuthState();
    const role = claims.value.role;

    // --- DEBUGGING POINT 2: Periksa role yang digunakan untuk redirect ---
    console.log('[AuthActions] Redirecting based on role:', role);

    if (role === 'admin') {
      return navigateTo('/admin');
    } else {
      return navigateTo('/');
    }
  };

  // Fungsi untuk mengubah password pengguna
  const changePassword = async (newPassword: string) => {
    try {
      if (!$auth.currentUser) {
        throw new Error('Anda harus login terlebih dahulu.');
      }
      await updatePassword($auth.currentUser, newPassword);
      showNotification('Password berhasil diubah.', 'success');
    } catch (e: any) {
      errorHandler(e);
    }
  };

  // Fungsi untuk mengirim email reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail($auth, email);
      showNotification('Email reset password telah dikirim. Silakan periksa kotak masuk Anda.', 'success');
    } catch (e: any) {
      errorHandler(e);
    }
  };

  const { logToServer } = useLogger();

  const errorHandler = (e: any) => {
    let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';

    // Tentukan pesan kesalahan berdasarkan kode error
    switch (e.code) {
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        errorMessage = 'Email atau password salah.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Akun Anda dinonaktifkan. Silakan hubungi admin.';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Login dibatalkan oleh pengguna.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Terlalu banyak percobaan login gagal. Coba lagi nanti.';
        break;
      default:
        // Penanganan untuk error yang tidak terduga
        console.error('Error Firebase Auth:', e);
        errorMessage = e.message || `Terjadi kesalahan. Kode error: ${e.code}`;
    }

    // Capture error to server for non-user-cancellation errors
    if (e.code !== 'auth/popup-closed-by-user') {
      logToServer({
        level: 'error',
        message: `Auth Error: ${errorMessage}`,
        metadata: {
          code: e.code,
          message: e.message,
          stack: e.stack
        }
      });
    }

    // Tampilkan pesan dan perbarui nilai error
    showNotification(errorMessage, 'error'); // Gunakan showNotification dengan tipe 'error'
  };

  const logout = async () => {
    await $auth.signOut();
    // State di `useAuth` akan otomatis ter-reset.
    // Redirect ke halaman login.
    navigateTo('/auth/login');
  };

  return {
    signInWithGoogle,
    loginEmailPassword,
    changePassword,
    resetPassword,
    logout
  };
};