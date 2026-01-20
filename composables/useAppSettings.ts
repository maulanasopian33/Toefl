import { ref, watch } from 'vue'
import { useNotification } from '@/composables/useNotification'
import { useFirebaseToken } from './FirebaseToken'
import { useLogger } from './useLogger'

/**
 * Interface untuk struktur data pengaturan aplikasi (internal, camelCase).
 * Sesuaikan dengan data yang dikembalikan oleh API Anda.
 */
export interface AppSettings {
  appName: string
  appShortName: string
  appSlug: string
  tagline: string
  description: string
  logoUrl?: string
  faviconUrl?: string
  primaryColor: string // warna_utama
  theme: 'system' | 'light' | 'dark' // mode_tampilan
  organization: string // nama_organisasi
  website: string
  supportEmail: string // email_support
  supportPhone: string // no_kontak
  defaultLanguage: 'id' | 'en' | 'ar'
  timezone: string
  currency: 'IDR' | 'USD'
  heroTitle?: string
  heroSubtitle?: string
  [key: string]: any // Allow other properties
}

/**
 * Helper function to map API snake_case to internal camelCase
 */
function mapApiToAppSettings(apiData: any): AppSettings {
  return {
    id: apiData.id,
    appName: apiData.nama_aplikasi,
    appShortName: apiData.nama_pendek,
    appSlug: apiData.id_aplikasi,
    tagline: apiData.tagline,
    description: apiData.deskripsi_singkat,
    logoUrl: apiData.logo_app,
    faviconUrl: apiData.favicon,
    primaryColor: apiData.warna_utama,
    theme: apiData.mode_tampilan,
    organization: apiData.nama_organisasi,
    website: apiData.website,
    supportEmail: apiData.email_support,
    supportPhone: apiData.no_kontak,
    defaultLanguage: apiData.bahasa_default,
    timezone: apiData.zona_waktu,
    currency: apiData.mata_uang,
    heroTitle: apiData.hero_title,
    heroSubtitle: apiData.hero_subtitle,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  }
}

/**
 * Helper function to map internal camelCase to API snake_case
 */
function mapAppSettingsToApi(appSettings: AppSettings): any {
  return {
    id: appSettings.id,
    nama_aplikasi: appSettings.appName,
    nama_pendek: appSettings.appShortName,
    id_aplikasi: appSettings.appSlug,
    tagline: appSettings.tagline,
    deskripsi_singkat: appSettings.description,
    logo_app: appSettings.logoUrl,
    favicon: appSettings.faviconUrl,
    warna_utama: appSettings.primaryColor,
    mode_tampilan: appSettings.theme,
    nama_organisasi: appSettings.organization,
    website: appSettings.website,
    email_support: appSettings.supportEmail,
    no_kontak: appSettings.supportPhone,
    bahasa_default: appSettings.defaultLanguage,
    zona_waktu: appSettings.timezone,
    mata_uang: appSettings.currency,
    hero_title: appSettings.heroTitle,
    hero_subtitle: appSettings.heroSubtitle,
    // createdAt and updatedAt are usually handled by the backend
  }
}

/**
 * Composable untuk mengelola pengaturan aplikasi.
 * Menangani pengambilan, pembaruan, dan state terkait.
 */
export function useAppSettings() {
  const { showNotification } = useNotification()
  const config = useRuntimeConfig()

  const API_URL = `${config.public.API_URL}/settings`

  // Menggunakan useFetch untuk mengambil data pengaturan
  const { data: settings, pending: isLoading, error, refresh: fetchSettings } = useAsyncData<AppSettings | null>(
    'app-settings',
    async () => {
      const token = await useFirebaseToken();
      if (!token) {
        throw new Error('Autentikasi pengguna gagal.');
      }
      const response = await $fetch<{ data: any }>(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Map the data right here, so the handler returns the correct type.
      return response.data ? mapApiToAppSettings(response.data) : null;
    },
    {
      // Nilai awal untuk mencegah error saat rendering di client
      default: () => null,
    },
  )

  const isSaving = ref(false)

  /**
   * Mengunggah file media (logo/favicon) ke server.
   * @param file - File yang akan diunggah.
   * @returns URL dari file yang berhasil diunggah.
   */
  async function uploadMedia(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('media', file)
    const token = await useFirebaseToken()
    if (!token) throw new Error('Autentikasi pengguna gagal.')

    const response = await $fetch<{ url: string }>(`${config.public.API_URL}/media/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.url
  }

  /**
   * Memperbarui pengaturan di server.
   * @param updatedSettings - Objek pengaturan yang akan disimpan.
   */
  async function updateSettings(updatedSettings: AppSettings) {
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Autentikasi pengguna gagal.')

      // Map internal camelCase to API snake_case for the PUT request
      const apiBody = mapAppSettingsToApi(updatedSettings);

      console.log("API body sent to PUT /settings:", apiBody);
      await $fetch(API_URL, {
        method: 'PUT',
        body: apiBody,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      showNotification('Pengaturan aplikasi berhasil diperbarui.', 'success')
      await fetchSettings() // Refresh data from server to ensure consistency
    } catch (e: any) {
      showNotification('Gagal menyimpan pengaturan ke server.', 'error')
      console.error(e)
      const { logToServer } = useLogger()
      logToServer({
        level: 'error',
        message: 'Failed to update app settings',
        metadata: { error: e.message }
      })
    }
  }

  return { settings, isLoading, isSaving, error, fetchSettings, updateSettings, uploadMedia }
}