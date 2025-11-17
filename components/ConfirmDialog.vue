<template>
  <Transition name="modal-fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
      @click.self="handleCancel"
    >
      <div class="dialog-content bg-white rounded-xl shadow-xl max-w-sm w-full mx-4">
        <div class="p-6 text-center">
          <div
            v-if="styles.icon"
            :class="styles.bg"
            class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Icon :name="styles.icon" :class="styles.iconColor" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <p class="mt-2 text-sm text-gray-600">
            {{ message }}
          </p>
        </div>
        <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            type="button"
            class="btn-gray"
            @click="handleCancel"
          >
            Batal
          </button>
          <button
            type="button"
            :class="styles.buttonClass"
            @click="handleConfirm"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  message: String,
  title: {
    type: String,
    default: 'Konfirmasi Tindakan'
  },
  type: {
    type: String,
    default: 'info' // 'info', 'warning', 'danger'
  }
});

const styles = computed(() => {
  switch (props.type) {
    case 'warning':
    case 'danger':
      return {
        icon: 'lucide:alert-triangle',
        bg: 'bg-red-100',
        iconColor: 'text-red-600',
        buttonClass: 'btn-danger'
      };
    default: // info
      return {
        icon: 'lucide:info',
        bg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        buttonClass: 'btn-primary'
      };
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .dialog-content,
.modal-fade-leave-active .dialog-content {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-fade-enter-from .dialog-content,
.modal-fade-leave-to .dialog-content {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}
</style>