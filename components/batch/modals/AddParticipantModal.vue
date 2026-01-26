<template>
  <TransitionRoot appear :show="modelValue" as="template">
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
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                 <div class="p-1.5 bg-emerald-100 rounded-lg">
                    <Icon name="lucide:user-plus" class="w-5 h-5 text-emerald-600" />
                 </div>
                 Tambah Peserta Baru
              </DialogTitle>
              
              <form @submit.prevent="handleSave" class="space-y-4">
                 <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Nama Lengkap</label>
                    <input 
                      type="text" 
                      v-model="participant.name" 
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 text-sm"
                      placeholder="John Doe"
                      required
                    />
                 </div>
                 
                 <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Alamat Email</label>
                    <input 
                      type="email" 
                      v-model="participant.email" 
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 text-sm"
                      placeholder="john.doe@example.com"
                      required
                    />
                 </div>

                 <div class="mt-8 flex justify-end gap-3">
                    <button 
                      type="button" 
                      @click="closeModal"
                      class="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm"
                    >
                       Batal
                    </button>
                    <button 
                      type="submit" 
                      class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95 flex items-center gap-2 text-sm"
                    >
                       Simpan Peserta
                    </button>
                 </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'save']);

const participant = ref({
  name: '',
  email: '',
});

const closeModal = () => {
  emit('update:modelValue', false);
};

const handleSave = () => {
  if (!participant.value.name.trim() || !participant.value.email.trim()) {
    return;
  }

  emit('save', { ...participant.value });
  closeModal();
  participant.value = { name: '', email: '' };
};
</script>