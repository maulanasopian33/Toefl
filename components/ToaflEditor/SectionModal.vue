<script setup lang="ts">
import { reactive, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: boolean
  payload?: { id?: string; name?: string; type?: string; instructions?: string }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'save', payload: { id: string; name: string; type: string; instructions: string }): void
}>()

const { $tinymceReady } = useNuxtApp() as any

const form = reactive({
  id: props.payload?.id || '',
  name: props.payload?.name || '',
  type: props.payload?.type || '',
  instructions: props.payload?.instructions || ''
})

const editorId = 'modal-instructions-editor'

async function initEditor() {
  await $tinymceReady()
  const tinymce = (window as any).tinymce
  try { tinymce.remove(`#${editorId}`) } catch(e) {}

  tinymce.init({
    selector: `#${editorId}`,
    plugins: 'advlist autolink link lists code directionality wordcount',
    toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | ltr rtl | removeformat',
    menubar: false,
    height: 200,
    setup: (ed: any) => {
      ed.on('init', () => {
        ed.setContent(form.instructions || '')
      })
      ed.on('blur', () => {
        form.instructions = ed.getContent()
      })
    }
  })
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    // Populate form when modal opens
    form.id = props.payload?.id || ''
    form.name = props.payload?.name || ''
    form.type = props.payload?.type || ''
    form.instructions = props.payload?.instructions || ''
    // Initialize editor on next tick
    nextTick(() => {
      initEditor()
    })
  } else {
    // Destroy editor when modal closes
    const tinymce = (window as any).tinymce
    const editor = tinymce?.get(editorId)
    if (editor) {
      editor.destroy()
    }
  }
})

watch(() => props.payload, (newPayload) => {
  if (props.modelValue) { // Hanya perbarui jika modal sedang terbuka
    form.id = newPayload?.id || '';
    form.name = newPayload?.name || '';
    form.type = newPayload?.type || '';
    form.instructions = newPayload?.instructions || '';
    const editor = (window as any).tinymce?.get(editorId);
    if (editor) {
      editor.setContent(form.instructions);
    }
  }
});

function onSave() {
  // Ambil konten terbaru dari editor secara manual sebelum menyimpan
  const tinymce = (window as any).tinymce
  const editor = tinymce?.get(editorId)
  if (editor) {
    form.instructions = editor.getContent()
  }

  const id = (form.id || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
  if (!id || !form.name || !form.type) return alert('ID, Nama, dan Tipe wajib diisi.')
  emit('save', { id, name: form.name.trim(), type: form.type.trim(), instructions: form.instructions.trim() || '' })
}
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-lg rounded-xl shadow-2xl">
      <div class="px-6 py-4 border-b">
        <h3 class="text-xl font-bold">
          {{ props.payload?.id ? 'Edit Bagian Ujian' : 'Tambah Bagian Ujian' }}
        </h3>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">ID Bagian</label>
          <input
            v-model="form.id"
            :readonly="!!props.payload?.id"
            class="mt-1 w-full border rounded-lg p-3"
            placeholder="mis. reading, istima"
          />
          <p class="text-xs text-gray-500 mt-1">hanya huruf/angka/underscore (akan dinormalisasi)</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nama Bagian</label>
          <input v-model="form.name" class="mt-1 w-full border rounded-lg p-3" placeholder="Qira'ah (Membaca)" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tipe</label>
          <input v-model="form.type" class="mt-1 w-full border rounded-lg p-3" placeholder="Qira'ah / Istima' / Tarkib" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Instruksi</label>
          <ClientOnly><textarea :id="editorId"></textarea></ClientOnly>
        </div>
      </div>

      <div class="px-6 py-4 border-t flex justify-end gap-2">
        <button @click="$emit('update:modelValue', false)" class="px-4 py-2 rounded-lg bg-gray-200">Batal</button>
        <button @click="onSave" class="px-4 py-2 rounded-lg bg-indigo-600 text-white">Simpan</button>
      </div>
    </div>
  </div>
</template>