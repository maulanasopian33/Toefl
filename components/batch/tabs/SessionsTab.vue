<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-indigo-50 rounded-xl text-indigo-600">
          <Icon name="lucide:calendar-days" class="w-6 h-6" />
        </div>
        <div>
          <h3 class="font-semibold text-slate-800 text-lg">Jadwal Sesi</h3>
          <p class="text-sm text-slate-500">Kelola semua sesi pertemuan, tryout, dan konsultasi untuk batch ini.</p>
        </div>
      </div>
      <button class="btn btn-primary inline-flex items-center gap-2">
        <Icon name="lucide:plus" class="w-4 h-4" />
        <span>Tambah Sesi</span>
      </button>
    </div>

    <!-- Sessions List -->
    <div v-if="batch.sessions && batch.sessions.length > 0" class="space-y-4">
      <div v-for="session in sortedSessions" :key="session.id" class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div class="p-5 flex flex-col sm:flex-row items-start gap-5">
          <!-- Date -->
          <div class="flex-shrink-0 text-center w-full sm:w-20 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p class="text-slate-900 font-bold text-2xl">{{ formatDate(session.start_at, 'd') }}</p>
            <p class="text-slate-500 text-xs font-semibold uppercase">{{ formatDate(session.start_at, 'MMM') }}</p>
            <p class="text-slate-400 text-xs mt-0.5">{{ formatDate(session.start_at, 'yyyy') }}</p>
          </div>

          <!-- Details -->
          <div class="flex-grow">
            <div class="flex items-center gap-3 mb-1">
              <span :class="sessionTypeBadgeClass(session.session_type)" class="px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wide">
                {{ session.session_type || 'Lainnya' }}
              </span>
              <p class="text-xs text-slate-500 font-medium">{{ formatTimeRange(session.start_at, session.end_at) }}</p>
            </div>
            <h4 class="font-bold text-slate-800 text-lg">{{ session.title }}</h4>
            <p v-if="session.notes" class="text-sm text-slate-600 mt-1 line-clamp-2">{{ session.notes }}</p>
            
            <div class="flex items-center gap-4 mt-3 text-xs">
              <div v-if="session.meeting_url" class="flex items-center gap-1.5 text-blue-600">
                <Icon name="lucide:video" class="w-3.5 h-3.5" />
                <a :href="session.meeting_url" target="_blank" class="font-medium hover:underline">Link Meeting</a>
              </div>
              <div class="flex items-center gap-1.5 text-slate-500">
                <Icon name="lucide:users" class="w-3.5 h-3.5" />
                <span class="font-medium">Kapasitas: {{ session.capacity }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex-shrink-0 flex sm:flex-col items-center gap-2 self-start sm:self-center">
            <button class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
              <Icon name="lucide:pencil" class="w-4 h-4" />
            </button>
            <button class="p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
              <Icon name="lucide:trash-2" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
      <div class="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 mx-auto">
        <Icon name="lucide:calendar-off" class="h-8 w-8 text-slate-400" />
      </div>
      <h3 class="text-lg font-semibold text-slate-900">Belum Ada Sesi</h3>
      <p class="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
        Anda belum menambahkan sesi apapun untuk batch ini.
      </p>
      <button class="btn btn-primary inline-flex items-center gap-2 mt-6">
        <Icon name="lucide:plus" class="w-4 h-4" />
        <span>Buat Sesi Pertama</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  batch: {
    type: Object,
    required: true,
  },
});

const sortedSessions = computed(() => {
  if (!props.batch.sessions) return [];
  return [...props.batch.sessions].sort((a, b) => new Date(a.start_at) - new Date(b.start_at));
});

const formatDate = (dateString, format) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  switch (format) {
    case 'd':
      return date.getDate();
    case 'MMM':
      return date.toLocaleDateString('id-ID', { month: 'short' });
    case 'yyyy':
      return date.getFullYear();
    default:
      return date.toLocaleDateString('id-ID');
  }
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatTimeRange = (start, end) => {
  return `${formatTime(start)} - ${formatTime(end)}`;
};

const sessionTypeBadgeClass = (type) => {
  const s = (type || '').toLowerCase();
  switch (s) {
    case 'class':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'tryout':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'consultation':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};
</script>