<template>
  <Modal v-model:show="show">
    <h2>{{ payload?.id ? 'Edit' : 'Tambah' }} Section</h2>
    <input v-model="name" placeholder="Nama Section" />
    <button @click="save" :disabled="!name">Simpan</button>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ show: Boolean, payload: Object })
const emit = defineEmits(['update:show', 'saved'])

const name = ref('')

watch(() => props.payload, (val) => {
  name.value = val?.name || ''
}, { immediate: true })

const save = async () => {
  const newPayload = { ...props.payload, name: name.value };
  // Menggunakan $fetch dari Nuxt untuk konsistensi
  // if(props.section?.idSection){
  //   await $fetch(`/api/sections/${props.section.idSection}`, { method: 'PUT', body: { name: name.value } })
  // } else {
  //   await $fetch(`/api/sections`, { method: 'POST', body: { name: name.value, batchId: props.section?.batchId } })
  // }
  emit('saved', newPayload)
  emit('update:show', false)
}
</script>
