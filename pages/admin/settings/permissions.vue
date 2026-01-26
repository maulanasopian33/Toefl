<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-7xl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
        <div>
           <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                 <Icon name="lucide:key" class="w-6 h-6" />
              </div>
              <h1 class="text-3xl font-black tracking-tight text-slate-900">Manajemen Hak Akses</h1>
           </div>
           <p class="text-slate-500 font-medium">Kelola semua hak akses yang tersedia dalam sistem.</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button @click="openCreateModal" class="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-black text-white hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 transform active:scale-95">
            <Icon name="lucide:plus-circle" class="h-5 w-5" />
            Tambah Hak Akses
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden ring-1 ring-gray-900/5">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-24 flex flex-col items-center justify-center animate-pulse">
          <Icon name="lucide:loader-2" class="h-12 w-12 animate-spin text-gray-200 mb-4" />
          <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Memuat data hak akses...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-24 text-center flex flex-col items-center">
          <div class="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-50 text-rose-600 mb-6 ring-4 ring-rose-50/50">
            <Icon name="lucide:alert-circle" class="h-10 w-10" />
          </div>
          <h3 class="text-xl font-black text-slate-900">Gagal Memuat Data</h3>
          <p class="mt-2 text-slate-500 max-w-xs mx-auto font-medium">{{ error }}</p>
          <button @click="fetchPermissions" class="mt-8 px-6 py-2.5 bg-rose-100 text-rose-700 font-bold rounded-xl hover:bg-rose-200 transition-colors">Coba Lagi</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="permissions.length === 0" class="p-24 text-center flex flex-col items-center">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 text-slate-400 mb-6 border border-dashed border-gray-200">
                <Icon name="lucide:shield-off" class="h-10 w-10" />
            </div>
            <h3 class="text-xl font-black text-slate-900">Belum Ada Hak Akses</h3>
            <p class="mt-2 text-slate-500 font-medium">Mulai dengan menambahkan hak akses baru untuk sistem.</p>
            <button @click="openCreateModal" class="mt-8 px-6 py-3 bg-indigo-50 text-indigo-700 font-black rounded-2xl hover:bg-indigo-100 transition-all">Buat Sekarang</button>
        </div>

        <!-- Permissions Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th scope="col" class="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Hak Akses</th>
                <th scope="col" class="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Deskripsi</th>
                <th scope="col" class="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal Dibuat</th>
                <th scope="col" class="relative px-8 py-5">
                  <span class="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-50">
              <tr v-for="permission in permissions" :key="permission.id" class="hover:bg-indigo-50/30 transition-colors group">
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                     <div class="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                        <Icon name="lucide:lock" class="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                     </div>
                     <span class="text-sm font-black text-slate-900 font-mono tracking-tight">{{ permission.name }}</span>
                  </div>
                </td>
                <td class="px-8 py-5">
                  <div class="text-sm text-slate-500 font-medium line-clamp-1 max-w-sm">{{ permission.description || '-' }}</div>
                </td>
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="text-xs font-bold text-gray-400">{{ formatDateTime(permission.createdAt) }}</div>
                </td>
                <td class="px-8 py-5 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="openEditModal(permission)" class="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm">
                      <Icon name="lucide:pencil" class="h-4 w-4" />
                    </button>
                    <button @click="openDeleteConfirmation(permission)" class="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm">
                      <Icon name="lucide:trash-2" class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for Create/Edit Permission -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-[2.5rem] bg-white p-0 text-left align-middle shadow-2xl transition-all border border-gray-100 flex flex-col">
                <!-- Header -->
                <div class="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between flex-shrink-0">
                  <div class="flex items-center gap-3">
                     <div class="p-2 bg-indigo-100 rounded-xl">
                        <Icon :name="isEditing ? 'lucide:edit-3' : 'lucide:plus-circle'" class="w-6 h-6 text-indigo-600" />
                     </div>
                     <div>
                        <DialogTitle as="h3" class="text-xl font-extrabold text-gray-900">{{ isEditing ? 'Edit Izin' : 'Buat Izin Baru' }}</DialogTitle>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Gunakan format <span class="text-indigo-500 font-black">resource.action</span></p>
                     </div>
                  </div>
                  <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                    <Icon name="lucide:x" class="w-5 h-5" />
                  </button>
                </div>

                <!-- Content -->
                <div class="px-8 py-8 space-y-6">
                  <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Nama Hak Akses</label>
                    <input 
                      type="text" 
                      v-model="editablePermission.name" 
                      class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-indigo-600 font-mono text-sm shadow-inner" 
                      placeholder="e.g., user.create"
                    >
                  </div>
                  <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Deskripsi Fungsi</label>
                    <textarea 
                      v-model="editablePermission.description" 
                      rows="3" 
                      class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700 text-sm shadow-inner resize-none" 
                      placeholder="Jelaskan kegunaan hak akses ini..."
                    ></textarea>
                  </div>
                </div>

                <!-- Footer -->
                <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex justify-end gap-3 rounded-b-[2.5rem]">
                  <button @click="closeModal" class="px-6 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">Batal</button>
                  <button @click="savePermission" :disabled="isSaving" class="inline-flex justify-center items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3 text-sm font-black text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95 disabled:opacity-50">
                    <Icon v-if="isSaving" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
                    {{ isSaving ? 'Menyimpan...' : 'Simpan Izin' }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="!!permissionToDelete" as="template">
      <Dialog as="div" @close="permissionToDelete = null" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-center align-middle shadow-2xl transition-all border border-gray-100">
                <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-rose-50 text-rose-600 mb-6 ring-4 ring-rose-50/50">
                    <Icon name="lucide:trash-2" class="h-10 w-10" />
                </div>
                <DialogTitle as="h3" class="text-xl font-black text-slate-900 leading-tight">Hapus Izin?</DialogTitle>
                <p class="mt-3 text-sm text-slate-500 font-medium px-2">
                    Anda yakin ingin menghapus hak akses <span class="text-rose-600 font-black font-mono">"{{ permissionToDelete?.name }}"</span>? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div class="mt-8 flex flex-col gap-3">
                    <button @click="confirmDelete" :disabled="isDeleting" class="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all transform active:scale-95 disabled:opacity-50">
                        <Icon v-if="isDeleting" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
                        Ya, Hapus Izin
                    </button>
                    <button @click="permissionToDelete = null" class="w-full px-6 py-3.5 rounded-2xl bg-gray-50 text-gray-500 text-sm font-bold hover:bg-gray-100 transition-all">Batal</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  permission: 'user.manage_permissions'
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
    permissions.value = (response.data || []).sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
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
  if (!editablePermission.value.name) return showNotification('Nama hak akses wajib diisi', 'error');
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