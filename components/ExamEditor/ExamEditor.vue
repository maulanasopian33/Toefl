<script setup lang="ts">
import { useExamData, type Section } from '@/composables/useExamData';
import { onMounted, ref, nextTick, watch } from 'vue'
import Sidebar from './Sidebar.vue'
import GroupCard from './GroupCard.vue'
import SectionModal from './SectionModal.vue'
import ImportBankModal from './ImportBankModal.vue'
import CustomAudioPlayer from './CustomAudioPlayer.vue'

const EditorMediaLibraryModal = defineAsyncComponent(() =>
  import('@/components/ExamEditor/MediaLibraryModal.vue')
)

const { $tinymceReady } = useNuxtApp() as any
const { showNotification } = useNotification()

// --- Pengambilan Data & State Management ---
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const examId = route.params.id as string;
const apiUrl = `${config.public.API_URL}/exams/${examId}`;
const { $auth } = useNuxtApp();

// 1. Panggil composable untuk mengambil data
const { data: fetchedData, pending: isLoading, error, isLocked, lockReason } = useExamData(examId);

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
} = useExamEditor();

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

// Computed to find questions without correct answers
const invalidQuestions = computed(() => {
  const result: { sectionName: string; sectionId: string; groupIndex: number; questionIndex: number; questionId: string }[] = [];
  
  data.value.forEach((section) => {
    section.groups.forEach((group, gIdx) => {
      group.questions.forEach((question, qIdx) => {
        if (!question.correctAnswer || question.correctAnswer.trim() === '') {
          result.push({
            sectionName: section.name,
            sectionId: section.id,
            groupIndex: gIdx + 1,
            questionIndex: qIdx + 1,
            questionId: question.id
          });
        }
      });
    });
  });
  
  return result;
});

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
const showImportModal = ref(false)
const modalPayload = ref<Partial<Section> & { batchId?: string }>()
const showSectionMediaModal = ref(false)

const { refresh: reloadData } = useExamData(examId);

