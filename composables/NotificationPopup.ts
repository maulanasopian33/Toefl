import { ref, readonly } from 'vue';

// State untuk notifikasi toast (jika diperlukan di masa depan)
const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error',
});

// State untuk dialog konfirmasi
const confirm = ref({
  show: false,
  message: '',
  title: 'Konfirmasi Tindakan',
  type: 'info' as 'info' | 'warning' | 'danger',
  resolve: (value: boolean) => {},
});

/**
 * Composable untuk mengelola notifikasi dan dialog konfirmasi global.
 */
export const useNotificationPopup = () => {
  // Fungsi untuk menampilkan dialog konfirmasi
  const showConfirm = (message: string, options?: { type?: 'info' | 'warning' | 'danger', title?: string }): Promise<boolean> => {
    confirm.value.show = true;
    confirm.value.message = message;
    confirm.value.type = options?.type || 'warning';
    confirm.value.title = options?.title || 'Anda Yakin?';
    return new Promise((resolve) => {
      confirm.value.resolve = resolve;
    });
  };

  // Fungsi yang dipanggil saat pengguna menekan "Confirm"
  const onConfirm = () => {
    confirm.value.show = false;
    confirm.value.resolve(true);
  };

  // Fungsi yang dipanggil saat pengguna menekan "Cancel"
  const onCancel = () => {
    confirm.value.show = false;
    confirm.value.resolve(false);
  };

  return {
    notification: readonly(notification),
    confirm: readonly(confirm),
    showConfirm,
    onConfirm,
    onCancel,
  };
};