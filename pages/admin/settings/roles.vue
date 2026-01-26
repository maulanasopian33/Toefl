<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-7xl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
           <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">
                 <Icon name="lucide:shield-check" class="w-6 h-6" />
              </div>
              <h1 class="text-3xl font-black tracking-tight text-slate-900">Role & Hak Akses</h1>
           </div>
           <p class="text-slate-500 font-medium">Atur peran pengguna dan izin akses untuk setiap fitur dalam aplikasi.</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button @click="openCreateModal" class="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-black text-white hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 transform active:scale-95">
            <Icon name="lucide:plus-circle" class="h-5 w-5" />
            Tambah Role Baru
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse">
        <Icon name="lucide:loader-2" class="h-12 w-12 animate-spin text-gray-200 mb-4" />
        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Memuat data role...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-[2.5rem] bg-white p-12 text-center shadow-xl border border-rose-100 flex flex-col items-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-50 text-rose-600 mb-6 ring-4 ring-rose-50/50">
          <Icon name="lucide:alert-circle" class="h-10 w-10" />
        </div>
        <h3 class="text-xl font-black text-slate-900">Gagal Memuat Data</h3>
        <p class="mt-2 text-slate-500 max-w-xs mx-auto font-medium">{{ error }}</p>
        <button @click="fetchRoles" class="mt-8 px-6 py-2.5 bg-rose-100 text-rose-700 font-bold rounded-xl hover:bg-rose-200 transition-colors">Coba Lagi</button>
      </div>

      <!-- Content Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="role in roles" :key="role.id" class="group rounded-[2.5rem] bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1 border border-slate-100 flex flex-col transition-all duration-300 overflow-hidden ring-1 ring-gray-900/5">
          <div class="p-8">
            <div class="flex justify-between items-start mb-6">
              <div class="bg-gray-50 p-3 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                 <Icon name="lucide:users" class="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
              </div>
              <div class="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openEditModal(role)" class="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  <Icon name="lucide:pencil" class="h-4 w-4" />
                </button>
                <button @click="openDeleteConfirmation(role)" class="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <h3 class="text-xl font-black text-slate-900 mb-1">{{ role.name }}</h3>
            <p class="text-sm text-slate-500 font-medium line-clamp-2 min-h-[2.5rem]">{{ role.description || "Tidak ada deskripsi." }}</p>
          </div>

          <div class="px-8 py-6 bg-gray-50/50 border-t border-slate-50 flex-grow">
            <div class="flex items-center justify-between mb-4">
               <h4 class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Hak Akses</h4>
               <span class="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100/50">{{ role.permissions?.length || 0 }} Izin</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="permission in role.permissions?.slice(0, 6)" :key="permission.id" class="inline-flex items-center gap-1.5 rounded-xl bg-white border border-gray-100 px-3 py-1.5 text-[10px] font-bold text-gray-600 shadow-sm">
                {{ permission.name }}
              </span>
              <span v-if="role.permissions?.length > 6" class="inline-flex items-center rounded-xl bg-gray-100 px-3 py-1.5 text-[10px] font-bold text-gray-400">
                +{{ role.permissions.length - 6 }} Lainnya
              </span>
              <span v-if="!role.permissions || role.permissions.length === 0" class="text-xs text-gray-400 font-medium italic">
                Belum ada hak akses.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Create/Edit Role -->
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
              <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-[2.5rem] bg-white text-left align-middle shadow-2xl transition-all border border-gray-100 flex flex-col max-h-[90vh]">
                <!-- Header -->
                <div class="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between flex-shrink-0">
                  <div class="flex items-center gap-3">
                     <div class="p-2 bg-indigo-100 rounded-xl">
                        <Icon :name="isEditing ? 'lucide:edit-3' : 'lucide:plus-circle'" class="w-6 h-6 text-indigo-600" />
                     </div>
                     <div>
                        <DialogTitle as="h3" class="text-xl font-extrabold text-gray-900">{{ isEditing ? 'Edit Peran' : 'Buat Peran Baru' }}</DialogTitle>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Konfigurasi struktur hak akses</p>
                     </div>
                  </div>
                  <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                    <Icon name="lucide:x" class="w-5 h-5" />
                  </button>
                </div>

                <!-- Content -->
                <div class="px-8 py-8 space-y-8 overflow-y-auto custom-scrollbar">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div class="space-y-2">
                       <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Nama Role</label>
                       <input 
                         type="text" 
                         v-model="editableRole.name" 
                         class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700 text-sm shadow-inner" 
                         placeholder="e.g., Operator"
                       >
                     </div>
                     <div class="space-y-2">
                       <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Deskripsi Singkat</label>
                       <textarea 
                         v-model="editableRole.description" 
                         rows="1" 
                         class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700 text-sm shadow-inner resize-none" 
                         placeholder="Tujuan peran ini..."
                       ></textarea>
                     </div>
                  </div>

                  <div class="space-y-6">
                    <div class="flex items-center justify-between border-b border-gray-50 pb-4">
                       <div class="flex items-center gap-2">
                          <Icon name="lucide:shield-check" class="w-5 h-5 text-indigo-500" />
                          <h4 class="text-xs font-black text-gray-800 uppercase tracking-wider">Pilih Hak Akses</h4>
                       </div>
                       <div class="text-[10px] font-bold text-gray-400 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 italic">
                          Tandai kotak di bawah untuk mengaktifkan izin
                       </div>
                    </div>

                    <div class="grid grid-cols-1 gap-6">
                      <div v-for="(group, groupName) in groupedPermissions" :key="groupName" class="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 group/group transition-all hover:bg-white hover:shadow-lg hover:shadow-gray-100 hover:border-indigo-100">
                        <div class="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
                           <div class="w-2 h-2 rounded-full bg-indigo-500 group-hover/group:animate-ping"></div>
                           <h5 class="text-xs font-black text-gray-700 uppercase tracking-widest">{{ groupName }}</h5>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          <label v-for="permission in group" :key="permission.id" class="relative group/perm cursor-pointer">
                            <input 
                              type="checkbox" 
                              :value="permission.id" 
                              v-model="selectedPermissions" 
                              class="peer sr-only"
                            >
                            <div class="p-4 rounded-2xl bg-white border border-gray-100 transition-all peer-checked:bg-indigo-600 peer-checked:border-indigo-600 peer-checked:shadow-lg peer-checked:shadow-indigo-100 group-hover/perm:border-indigo-200">
                               <div class="flex items-start justify-between mb-2">
                                  <span class="text-[10px] font-black uppercase tracking-tight text-gray-400 transition-colors peer-checked:text-indigo-200" :class="selectedPermissions.includes(permission.id) ? 'text-indigo-200' : 'text-gray-400'">{{ permission.name.split('.')[1] || permission.name }}</span>
                                  <div class="w-4 h-4 rounded-md border-2 transition-all flex items-center justify-center" :class="selectedPermissions.includes(permission.id) ? 'bg-white border-white' : 'bg-gray-50 border-gray-200 group-hover/perm:border-indigo-300'">
                                     <Icon v-if="selectedPermissions.includes(permission.id)" name="lucide:check" class="w-3 h-3 text-indigo-600" />
                                  </div>
                               </div>
                               <h6 class="text-xs font-bold text-gray-800 transition-colors" :class="selectedPermissions.includes(permission.id) ? 'text-white' : 'text-gray-800'">{{ permission.description || "Aktifkan modul ini" }}</h6>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex justify-end gap-3 flex-shrink-0">
                  <button @click="closeModal" class="px-6 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">Batal</button>
                  <button @click="saveRole" :disabled="isSaving" class="inline-flex justify-center items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3 text-sm font-black text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95 disabled:opacity-50">
                    <Icon v-if="isSaving" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
                    {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="!!roleToDelete" as="template">
      <Dialog as="div" @close="roleToDelete = null" class="relative z-50">
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
              <DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-[2rem] bg-white p-8 text-center align-middle shadow-2xl transition-all border border-gray-100">
                <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-rose-50 text-rose-600 mb-6 ring-4 ring-rose-50/50">
                    <Icon name="lucide:trash-2" class="h-10 w-10" />
                </div>
                <DialogTitle as="h3" class="text-xl font-black text-slate-900 leading-tight">Hapus Role?</DialogTitle>
                <p class="mt-3 text-sm text-slate-500 font-medium px-2">
                    Anda yakin ingin menghapus role <span class="text-slate-900 font-black">"{{ roleToDelete?.name }}"</span>? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div class="mt-8 flex flex-col gap-3">
                    <button @click="confirmDelete" :disabled="isDeleting" class="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all transform active:scale-95 disabled:opacity-50">
                        <Icon v-if="isDeleting" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
                        Ya, Hapus Role
                    </button>
                    <button @click="roleToDelete = null" class="w-full px-6 py-3.5 rounded-2xl bg-gray-50 text-gray-500 text-sm font-bold hover:bg-gray-100 transition-all">Batal</button>
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
import { ref, onMounted, computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

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
  if (!allPermissions.value) return {};
  return allPermissions.value.reduce((acc, permission) => {
    const groupName = (permission.name || '').split('.')[0] || 'lainnya';
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
  selectedPermissions.value = (role.permissions || []).map((p: any) => p.id);
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveRole = async () => {
  if (!editableRole.value.name) return showNotification('Nama role wajib diisi', 'error');
  isSaving.value = true;
  try {
    const token = await $auth?.currentUser?.getIdToken();
    const payload = {
      name: editableRole.value.name,
      description: editableRole.value.description,
      permissions: selectedPermissions.value,
    };

    if (isEditing.value) {
      await $fetch(`${config.public.API_URL}/rbac/roles/${editableRole.value.id}`, {
        method: 'PUT',
        body: payload,
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Role berhasil diperbarui.', 'success');
    } else {
      await $fetch(`${config.public.API_URL}/rbac/roles`, {
        method: 'POST',
        body: payload,
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Role baru berhasil dibuat.', 'success');
    }
    
    closeModal();
    fetchRoles();
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
        fetchRoles();
    } catch (err) {
        console.error("Error deleting role:", err);
        showNotification('Gagal menghapus role.', 'error');
    } finally {
        isDeleting.value = false;
    }
};

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}
</style>