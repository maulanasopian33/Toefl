<template>
  <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-800">Partisipasi</h3>
        <div class="flex items-center gap-4 mt-2">
          <div class="flex items-center text-gray-600">
            <Icon name="lucide:users" class="w-5 h-5 mr-2" />
            <span class="font-medium">{{ batch.participants?.length || 0 }} / {{ batch.max_participants }} Peserta</span>
          </div>
          <div class="w-px h-5 bg-gray-300"></div>
          <div class="text-sm text-gray-500">
            Minimal: {{ batch.min_participants || '-' }} peserta
          </div>
        </div>
      </div>

      {{ isRegistrationDisabled }}
      <button 
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isRegistrationDisabled"
      >
        <Icon :name="registrationIcon" class="w-5 h-5" />
        {{ registrationText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  batch: { type: Object, required: true }
})

const isRegistrationDisabled = computed(() => {
  const now = new Date();
  const open = props.batch.registration_open_at ? new Date(props.batch.registration_open_at) : null;
  const close = props.batch.registration_close_at ? new Date(props.batch.registration_close_at) : null;

  console.log(props.batch);
  
  console.log(now);
  console.log(open);
  console.log(close);

  console.log("status", props.batch.status !== 'OPEN');
  console.log("before open", open && now < open);
  console.log("after close", close && now > close);
  console.log("full", (props.batch.participants?.length || 0) >= props.batch.max_participants);
  
  if (props.batch.status !== 'OPEN') return true;
  if (open && now < open) return true;
  if (close && now > close) return true;
  if ((props.batch.participants?.length || 0) >= props.batch.max_participants) return true;
  
  return false;
});

const registrationText = computed(() => {
  const now = new Date();
  const open = props.batch.registration_open_at ? new Date(props.batch.registration_open_at) : null;

  if (props.batch.status === 'FULL' || (props.batch.participants?.length || 0) >= props.batch.max_participants) return 'Kuota Penuh';
  if (props.batch.status !== 'OPEN') return 'Pendaftaran Ditutup';
  if (open && now < open) return 'Segera Dibuka';
  
  return 'Daftar Sekarang';
});

const registrationIcon = computed(() => isRegistrationDisabled.value ? 'lucide:lock' : 'lucide:edit-3');
</script>