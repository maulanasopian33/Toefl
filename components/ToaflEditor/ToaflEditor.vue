<script setup lang="ts">
import { useExamData, type Section } from '@/composables/useExamData';
import { onMounted, ref, nextTick, watch } from 'vue'
import Sidebar from './Sidebar.vue'
import GroupCard from './GroupCard.vue'
import SectionModal from './SectionModal.vue'

const { $tinymceReady } = useNuxtApp() as any
const { showNotification } = useNotification()

// --- Pengambilan Data & State Management ---
const config = useRuntimeConfig();
const route = useRoute();
const examId = route.params.id as string;
const apiUrl = `${config.public.API_URL}/exams/${examId}`;
const { $auth } = useNuxtApp();

// 1. Panggil composable untuk mengambil data
const { data: fetchedData, pending: isLoading, error } = useExamData(examId);

// Jika terjadi error saat fetch, tampilkan notifikasi
if (error.value) {
  showNotification("Gagal memuat data ujian dari server.", 'error');
  console.error("Gagal memuat data ujian:", error.value);
}
// 2. Panggil composable editor
const {
  data, activeSectionId, isSidebarOpen, activeSection,
  setActiveSection, toggleSidebar,
  saveSectionDetails, deleteSection,
  updateSectionMedia,
  addGroup, moveGroup, deleteGroup, toggleGroup, updateGroupMedia,
  addQuestion, deleteQuestion, moveQuestion,
  updateOption, addOption, deleteOption
} = useToaflEditor();

// 3. Sinkronkan data dari fetch ke state editor
watch(fetchedData, (newData) => {
  if (newData) {
    // Gunakan JSON.parse/stringify untuk deep copy agar tidak ada referensi silang
    data.value = JSON.parse(JSON.stringify(newData));
  }
}, { immediate: true });

// Watcher untuk inisialisasi section aktif
// Ditempatkan di sini agar terikat dengan siklus hidup komponen
// dan data yang baru dimuat.
watch(() => data.value, (newSections) => {
  if (newSections && newSections.length > 0 && !activeSectionId.value) {
    setActiveSection(newSections[0].id);
  }
}, { immediate: true, deep: true }); // `immediate: true` untuk berjalan saat komponen dimuat

const isSaving = ref(false);

async function saveAllChanges() {
  if (isSaving.value) return;
  isSaving.value = true;

  const tinymce = (window as any).tinymce;
  if (tinymce && tinymce.editors) {
    // Memicu 'blur' pada semua editor aktif untuk memastikan data mereka tersimpan ke state
    Object.values(tinymce.editors).forEach((editor: any) => {
      if (editor && !editor.isDestroyed) {
        editor.fire('blur');
      }
    });
  }

  // Tunggu DOM diperbarui setelah event blur
  await nextTick();

  // --- DEBUGGING: Tampilkan data yang akan dikirim ---
  // console.log("Data yang akan disimpan:", JSON.parse(JSON.stringify(data.value)));
  // showNotification("Mode Debug: Data ditampilkan di console.", "success");
  // isSaving.value = false;

  // --- FUNGSI SIMPAN AKTIF (Hapus komentar jika sudah siap) ---
  const user = $auth.currentUser;
  if (!user) {
    showNotification("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    isSaving.value = false;
    return;
  }

  try {
    const token = await user.getIdToken();
    // Mengirim data terbaru ke API
    await $fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data.value // API Anda mengharapkan array of sections
    });
    showNotification("Semua perubahan telah berhasil disimpan.", 'success');
  } catch (error) {
    console.error("Gagal menyimpan data ujian:", error);
    showNotification("Gagal menyimpan perubahan ke server.", 'error');
  } finally {
    isSaving.value = false;
  }
}

const showModal = ref(false)
const modalPayload = ref<Partial<Section> & { batchId?: string }>()

