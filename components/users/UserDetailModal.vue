<template>
  <Transition name="modal-fade">
    <div v-if="modelValue && user" class="fixed inset-0 bg-black/60 !mt-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <header class="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 class="text-lg font-semibold text-gray-800">Detail Pengguna</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </header>

        <main class="flex-grow p-6 overflow-y-auto">
          <div class="flex items-center gap-4 mb-6">
            <template v-if="user.picture">
              <img :src="apiUrl + user.picture" alt="avatar" class="h-16 w-16 rounded-full object-cover border border-gray-200" />
            </template>
            <template v-else>
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-semibold text-indigo-600">
                {{ initials(user.name) }}
              </div>
            </template>
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ user.name }}</h3>
              <p class="text-sm text-gray-600">{{ user.email }}</p>
              <p class="text-xs text-gray-500">UID: {{ user.uid }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <!-- General Info -->
            <div>
              <h4 class="font-semibold text-gray-700 mb-2">Informasi Umum</h4>
              <dl class="space-y-1">
                <div class="flex justify-between">
                  <dt class="text-gray-500">Role:</dt>
                  <dd class="font-medium text-gray-800 capitalize">{{ user.role }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Dibuat Pada:</dt>
                  <dd class="font-medium text-gray-800">{{ formatDate(user.createdAt) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Terakhir Login:</dt>
                  <dd class="font-medium text-gray-800">{{ formatDate(user.lastLogin) || '-' }}</dd>
                </div>
              </dl>
            </div>

            <!-- Academic Info -->
            <div>
              <h4 class="font-semibold text-gray-700 mb-2">Data Akademik</h4>
              <dl class="space-y-1">
                <div class="flex justify-between">
                  <dt class="text-gray-500">NIM:</dt>
                  <dd class="font-medium text-gray-800">{{ user.detailuser?.nim || '-' }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Fakultas:</dt>
                  <dd class="font-medium text-gray-800">{{ user.detailuser?.fakultas || '-' }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Program Studi:</dt>
                  <dd class="font-medium text-gray-800">{{ user.detailuser?.prodi || '-' }}</dd>
                </div>
              </dl>
            </div>

            <!-- Status Info -->
            <div class="md:col-span-2">
              <h4 class="font-semibold text-gray-700 mb-2">Status</h4>
              <div class="flex flex-wrap items-center gap-2">
                <span :class="['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium', user.email_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700']">
                  <Icon :name="user.email_verified ? 'lucide:mail-check' : 'lucide:mail-question'" class="h-3.5 w-3.5" />
                  Email {{ user.email_verified ? 'Terverifikasi' : 'Belum Terverifikasi' }}
                </span>
                <span :class="['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium', user.disabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">
                  <Icon :name="user.disabled ? 'lucide:user-x' : 'lucide:user-check'" class="h-3.5 w-3.5" />
                  Akun {{ user.disabled ? 'Nonaktif' : 'Aktif' }}
                </span>
              </div>
            </div>
          </div>
        </main>

        <footer class="p-4 border-t border-gray-200 bg-gray-50 flex justify-end flex-shrink-0">
          <button @click="closeModal" class="btn-secondary">
            Tutup
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '@/composables/useUsers';

const props = defineProps<{
  modelValue: boolean;
  user: User | null;
}>();

const emit = defineEmits(['update:modelValue']);

const config = useRuntimeConfig();
const apiUrl = config.public.API_URL;

const closeModal = () => {
  emit('update:modelValue', false);
};

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
/* Optional: Add scale effect for content */
.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white {
  transition: transform 0.3s ease;
}
.modal-fade-enter-from .bg-white,
.modal-fade-leave-to .bg-white {
  transform: scale(0.95);
}
</style>