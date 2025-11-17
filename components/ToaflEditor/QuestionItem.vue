<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{sectionId:string,groupIndex:number,qIndex:number,q:any, questionsLength:number}>()
const emit = defineEmits(['delete','move','updateOption','addOption','deleteOption','rtlToggle','initEditor'])
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
  <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-4">
    <!-- Question Header -->
    <div class="flex justify-between items-center mb-4">
      <span class="font-semibold text-gray-700">Soal #{{ qIndex + 1 }}</span>
      <div class="flex items-center space-x-1">
        <button @click="emit('move',-1)" :disabled="qIndex === 0" class="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
        </button>
        <button @click="emit('move',1)" :disabled="qIndex === questionsLength - 1" class="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <button @click="emit('delete')" class="p-1.5 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    </div>

    <!-- Question Text Editor -->
    <div class="bg-white p-1 rounded-lg border border-gray-200">
      <div v-if="!isEditorActive"
           @click="isEditorActive = true"
           class="prose prose-sm max-w-none p-3 min-h-[50px] cursor-pointer hover:bg-gray-50"
           v-html="q.question || '<p class=\'text-gray-400\'>Klik untuk mengedit soal...</p>'">
      </div>
      <ClientOnly v-else><textarea :id="qId">{{q.question}}</textarea></ClientOnly>
    </div>
    <div class="flex justify-end mt-2 mb-4">
      <button @click="emit('rtlToggle',qId)" class="text-sm text-gray-600 hover:text-indigo-600 flex items-center space-x-1 p-1 rounded-md hover:bg-gray-100 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
        <span>Ubah Arah Teks</span>
      </button>
    </div>

    <!-- Options -->
    <div class="space-y-3">
      <label class="text-sm font-semibold text-gray-600 block">Opsi Jawaban</label>
      <div v-for="(opt,i) in q.options" :key="i" class="flex items-center space-x-3">
        <label class="cursor-pointer">
          <input type="radio" :name="qId" :value="opt" v-model="q.correctAnswer" class="peer sr-only"/>
          <svg class="w-6 h-6 text-gray-300 peer-checked:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7h2a2 2 0 012 2v4a2 2 0 01-2 2h-2m-6 0a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2zM9 7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V7z"></path></svg>
        </label>
        <div class="relative flex-grow">
          <input :id="`opt-${qId}-${i}`" type="text" :value="opt" @input="e=>emit('updateOption',i,(e.target as HTMLInputElement).value)" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 pr-10"/>
          <button @click="toggleOptionDir(i)" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          </button>
        </div>
        <button @click.stop="emit('deleteOption',i)" class="p-1.5 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>

    <!-- Add Option Button -->
    <button @click.stop="emit('addOption', qIndex)" class="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center space-x-1.5 p-1">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
      <span>Tambah Opsi</span>
    </button>
  </div>
</template>
