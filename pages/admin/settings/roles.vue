<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-7xl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">Manajemen Role & Hak Akses</h1>
          <p class="mt-1 text-slate-500">Atur peran pengguna dan izin akses untuk setiap fitur dalam aplikasi.</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button @click="openCreateModal" class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm">
            <Icon name="lucide:plus-circle" class="h-4 w-4" />
            Tambah Role Baru
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <Icon name="lucide:loader-2" class="h-10 w-10 animate-spin text-amber-600" />
        <p class="mt-4 text-slate-600 font-medium">Memuat data role...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-2xl bg-white p-8 text-center shadow-sm border border-rose-100">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
          <Icon name="lucide:alert-circle" class="h-8 w-8" />
        </div>
        <h3 class="text-lg font-bold text-slate-900">Gagal Memuat Data</h3>
        <p class="mt-2 text-slate-500 max-w-xs mx-auto">{{ error }}</p>
      </div>

      <!-- Content Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="role in roles" :key="role.id" class="rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-bold text-slate-900">{{ role.name }}</h3>
                <p class="text-sm text-slate-500 mt-1">{{ role.description }}</p>
              </div>
              <div class="flex-shrink-0">
                <button @click="openEditModal(role)" class="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Icon name="lucide:pencil" class="h-4 w-4" />
                </button>
                <button @click="openDeleteConfirmation(role)" class="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div class="px-6 pt-2 pb-6 border-t border-slate-100 flex-grow">
            <h4 class="text-xs font-semibold uppercase text-slate-400 mb-3">Hak Akses</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="permission in role.permissions" :key="permission.id" class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {{ permission.name }}
              </span>
              <span v-if="!role.permissions || role.permissions.length === 0" class="text-xs text-slate-400 italic">
                Belum ada hak akses.
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal for Create/Edit Role -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" @click.self="closeModal">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div class="p-6 border-b border-slate-200">
          <h2 class="text-xl font-bold text-slate-900">{{ isEditing ? 'Edit Role' : 'Buat Role Baru' }}</h2>
          <p class="text-sm text-slate-500 mt-1">Isi detail role dan pilih hak akses yang sesuai.</p>
        </div>
        <div class="p-6 space-y-6 overflow-y-auto">
          <div>
            <label for="role-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Role</label>
            <input type="text" id="role-name" v-model="editableRole.name" class="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="e.g., Operator">
          </div>
          <div>
            <label for="role-description" class="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea id="role-description" v-model="editableRole.description" rows="2" class="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Deskripsi singkat tentang peran ini"></textarea>
          </div>
          <div>
            <h3 class="text-base font-semibold text-slate-800 mb-3">Pilih Hak Akses</h3>
            <div class="space-y-4">
              <div v-for="(group, groupName) in groupedPermissions" :key="groupName" class="p-4 border border-slate-200 rounded-xl">
                <h4 class="font-semibold text-slate-700 capitalize mb-3">{{ groupName }}</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                  <div v-for="permission in group" :key="permission.id" class="relative flex items-start">
                    <div class="flex h-6 items-center">
                      <input :id="`permission-${permission.id}`" :value="permission.id" v-model="selectedPermissions" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600">
                    </div>
                    <div class="ml-3 text-sm leading-6">
                      <label :for="`permission-${permission.id}`" class="font-medium text-slate-900">{{ permission.name }}</label>
                      <p class="text-slate-500 text-xs">{{ permission.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
          <button @click="closeModal" class="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">Batal</button>
          <button @click="saveRole" :disabled="isSaving" class="inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50">
            <Icon v-if="isSaving" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
            {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="roleToDelete" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" @click.self="roleToDelete = null">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div class="p-6 text-center">
                <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
                    <Icon name="lucide:trash-2" class="h-8 w-8" />
                </div>
                <h3 class="text-lg font-bold text-slate-900">Hapus Role?</h3>
                <p class="mt-2 text-sm text-slate-500">
                    Anda yakin ingin menghapus role <strong>{{ roleToDelete.name }}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
            </div>
            <div class="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                <button @click="roleToDelete = null" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">Batal</button>
                <button @click="confirmDelete" :disabled="isDeleting" class="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50">
                    <Icon v-if="isDeleting" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
                    Ya, Hapus
                </button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'user.manage_role'
});

const config = useRuntimeConfig();
const { $auth } = useNuxtApp();
const { showNotification } = useNotification();

// Data state
const roles = ref<any[]>([]);
const allPermissions = ref<any[]>([]);
const isLoading = ref(true);
const error = ref('');

// Modal state
const isModalOpen = ref(false);
const isEditing = ref(false);
const editableRole = ref<any>({});
const selectedPermissions = ref<number[]>([]);
const isSaving = ref(false);

// Delete confirmation state
const roleToDelete = ref<any | null>(null);
const isDeleting = ref(false);

// API Fetching
const fetchRoles = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const token = await $auth?.currentUser?.getIdToken();
    const response: any = await $fetch(`${config.public.API_URL}/rbac/roles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    roles.value = response.data;
  } catch (err) {
    console.error("Error fetching roles:", err);
    error.value = 'Gagal mengambil data roles dari server.';
  } finally {
    isLoading.value = false;
  }
};

const fetchPermissions = async () => {
  try {
    const token = await $auth?.currentUser?.getIdToken();
    const response: any = await $fetch(`${config.public.API_URL}/rbac/permissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    allPermissions.value = response.data;
  } catch (err) {
    console.error("Error fetching permissions:", err);
    showNotification('Gagal memuat daftar hak akses.', 'error');
  }
};

