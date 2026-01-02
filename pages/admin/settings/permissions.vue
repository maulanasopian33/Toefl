<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-7xl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">Manajemen Hak Akses</h1>
          <p class="mt-1 text-slate-500">Kelola semua hak akses yang tersedia dalam sistem.</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button @click="openCreateModal" class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm">
            <Icon name="lucide:plus-circle" class="h-4 w-4" />
            Tambah Hak Akses
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-12 flex flex-col items-center justify-center">
          <Icon name="lucide:loader-2" class="h-10 w-10 animate-spin text-amber-600" />
          <p class="mt-4 text-slate-600 font-medium">Memuat data hak akses...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
            <Icon name="lucide:alert-circle" class="h-8 w-8" />
          </div>
          <h3 class="text-lg font-bold text-slate-900">Gagal Memuat Data</h3>
          <p class="mt-2 text-slate-500 max-w-xs mx-auto">{{ error }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="permissions.length === 0" class="p-12 text-center">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-4">
                <Icon name="lucide:shield-off" class="h-8 w-8" />
            </div>
            <h3 class="text-lg font-bold text-slate-900">Belum Ada Hak Akses</h3>
            <p class="mt-2 text-slate-500">Mulai dengan menambahkan hak akses baru.</p>
        </div>

        <!-- Permissions Table -->
        <table v-else class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Hak Akses</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Deskripsi</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal Dibuat</th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="permission in permissions" :key="permission.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-mono text-slate-900">{{ permission.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-500">{{ permission.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-500">{{ formatDateTime(permission.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openEditModal(permission)" class="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Icon name="lucide:pencil" class="h-4 w-4" />
                </button>
                <button @click="openDeleteConfirmation(permission)" class="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Create/Edit Permission -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" @click.self="closeModal">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div class="p-6 border-b border-slate-200">
          <h2 class="text-xl font-bold text-slate-900">{{ isEditing ? 'Edit Hak Akses' : 'Buat Hak Akses Baru' }}</h2>
          <p class="text-sm text-slate-500 mt-1">Gunakan format `resource.action`, contoh: `user.create`.</p>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label for="permission-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Hak Akses</label>
            <input type="text" id="permission-name" v-model="editablePermission.name" class="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono" placeholder="e.g., user.create">
          </div>
          <div>
            <label for="permission-description" class="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea id="permission-description" v-model="editablePermission.description" rows="3" class="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Deskripsi singkat tentang fungsi hak akses ini"></textarea>
          </div>
        </div>
        <div class="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
          <button @click="closeModal" class="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">Batal</button>
          <button @click="savePermission" :disabled="isSaving" class="inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50">
            <Icon v-if="isSaving" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
            {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="permissionToDelete" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" @click.self="permissionToDelete = null">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div class="p-6 text-center">
                <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
                    <Icon name="lucide:trash-2" class="h-8 w-8" />
                </div>
                <h3 class="text-lg font-bold text-slate-900">Hapus Hak Akses?</h3>
                <p class="mt-2 text-sm text-slate-500">
                    Anda yakin ingin menghapus hak akses <strong class="font-mono">{{ permissionToDelete.name }}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
            </div>
            <div class="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                <button @click="permissionToDelete = null" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">Batal</button>
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
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
});

const config = useRuntimeConfig();
const { $auth } = useNuxtApp();
const { showNotification } = useNotification();

// Data state
const permissions = ref<any[]>([]);
const isLoading = ref(true);
const error = ref('');

// Modal state
const isModalOpen = ref(false);
const isEditing = ref(false);
const editablePermission = ref<any>({});
const isSaving = ref(false);

// Delete confirmation state
const permissionToDelete = ref<any | null>(null);
const isDeleting = ref(false);

// API Fetching
const fetchPermissions = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const token = await $auth?.currentUser?.getIdToken();
    const response: any = await $fetch(`${config.public.API_URL}/rbac/permissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    permissions.value = response.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Error fetching permissions:", err);
    error.value = 'Gagal mengambil data hak akses dari server.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPermissions();
});

// Modal logic
const openCreateModal = () => {
  isEditing.value = false;
  editablePermission.value = { name: '', description: '' };
  isModalOpen.value = true;
};

const openEditModal = (permission: any) => {
  isEditing.value = true;
  editablePermission.value = { ...permission };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const savePermission = async () => {
  isSaving.value = true;
  try {
    const token = await $auth?.currentUser?.getIdToken();
    const payload = {
      name: editablePermission.value.name,
      description: editablePermission.value.description,
    };

    if (isEditing.value) {
      await $fetch(`${config.public.API_URL}/rbac/permissions/${editablePermission.value.id}`, {
        method: 'PUT',
        body: payload,
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Hak akses berhasil diperbarui.', 'success');
    } else {
      await $fetch(`${config.public.API_URL}/rbac/permissions`, {
        method: 'POST',
        body: payload,
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Hak akses baru berhasil dibuat.', 'success');
    }
    
    closeModal();
    fetchPermissions();
  } catch (err) {
    console.error("Error saving permission:", err);
    showNotification('Gagal menyimpan hak akses.', 'error');
  } finally {
    isSaving.value = false;
  }
};

// Delete logic
const openDeleteConfirmation = (permission: any) => {
    permissionToDelete.value = permission;
};

const confirmDelete = async () => {
    if (!permissionToDelete.value) return;
    isDeleting.value = true;
    try {
        const token = await $auth?.currentUser?.getIdToken();
        await $fetch(`${config.public.API_URL}/rbac/permissions/${permissionToDelete.value.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        showNotification(`Hak akses "${permissionToDelete.value.name}" berhasil dihapus.`, 'success');
        permissionToDelete.value = null;
        fetchPermissions();
    } catch (err) {
        console.error("Error deleting permission:", err);
        showNotification('Gagal menghapus hak akses.', 'error');
    } finally {
        isDeleting.value = false;
    }
};

// Helper function
const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}
</script>