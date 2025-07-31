interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  userAnswer: string | null;
  passage?: string; // Ditambahkan untuk pertanyaan individu jika tidak ada grup passage
  audioUrl?: string; // Ditambahkan untuk pertanyaan individu jika tidak ada grup audio
}

interface QuestionGroup {
  passage?: string;
  audioUrl?: string;
  questions: Question[];
}

interface Section {
  id: string;
  name: string;
  type: string;
  instructions: string;
  groups: QuestionGroup[];
  audioInstructions?: string;
}