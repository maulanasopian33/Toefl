import { defineStore } from 'pinia'
import type { Doc } from '@/composables/useDocs'

export const useDocPopupStore = defineStore('docPopup', {
  state: () => ({
    isOpen: false,
    isMinimized: false,
    currentDoc: null as Doc | null,
  }),
  actions: {
    openDoc(doc: Doc) {
      this.currentDoc = doc
      this.isOpen = true
      this.isMinimized = false
    },
    close() {
      this.isOpen = false
      this.currentDoc = null
    },
    toggleMinimize() {
      this.isMinimized = !this.isMinimized
    },
    minimize() {
      this.isMinimized = true
    },
    maximize() {
      this.isMinimized = false
    }
  }
})
