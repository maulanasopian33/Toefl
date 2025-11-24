<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
    <div class="flex items-center gap-3">
      <Icon name="lucide:users" class="h-5 w-5 flex-shrink-0 text-gray-500" />
      <h3 class="text-lg font-semibold text-gray-800">
        Peserta Terdaftar ({{ participants.length }})
      </h3>
    </div>

    <div v-if="participants && participants.length > 0" class="mt-4 flex items-center">
      <div class="flex -space-x-2 overflow-hidden">
        <img
          v-for="participant in visibleParticipants"
          :key="participant.id"
          class="inline-block h-10 w-10 rounded-full ring-2 ring-white"
          :src="getAvatarUrl(participant.user.picture)"
          :alt="participant.user.name"
          :title="participant.user.name"
        />
      </div>
      <div v-if="remainingCount > 0" class="ml-2">
        <span class="text-sm font-medium text-gray-500">+{{ remainingCount }} lainnya</span>
      </div>
    </div>

    <div v-else class="mt-4 text-center text-gray-400 italic">
      <p>Belum ada peserta yang bergabung di batch ini.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  participants: {
    type: Array,
    default: () => []
  }
});

const config = useRuntimeConfig();
const MAX_VISIBLE = 8;

const visibleParticipants = computed(() => props.participants.slice(0, MAX_VISIBLE));
const remainingCount = computed(() => Math.max(0, props.participants.length - MAX_VISIBLE));

const getAvatarUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/40'; // Fallback avatar
  // Asumsi path adalah relatif, misal: /images/avatar/....png
  return `${config.public.API_URL.replace('/api/v1', '')}${path}`;
};
</script>