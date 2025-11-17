<script setup lang="ts">
import { computed } from 'vue';
import { useNotification } from '@/composables/useNotification'; // Untuk Toast
import { useNotificationPopup } from '@/composables/NotificationPopup'; // Untuk Confirm Dialog
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const { show, message, type } = useNotification();
const styles = computed(() => {
  switch (type.value) {
    case 'success':
      return {
        icon: 'lucide:check-circle-2',
        bg: 'bg-green-50',
        border: 'border-green-300',
        iconColor: 'text-green-500',
        textColor: 'text-green-800',
        title: 'Berhasil'
      };
    case 'warning':
      return {
        icon: 'lucide:alert-triangle',
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        iconColor: 'text-yellow-500',
        textColor: 'text-yellow-800',
        title: 'Peringatan'
      };
    case 'error':
      return {
        icon: 'lucide:x-circle',
        bg: 'bg-red-50',
        border: 'border-red-300',
        iconColor: 'text-red-500',
        textColor: 'text-red-800',
        title: 'Terjadi Kesalahan'
      };
    default:
      return {};
  }
});

// Ambil state dan fungsi untuk dialog konfirmasi
const { confirm, onConfirm, onCancel } = useNotificationPopup();
</script>

<template>
  <div>
    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="show" :class="[styles.bg, styles.border]" class="fixed top-5 right-5 w-full max-w-sm p-4 border-l-4 rounded-lg shadow-xl z-[150]">
        <div class="flex items-start space-x-3">
          <Icon :name="styles.icon!" :class="styles.iconColor" size="24" class="flex-shrink-0 mt-0.5" />
          <div class="flex-grow">
            <h4 :class="styles.textColor" class="font-bold">{{ styles.title }}</h4>
            <p :class="styles.textColor" class="text-sm">{{ message }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      :model-value="confirm.show"
      :message="confirm.message"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.4s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>