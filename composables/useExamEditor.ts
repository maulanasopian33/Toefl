import { ref, computed } from 'vue'

// --- Mendefinisikan Tipe Data (Sangat disarankan) ---
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  audioUrl?: string | null;
}

interface Group {
  id: string;
  passage: string;
  audioUrls: string[];
  isCollapsed: boolean;
  questions: Question[];
}

interface Section {
  id: string;
  name: string;
  type: string;
  instructions: string;
  audioInstructions?: string | null;
  groups: Group[];
  scoring_table_id?: number | null;
}

// --- State Utama (tipe data langsung array dari Section) ---

// Inisialisasi `data` dengan struktur yang benar.
// `sections` harus selalu berupa array.
const data = ref<Section[]>([]);

const activeSectionId = ref<string | null>(null);
const isSidebarOpen = ref(true);

export function useExamEditor() {

  // --- Computed Properties (dibuat murni read-only) ---
  const activeSection = computed(() => {
    return data.value.find(s => s.id === activeSectionId.value) || null;
  });

  // --- Functions (Mutations) ---

  const setActiveSection = (id: string) => {
    activeSectionId.value = id;
  };

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const saveSectionDetails = (payload: { id?: string; name: string; type: string; instructions: string; scoring_table_id?: number | null }) => {
    console.log("payload", payload);

    if (payload.id) { // Update
      const section = data.value.find(s => s.id === payload.id);
      console.log("section", section);
      console.log("data", data);

      if (section) {
        section.name = payload.name;
        section.type = payload.type;
        section.scoring_table_id = payload.scoring_table_id;
      } else {
        data.value.push({
          id: payload.id,
          name: payload.name,
          type: payload.type,
          instructions: payload.instructions || '',
          scoring_table_id: payload.scoring_table_id,
          groups: []
        });
      }
    } else { // Create
      console.log("buat baru");

      data.value.push({
        id: `section-${Date.now()}`,
        name: payload.name,
        type: payload.type,
        instructions: payload.instructions || '',
        scoring_table_id: payload.scoring_table_id,
        groups: []
      });
    }
  };

  const deleteSection = (id: string) => {
    const index = data.value.findIndex(s => s.id === id);
    if (index > -1) {
      data.value.splice(index, 1);
      if (activeSectionId.value === id) {
        activeSectionId.value = data.value.length > 0 ? data.value[0].id : null;
      }
    }
  };

  const updateSectionMedia = (sectionId: string, field: 'audioInstructions', value: string | null) => {
    const section = data.value.find(s => s.id === sectionId);
    if (section) {
      section[field] = value;
    }
  };

  const addGroup = (sectionId: string) => {
    const section = data.value.find(s => s.id === sectionId);
    if (section) {
      section.groups.push({
        id: `group-${Date.now()}`,
        passage: '',
        isCollapsed: false,
        audioUrls: [],
        questions: []
      });
    }
  };

  const deleteGroup = (sectionId: string, groupIndex: number) => {
    const section = data.value.find(s => s.id === sectionId);
    if (section) {
      section.groups.splice(groupIndex, 1);
    }
  };

  const moveGroup = (sectionId: string, groupIndex: number, direction: 'up' | 'down') => {
    const section = data.value.find(s => s.id === sectionId);
    if (!section) return;
    const newIndex = direction === 'up' ? groupIndex - 1 : groupIndex + 1;
    if (newIndex >= 0 && newIndex < section.groups.length) {
      const [movedGroup] = section.groups.splice(groupIndex, 1);
      section.groups.splice(newIndex, 0, movedGroup);
    }
  };

  const toggleGroup = (sectionId: string, groupIndex: number) => {
    const section = data.value.find(s => s.id === sectionId);
    if (section && section.groups[groupIndex]) {
      section.groups[groupIndex].isCollapsed = !section.groups[groupIndex].isCollapsed;
    }
  };

  const updateGroupMedia = (sectionId: string, groupIndex: number, action: 'add' | 'delete', field: 'audioUrls', value: string | number) => {
    const section = data.value.find(s => s.id === sectionId);
    if (section?.groups[groupIndex]) {
      const group = section.groups[groupIndex];
      if (action === 'add') {
        if (!group.audioUrls) group.audioUrls = [];
        group.audioUrls.push(value as string);
      } else if (action === 'delete') {
        group.audioUrls.splice(value as number, 1);
      }
    }
  };

  const addQuestion = (sectionId: string, groupIndex: number) => {
    const section = data.value.find(s => s.id === sectionId);
    if (section && section.groups[groupIndex]) {
      section.groups[groupIndex].questions.push({
        id: `question-${Date.now()}`,
        question: '',
        options: [],
        correctAnswer: ''
      });
    }
  };

  const deleteQuestion = (sectionId: string, groupIndex: number, questionIndex: number) => {
    const section = data.value.find(s => s.id === sectionId);
    if (section && section.groups[groupIndex]) {
      section.groups[groupIndex].questions.splice(questionIndex, 1);
    }
  };

  const moveQuestion = (sectionId: string, groupIndex: number, questionIndex: number, direction: 'up' | 'down') => {
    const section = data.value.find(s => s.id === sectionId);
    if (!section || !section.groups[groupIndex]) return;

    const questions = section.groups[groupIndex].questions;
    const newIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1;

    if (newIndex >= 0 && newIndex < questions.length) {
      const [movedQuestion] = questions.splice(questionIndex, 1);
      questions.splice(newIndex, 0, movedQuestion);
    }
  };

  const updateOption = (sectionId: string, groupIndex: number, questionIndex: number, optionIndex: number, text: string) => {
    const section = data.value.find(s => s.id === sectionId);
    if (section?.groups[groupIndex]?.questions[questionIndex]?.options) {
      section.groups[groupIndex].questions[questionIndex].options[optionIndex] = text;
    }
  };

  const addOption = (sectionId: string, groupIndex: number, questionIndex: number) => {
    const section = data.value.find(s => s.id === sectionId);
    if (section?.groups[groupIndex]?.questions[questionIndex]) {
      const question = section.groups[groupIndex].questions[questionIndex];
      // Pastikan array options ada sebelum push
      if (!question.options) {
        question.options = [];
      }
      question.options.push(''); // Tambah opsi baru yang kosong
    }
  };

  const deleteOption = (sectionId: string, groupIndex: number, questionIndex: number, optionIndex: number) => {
    const section = data.value.find(s => s.id === sectionId);
    if (section?.groups[groupIndex]?.questions[questionIndex]?.options) {
      section.groups[groupIndex].questions[questionIndex].options.splice(optionIndex, 1);
    }
  };

  const updateQuestionMedia = (sectionId: string, groupIndex: number, questionIndex: number, field: 'audioUrl', value: string | null) => {
    const section = data.value.find(s => s.id === sectionId);
    if (section?.groups[groupIndex]?.questions[questionIndex]) {
      section.groups[groupIndex].questions[questionIndex][field] = value;
    }
  };

  const reorderSections = (newList: { id: string; name: string }[]) => {
    const reordered = newList.map(item => {
      return data.value.find(s => s.id === item.id)!;
    }).filter(Boolean);
    data.value = reordered;
  };

  return {
    data,
    activeSectionId,
    isSidebarOpen,
    activeSection,
    setActiveSection,
    toggleSidebar,
    saveSectionDetails,
    deleteSection,
    updateSectionMedia,
    addGroup,
    moveGroup,
    deleteGroup,
    toggleGroup,
    updateGroupMedia,
    addQuestion,
    deleteQuestion,
    moveQuestion,
    updateOption,
    addOption,
    deleteOption,
    updateQuestionMedia,
    reorderSections,
  };
}