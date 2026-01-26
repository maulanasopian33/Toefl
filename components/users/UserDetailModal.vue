<template>
  <TransitionRoot appear :show="modelValue && !!user" as="template">
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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-[2rem] bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
              <DialogTitle as="h3" class="text-lg font-extrabold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                 <div class="p-1.5 bg-indigo-100 rounded-lg">
                    <Icon name="lucide:user" class="w-5 h-5 text-indigo-600" />
                 </div>
                 Detail Pengguna
              </DialogTitle>
              
              <div v-if="user" class="space-y-8">
                 <!-- Profile Header -->
                 <div class="flex items-center gap-6 p-6 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
                    <div class="relative">
                       <template v-if="user.picture">
                         <img :src="apiUrl + user.picture" alt="avatar" class="h-20 w-20 rounded-2xl object-cover ring-4 ring-white shadow-sm" />
                       </template>
                       <template v-else>
                         <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-black text-indigo-600 ring-4 ring-white shadow-sm">
                           {{ initials(user.name) }}
                         </div>
                       </template>
                       <div class="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-xl shadow-sm border border-gray-100 ring-1 ring-gray-900/5">
                          <Icon :name="user.disabled ? 'lucide:user-x' : 'lucide:user-check'" class="w-4 h-4" :class="user.disabled ? 'text-rose-500' : 'text-emerald-500'" />
                       </div>
                    </div>
                    <div class="flex-1 min-w-0">
                       <h4 class="text-xl font-black text-gray-900 truncate">{{ user.name }}</h4>
                       <div class="flex items-center gap-2 mt-1">
                          <span class="text-xs font-bold text-gray-500">{{ user.email }}</span>
                          <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">UID: {{ user.uid }}</span>
                       </div>
                       <div class="flex items-center gap-2 mt-3">
                          <span class="inline-flex px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                             {{ user.role }}
                          </span>
                          <span :class="['inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border', user.email_verified ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100']">
                             <Icon :name="user.email_verified ? 'lucide:mail-check' : 'lucide:mail-question'" class="h-3 w-3" />
                             {{ user.email_verified ? 'Verified' : 'Unverified' }}
                          </span>
                       </div>
                    </div>
                 </div>

                 <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- General Info -->
                    <div class="space-y-4">
                       <h5 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Informasi Akun</h5>
                       <div class="bg-gray-50/50 rounded-[1.5rem] border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                          <div class="px-5 py-3.5 flex justify-between items-center group/item hover:bg-white transition-colors">
                             <dt class="text-xs font-bold text-gray-500">Dibuat Pada</dt>
                             <dd class="text-xs font-black text-gray-800">{{ formatDate(user.createdAt) }}</dd>
                          </div>
                          <div class="px-5 py-3.5 flex justify-between items-center group/item hover:bg-white transition-colors">
                             <dt class="text-xs font-bold text-gray-500">Terakhir Login</dt>
                             <dd class="text-xs font-black text-gray-800">{{ formatDate(user.lastLogin) || 'Never' }}</dd>
                          </div>
                       </div>
                    </div>

                    <!-- Academic Info -->
                    <div class="space-y-4">
                       <h5 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Data Akademik</h5>
                       <div class="bg-gray-50/50 rounded-[1.5rem] border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                          <div class="px-5 py-3.5 flex justify-between items-center group/item hover:bg-white transition-colors">
                             <dt class="text-xs font-bold text-gray-500">NIM</dt>
                             <dd class="text-xs font-black text-gray-800">{{ user.detailuser?.nim || '-' }}</dd>
                          </div>
                          <div class="px-5 py-3.5 flex justify-between items-center group/item hover:bg-white transition-colors">
                             <dt class="text-xs font-bold text-gray-500">Program Studi</dt>
                             <dd class="text-xs font-black text-gray-800 text-right">{{ user.detailuser?.prodi || '-' }}</dd>
                          </div>
                          <div class="px-5 py-3.5 flex justify-between items-center group/item hover:bg-white transition-colors">
                             <dt class="text-xs font-bold text-gray-500">Fakultas</dt>
                             <dd class="text-xs font-black text-gray-800">{{ user.detailuser?.fakultas || '-' }}</dd>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div class="mt-8 flex justify-end">
                    <button 
                      type="button" 
                      @click="closeModal"
                      class="px-8 py-3 rounded-2xl bg-gray-900 text-white font-black shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all transform active:scale-95 text-sm"
                    >
                       Tutup Detail
                    </button>
                 </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
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
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>