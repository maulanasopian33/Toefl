<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import QuestionItem from './QuestionItem.vue';
import MediaLibraryModal from './MediaLibraryModal.vue';
import CustomAudioPlayer from './CustomAudioPlayer.vue';
// Lazy load the component only on the client side
const ToaflEditorMediaLibraryModal = defineAsyncComponent(() =>
  import('@/components/ToaflEditor/MediaLibraryModal.vue')
)
const config = useRuntimeConfig()

const props = defineProps<{sectionId:string,groupIndex:number,groupsLength:number,group:any}>()
const emit = defineEmits(['toggle','moveGroup','deleteGroup','updateGroupMedia','initPassageEditor','initQuestionEditor','toggleDir',
  'addQuestion','deleteQuestion','moveQuestion','updateOption','addOption','deleteOption'])
const pid=`group-${props.sectionId}-${props.groupIndex}`

function initializeEditors() {
  nextTick(() => {
    emit('initPassageEditor', pid);
  });
}
onMounted(initializeEditors);
// Inisialisasi ulang editor passage saat grup dibuka
watch(() => props.group.isCollapsed, (isCollapsed) => { if (!isCollapsed) initializeEditors(); });

const showMediaModal = ref(false);
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Card Header -->
    <div class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50/50" @click="emit('toggle')">
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-gray-400 transform transition-transform duration-200" :class="{'rotate-90': !group.isCollapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        <h3 class="font-semibold text-gray-800">Grup Soal #{{ groupIndex + 1 }}</h3>
      </div>
      <div class="flex items-center space-x-1" @click.stop>
        <button @click="emit('moveGroup',-1)" :disabled="groupIndex === 0" class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
        </button>
        <button @click="emit('moveGroup',1)" :disabled="groupIndex === groupsLength - 1" class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <button @click="emit('deleteGroup')" class="p-1.5 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    </div>

    <!-- Card Body -->
    <Transition name="collapse">
      <div v-if="!group.isCollapsed" class="p-5 border-t border-gray-200">
        <div class="mb-6">
          <label class="font-semibold text-gray-700 mb-2 block">Teks Grup (Passage)</label>
          <div class="bg-gray-50 p-1 rounded-lg border border-gray-200">
            <ClientOnly><textarea :id="pid">{{group.passage}}</textarea></ClientOnly>
          </div>
          <div class="flex justify-end mt-2">
            <button @click="emit('toggleDir',pid)" class="text-sm text-gray-600 hover:text-indigo-600 flex items-center space-x-1 p-1 rounded-md hover:bg-gray-100 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              <span>Ubah Arah Teks</span>
            </button>
          </div>
        </div>

        <!-- Audio Upload -->
        <div class="mb-6">
          <label class="font-semibold text-gray-700 mb-2 block">File Audio Grup</label>
          <div v-if="group.audioUrl" class="flex items-center space-x-3">
            <CustomAudioPlayer :src="`${config.public.MEDIA_URL}${group.audioUrl}`" />
            <button @click="emit('updateGroupMedia', 'audioUrl', null)" class="p-1.5 rounded-md text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
          <div v-else @click="showMediaModal = true">
            <button class="w-full flex items-center justify-center px-4 py-3 bg-white text-indigo-600 rounded-lg shadow-sm tracking-wide border border-indigo-200 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.55 13a3 3 0 11-5.1 0m-2.45-2.45a3 3 0 114.24 0M12 3v1m0 16v1m8.49-3.51l-.71.71M4.22 4.22l-.71.71M21 12h-1M4 12H3m14.22-7.78l-.71-.71M4.93 19.07l-.71-.71"></path></svg>
              <span class="text-base leading-normal">Pilih dari Pustaka Media...</span>
            </button>
          </div>
        </div>

        <!-- Animated list for questions -->
        <TransitionGroup tag="div" name="list" class="relative space-y-6">
            <QuestionItem v-for="(q,qIndex) in group.questions" :key="q.id"
                          :q="q" :section-id="sectionId" :group-index="groupIndex" :q-index="qIndex"
                          :questions-length="group.questions.length"
                          @initEditor="id=>emit('initQuestionEditor', {editorId: id, questionIndex: qIndex})" @rtlToggle="id=>emit('toggleDir',id)"
                          @delete="emit('deleteQuestion',qIndex)"
                          @move="d=>emit('moveQuestion',qIndex,d)"
                          @updateOption="(o,t)=>emit('updateOption',qIndex,o,t)"
                          @addOption="questionIndexPayload => emit('addOption', questionIndexPayload)"
                          @deleteOption="o=>emit('deleteOption',qIndex,o)" />
        </TransitionGroup>

        <button @click="emit('addQuestion')" class="mt-6 w-full py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-all duration-200 flex items-center justify-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          <span>Tambah Soal</span>
        </button>
      </div>
    </Transition>
    <ClientOnly>
      <template #default>
        <ToaflEditorMediaLibraryModal
          v-model="showMediaModal"
          :media-type="'audio'"
          @select="url => emit('updateGroupMedia', 'audioUrl', url)"
        />
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* ensure leaving items are taken out of layout flow so that moving animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>