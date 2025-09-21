import { reactive } from 'vue';

// Definisikan tipe untuk tombol notifikasi
interface NotificationButton {
  text: string;
  className: string;
  action: () => void;
}

// Definisikan tipe untuk state pop-up
interface NotificationState {
  isOpen: boolean;
  title: string;
  message: string;
  buttons: NotificationButton[];
}

// State global untuk pop-up
const state = reactive<NotificationState>({
  isOpen: false,
  title: '',
  message: '',
  buttons: [],
});

/**
 * Membuka pop-up notifikasi.
 * @param {string} title - Judul pop-up.
 * @param {string} message - Pesan pop-up.
 * @param {NotificationButton[]} buttons - Konfigurasi tombol.
 */
function show(title: string, message: string, buttons: NotificationButton[]) {
  state.title = title;
  state.message = message;
  state.buttons = buttons;
  state.isOpen = true;
}

/**
 * Menutup pop-up notifikasi.
 */
function hide(): void {
  state.isOpen = false;
}

/**
 * Menampilkan pop-up alert sederhana.
 * @param {string} message - Pesan yang akan ditampilkan.
 */
function showAlert(message: string): void {
  show(
    'Perhatian!',
    message,
    [{
      text: 'OK',
      className: 'bg-green-600 text-white hover:bg-green-700',
      action: () => hide()
    }]
  );
}

/**
 * Menampilkan pop-up konfirmasi dengan Promise.
 * @param {string} message - Pesan konfirmasi yang akan ditampilkan.
 * @returns {Promise<boolean>} - Mengembalikan true jika dikonfirmasi, false jika dibatalkan.
 */
function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    show(
      'Konfirmasi',
      message,
      [{
        text: 'Batal',
        className: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        action: () => {
          hide();
          resolve(false);
        }
      }, {
        text: 'Lanjutkan',
        className: 'bg-green-600 text-white hover:bg-green-700',
        action: () => {
          hide();
          resolve(true);
        }
      }]
    );
  });
}

// Composable untuk mengelola notifikasi pop-up
export function useNotificationPopup() {
  return {
    state,
    showAlert,
    showConfirm,
    hide
  };
}