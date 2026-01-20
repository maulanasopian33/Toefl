// store/testSessionStore.ts
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
    sectionsData: [],
    allAnswers: [],
    fontSize: 'normal' as 'small' | 'normal' | 'large' | 'extra-large',
  }),
  actions: {
    setFontSize(size: 'small' | 'normal' | 'large' | 'extra-large') {
      this.fontSize = size;
    },
    setTestId(id: string) {
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
    },
  },
  persist: true,
});