function onSectionImported() {
  reloadData();
  showNotification('Daftar bagian diperbarui setelah impor.', 'info');
}

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
            const token = await $auth.currentUser?.getIdToken();
            if (!token) throw new Error("No auth token");

            const response: { url: string } = await $fetch(`${config.public.API_URL}/media/upload`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
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
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <!-- Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 py-3 flex justify-between items-center shadow-sm">
      <div class="flex items-center gap-4">
        <button class="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 md:hidden transition-colors" @click="toggleSidebar()">
          <Icon name="lucide:menu" class="w-6 h-6" />
        </button>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Icon name="lucide:edit-3" class="w-5 h-5" />
          </div>
          <div>
            <h1 class="font-bold text-lg text-slate-900 leading-tight">Editor Soal</h1>
            <p class="text-xs text-slate-500 font-medium">Kelola Soal & Struktur Ujian</p>
          </div>
        </div>
      </div>
      <button @click="router.back()" class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" title="Kembali">
           <Icon name="lucide:arrow-left" class="w-5 h-5" />
        </button>
      <button 
        @click="saveAllChanges" 
        :disabled="isSaving || isLocked" 
        class="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        :title="isLocked ? 'Editor terkunci: ' + (lockReason === 'SUBMISSIONS_EXIST' ? 'Sudah ada siswa yang mengerjakan' : 'Waktu ujian sudah dimulai') : 'Simpan Perubahan'"
      >
        <Icon v-if="isSaving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
        <Icon v-else-if="isLocked" name="lucide:lock" class="w-4 h-4" />
        <Icon v-else name="lucide:save" class="w-4 h-4" />
        <span class="font-medium hidden md:block">{{ isSaving ? 'Menyimpan...' : (isLocked ? 'Terkunci' : 'Simpan Perubahan') }}</span>
      </button>
    </header>

    <main class="flex flex-1">
      <Sidebar class="border-r border-slate-200 bg-white z-10" :sections="data.map(s=>({id:s.id,name:s.name}))"
               :active-id="activeSectionId || ''"
               :is-open="isSidebarOpen"
               @select="setActiveSection"
               @toggle="toggleSidebar"
               @add-section="openSectionModal()"
               @import-bank="showImportModal = true" />

      <div class="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
        <!-- Locked Banner -->
        <div v-if="isLocked" class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shadow-sm animate-fade-in-down">
           <div class="p-2 bg-amber-100 rounded-xl text-amber-600 flex-shrink-0">
              <Icon name="lucide:lock" class="w-5 h-5" />
           </div>
           <div>
              <h3 class="font-bold text-amber-900 text-sm">Mode Baca-Saja (Locked)</h3>
              <p class="text-xs text-amber-700 mt-1 leading-relaxed">
                 {{ lockReason === 'SUBMISSIONS_EXIST' 
                    ? 'Ujian ini sudah dikerjakan oleh siswa. Untuk menjaga integritas nilai, pengeditan dinonaktifkan.' 
                    : 'Waktu ujian telah dimulai. Pengeditan tidak diizinkan saat ujian berlangsung.' }}
                 Jika ingin mengubah soal, silakan <button @click="openSectionModal(activeSectionId || undefined)" class="font-bold underline hover:text-amber-900">Promosikan ke Bank Soal</button> lalu buat batch baru.
              </p>
            </div>
         </div>

         <!-- Missing Answer Notification -->
         <div v-if="invalidQuestions.length > 0" class="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 shadow-sm animate-fade-in-down">
            <div class="p-2 bg-rose-100 rounded-xl text-rose-600 flex-shrink-0">
               <Icon name="lucide:alert-circle" class="w-5 h-5" />
            </div>
            <div class="flex-1">
               <div class="flex items-center justify-between">
                  <h3 class="font-bold text-rose-900 text-sm">Ada {{ invalidQuestions.length }} pertanyaan yang belum memiliki jawaban benar</h3>
               </div>
               <div class="mt-2 flex flex-wrap gap-2">
                  <div v-for="(iq, idx) in invalidQuestions" :key="idx" 
                       class="px-2 py-1 bg-white border border-rose-100 rounded-lg text-[10px] text-rose-700 font-medium flex items-center gap-1.5 shadow-sm">
                     <span class="opacity-60">{{ iq.sectionName }}</span>
                     <span class="w-1 h-1 rounded-full bg-rose-200"></span>
                     <span>Grup {{ iq.groupIndex }}</span>
                     <span class="w-1 h-1 rounded-full bg-rose-200"></span>
                     <span class="text-rose-900 font-bold">No. {{ iq.questionIndex }}</span>
                  </div>
               </div>
               <p class="text-[10px] text-rose-600 mt-2 italic">* Pastikan semua pertanyaan telah dipilih jawaban benarnya agar sistem penilaian berfungsi dengan benar.</p>
            </div>
         </div>

         <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center h-full text-center">
          <div class="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
            <Icon name="lucide:loader-2" class="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900">Memuat Data Ujian...</h3>
          <p class="text-slate-500 text-sm mt-1">Mohon tunggu sebentar.</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!activeSection" class="flex flex-col items-center justify-center h-full text-center p-8">
          <div class="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-200 flex items-center justify-center mb-6 rotate-3">
            <Icon name="lucide:layout-dashboard" class="w-12 h-12 text-slate-300" />
          </div>
          <h3 class="text-xl font-bold text-slate-900">Selamat Datang di Editor</h3>
          <p class="text-slate-500 mt-2 max-w-md mx-auto">Pilih bagian ujian dari panel samping atau buat bagian baru untuk mulai menyusun soal.</p>
          <button @click="openSectionModal()" class="mt-6 btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl">
            <Icon name="lucide:plus" class="w-4 h-4" />
            <span>Buat Bagian Baru</span>
          </button>
        </div>

        <div v-else-if="activeSection">
          <!-- Section Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">Section</span>
                <span class="text-xs text-slate-400 font-mono">ID: {{ activeSection.id }}</span>
              </div>
              <h2 class="text-3xl font-bold text-slate-900 tracking-tight">{{activeSection.name}}</h2>
            </div>
            <div class="flex items-center gap-2">
              <button @click="openSectionModal(activeSection.id)" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                <Icon name="lucide:settings-2" class="w-4 h-4" />
                <span>Pengaturan</span>
              </button>
              <button @click="onDeleteSection(activeSection.id)" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 text-sm font-medium rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
                <span>Hapus</span>
              </button>
            </div>
          </div>

          <!-- Gunakan :key untuk memaksa re-render saat activeSection berubah -->
          <!-- Ini cara yang lebih bersih daripada menggunakan watch untuk destroy/init editor -->
          <div :key="activeSection.id" class="bg-white p-6 rounded-2xl mb-8 shadow-sm border border-slate-200">
            <div class="flex items-center gap-2 mb-3">
              <div class="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                <Icon name="lucide:file-text" class="w-4 h-4" />
              </div>
              <label class="font-semibold text-slate-800">Instruksi Bagian</label>
            </div>
            <div class="bg-slate-50 p-1 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
              <!-- Pindahkan ClientOnly ke luar textarea untuk stabilitas -->
              <ClientOnly>
                <textarea :id="`section-${activeSection.id}`" @vue:mounted="initEditorFor(`section-${activeSection.id}`, () => activeSection.instructions, () => updateFromEditor(`section-${activeSection.id}`, html => activeSection.instructions = html))"></textarea>
              </ClientOnly>
            </div>
            <div class="flex justify-end mt-2">
              <button @click="toggleDir(`section-${activeSection.id}`)" class="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
                <Icon name="lucide:languages" class="w-3.5 h-3.5" />
                <span>Ubah Arah Teks</span>
              </button>
            </div>

            <!-- Audio Section for Section -->
            <div class="mt-6 pt-6 border-t border-slate-100">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                  <Icon name="lucide:headphones" class="w-4 h-4" />
                </div>
                <label class="font-semibold text-slate-800">Audio Bagian</label>
              </div>
              
              <div v-if="activeSection.audioUrl" class="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CustomAudioPlayer :src="`${config.public.MEDIA_URL}${activeSection.audioUrl}`" />
                <button @click="updateSectionMedia(activeSection.id, 'audioUrl', null)" class="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors flex-shrink-0" title="Hapus Audio">
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
              <div v-else>
                 <button @click="showSectionMediaModal = true" class="w-full flex items-center justify-center px-4 py-4 bg-white text-slate-500 rounded-xl border-2 border-dashed border-slate-300 cursor-pointer hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group">
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="lucide:music" class="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />
                    <span class="text-sm font-medium">Pilih Audio Bagian</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-6">
          <GroupCard v-for="(g,i) in activeSection.groups" :key="i" :group="g"
                     :section-id="activeSection.id" :group-index="i"
                     :groups-length="activeSection.groups.length"
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
          </div>

          <button @click="addGroup(activeSection.id)" class="mt-8 w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 flex items-center justify-center gap-2 group">
            <div class="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors"><Icon name="lucide:plus" class="w-5 h-5" /></div>
            <span class="font-medium">Tambah Grup Soal Baru</span>
          </button>
        </div>
      </div>
    </main>
    <SectionModal v-model="showModal" :payload="modalPayload" @save="onSaveSection" />
    <ImportBankModal v-model="showImportModal" :batch-id="examId" @imported="onSectionImported" />
    <ClientOnly>
      <EditorMediaLibraryModal
        v-model="showSectionMediaModal"
        :media-type="'audio'"
        @select="url => updateSectionMedia(activeSectionId, 'audioUrl', url)"
      />
    </ClientOnly>
  </div>
</template>