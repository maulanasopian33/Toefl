<template>
  <TransitionRoot appear :show="confirm.show" as="template">
    <Dialog as="div" @close="onCancel" class="relative z-50">
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
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                 <div class="p-1.5 bg-indigo-100 rounded-lg">
                    <Icon name="lucide:user-cog" class="w-5 h-5 text-indigo-600" />
                 </div>
                 {{ confirm.title }}
              </DialogTitle>
              
              <div class="space-y-6">
                 <div v-if="confirm.message" class="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-500 font-medium" v-html="confirm.message"></div>

                 <!-- Role Selection -->
                 <div class="space-y-3">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Pilih Peran Baru</p>
                    <div class="space-y-2">
                       <label 
                         v-for="role in confirm.availableRoles" 
                         :key="role" 
                         :for="`role-${role}`"
                         class="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-all duration-200 group hover:bg-white hover:border-indigo-200"
                         :class="{ 'ring-2 ring-indigo-500 border-indigo-200 bg-white ring-offset-0': selectedRole === role }"
                       >
                         <span class="font-bold text-gray-700 capitalize text-sm group-hover:text-indigo-600 transition-colors">{{ role }}</span>
                         <div class="relative flex items-center justify-center">
                            <input
                              :id="`role-${role}`"
                              v-model="selectedRole"
                              type="radio"
                              :value="role"
                              name="role-selection"
                              class="peer sr-only"
                            />
                            <div class="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-indigo-600 peer-checked:bg-white flex items-center justify-center transition-all">
                               <div class="w-2 h-2 rounded-full bg-indigo-600 scale-0 peer-checked:scale-100 transition-transform"></div>
                            </div>
                         </div>
                       </label>
                    </div>
                 </div>

                 <div class="mt-8 flex justify-end gap-3">
                    <button 
                      type="button" 
                      @click="onCancel"
                      class="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm"
                    >
                       Batal
                    </button>
                    <button 
                      type="button" 
                      class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center gap-2 text-sm disabled:opacity-50"
                      :disabled="!selectedRole || selectedRole === confirm.currentRole"
                      @click="onSelectRole(selectedRole!)"
                    >
                       Simpan Perubahan
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
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useNotificationPopup } from '@/composables/NotificationPopup'

const {
  roleSelector: confirm,
  onSelectRole,
  onCancelRoleSelection: onCancel,
} = useNotificationPopup()

const selectedRole = ref<string | null>(null)

// Reset local state when modal opens
watch(() => confirm.value.show, (isVisible) => {
  if (isVisible) {
    selectedRole.value = confirm.value.currentRole
  }
})
</script>