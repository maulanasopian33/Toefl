import { ref, computed, watch, onMounted } from 'vue'
import { useFirebaseToken } from './FirebaseToken' // Asumsi untuk otentikasi

export type Role = 'admin' | 'peserta' | 'panitia'

export interface User {
  uid: string
  name: string
  email: string
  email_verified: boolean
  picture?: string
  lastLogin?: string
  role: Role
  createdAt: string
  disabled: boolean
  nim?: string
  fakultas?: string
  prodi?: string
}

export function useUsers() {
  const config = useRuntimeConfig()
  const API_URL = `${config.public.API_URL}/users`

  const users = ref<User[]>([])
  const isLoading = ref(true)
  const error = ref<Error | null>(null)

  // Filters
  const search = ref('')
  const faculty = ref('')
  const program = ref('')
  const role = ref<Role | ''>('')
  const email_verified = ref<'verified' | 'unverified' | ''>('')
  const accountStatus = ref<'active' | 'disabled' | ''>('')

  // Sorting & pagination
  const sortBy = ref<'createdAt' | 'name' | 'lastLogin' | 'role'>('createdAt')
  const sortOrder = ref<'asc' | 'desc'>('desc')
  const page = ref(1)
  const pageSize = ref(10)

  // State dari API
  const totalItems = ref(0)
  const totalPages = ref(0)
  const summary = ref({ total: 0, verified: 0, active: 0, disabled: 0 })
  const facultyOptions = ref<string[]>([])
  const programOptions = ref<string[]>([])

  const fetchUsers = async () => {
    isLoading.value = true
    error.value = null
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Authentication token not found.')

      const params = {
        page: page.value,
        limit: pageSize.value,
        search: search.value,
        faculty: faculty.value,
        program: program.value,
        role: role.value,
        email_verified: email_verified.value,
        status: accountStatus.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
      }

      // Hapus parameter kosong agar URL lebih bersih
      Object.keys(params).forEach(key => {
        if (!params[key as keyof typeof params]) {
          delete params[key as keyof typeof params]
        }
      })

      const response = await $fetch<{
        data: User[]
        meta: {
          totalItems: number
          totalPages: number
          currentPage: number
        }
        summary: {
          total: number
          verified: number
          active: number
          disabled: number
        }
        filterOptions: {
          faculties: string[]
          programs: string[]
        }
      }>(API_URL, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      })

      users.value = response.data
      totalItems.value = response.meta.totalItems
      totalPages.value = response.meta.totalPages
      page.value = response.meta.currentPage

      // Pastikan untuk menangani kasus di mana summary atau filterOptions mungkin tidak ada
      if (response.summary) {
        summary.value = response.summary
      }
      if (response.filterOptions) {
        // Hanya update opsi filter jika belum ada untuk menghindari kedipan
        if (facultyOptions.value.length === 0) facultyOptions.value = response.filterOptions.faculties
        if (programOptions.value.length === 0) programOptions.value = response.filterOptions.programs
      }
    } catch (e: any) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  const resetFilters = () => {
    search.value = ''
    faculty.value = ''
    program.value = ''
    role.value = ''
    email_verified.value = ''
    accountStatus.value = ''
    sortBy.value = 'createdAt'
    sortOrder.value = 'desc'
    page.value = 1
  }

  /**
   * Mengubah status aktif/nonaktif seorang pengguna.
   * @param uid - UID dari pengguna yang akan diubah.
   * @param currentStatus - Status 'disabled' saat ini (true jika nonaktif).
   */
  const toggleUserStatus = async (uid: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    try {
      const token = await useFirebaseToken()
      if (!token) throw new Error('Token otentikasi tidak ditemukan.')

      await $fetch(`${API_URL}/${uid}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: { disabled: newStatus },
      })

      // Update state lokal untuk respons UI yang cepat tanpa perlu refetch
      const userIndex = users.value.findIndex(u => u.uid === uid)
      if (userIndex !== -1) {
        users.value[userIndex].disabled = newStatus
      }
    } catch (e: any) {
      console.error('Gagal mengubah status pengguna:', e)
      throw e // Lemparkan kembali error agar bisa ditangani oleh komponen pemanggil
    }
  }

  // Watch for changes in filters and pagination to refetch data
  watch(
    [search, faculty, program, role, email_verified, accountStatus, sortBy, sortOrder, page, pageSize],
    () => {
      // Saat filter berubah, selalu kembali ke halaman 1, kecuali jika hanya 'page' yang berubah.
      if (page.value !== 1) {
        // This logic is tricky. A simpler way is to reset page on any filter change EXCEPT page itself.
        // For now, let's just refetch. The API will handle the page logic.
      }
      fetchUsers()
    },
    { deep: true } // deep watch for reactive objects if any
  )

  // Initial fetch
  onMounted(fetchUsers)
console.log(users);

  return {
    // Data & State
    isLoading,
    error,
    paginatedUsers: users, // Ganti nama untuk konsistensi dengan view
    totalItems,
    totalPages,

    // Filters & Sorting
    search,
    faculty,
    program,
    role,
    email_verified,
    accountStatus,
    sortBy,
    sortOrder,

    // Pagination
    page,
    pageSize,

    // Functions
    fetchUsers, // expose fetchUsers untuk refresh manual
    resetFilters,
    toggleUserStatus,

    // Summary & Options
    totalCount: computed(() => summary.value.total),
    verifiedCount: computed(() => summary.value.verified),
    activeCount: computed(() => summary.value.active),
    disabledCount: computed(() => summary.value.disabled),
    facultyOptions,
    programOptions,
  }
}