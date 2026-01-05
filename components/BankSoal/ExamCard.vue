<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden flex flex-col h-full">
    <!-- Card Header -->
    <div class="p-5 flex justify-between items-start border-b border-slate-100 bg-slate-50/50">
      <div class="flex gap-3">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
             :class="typeColorClass">
          <span class="font-bold text-xs">{{ typeLabel }}</span>
        </div>
        <div>
          <h3 class="font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors" :title="exam.name">
            {{ exam.name }}
          </h3>
          <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Icon name="lucide:clock" class="w-3 h-3" />
            <span>Updated {{ formatDate(exam.updatedAt || exam.createdAt) }}</span>
          </p>
        </div>
      </div>
      <!-- Actions Dropdown -->
      <div class="relative">
        <button @click.stop="$emit('toggle-menu')" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <Icon name="lucide:more-vertical" class="w-4 h-4" />
        </button>
        <!-- Dropdown Menu (Teleported or Handled by Parent is better, but simple v-if here for now) -->
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-5 flex-grow">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center">
          <span class="text-xl font-bold text-slate-700">{{ exam.sections?.length || 0 }}</span>
          <span class="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Sections</span>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center">
          <span class="text-xl font-bold text-slate-700">{{ totalQuestions }}</span>
          <span class="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Questions</span>
        </div>
      </div>
      
      <p v-if="exam.description" class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
        {{ exam.description }}
      </p>
      <p v-else class="text-xs text-slate-400 italic">
        Tidak ada deskripsi.
      </p>
    </div>

    <!-- Card Footer -->
    <div class="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center gap-2">
      <NuxtLink :to="`/admin/exam/edit/${exam.id}`" class="flex-1 inline-flex justify-center items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all">
        <Icon name="lucide:edit-3" class="w-3.5 h-3.5" />
        Edit Soal
      </NuxtLink>
      <button @click="$emit('delete', exam.id)" class="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:border-rose-300 hover:text-rose-600 hover:shadow-sm transition-all" title="Hapus">
        <Icon name="lucide:trash-2" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  exam: any
}>();

const emit = defineEmits(['delete', 'toggle-menu']);

const typeLabel = computed(() => {
  const type = props.exam.type?.toUpperCase() || '';
  if (type.includes('TOAFL')) return 'TOAFL';
  if (type.includes('TOEFL')) return 'TOEFL';
  return 'EXAM';
});

const typeColorClass = computed(() => {
  const type = props.exam.type?.toUpperCase() || '';
  if (type.includes('TOAFL')) return 'bg-emerald-500'; // Green for Arabic
  if (type.includes('TOEFL')) return 'bg-blue-500';    // Blue for English
  return 'bg-indigo-500';
});

const totalQuestions = computed(() => {
  if (!props.exam.sections) return 0;
  return props.exam.sections.reduce((total: number, section: any) => {
    return total + (section.groups?.reduce((st: number, g: any) => st + (g.questions?.length || 0), 0) || 0);
  }, 0);
});

function formatDate(dateString: string) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
</script>
