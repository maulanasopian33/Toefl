import { ref } from 'vue'

export interface CertificateTemplate {
  id: string
  name: string
  templateFile: string // URL/Path to DOCX file
  previewImage?: string // Optional: generated preview of the docx
  isActive: boolean
  createdAt: string
  config?: any 
}

export function useCertificateTemplates() {
  const templates = ref<CertificateTemplate[]>([
    {
      id: 'tmpl-001',
      name: 'Modern Classic Template',
      templateFile: '/templates/classic.docx',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'tmpl-002',
      name: 'Professional Blue Template',
      templateFile: '/templates/professional-blue.docx',
      isActive: false,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'tmpl-003',
      name: 'Elegant Gold Template',
      templateFile: '/templates/elegant-gold.docx',
      isActive: false,
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ])
  
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const fetchTemplates = async () => {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    isLoading.value = false
  }

  const addTemplate = async (template: Omit<CertificateTemplate, 'id' | 'createdAt' | 'isActive'>) => {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const newTemplate: CertificateTemplate = {
      ...template,
      id: `tmpl-${Date.now()}`,
      isActive: false,
      createdAt: new Date().toISOString()
    }
    
    templates.value.unshift(newTemplate)
    isLoading.value = false
    return newTemplate
  }

  const updateTemplate = async (id: string, data: Partial<CertificateTemplate>) => {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = templates.value.findIndex(t => t.id === id)
    if (index !== -1) {
      templates.value[index] = { ...templates.value[index], ...data }
    }
    isLoading.value = false
  }

  const deleteTemplate = async (id: string) => {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 400))
    
    templates.value = templates.value.filter(t => t.id !== id)
    isLoading.value = false
  }

  const setActiveTemplate = async (id: string) => {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 300))
    
    templates.value = templates.value.map(t => ({
      ...t,
      isActive: t.id === id
    }))
    isLoading.value = false
  }

  return {
    templates,
    isLoading,
    error,
    fetchTemplates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    setActiveTemplate
  }
}
