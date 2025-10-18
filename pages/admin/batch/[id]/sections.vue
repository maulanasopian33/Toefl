<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Batch: {{ batch.name }}</h1>

    <button @click="openSectionModal()" class="btn-primary mb-4">
      Tambah Section
    </button>

    <SectionAccordion
      v-for="section in sections"
      :key="section.idSection"
      :section="section"
      :onUpdate="fetchSections"
    />

    <SectionModal 
      v-model:show="sectionModal.show" 
      :section="sectionModal.data" 
      @saved="fetchSections" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import SectionAccordion from '~/components/admin/SectionAccordion.vue'
import SectionModal from '~/components/admin/SectionModal.vue'

const route = useRoute()
const batchId = route.params.id

const batch = ref({})
const sections = ref([])

const sectionModal = ref({ show: false, data: null })

const openSectionModal = (section = null) => {
  sectionModal.value = { show: true, data: section }
}

const fetchSections = async () => {
  const batchRes = await axios.get(`/api/batches/${batchId}`)
  batch.value = batchRes.data.data

  const sectionsRes = await axios.get(`/api/sections?batchId=${batchId}`)
  sections.value = sectionsRes.data
}

onMounted(fetchSections)
</script>
