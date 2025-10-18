<template>
  <Modal v-model:show="show">
    <h2>{{ section ? 'Edit' : 'Tambah' }} Section</h2>
    <input v-model="name" placeholder="Nama Section" />
    <button @click="save">Simpan</button>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

defineProps({ show: Boolean, section: Object })
defineEmits(['update:show', 'saved'])

const name = ref('')

watch(() => section, (val) => {
  name.value = val?.name || ''
})

const save = async () => {
  if(section){
    await axios.put(`/api/sections/${section.idSection}`, { name: name.value })
  } else {
    await axios.post(`/api/sections`, { name: name.value, batchId: section?.batchId })
  }
  emit('saved')
  emit('update:show', false)
}
</script>
