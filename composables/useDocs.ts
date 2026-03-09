import { ref } from 'vue'
import { useFirebaseToken } from './FirebaseToken'
import { useNotification } from './useNotification'

export interface Doc {
  id: number
  title: string
  slug: string
  category: string
  category_icon: string
  content_md?: string
  order_num: number
  status: boolean
  createdAt?: string
  updatedAt?: string
}

export interface DocCategory {
  category: string
  icon: string
  articles: Pick<Doc, 'id' | 'title' | 'slug' | 'order_num'>[]
}

export function useDocs() {
  const config = useRuntimeConfig()
  const { showNotification } = useNotification()

  const categories = ref<DocCategory[]>([])
  const allDocs = ref<Doc[]>([])
  const activeDoc = ref<Doc | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)

  const fetchPublishedDocs = async () => {
    isLoading.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')
      const response = await $fetch<{ status: boolean; data: DocCategory[] }>(
        `${config.public.API_URL}/docs`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.status) categories.value = response.data
    } catch (error) {
      console.error('useDocs.fetchPublishedDocs error:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchAllDocs = async () => {
    isLoading.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')
      const response = await $fetch<{ status: boolean; data: Doc[] }>(
        `${config.public.API_URL}/docs/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.status) allDocs.value = response.data
    } catch (error) {
      console.error('useDocs.fetchAllDocs error:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchDocBySlug = async (slug: string) => {
    isLoading.value = true
    activeDoc.value = null
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')
      const response = await $fetch<{ status: boolean; data: Doc }>(
        `${config.public.API_URL}/docs/slug/${slug}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.status) activeDoc.value = response.data
    } catch (error) {
      console.error('useDocs.fetchDocBySlug error:', error)
    } finally {
      isLoading.value = false
    }
  }

  const createDoc = async (payload: Partial<Doc>) => {
    isSaving.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')
      const response = await $fetch<{ status: boolean; message: string; data: Doc }>(
        `${config.public.API_URL}/docs`,
        {
          method: 'POST',
          body: payload,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.status) {
        showNotification(response.message, 'success')
        await fetchAllDocs()
        return response.data
      }
    } catch (error: any) {
      showNotification(error?.data?.message || 'Gagal membuat artikel.', 'error')
    } finally {
      isSaving.value = false
    }
  }

  const updateDoc = async (id: number, payload: Partial<Doc>) => {
    isSaving.value = true
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')
      const response = await $fetch<{ status: boolean; message: string; data: Doc }>(
        `${config.public.API_URL}/docs/${id}`,
        {
          method: 'PUT',
          body: payload,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.status) {
        showNotification(response.message, 'success')
        await fetchAllDocs()
        return response.data
      }
    } catch (error: any) {
      showNotification(error?.data?.message || 'Gagal memperbarui artikel.', 'error')
    } finally {
      isSaving.value = false
    }
  }

  const deleteDoc = async (id: number) => {
    if (!confirm('Hapus artikel ini? Aksi tidak dapat dibatalkan.')) return
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Unauthenticated')
      const response = await $fetch<{ status: boolean; message: string }>(
        `${config.public.API_URL}/docs/${id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.status) {
        showNotification(response.message, 'success')
        await fetchAllDocs()
      }
    } catch (error: any) {
      showNotification(error?.data?.message || 'Gagal menghapus artikel.', 'error')
    }
  }

  return {
    categories, allDocs, activeDoc,
    isLoading, isSaving,
    fetchPublishedDocs, fetchAllDocs, fetchDocBySlug,
    createDoc, updateDoc, deleteDoc
  }
}
