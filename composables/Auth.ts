// composables/useAuth.js
import { ref } from 'vue';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  signInWithPopup
} from 'firebase/auth';
const { startLoading, stopLoading } = useLoading();
const { showAlert, showConfirm } = useNotificationPopup();

export const useAuth = () => {
  const { $auth, $googleProvider } = useNuxtApp();
  const router = useRouter();
  const config = useRuntimeConfig();

  // State untuk menyimpan status login atau error
  const user = ref();
  const error = ref();

  const signInWithGoogle = async () => {
    try {
      startLoading();
      const result = await signInWithPopup($auth, $googleProvider);
      user.value = result.user;
      
      // Dapatkan dan simpan token
      const idToken = await user.value.getIdToken();
      
      // Post ke backend
      const response = await fetch(`${config.public.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to login with backend');
      }
      
      const backendData = await response.json();
      sessionStorage.setItem('userRole', backendData.role);
      stopLoading();
      router.push('/');
      
    } catch (err : any) {
      stopLoading();
      errorHandler(err);
    }
  };

  // Fungsi untuk login
  const loginEmailPassword = async (email :string , password : string) => {
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword($auth, email, password);
      user.value = userCredential.user;

      // Dapatkan dan simpan token
      const idToken = await user.value.getIdToken();
      
      // Post ke backend
      const response = await fetch(`${config.public.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to login with backend');
      }
      
      const backendData = await response.json();
      sessionStorage.setItem('userRole', backendData.role);
      
      router.push('/');
    } catch (e : any) {
      errorHandler(e);
    }
  };
  // Fungsi untuk mengubah password pengguna
  const changePassword = async (newPassword : string) => {
      error.value = null;
      try {
        if (!$auth.currentUser) {
          throw new Error('Anda harus login terlebih dahulu.');
        }
        await updatePassword($auth.currentUser, newPassword);
      } catch (e : any) {
        errorHandler(e);
      }
    };
  // Fungsi untuk mengirim email reset password
  const resetPassword = async (email : string) => {
    error.value = null;
    try {
      await sendPasswordResetEmail($auth, email);
    } catch (e :any) {
      errorHandler(e);
    }
  };
  // Fungsi untuk mendaftar pengguna baru
  const registerEmailPassword = async (email : string, password : string) => {
    error.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword($auth, email, password);
      user.value = userCredential.user;
    } catch (e : any) {
      errorHandler(e);
    }
  };
  const errorHandler = (e : any) => {
    let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
    
    // Tentukan pesan kesalahan berdasarkan kode error
    switch (e.code) {
      case 'auth/wrong-password':
        errorMessage = 'Password salah.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Email tidak terdaftar.';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Email atau password salah.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Akun Anda dinonaktifkan. Silakan hubungi admin.';
        router.push('/auth/disable'); // Aktifkan jika diperlukan
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Login dibatalkan oleh pengguna.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Format email tidak valid.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Email sudah terdaftar. Gunakan email lain.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Metode login tidak diizinkan. Hubungi administrator.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password terlalu lemah. Password harus minimal 6 karakter.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Terlalu banyak percobaan login gagal. Coba lagi nanti.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Tidak ada koneksi internet. Silakan periksa jaringan Anda.';
        break;
      case 'auth/requires-recent-login':
        errorMessage = 'Untuk melanjutkan, silakan login kembali.';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'Email sudah digunakan dengan metode login lain.';
        break;
      case 'auth/missing-password':
        errorMessage = 'Password tidak boleh kosong.';
        break;
      default:
        // Penanganan untuk error yang tidak terduga
        console.error('Error Firebase Auth:', e);
        errorMessage = `Terjadi kesalahan. Kode error: ${e.code}`;
    }
    
    // Tampilkan pesan dan perbarui nilai error
    showAlert(errorMessage);
    return error.value = errorMessage;
  };
  const logout = async () => {
    await $auth.signOut();
    sessionStorage.removeItem('userRole');
    user.value = null;
    router.push('/login');
  };

  return {
    user,
    error,
    signInWithGoogle,
    loginEmailPassword,
    changePassword,
    resetPassword,
    registerEmailPassword,
    logout
  };
};