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

// State untuk dialog alert (informasi tunggal)
const alert = ref({
  show: false,
  message: '',
  title: 'Informasi',
  type: 'info' as 'success' | 'info' | 'warning' | 'error',
  resolve: () => {},
});

// State untuk dialog pemilihan role
const roleSelector = ref({
  show: false,
  title: 'Pilih Role Baru',
  message: '',
  currentRole: '',
  availableRoles: [] as string[],
  resolve: (value: string | null) => {},
});

/**
 * Composable untuk mengelola notifikasi dan dialog konfirmasi global.
 */
export const useNotificationPopup = () => {
  // Fungsi untuk menampilkan dialog konfirmasi
  const showConfirm = (
    message: string,
    options?: {
      type?: 'info' | 'warning' | 'danger'
      title?: string
      confirmText?: string
      html?: boolean
    }
  ): Promise<boolean> => {
    confirm.value.show = true;
    confirm.value.message = message;
    confirm.value.type = options?.type || 'warning';
    confirm.value.title = options?.title || 'Anda Yakin?';
    return new Promise((resolve) => {
      confirm.value.resolve = resolve;
    });
  };

  // Fungsi untuk menampilkan dialog alert
  const showAlert = (
    message: string,
    options?: {
      title?: string
      type?: 'success' | 'info' | 'warning' | 'error'
    }
  ): Promise<void> => {
    alert.value.show = true;
    alert.value.message = message;
    alert.value.title = options?.title || 'Informasi';
    alert.value.type = options?.type || 'info';
    return new Promise((resolve) => {
      alert.value.resolve = resolve;
    });
  };

  // Fungsi untuk menampilkan dialog pemilihan role
  const showRoleSelector = (
    message: string,
    currentRole: string,
    availableRoles: string[],
    options?: { title?: string }
  ): Promise<string | null> => {
    roleSelector.value.show = true;
    roleSelector.value.message = message;
    roleSelector.value.currentRole = currentRole;
    roleSelector.value.availableRoles = availableRoles;
    roleSelector.value.title = options?.title || 'Ubah Role Pengguna';
    return new Promise((resolve) => {
      roleSelector.value.resolve = resolve;
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

  // Fungsi yang dipanggil saat pengguna menutup alert
  const onAlertClose = () => {
    alert.value.show = false;
    alert.value.resolve();
  };

  // Fungsi yang dipanggil saat role baru dipilih dan disimpan
  const onSelectRole = (newRole: string) => {
    roleSelector.value.show = false;
    roleSelector.value.resolve(newRole);
  };

  // Fungsi yang dipanggil saat modal role dibatalkan
  const onCancelRoleSelection = () => {
    roleSelector.value.show = false;
    roleSelector.value.resolve(null);
  };

  return {
    notification: readonly(notification),
    confirm: readonly(confirm),
    alert: readonly(alert),
    roleSelector: readonly(roleSelector),
    showConfirm,
    showAlert,
    showRoleSelector,
    onConfirm,
    onCancel,
    onAlertClose,
    onSelectRole,
    onCancelRoleSelection,
  };
};