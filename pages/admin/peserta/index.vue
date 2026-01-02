<template>
  <section class="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
    <div class="mx-auto max-w-7xl space-y-6">
      <UsersHeader @sync="fetchUsers" />

      <UsersFilters
        v-model:search="search"
        v-model:faculty="faculty"
        v-model:program="program"
        v-model:role="role"
        v-model:emailVerified="emailVerified"
        v-model:accountStatus="accountStatus"
        v-model:sortBy="sortBy"
        :faculty-options="facultyOptions"
        :program-options="programOptions"
        @reset="resetFilters"
      />

      <UsersSummary
        :total-count="totalCount"
        :verified-count="verifiedCount"
        :active-count="activeCount"
        :disabled-count="disabledCount"
      />

      <UsersTable
        :users="paginatedUsers"
        :total-filtered="totalItems"
        :is-loading="isLoading"
        :current-page="page"
        :total-pages="totalPages"
        @view-detail="handleViewDetail"
        @reset-password="handleResetPassword"
        @toggle-disable="handleToggleDisable"
        @delete-user="handleDeleteUser"
        @change-role="handleChangeRole"
        
        @update:currentPage="p => page = p"
      />

      <UserDetailModal
        v-model="showDetailModal"
        :user="selectedUser"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUsers, type User } from '@/composables/useUsers'
import UsersHeader from '@/components/users/UsersHeader.vue'
import UsersFilters from '@/components/users/UsersFilters.vue'
import UsersSummary from '@/components/users/UsersSummary.vue'
import UsersTable from '@/components/users/UsersTable.vue'
import UserDetailModal from '@/components/users/UserDetailModal.vue'
import { useNotification } from '@/composables/useNotification'
import { useNotificationPopup } from '@/composables/NotificationPopup'
import { useUserDelete } from '@/composables/users/delete'
import { useUserChangeRole } from '@/composables/users/changeRole'

definePageMeta({
  title: 'Peserta - Admin Panel',
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  roles: ['admin'],
});

const {
  // ... (properti lain)
  isLoading,
  search,
  faculty,
  program,
  role,
  emailVerified,
  accountStatus,
  sortBy,
  page,
  fetchUsers,
  resetFilters,
  toggleUserStatus,
  totalPages,
  totalItems,
  paginatedUsers,
  totalCount,
  verifiedCount,
  activeCount,
  disabledCount,
  facultyOptions,
  programOptions,
} = useUsers()

const availableRoles = ref<string[]>([]);
const showDetailModal = ref(false);
const { showNotification } = useNotification()
const { showConfirm, showRoleSelector } = useNotificationPopup()

// Placeholder handlers – nanti sambungkan ke Firebase Admin API
const handleViewDetail = (user: User) => {
  selectedUser.value = user;
  showDetailModal.value = true;
}

const config = useRuntimeConfig();
const { $auth } = useNuxtApp();

const fetchAvailableRoles = async () => {
  try {
    const token = await $auth?.currentUser?.getIdToken();
    const response: any = await $fetch(`${config.public.API_URL}/rbac/roles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && Array.isArray(response.data)) {
      availableRoles.value = response.data.map((role: any) => role.name);
    }
  } catch (error) {
    console.error('Failed to fetch roles:', error);
    availableRoles.value = ['admin', 'user', 'proctor']; // Fallback
    showNotification('Gagal memuat daftar role dari server, menggunakan daftar default.', 'error');
  }
};

const handleResetPassword = (user: User) => {
  console.log('Reset password', user.uid)
}

const handleToggleDisable = async (user: User) => {
  const actionText = user.disabled ? 'mengaktifkan' : 'menonaktifkan'
  const confirmed = await showConfirm(
    `Pengguna "${user.name}" akan di${actionText}. Anda yakin?`,
    {
      title: `Konfirmasi ${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Akun`,
      confirmText: `Ya, ${actionText}`,
    }
  )

  if (!confirmed) return

  try {
    await toggleUserStatus(user.uid, user.disabled)
    const successMessage = `Akun ${user.name} berhasil di${actionText}.`
    showNotification(successMessage, 'success')
  } catch (error: any) {
    showNotification(error.message || `Gagal ${actionText} akun.`, 'error')
  }
}

const handleDeleteUser = async (user: User) => {
  const confirmed = await showConfirm(
    `Pengguna "${user.name}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`,
    {
      title: 'Hapus Pengguna Permanen?',
      type: 'danger',
      confirmText: 'Ya, Hapus Pengguna',
    }
  )

  if (!confirmed) return

  try {
    await useUserDelete(user.uid)
    showNotification(`Pengguna "${user.name}" berhasil dihapus.`, 'success')
    await fetchUsers() // Muat ulang data pengguna
  } catch (error: any) {
    console.error('Gagal menghapus pengguna:', error)
    showNotification(error.message || 'Terjadi kesalahan saat menghapus pengguna.', 'error')
  }
}

const handleChangeRole = async (user: User) => {
  // Daftar role yang tersedia
  if (availableRoles.value.length === 0) {
    // showNotification('Daftar role sedang dimuat, silakan coba sesaat lagi.', 'info');
    await fetchAvailableRoles();
    if(availableRoles.value.length === 0) return; // exit if still empty
  }

  const newRole = await showRoleSelector(
    `Pilih role baru untuk pengguna "${user.name}". Role saat ini adalah "${user.role}".`,
    user.role,
    availableRoles.value,
    { title: 'Ubah Role Pengguna' }
  );

  // Jika pengguna membatalkan atau tidak memilih role baru
  if (!newRole || newRole === user.role) {
    return;
  }

  try {
    await useUserChangeRole(user.uid, newRole);
    showNotification(`Role untuk ${user.name} berhasil diubah menjadi ${newRole}.`, 'success');
    await fetchUsers(); // Muat ulang data untuk menampilkan role baru
  } catch (error: any) {
    showNotification(error.message || 'Gagal mengubah role pengguna.', 'error');
  }
}

const closeModal = () => {
  showDetailModal.value = false;
}

const selectedUser = ref(null);

onMounted(() => {
  fetchAvailableRoles();
});


</script>









<style scoped>
.shadow-xs {
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}
</style>
