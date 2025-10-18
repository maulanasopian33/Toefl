<template>
  <div class="border rounded mb-2 p-4">
    <div class="flex justify-between items-center mb-2">
      <h2 class="font-bold">{{ section.name }}</h2>
      <div>
        <button @click="$emit('edit', section)" class="btn-sm mr-2">Edit</button>
        <button @click="deleteSection" class="btn-sm btn-danger">Hapus</button>
      </div>
    </div>

    <button @click="openGroupModal()" class="btn-primary mb-2">Tambah Group</button>

    <div class="grid grid-cols-2 gap-4">
      <GroupCard 
        v-for="group in section.groups" 
        :key="group.idGroup" 
        :group="group" 
        :onUpdate="fetchGroups" 
      />
    </div>

    <GroupModal 
      v-model:show="groupModal.show" 
      :group="groupModal.data" 
      :sectionId="section.idSection"
      @saved="fetchGroups" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import GroupCard from './GroupCard.vue'
import GroupModal from './GroupModal.vue'

defineProps({
  section: Object,
  onUpdate: Function
})

const groupModal = ref({ show: false, data: null })

const openGroupModal = (group = null) => {
  groupModal.value = { show: true, data: group }
}

const fetchGroups = async () => {
  const res = await axios.get(`/api/sections/${section.idSection}/groups`)
  section.groups = res.data
  onUpdate && onUpdate()
}

const deleteSection = async () => {
  if (confirm('Hapus section ini?')) {
    await axios.delete(`/api/sections/${section.idSection}`)
    onUpdate && onUpdate()
  }
}
</script>
