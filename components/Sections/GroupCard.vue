<template>
  <div class="border rounded p-2">
    <h3 class="font-semibold mb-1">{{ group.name }}</h3>

    <button @click="openQuestionManager" class="btn-sm btn-primary mb-1">
      Manage Questions
    </button>

    <button @click="openAudioManager" class="btn-sm btn-secondary mb-1">
      Manage Audio
    </button>
  </div>

  <QuestionManager 
    v-model:show="questionModal.show" 
    :groupId="group.idGroup" 
    @saved="refreshGroup"
  />

  <AudioInstructionManager
    v-model:show="audioModal.show" 
    :groupId="group.idGroup"
    @saved="refreshGroup"
  />
</template>

<script setup>
import { ref } from 'vue'
import QuestionManager from './QuestionManager.vue'
import AudioInstructionManager from './AudioInstructionManager.vue'

defineProps({ group: Object, onUpdate: Function })

const questionModal = ref({ show: false })
const audioModal = ref({ show: false })

const openQuestionManager = () => questionModal.value.show = true
const openAudioManager = () => audioModal.value.show = true

const refreshGroup = () => onUpdate && onUpdate()
</script>
