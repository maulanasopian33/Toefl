<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{sectionId:string,groupIndex:number,qIndex:number,q:any, questionsLength:number}>()
const emit = defineEmits(['delete','move','updateOption','addOption','deleteOption','rtlToggle','initEditor', 'manageAudio'])
const config = useRuntimeConfig()
import CustomAudioPlayer from './CustomAudioPlayer.vue'
const qId=`q-${props.sectionId}-${props.groupIndex}-${props.qIndex}`

const isEditorActive = ref(false);

watch(isEditorActive, (isActive) => {
  if (isActive) {
    emit('initEditor', qId);
  }
});

function toggleOptionDir(index: number) {
  const optionInputId = `opt-${qId}-${index}`;
  const inputEl = document.getElementById(optionInputId) as HTMLInputElement;
  if (inputEl) {
    inputEl.dir = inputEl.dir === 'rtl' ? 'ltr' : 'rtl';
  }
}
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <!-- Question Header -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">{{ qIndex + 1 }}</span>
        <span class="font-semibold text-slate-700">Pertanyaan</span>
      </div>
      <div class="flex items-center space-x-1">
        <button @click="emit('move',-1)" :disabled="qIndex === 0" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Icon name="lucide:arrow-up" class="w-4 h-4" />
        </button>
        <button @click="emit('move',1)" :disabled="qIndex === questionsLength - 1" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Icon name="lucide:arrow-down" class="w-4 h-4" />
        </button>
        <button @click="emit('delete')" class="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors ml-1">
          <Icon name="lucide:trash-2" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Question Text Editor -->
    <div class="bg-slate-50 p-1 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
      <div v-if="!isEditorActive"
           @click="isEditorActive = true"
           class="prose prose-sm max-w-none p-3 min-h-[60px] cursor-text text-slate-600"
           v-html="q.question || '<p class=\'text-slate-400 italic\'>Klik di sini untuk menulis pertanyaan...</p>'">
      </div>
      <ClientOnly v-else><textarea :id="qId">{{q.question}}</textarea></ClientOnly>
    </div>
    <div class="flex justify-end mt-2 mb-4">
      <button @click="emit('rtlToggle',qId)" class="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
        <Icon name="lucide:languages" class="w-3.5 h-3.5" />
        <span>Ubah Arah Teks</span>
      </button>
    </div>

    <!-- Question Audio -->
    <div class="mb-4">
      <div v-if="q.audioUrl" class="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <CustomAudioPlayer :src="`${config.public.MEDIA_URL}${q.audioUrl}`" />
        <button @click="emit('manageAudio', 'delete')" class="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors flex-shrink-0" title="Hapus Audio">
          <Icon name="lucide:trash-2" class="w-4 h-4" />
        </button>
      </div>
      <div v-else>
        <button @click="emit('manageAudio', 'select')" class="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-500 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all font-medium">
          <Icon name="lucide:music" class="w-4 h-4" />
          <span class="text-xs">Tambah Audio Pertanyaan</span>
        </button>
      </div>
    </div>

    <!-- Options -->
    <div class="space-y-3">
      <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Opsi Jawaban</label>
      <div v-for="(opt,i) in q.options" :key="i" class="flex items-center space-x-3">
        <label class="cursor-pointer">
          <input type="radio" :name="qId" :value="opt" v-model="q.correctAnswer" class="peer sr-only"/>
          <div class="w-6 h-6 rounded-full border-2 border-slate-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 text-white peer-checked:text-emerald-500 flex items-center justify-center transition-all">
             <Icon name="lucide:check" class="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100" />
          </div>
        </label>
        <div class="relative flex-grow">
          <input :id="`opt-${qId}-${i}`" type="text" :value="opt" @input="e=>emit('updateOption',i,(e.target as HTMLInputElement).value)" class="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm p-2.5 pr-10 transition-shadow" placeholder="Tulis jawaban..."/>
          <button @click="toggleOptionDir(i)" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-indigo-600">
            <Icon name="lucide:languages" class="w-4 h-4" />
          </button>
        </div>
        <button @click.stop="emit('deleteOption',i)" class="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors flex-shrink-0">
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Add Option Button -->
    <button @click.stop="emit('addOption', qIndex)" class="mt-4 text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors w-fit">
      <Icon name="lucide:plus" class="w-3.5 h-3.5" />
      <span>Tambah Opsi</span>
    </button>
  </div>
</template>
