<template>
  <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Jadwal Sesi</h3>
    <div v-if="!sessions || sessions.length === 0" class="text-center py-10 text-gray-500">
      <Icon name="lucide:calendar-off" class="w-10 h-10 mx-auto text-gray-400" />
      <p class="mt-2 text-sm">Jadwal sesi belum tersedia.</p>
    </div>
    <ul v-else class="space-y-4">
      <li v-for="session in sessions" :key="session.id" class="flex items-start gap-4">
        <div class="flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white" :class="getSessionType(session.session_type).bg">
          <Icon :name="getSessionType(session.session_type).icon" class="w-6 h-6" />
        </div>
        <div class="flex-grow">
          <p class="font-semibold text-gray-900">{{ session.title }}</p>
          <div class="text-sm text-gray-500 mt-1 flex items-center gap-4">
            <span class="flex items-center gap-1.5">
              <Icon name="lucide:calendar" class="w-3.5 h-3.5" />
              {{ formatDateTime(session.start_at) }}
            </span>
            <a v-if="session.meeting_url" :href="session.meeting_url" target="_blank" class="flex items-center gap-1.5 text-blue-600 hover:underline">
              <Icon name="lucide:video" class="w-3.5 h-3.5" />
              Online
            </a>
          </div>
          <p v-if="session.notes" class="text-xs text-gray-400 mt-1 italic">"{{ session.notes }}"</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps({ sessions: { type: Array, default: () => [] } })

const getSessionType = (type: string) => {
  switch (type?.toUpperCase()) {
    case 'CLASS': return { bg: 'bg-blue-500', icon: 'lucide:book-user' };
    case 'TRYOUT': return { bg: 'bg-green-500', icon: 'lucide:file-check-2' };
    case 'CONSULTATION': return { bg: 'bg-purple-500', icon: 'lucide:messages-square' };
    default: return { bg: 'bg-gray-400', icon: 'lucide:help-circle' };
  }
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
}
</script>