async function initTiny(selector: string, initialContent: string, onBlur: () => void) {
  await $tinymceReady()
  const tinymce = (window as any).tinymce
  try { tinymce.remove(`#${selector}`) } catch(e) {}
  const isRtl = /[\u0600-\u06FF]/.test(initialContent || '')
  const dir = isRtl ? 'rtl' : 'ltr'
  const wrapped = `<div dir="${dir}">${initialContent || ''}</div>`
  tinymce.init({
    selector: `#${selector}`,
    plugins: 'advlist autolink link lists code directionality wordcount table preview image',
    toolbar: 'undo redo | blocks | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ltr rtl | removeformat | code preview | image',
    menubar: false,
    height: 200,
    file_picker_callback: (callback: (url: string, meta: { alt: string }) => void, value: any, meta: any) => {
      if (meta.filetype === 'image') {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        input.onchange = async () => {
          const file = (input.files as FileList)[0];
          
          // --- Integrasi API Unggah Gambar ---
          const formData = new FormData();
          // Menggunakan key 'media' sesuai spesifikasi API Anda
          formData.append('media', file);

          try {
            const response: { url: string } = await $fetch(`${config.public.API_URL}/media/upload`, {
              method: 'POST',
              body: formData
            });
            callback(response.url, { alt: file.name });
          } catch (error) {
            console.error('Gagal mengunggah gambar:', error);
            showNotification('Gagal mengunggah gambar.', 'error');
          }
        };

        input.click();
      }
    },
    setup: (ed:any)=>{
      ed.on('init',()=>{ ed.setContent(wrapped); ed.execCommand(dir==='rtl'?'mceDirectionRTL':'mceDirectionLTR'); })
      ed.on('blur', onBlur)
    }
  });
}

function toggleDir(editorId:string){
  const t=(window as any).tinymce
  const ed=t?.get(editorId)
  if(!ed)return
  const html=ed.getContent()
  const temp=document.createElement('div')
  temp.innerHTML=html
  const wrapper=temp.querySelector('div[dir]')||temp
  const cur=wrapper.getAttribute('dir')||'ltr'
  const newDir=cur==='rtl'?'ltr':'rtl'
  const inner=wrapper.innerHTML
  ed.setContent(`<div dir="${newDir}">${inner}</div>`)
  ed.execCommand(newDir==='rtl'?'mceDirectionRTL':'mceDirectionLTR')
  ed.fire('blur')
}

function updateFromEditor(id:string, cb:(html:string)=>void){
  const t=(window as any).tinymce
  const ed=t?.get(id)
  if(!ed)return
  const temp=document.createElement('div')
  temp.innerHTML=ed.getContent()
  const div=temp.querySelector('div[dir]')||temp
  cb(div.innerHTML.trim())
}

function initEditorFor(id:string,getInit:()=>string,onBlur:()=>void){
  nextTick(()=>initTiny(id,getInit(),onBlur))
}

