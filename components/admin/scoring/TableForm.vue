<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { useScoring, type ScoringTable, type ScoringDetail } from '@/composables/useScoring';

const props = defineProps<{
  initialData?: ScoringTable;
  isSaving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'save', data: ScoringTable): void;
  (e: 'cancel'): void;
}>();

const { sections, fetchSections } = useScoring();

const form = reactive<ScoringTable>({
  name: props.initialData?.name || '',
  description: props.initialData?.description || '',
  details: props.initialData?.details ? [...props.initialData.details] : []
});

onMounted(async () => {
  await fetchSections();
  if (sectionCategories.value.length > 0 && !activeCategory.value) {
    activeCategory.value = sectionCategories.value[0];
  }
});

const sectionCategories = computed(() => {
  // Get unique idSections from database
  if (sections.value && sections.value.length > 0) {
    return Array.from(new Set(sections.value.map(s => s.idSection)));
  }
  // Fallback if DB empty or still loading
  return ['listening', 'structure', 'reading'];
});

const activeCategory = ref(sectionCategories.value[0]);

// Ensure activeCategory updates if sectionCategories changes and it's not in the new set
watch(sectionCategories, (newVal) => {
  if (newVal.length > 0 && !newVal.includes(activeCategory.value)) {
    activeCategory.value = newVal[0];
  }
});

const getCategoryLabel = (cat: string) => {
  const section = sections.value.find(s => s.idSection === cat);
  return section ? `${section.namaSection} (${cat})` : cat;
};

const filteredDetails = computed(() => {
  return form.details?.filter(d => d.section_category === activeCategory.value) || [];
});

const addRow = () => {
  if (!form.details) form.details = [];
  
  // Find the next correct_count
  const lastRow = [...filteredDetails.value].sort((a, b) => b.correct_count - a.correct_count)[0];
  const nextCount = lastRow ? lastRow.correct_count + 1 : 0;
  
  form.details.push({
    section_category: activeCategory.value,
    correct_count: nextCount,
    converted_score: 0
  });
};

const removeRow = (index: number) => {
  if (!form.details) return;
  const detailToRemove = filteredDetails.value[index];
  const actualIndex = form.details.indexOf(detailToRemove);
  if (actualIndex > -1) {
    form.details.splice(actualIndex, 1);
  }
};

const onSave = () => {
  emit('save', { ...form });
};

// Bulk Import Helper (Simple Textarea)
const showBulkImport = ref(false);
const bulkText = ref('');
const importBulk = () => {
  const lines = bulkText.value.split('\n');
  const newDetails: ScoringDetail[] = [];
  
  lines.forEach(line => {
    const [correct, converted] = line.split(/[\s,t]+/).map(n => parseInt(n.trim()));
    if (!isNaN(correct) && !isNaN(converted)) {
      newDetails.push({
        section_category: activeCategory.value,
        correct_count: correct,
        converted_score: converted
      });
    }
  });

  if (newDetails.length > 0) {
    // Clear existing for this category and add new
    if (form.details) {
      form.details = form.details.filter(d => d.section_category !== activeCategory.value);
      form.details.push(...newDetails);
    } else {
      form.details = newDetails;
    }
    showBulkImport.value = false;
    bulkText.value = '';
  }
};
</script>

<template>
  <div class="space-y-8">
    <!-- General Info Section -->
    <section class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
      <h2 class="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
        <Icon name="lucide:info" class="w-5 h-5 text-indigo-600" />
        Informasi Umum
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Nama Tabel</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700 text-sm"
            placeholder="mis. TOEFL ITP Standard"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Deskripsi</label>
          <textarea 
            v-model="form.description" 
            class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700 text-sm resize-none"
            rows="1"
            placeholder="Keterangan opsional..."
          ></textarea>
        </div>
      </div>
    </section>

    <!-- Scoring Details Section -->
    <section class="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-black text-gray-900 flex items-center gap-2">
            <Icon name="lucide:list-ordered" class="w-5 h-5 text-indigo-600" />
            Detail Konversi Skor
          </h2>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sesuaikan nilai berdasarkan jumlah jawaban benar</p>
        </div>
        <div class="flex items-center gap-2">
           <button 
             @click="showBulkImport = !showBulkImport"
             class="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
           >
             {{ showBulkImport ? 'Batal Bulk' : 'Bulk Import' }}
           </button>
           <button 
             @click="addRow"
             class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
           >
             <Icon name="lucide:plus" class="w-4 h-4" /> Tambah Baris
           </button>
        </div>
      </div>

      <!-- Categories Tabs -->
      <div class="px-8 pt-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-50">
        <button 
          v-for="cat in sectionCategories" 
          :key="cat"
          @click="activeCategory = cat"
          class="px-6 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap"
          :class="activeCategory === cat ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'"
        >
          {{ getCategoryLabel(cat) }}
        </button>
      </div>

      <div class="p-8">
        <!-- Bulk Import Area -->
        <div v-if="showBulkImport" class="mb-8 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-4">
          <label class="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Input Data Massal (Benar [spasi/koma/tab] Nilai) untuk {{ getCategoryLabel(activeCategory) }}</label>
          <textarea 
            v-model="bulkText" 
            class="w-full h-32 px-4 py-3 bg-white border border-indigo-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-mono"
            placeholder="0 21&#10;1 22&#10;2 23..."
          ></textarea>
          <div class="flex justify-end">
            <button @click="importBulk" class="px-6 py-2.5 bg-indigo-600 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-200/50">Impor Sekarang</button>
          </div>
        </div>

        <!-- Details Table -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div v-for="(detail, idx) in filteredDetails" :key="idx" class="flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[9px] font-black text-gray-400 underline decoration-indigo-300">BENAR: {{ detail.correct_count }}</span>
              <button @click="removeRow(idx)" class="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-all p-1">
                <Icon name="lucide:x" class="w-3 h-3" />
              </button>
            </div>
            <div class="relative">
              <input 
                v-model.number="detail.converted_score" 
                type="number" 
                class="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 outline-none text-center font-black text-indigo-600"
              />
              <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                 <span class="text-[10px] text-gray-300 font-bold uppercase">Skor</span>
              </div>
            </div>
          </div>
          
          <button 
            @click="addRow" 
            class="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-300 hover:border-indigo-200 hover:text-indigo-300 transition-all"
          >
             <Icon name="lucide:plus" class="w-6 h-6 mb-1" />
             <span class="text-[10px] font-black uppercase">Tambah</span>
          </button>
        </div>

        <div v-if="filteredDetails.length === 0 && !showBulkImport" class="py-12 text-center">
           <Icon name="lucide:list-x" class="w-12 h-12 text-gray-100 mx-auto mb-3" />
           <p class="text-sm text-gray-400 font-medium">Belum ada rincian untuk kategori <span class="text-indigo-400 font-black">{{ getCategoryLabel(activeCategory) }}</span></p>
        </div>
      </div>
    </section>

    <!-- Form Actions -->
    <div class="flex justify-end gap-3 pt-4">
      <button 
        type="button" 
        @click="$emit('cancel')" 
        class="px-8 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
      >
        Batal
      </button>
      <button 
        type="button" 
        @click="onSave" 
        :disabled="isSaving"
        class="inline-flex justify-center items-center gap-2 rounded-2xl bg-indigo-600 px-10 py-3.5 text-sm font-black text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95 disabled:opacity-50"
      >
        <Icon v-if="isSaving" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
        {{ isSaving ? 'Menyimpan...' : 'Simpan Tabel Konversi' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
