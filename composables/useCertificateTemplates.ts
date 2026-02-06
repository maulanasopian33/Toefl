import { ref } from 'vue'
import { useFirebaseToken } from './FirebaseToken'
import { useNotification } from './useNotification'

export interface CertificateTemplateFormat {
  id?: number;
  templateId?: number;
  name: string;
  file_docx: string;
  is_active: boolean;
}

export interface CertificateTemplate {
  id?: number;
  name: string;
  status: boolean;
  formats: CertificateTemplateFormat[];
  createdAt?: string;
  updatedAt?: string;
}

export function useCertificateTemplates() {
  const config = useRuntimeConfig()
  const { showNotification } = useNotification()
  const templates = ref<CertificateTemplate[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)

  const fetchTemplates = async () => {
    isLoading.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<{ status: boolean, data: CertificateTemplate[] }>(`${config.public.API_URL}/certificate-templates`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status) {
        templates.value = response.data
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      showNotification('Gagal mengambil data template sertifikat', 'error')
    } finally {
      isLoading.value = false
    }
  }

  const saveTemplate = async (template: CertificateTemplate) => {
    isSaving.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<{ status: boolean, message: string, data: CertificateTemplate }>(`${config.public.API_URL}/certificate-templates/save`, {
        method: 'POST',
        body: template,
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status) {
        showNotification(response.message, 'success')
        await fetchTemplates()
        return response.data
      }
    } catch (error) {
      console.error('Error saving template:', error)
      showNotification('Gagal menyimpan template sertifikat', 'error')
    } finally {
      isSaving.value = false
    }
  }

  const deleteTemplate = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus template ini?')) return

    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')

      const response = await $fetch<{ status: boolean, message: string }>(`${config.public.API_URL}/certificate-templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status) {
        showNotification(response.message, 'success')
        await fetchTemplates()
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      showNotification('Gagal menghapus template sertifikat', 'error')
    }
  }

  return {
    templates,
    isLoading,
    isSaving,
    fetchTemplates,
    saveTemplate,
    deleteTemplate
  }
}