onMounted(() => {
  fetchRoles();
  fetchPermissions();
});

// Computed for grouping permissions
const groupedPermissions = computed(() => {
  return allPermissions.value.reduce((acc, permission) => {
    const groupName = permission.name.split('.')[0] || 'lainnya';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(permission);
    return acc;
  }, {} as Record<string, any[]>);
});

// Modal logic
const openCreateModal = () => {
  isEditing.value = false;
  editableRole.value = { name: '', description: '' };
  selectedPermissions.value = [];
  isModalOpen.value = true;
};

const openEditModal = (role: any) => {
  isEditing.value = true;
  editableRole.value = { ...role };
  selectedPermissions.value = role.permissions.map((p: any) => p.id);
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveRole = async () => {
  isSaving.value = true;
  try {
    const token = await $auth?.currentUser?.getIdToken();
    const payload = {
      name: editableRole.value.name,
      description: editableRole.value.description,
      permissions: selectedPermissions.value,
    };

    if (isEditing.value) {
      // Update
      await $fetch(`${config.public.API_URL}/rbac/roles/${editableRole.value.id}`, {
        method: 'PUT',
        body: payload,
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Role berhasil diperbarui.', 'success');
    } else {
      // Create
      await $fetch(`${config.public.API_URL}/rbac/roles`, {
        method: 'POST',
        body: payload,
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Role baru berhasil dibuat.', 'success');
    }
    
    closeModal();
    fetchRoles(); // Refresh data
  } catch (err) {
    console.error("Error saving role:", err);
    showNotification('Gagal menyimpan role.', 'error');
  } finally {
    isSaving.value = false;
  }
};

// Delete logic
const openDeleteConfirmation = (role: any) => {
    roleToDelete.value = role;
};

const confirmDelete = async () => {
    if (!roleToDelete.value) return;
    isDeleting.value = true;
    try {
        const token = await $auth?.currentUser?.getIdToken();
        await $fetch(`${config.public.API_URL}/rbac/roles/${roleToDelete.value.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        showNotification(`Role "${roleToDelete.value.name}" berhasil dihapus.`, 'success');
        roleToDelete.value = null;
        fetchRoles(); // Refresh data
    } catch (err) {
        console.error("Error deleting role:", err);
        showNotification('Gagal menghapus role.', 'error');
    } finally {
        isDeleting.value = false;
    }
};

</script>

<style scoped>
/* Custom scrollbar for modal content */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>