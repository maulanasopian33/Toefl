<template>
  <div class="card mb-6">
    <h3 class="text-xl font-bold text-gray-800 mb-4">
      Peserta yang Sudah Bergabung (<span>{{ participants.length }}</span>)
    </h3>
    <div v-if="participants.length > 0" class="participants-grid">
      <div v-for="(participant, index) in participants" :key="index">
        <img :src="participant.profilePic" alt="Avatar Peserta" class="participant-avatar">
      </div>
    </div>
    <p v-else class="text-gray-500 text-center py-4">Belum ada peserta yang bergabung.</p>
  </div>
</template>

<script setup>
const props = defineProps({
  participants: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.participant-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #cbd5e1;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
  cursor: pointer;
}
.participant-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  border-color: #3b82f6;
}
.participants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.5rem;
  justify-items: center;
  align-items: center;
}
</style>