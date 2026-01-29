<script setup lang="ts">
import { reactive, watch, nextTick, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useScoring } from '@/composables/useScoring'

const props = defineProps<{
  modelValue: boolean
  payload?: { id?: string; name?: string; type?: string; instructions?: string; scoring_table_id?: number | null }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'save', payload: { id: string; name: string; type: string; instructions: string; scoring_table_id?: number | null }): void
}>()

const { $tinymceReady } = useNuxtApp() as any
const { tables, fetchTables } = useScoring()

onMounted(() => {
  fetchTables()
})

const form = reactive({
  id: props.payload?.id || '',
  name: props.payload?.name || '',
  type: props.payload?.type || '',
  instructions: props.payload?.instructions || '',
  scoring_table_id: props.payload?.scoring_table_id || null
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
    form.id = props.payload?.id || ''
    form.name = props.payload?.name || ''
    form.type = props.payload?.type || ''
    form.instructions = props.payload?.instructions || ''
    form.scoring_table_id = props.payload?.scoring_table_id || null
    nextTick(() => {
      initEditor()
    })
  } else {
    const tinymce = (window as any).tinymce
    const editor = tinymce?.get(editorId)
    if (editor) {
      editor.destroy()
    }
  }
})

watch(() => props.payload, (newPayload) => {
  if (props.modelValue) {
    form.id = newPayload?.id || '';
    form.name = newPayload?.name || '';
    form.type = newPayload?.type || '';
    form.instructions = newPayload?.instructions || '';
    form.scoring_table_id = newPayload?.scoring_table_id || null;
    const editor = (window as any).tinymce?.get(editorId);
    if (editor) {
      editor.setContent(form.instructions);
    }
  }
});

const isPromoting = ref(false)

async function onPromote() {
  if (!props.payload?.id) return
  if (!confirm('Jadikan section ini sebagai template di Bank Soal? Anda bisa menggunakannya kembali di batch lain.')) return
  
  isPromoting.value = true
  try {
    const config = useRuntimeConfig()
    const { $auth } = useNuxtApp()
    const token = await $auth.currentUser?.getIdToken()
    
    await $fetch(`${config.public.API_URL}/bank/promote/${props.payload.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    
    const { showNotification } = useNotification()
    showNotification('Section berhasil dipromosikan ke Bank Soal!', 'success')
  } catch (e: any) {
    const { showNotification } = useNotification()
    showNotification('Gagal mempromosikan section.', 'error')
  } finally {
    isPromoting.value = false
  }
}

function onSave() {
  const tinymce = (window as any).tinymce
  const editor = tinymce?.get(editorId)
  if (editor) {
    form.instructions = editor.getContent()
  }

  const id = (form.id || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
  if (!id || !form.name || !form.type) return
  emit('save', { 
    id, 
    name: form.name.trim(), 
    type: form.type.trim(), 
    instructions: form.instructions.trim() || '',
    scoring_table_id: form.scoring_table_id
  })
}
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="$emit('update:modelValue', false)" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-[2rem] bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
              <DialogTitle as="h3" class="text-lg font-extrabold leading-6 text-gray-900 mb-6 flex items-center gap-2">
                 <div class="p-1.5 bg-blue-100 rounded-lg">
                    <Icon :name="props.payload?.id ? 'lucide:edit-3' : 'lucide:plus-circle'" class="w-5 h-5 text-blue-600" />
                 </div>
                 {{ props.payload?.id ? 'Edit Bagian Ujian' : 'Tambah Bagian Ujian' }}
              </DialogTitle>
              
              <div class="space-y-5">
                 <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">ID Bagian</label>
                    <input
                      v-model="form.id"
                      :readonly="!!props.payload?.id"
                      class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm disabled:opacity-60"
                      placeholder="mis. reading, listening"
                    />
                    <p class="text-[9px] text-gray-400 font-medium italic mt-1 px-1">* Hanya huruf/angka/underscore (akan dinormalisasi)</p>
                 </div>

                 <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Nama Bagian</label>
                    <input 
                      v-model="form.name" 
                      class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm"
                      placeholder="Reading (Membaca)" 
                    />
                 </div>

                 <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Tipe</label>
                    <input 
                      v-model="form.type" 
                      class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm"
                      placeholder="reading / listening / structure" 
                    />
                 </div>

                 <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Tabel Konversi Skor</label>
                    <select 
                      v-model="form.scoring_table_id" 
                      class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm"
                    >
                      <option :value="null">Gunakan Fallback Default</option>
                      <option v-for="table in tables" :key="table.id" :value="table.id">
                        {{ table.name }}
                      </option>
                    </select>
                    <p class="text-[9px] text-gray-400 font-medium italic mt-1 px-1">* Opsional, gunakan jika ingin kustom skor per jawaban benar</p>
                 </div>

                 <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none px-1">Instruksi</label>
                    <div class="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden min-h-[250px] shadow-inner focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
                       <ClientOnly><textarea :id="editorId"></textarea></ClientOnly>
                    </div>
                 </div>

                  <div class="mt-8 flex justify-between items-center">
                    <div>
                        <button 
                          v-if="props.payload?.id"
                          type="button" 
                          @click="onPromote"
                          :disabled="isPromoting"
                          class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors disabled:opacity-50"
                        >
                           <Icon v-if="isPromoting" name="lucide:loader-2" class="w-3 h-3 animate-spin" />
                           <Icon v-else name="lucide:database-zap" class="w-3 h-3" />
                           {{ isPromoting ? 'Memproses...' : 'Promosikan ke Bank Soal' }}
                        </button>
                    </div>
                    <div class="flex gap-3">
                      <button 
                        type="button" 
                        @click="$emit('update:modelValue', false)"
                        class="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm"
                      >
                         Batal
                      </button>
                      <button 
                        type="button" 
                        @click="onSave"
                        class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-200 transition-all transform active:scale-95 flex items-center gap-2 text-sm"
                      >
                         Simpan Bagian
                      </button>
                    </div>
                  </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style>
/* Override TinyMCE skin to match design better */
.tox-tinymce {
  border: none !important;
  background: transparent !important;
}
.tox .tox-edit-area__iframe {
  background: white !important;
}
.tox .tox-toolbar, .tox .tox-toolbar__primary {
  background: #f9fafb !important;
}
</style>