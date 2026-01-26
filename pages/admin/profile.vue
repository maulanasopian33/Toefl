<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Profil Saya</h1>
        <p class="mt-1 text-slate-500">Informasi akun dan daftar hak akses yang Anda miliki.</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div class="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div class="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 overflow-hidden border-4 border-white shadow-sm">
             <img v-if="userdb?.picture" :src="userdb.picture" alt="Profile" class="h-full w-full object-cover" />
             <span v-else>{{ userInitials }}</span>
          </div>
          <div class="text-center sm:text-left">
            <h2 class="text-2xl font-bold text-slate-900">{{ userdb?.name || 'Pengguna' }}</h2>
            <p class="text-slate-500 font-medium">{{ userdb?.email }}</p>
            <div class="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
              <span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize">
                Role: {{ userdb?.role || 'User' }}
              </span>
              <span v-if="userdb?.email_verified" class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                Terverifikasi
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 class="text-base font-semibold leading-6 text-slate-900">Daftar Hak Akses (Permissions)</h3>
          <p class="mt-1 text-sm text-slate-500">Berikut adalah daftar izin yang diberikan kepada akun Anda berdasarkan role saat ini.</p>
        </div>
        
        <div class="p-6">
          <div v-if="permissions.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div v-for="(group, groupName) in groupedPermissions" :key="groupName" class="rounded-xl border border-slate-200 p-4">
                <h4 class="font-semibold text-slate-800 capitalize mb-3 flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-blue-500"></span>
                  {{ groupName }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="permission in group" :key="permission" class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {{ permission }}
                  </span>
                </div>
             </div>
          </div>
          
          <div v-else class="text-center py-12">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Icon name="lucide:lock" class="h-6 w-6 text-slate-400" />
            </div>
            <h3 class="text-sm font-semibold text-slate-900">Tidak Ada Hak Akses Khusus</h3>
            <p class="mt-1 text-sm text-slate-500">Akun Anda tidak memiliki permission tambahan yang terdaftar.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-check'],
  title: 'My Profile - Admin Panel',
  permission: "profile.view"
});

const { user, claims } = useAuth();
const { data: userdb } = await useUserMe();
const userInitials = computed(() => {
  const name = userdb.value?.name || '';
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

const permissions = computed(() => {
  // Mengambil permissions dari claims.
  // Struktur claims.permissions bisa berupa array string atau array object {name: string, ...}
  const perms = (claims.value as any).permissions || [];
  
  if (Array.isArray(perms) && perms.length > 0) {
    // Jika elemen pertama adalah object, ambil properti .name
    if (typeof perms[0] === 'object' && perms[0] !== null && 'name' in perms[0]) {
      return perms.map((p: any) => p.name);
    }
    // Jika string, kembalikan langsung
    return perms;
  }
  return [];
});

const groupedPermissions = computed(() => {
  const groups: Record<string, string[]> = {};
  
  permissions.value.forEach((permission: string) => {
    // Mengelompokkan berdasarkan prefix (misal: 'user.create' -> group 'user')
    const parts = permission.split('.');
    const groupName = parts.length > 1 ? parts[0] : 'Umum';
    
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(permission);
  });
  
  return groups;
});
</script>