<template>
  <Transition name="modal-fade">
    <div v-if="confirm.show" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 p-4" @click.self="onCancel">
      <div class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all">
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10 ring-4 ring-indigo-50">
              <Icon name="lucide:user-cog" class="h-6 w-6 text-indigo-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900">{{ confirm.title }}</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500" v-html="confirm.message"></p>
              </div>

              <!-- Role Selection -->
              <div class="mt-5 space-y-3">
                <label v-for="role in confirm.availableRoles" :key="role" :for="`role-${role}`"
                  class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:ring-2 has-[:checked]:ring-indigo-200"
                >
                  <span class="font-medium text-slate-800 capitalize">{{ role }}</span>
                  <input
                    :id="`role-${role}`"
                    v-model="selectedRole"
                    type="radio"
                    :value="role"
                    name="role-selection"
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </label>
              </div>

            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50"
            :disabled="!selectedRole || selectedRole === confirm.currentRole"
            @click="onSelectRole(selectedRole!)"
          >
            Simpan Perubahan
          </button>
          <button
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            @click="onCancel"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .transform {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-fade-leave-active .transform {
  transition: all 0.2s ease-in-out;
}
.modal-fade-enter-from .transform, .modal-fade-leave-to .transform {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}
</style>