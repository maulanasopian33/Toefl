import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  signInWithPopup
} from 'firebase/auth';
import { useAuth as useAuthState } from './useAuth'; // Impor state manager

const { startLoading, stopLoading } = useLoading();
const { showAlert, showConfirm } = useNotificationPopup();

/**
 * Composable ini berisi FUNGSI AKSI terkait otentikasi (login, logout, dll).
 * Untuk STATE pengguna (data, role, status login), gunakan `useAuth()`.
 */
export const useAuthActions = () => {
  const { $auth, $googleProvider } = useNuxtApp();
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      startLoading();
      await signInWithPopup($auth, $googleProvider);
      // Setelah login, state di `useAuth` akan diperbarui secara otomatis.
      // Kita hanya perlu menunggu dan kemudian redirect.
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
      await redirectBasedOnRole();
    } catch (e: any) {
      errorHandler(e);
    } finally {
      stopLoading();
    }
  };

  const redirectBasedOnRole = async () => {
    // Tunggu sesaat agar custom claims termuat
    await new Promise(resolve => setTimeout(resolve, 200));
    const { forceRefreshUserToken } = useAuthState();
    await forceRefreshUserToken(); // Paksa refresh token untuk mendapatkan claims terbaru

    const { claims } = useAuthState();
    const role = claims.value.role;

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
      showAlert('Password berhasil diubah.', 'success');
    } catch (e: any) {
      errorHandler(e);
    }
  };

  // Fungsi untuk mengirim email reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail($auth, email);
      showAlert('Email reset password telah dikirim. Silakan periksa kotak masuk Anda.', 'success');
    } catch (e: any) {
      errorHandler(e);
    }
  };

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

    // Tampilkan pesan dan perbarui nilai error
    showAlert(errorMessage);
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