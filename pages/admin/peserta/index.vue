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
        @update:currentPage="p => page = p"
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
import { useNotification } from '@/composables/useNotification'

definePageMeta({
  title: 'Peserta - Admin Panel',
  layout: 'admin',
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

const { showNotification } = useNotification()

// Placeholder handlers – nanti sambungkan ke Firebase Admin API
const handleViewDetail = (user: User) => {
  console.log('View detail', user.uid)
}

const handleResetPassword = (user: User) => {
  console.log('Reset password', user.uid)
}

const handleToggleDisable = async (user: User) => {
  const actionText = user.disabled ? 'mengaktifkan' : 'menonaktifkan'
  const confirmed = confirm(`Apakah Anda yakin ingin ${actionText} akun ${user.name}?`)

  if (!confirmed) return

  try {
    await toggleUserStatus(user.uid, user.disabled)
    const successMessage = `Akun ${user.name} berhasil di${actionText}.`
    showNotification(successMessage, 'success')
  } catch (error: any) {
    showNotification(error.message || `Gagal ${actionText} akun.`, 'error')
  }
}
</script>

<style scoped>
.shadow-xs {
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}
</style>
