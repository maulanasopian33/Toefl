<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import QuestionItem from './QuestionItem.vue';
import MediaLibraryModal from './MediaLibraryModal.vue';
import CustomAudioPlayer from './CustomAudioPlayer.vue';
// Lazy load the component only on the client side
const EditorMediaLibraryModal = defineAsyncComponent(() =>
  import('@/components/ExamEditor/MediaLibraryModal.vue')
)
const config = useRuntimeConfig()

const props = defineProps<{sectionId:string,groupIndex:number,groupsLength:number,group:any}>()
const emit = defineEmits(['toggle','moveGroup','deleteGroup','updateGroupMedia','initPassageEditor','initQuestionEditor','toggleDir',
  'addQuestion','deleteQuestion','moveQuestion','updateOption','addOption','deleteOption', 'updateQuestionMedia'])
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
const mediaTarget = ref<{ type: 'group' | 'question', qIndex?: number }>({ type: 'group' });

function openGroupMedia() {
  mediaTarget.value = { type: 'group' };
  showMediaModal.value = true;
}

function handleQuestionAudio(qIndex: number, action: 'select' | 'delete') {
  if (action === 'delete') {
    emit('updateQuestionMedia', qIndex, 'audioUrl', null);
  } else {
    mediaTarget.value = { type: 'question', qIndex };
    showMediaModal.value = true;
  }
}

function onMediaSelect(url: string) {
  if (mediaTarget.value.type === 'group') {
    emit('updateGroupMedia', 'add', 'audioUrls', url);
  } else if (mediaTarget.value.type === 'question' && mediaTarget.value.qIndex !== undefined) {
    emit('updateQuestionMedia', mediaTarget.value.qIndex, 'audioUrl', url);
  }
  showMediaModal.value = false;
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-shadow hover:shadow-md">
    <!-- Card Header -->
    <div class="flex justify-between items-center p-5 cursor-pointer hover:bg-slate-50/50 transition-colors" @click="emit('toggle')">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 transition-colors" :class="{'bg-indigo-50 text-indigo-600': !group.isCollapsed}">
          <Icon name="lucide:folder-open" class="w-4 h-4" />
        </div>
        <h3 class="font-bold text-slate-800 text-lg">Grup Soal #{{ groupIndex + 1 }}</h3>
      </div>
      <div class="flex items-center space-x-1" @click.stop>
        <button @click="emit('moveGroup',-1)" :disabled="groupIndex === 0" class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Icon name="lucide:arrow-up" class="w-4 h-4" />
        </button>
        <button @click="emit('moveGroup',1)" :disabled="groupIndex === groupsLength - 1" class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Icon name="lucide:arrow-down" class="w-4 h-4" />
        </button>
        <button @click="emit('deleteGroup')" class="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors ml-1">
          <Icon name="lucide:trash-2" class="w-4 h-4" />
        </button>
        <div class="w-px h-4 bg-slate-200 mx-2"></div>
        <Icon name="lucide:chevron-down" class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{'rotate-180': !group.isCollapsed}" />
      </div>
    </div>

    <!-- Card Body -->
    <Transition name="collapse">
      <div v-if="!group.isCollapsed" class="p-6 border-t border-slate-100 bg-slate-50/30">
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="lucide:book-open" class="w-4 h-4 text-slate-500" />
            <label class="font-semibold text-slate-700">Teks Bacaan (Passage)</label>
          </div>
          <div class="bg-white p-1 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
            <ClientOnly><textarea :id="pid">{{group.passage}}</textarea></ClientOnly>
          </div>
          <div class="flex justify-end mt-2">
            <button @click="emit('toggleDir',pid)" class="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
              <Icon name="lucide:languages" class="w-3.5 h-3.5" />
              <span>Ubah Arah Teks</span>
            </button>
          </div>
        </div>

        <div class="mb-8">
          <div class="flex items-center gap-2 mb-2">
            <Icon name="lucide:headphones" class="w-4 h-4 text-slate-500" />
            <label class="font-semibold text-slate-700">File Audio Grup</label>
          </div>
          
          <div class="space-y-3">
            <div v-for="(audio, index) in group.audioUrls" :key="index" class="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200">
              <CustomAudioPlayer :src="`${config.public.MEDIA_URL}${audio}`" />
              <button @click="emit('updateGroupMedia', 'delete', 'audioUrls', index)" class="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors flex-shrink-0">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
            
            <button @click="openGroupMedia" class="w-full flex items-center justify-center px-4 py-3 bg-white text-slate-500 rounded-xl border-2 border-dashed border-slate-300 cursor-pointer hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group">
              <div class="flex items-center gap-2">
                <Icon name="lucide:music" class="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                <span class="text-sm font-medium">Tambah Audio ke Grup</span>
              </div>
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
                          @deleteOption="o=>emit('deleteOption',qIndex,o)"
                          @manageAudio="action => handleQuestionAudio(qIndex, action)" />
        </TransitionGroup>

        <button @click="emit('addQuestion')" class="mt-6 w-full py-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 font-medium">
          <Icon name="lucide:plus-circle" class="w-4 h-4" />
          <span>Tambah Pertanyaan</span>
        </button>
      </div>
    </Transition>
    <ClientOnly>
      <template #default>
        <EditorMediaLibraryModal
          v-model="showMediaModal"
          :media-type="'audio'"
          @select="onMediaSelect"
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