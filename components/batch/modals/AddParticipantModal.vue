<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75" @click.self="closeModal">
      <Transition name="modal-scale">
        <div v-if="modelValue" class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <form @submit.prevent="handleSave">
            <div class="bg-white px-6 pt-5 pb-6">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Icon name="lucide:user-plus" class="h-6 w-6 text-teal-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg font-semibold leading-6 text-gray-900">Tambah Peserta Baru</h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <input
                        type="text"
                        v-model="participant.name"
                        id="name"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700">Alamat Email</label>
                      <input
                        type="email"
                        v-model="participant.email"
                        id="email"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-2xl">
              <button
                type="submit"
                class="inline-flex w-full justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 sm:ml-3 sm:w-auto"
              >
                Simpan
              </button>
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                @click="closeModal"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'save']);

const participant = ref({
  name: '',
  email: '',
});

// Fungsi untuk menutup modal
const closeModal = () => {
  emit('update:modelValue', false);
};

// Fungsi untuk menangani penyimpanan
const handleSave = () => {
  // Validasi sederhana
  if (!participant.value.name.trim() || !participant.value.email.trim()) {
    alert('Nama dan Email tidak boleh kosong.');
    return;
  }

  // Kirim data baru ke parent, lalu tutup modal
  emit('save', { ...participant.value });
  closeModal();
  // Reset form
  participant.value = { name: '', email: '' };
};

// Menangani penutupan modal dengan tombol 'Escape'
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
};

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});
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

.modal-scale-enter-active {
  transition: all 0.3s ease-out;
}
.modal-scale-leave-active {
  transition: all 0.2s ease-in;
}
.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: translateY(1rem) scale(0.95);
}
</style>