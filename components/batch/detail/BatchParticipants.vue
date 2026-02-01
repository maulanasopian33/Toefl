<template>
  <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Daftar Peserta ({{ participants?.length || 0 }})</h3>
    <div v-if="!participants || participants.length === 0" class="text-center py-10 text-gray-500">
      <Icon name="lucide:user-x" class="w-10 h-10 mx-auto text-gray-400" />
      <p class="mt-2 text-sm">Belum ada peserta yang terdaftar.</p>
    </div>
    <div v-else-if="participants && participants.length > 0" class="mt-4 flex items-center">
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
  </div>
</template>

<script setup lang="ts">

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

const getAvatarUrl = (path : string) => {
  if (!path) return 'https://via.placeholder.com/40'; // Fallback avatar
  // Asumsi path adalah relatif, misal: /images/avatar/....png
  return path;
};
</script>