function openSectionModal(id?:string){
  const s=data.value.find(x=>x.id===id)
  modalPayload.value=s?{...s}:{ batchId: examId }
  showModal.value=true
}
function onSaveSection(p:any){saveSectionDetails(p);showModal.value=false}
function onDeleteSection(id:string){if(confirm('Hapus bagian ini?'))deleteSection(id)}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <header class="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-20">
      <div class="flex items-center space-x-4">
        <button class="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden" @click="toggleSidebar()">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <h1 class="font-bold text-xl text-gray-800">TOAFL Editor</h1>
      </div>
      <button @click="saveAllChanges" :disabled="isSaving" class="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 flex items-center space-x-2 disabled:bg-indigo-400 disabled:cursor-wait">
        <svg v-if="isSaving" class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
        <span>{{ isSaving ? 'Menyimpan...' : 'Simpan' }}</span>
      </button>
    </header>

    <main class="flex flex-1">
      <Sidebar class="shadow-lg" :sections="data.map(s=>({id:s.id,name:s.name}))"
               :active-id="activeSectionId || ''"
               :is-open="isSidebarOpen"
               @select="setActiveSection"
               @toggle="toggleSidebar"
               @add-section="openSectionModal()" />

      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="isLoading" class="flex flex-col items-center justify-center h-full text-center p-8">
          <svg class="w-16 h-16 text-gray-400 animate-spin mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-700">Memuat Data Ujian...</h3>
        </div>
        <div v-else-if="!activeSection" class="flex flex-col items-center justify-center h-full text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <h3 class="text-xl font-semibold text-gray-700">Selamat Datang di Editor</h3>
          <p class="text-gray-500 mt-2">Pilih bagian dari panel samping atau buat bagian baru untuk memulai.</p>
        </div>

        <div v-else-if="activeSection">
          <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h2 class="text-3xl font-bold text-gray-800">{{activeSection.name}}</h2>
            <div class="space-x-2">
              <button @click="openSectionModal(activeSection.id)" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">Edit</button>
              <button @click="onDeleteSection(activeSection.id)" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">Hapus</button>
            </div>
          </div>

          <!-- Gunakan :key untuk memaksa re-render saat activeSection berubah -->
          <!-- Ini cara yang lebih bersih daripada menggunakan watch untuk destroy/init editor -->
          <div :key="activeSection.id" class="bg-white p-5 rounded-xl mb-6 shadow-sm border border-gray-200">
            <label class="font-semibold text-gray-700 mb-2 block">Instruksi</label>
            <div class="bg-gray-50 p-1 rounded-lg border border-gray-200">
              <!-- Pindahkan ClientOnly ke luar textarea untuk stabilitas -->
              <ClientOnly>
                <textarea :id="`section-${activeSection.id}`" @vue:mounted="initEditorFor(`section-${activeSection.id}`, () => activeSection.instructions, () => updateFromEditor(`section-${activeSection.id}`, html => activeSection.instructions = html))"></textarea>
              </ClientOnly>
            </div>
            <div class="flex justify-end mt-2">
              <button @click="toggleDir(`section-${activeSection.id}`)" class="text-sm text-gray-600 hover:text-indigo-600 flex items-center space-x-1 p-1 rounded-md hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                <span>Ubah Arah Teks</span>
              </button>
            </div>
          </div>

          <GroupCard v-for="(g,i) in activeSection.groups" :key="i" :group="g"
                     :section-id="activeSection.id" :group-index="i"
                     :groups-length="activeSection.groups.length"
                     class="mb-6"
                     @toggle="toggleGroup(activeSection.id,i)"
                     @moveGroup="d=>moveGroup(activeSection.id,i,d)"
                     @deleteGroup="deleteGroup(activeSection.id,i)"
                     @updateGroupMedia="(f,v)=>updateGroupMedia(activeSection.id,i,f,v)"                     
                     @initPassageEditor="id=>initEditorFor(id,()=>g.passage,()=>updateFromEditor(id,h=>g.passage=h))"
                     @initQuestionEditor="p=>initEditorFor(p.editorId,()=>g.questions[p.questionIndex].question,()=>updateFromEditor(p.editorId,h=>g.questions[p.questionIndex].question=h))"
                     @toggleDir="toggleDir"
                     @addQuestion="addQuestion(activeSection.id,i)"
                     @deleteQuestion="q=>deleteQuestion(activeSection.id,i,q)"
                     @moveQuestion="(q,d)=>moveQuestion(activeSection.id,i,q,d)"
                     @updateOption="(q,o,t)=>updateOption(activeSection.id,i,q,o,t)"
                     @addOption="qIndex=>addOption(activeSection.id,i,qIndex)"
                     @deleteOption="(q,o)=>deleteOption(activeSection.id,i,q,o)" />
          <button @click="addGroup(activeSection.id)" class="w-full py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-all duration-200 flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span>Tambah Grup Soal</span>
          </button>
        </div>
      </div>
    </main>
    <SectionModal v-model="showModal" :payload="modalPayload" @save="onSaveSection" />
  </div>
</template>