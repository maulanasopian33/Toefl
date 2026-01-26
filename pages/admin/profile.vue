<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-4xl space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Profil Saya</h1>
          <p class="mt-1 text-slate-500 font-medium">Informasi akun dan daftar hak akses yang Anda miliki.</p>
        </div>
        <div class="flex items-center gap-2 text-sm font-medium text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Icon name="lucide:shield-check" class="w-4 h-4 text-emerald-500" />
          <span>Status Akun Aktif</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Side: Avatar & Core Info -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden transform transition-all hover:scale-[1.02]">
            <div class="p-8 flex flex-col items-center text-center">
              <div class="relative group">
                <div class="h-32 w-32 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400 overflow-hidden border-4 border-white shadow-lg group-hover:border-blue-50 transition-all">
                  <img v-if="userdb?.picture" :src="userdb.picture" alt="Profile" class="h-full w-full object-cover transition-transform group-hover:scale-110" />
                  <span v-else>{{ userInitials }}</span>
                </div>
                <div v-if="userdb?.email_verified" class="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white shadow-lg">
                  <Icon name="lucide:check" class="w-4 h-4" />
                </div>
              </div>
              <h2 class="mt-6 text-2xl font-bold text-slate-900 leading-tight">{{ userdb?.name || 'Pengguna' }}</h2>
              <p class="text-slate-500 font-medium text-sm mt-1">{{ userdb?.email }}</p>
              <div class="mt-4 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase tracking-wider">
                {{ userdb?.role || 'User' }}
              </div>
            </div>
            <div class="border-t border-slate-100 bg-slate-50/50 p-6 space-y-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-400 font-medium">Member Since</span>
                <span class="text-slate-700 font-bold">{{ formatDate(userdb?.createdAt) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-400 font-medium">Last Login</span>
                <span class="text-slate-700 font-bold text-xs">{{ formatDateTime(userdb?.lastLogin) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Detailed Data & Permissions -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Academic Data -->
          <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden ring-1 ring-gray-900/5">
            <div class="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-xl">
                <Icon name="lucide:graduation-cap" class="w-5 h-5 text-blue-600" />
              </div>
              <h3 class="text-lg font-extrabold text-slate-900">Data Akademik</h3>
            </div>
            <div class="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div class="space-y-1">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nomor Induk (NIM)</p>
                <p class="text-slate-900 font-bold flex items-center gap-2">
                  {{ userdb?.detailuser?.nim || '-' }}
                  <Icon v-if="!userdb?.detailuser?.nim" name="lucide:alert-circle" class="w-3.5 h-3.5 text-amber-500" />
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program Studi</p>
                <p class="text-slate-900 font-bold uppercase tracking-tight">{{ userdb?.detailuser?.prodi || '-' }}</p>
              </div>
              <div class="sm:col-span-2 space-y-1 border-t border-slate-50 pt-4">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fakultas / Instansi</p>
                <p class="text-slate-900 font-bold uppercase tracking-tight">{{ userdb?.detailuser?.fakultas || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Permissions Section -->
          <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden ring-1 ring-gray-900/5">
            <div class="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-indigo-100 rounded-xl">
                  <Icon name="lucide:key" class="w-5 h-5 text-indigo-600" />
                </div>
                <h3 class="text-lg font-extrabold text-slate-900">Hak Akses (Permissions)</h3>
              </div>
              <span class="px-3 py-1 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-lg uppercase">
                Total: {{ permissions.length }}
              </span>
            </div>
            
            <div class="p-8">
              <div v-if="permissions.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div v-for="(group, groupName) in groupedPermissions" :key="groupName" class="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 space-y-4">
                    <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between">
                      {{ groupName }}
                      <Icon name="lucide:layers" class="w-3.5 h-3.5 opacity-30" />
                    </h4>
                    <div class="flex flex-wrap gap-1.5 text-left">
                      <span v-for="permission in group" :key="permission" class="inline-flex items-center rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600 shadow-sm">
                        {{ permission.split('.')[1] || permission }}
                      </span>
                    </div>
                 </div>
              </div>
              
              <div v-else class="text-center py-12">
                <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 border border-slate-100 mb-4">
                  <Icon name="lucide:lock" class="h-8 w-8 text-slate-300" />
                </div>
                <h3 class="text-base font-bold text-slate-900">Tidak Ada Hak Akses Khusus</h3>
                <p class="mt-1 text-sm text-slate-500 font-medium">Akun Anda tidak memiliki permission tambahan.</p>
              </div>
            </div>
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

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateTime = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleTimeString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const permissions = computed(() => {
  const perms = (claims.value as any).permissions || [];
  if (Array.isArray(perms) && perms.length > 0) {
    if (typeof perms[0] === 'object' && perms[0] !== null && 'name' in perms[0]) {
      return perms.map((p: any) => p.name);
    }
    return perms;
  }
  return [];
});

const groupedPermissions = computed(() => {
  const groups: Record<string, string[]> = {};
  permissions.value.forEach((permission: string) => {
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