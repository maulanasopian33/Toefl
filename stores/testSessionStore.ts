// stores/testSessionStore.ts
import { defineStore } from 'pinia';

export const useTestSessionStore = defineStore('testSession', {
  state: () => ({
    testId: null as string | null,
    testMetadata: null as any,
    currentSectionIndex: 0,
    currentGroupIndex: 0,
    currentQuestionIndex: 0,
    timeLeft: 0,
    quizState: 'intro' as 'intro' | 'questions' | 'finished',
    sectionsData: [] as any[],
    allAnswers: [] as any[],
    fontSize: 'normal' as 'small' | 'normal' | 'large' | 'extra-large',
    isRestored: false,
  }),
  actions: {
    setFontSize(size: 'small' | 'normal' | 'large' | 'extra-large') {
      this.fontSize = size;
    },
    setTestId(id: string | null) {
      this.testId = id;
    },
    setTestMetadata(metadata: any) {
      this.testMetadata = metadata;
    },
    setCurrentSectionIndex(index: number) {
      this.currentSectionIndex = index;
    },
    setCurrentGroupIndex(index: number) {
      this.currentGroupIndex = index;
    },
    setCurrentQuestionIndex(index: number) {
      this.currentQuestionIndex = index;
    },
    setTimeLeft(time: number) {
      this.timeLeft = time;
    },
    setQuizState(state: 'intro' | 'questions' | 'finished') {
      this.quizState = state;
    },
    setSectionsData(data: any[]) {
      this.sectionsData = data;
    },
    setAllAnswers(answers: any[]) {
      this.allAnswers = answers;
    },
    setRestored(value: boolean) {
      this.isRestored = value;
    },
    saveProgress(data: Partial<{
      currentSectionIndex: number;
      currentGroupIndex: number;
      currentQuestionIndex: number;
      timeLeft: number;
      quizState: 'intro' | 'questions' | 'finished';
      sectionsData: any[];
    }>) {
      if (data.currentSectionIndex !== undefined) this.currentSectionIndex = data.currentSectionIndex;
      if (data.currentGroupIndex !== undefined) this.currentGroupIndex = data.currentGroupIndex;
      if (data.currentQuestionIndex !== undefined) this.currentQuestionIndex = data.currentQuestionIndex;
      if (data.timeLeft !== undefined) this.timeLeft = data.timeLeft;
      if (data.quizState !== undefined) this.quizState = data.quizState;
      if (data.sectionsData !== undefined) this.sectionsData = data.sectionsData;
    },
    clearSession() {
      this.testId = null;
      this.testMetadata = null;
      this.currentSectionIndex = 0;
      this.currentGroupIndex = 0;
      this.currentQuestionIndex = 0;
      this.timeLeft = 0;
      this.quizState = 'intro';
      this.sectionsData = [];
      this.allAnswers = [];
      this.isRestored = false;
    },
  },
  persist: {
    storage: localStorage,
    pick: ['testId', 'currentSectionIndex', 'currentGroupIndex', 'currentQuestionIndex', 'timeLeft', 'quizState', 'sectionsData', 'allAnswers', 'fontSize'],
  },
});
