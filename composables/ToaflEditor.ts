import { ref, computed } from 'vue'

export function useToaflEditor() {
  const data = ref([
    {
      id: 'reading',
      name: "Qira'ah (Membaca)",
      type: "Qira'ah",
      instructions: "Petunjuk awal...",
      groups: [
        {
          passage: "هَذَا بَيْتِي...",
          mediaUrl: "",
          mediaType: "image",
          isCollapsed: false,
          questions: [
            { id: "R1", type: "Qira'ah", question: "كم عدد الغرف؟", options: ["ثلاث", "أربع"], correctAnswer: "أربع" }
          ]
        }
      ]
    }
  ])

  const activeSectionId = ref('reading')
  const isSidebarOpen = ref(false)
  const activeSection = computed(()=>data.value.find(s=>s.id===activeSectionId.value))

  function setActiveSection(id:string){activeSectionId.value=id}
  function toggleSidebar(force=false){isSidebarOpen.value=force?false:!isSidebarOpen.value}

  function saveSectionDetails(p:any){
    const id=p.id.toLowerCase()
    const i=data.value.findIndex(s=>s.id===id)
    if(i>=0) data.value[i]={...data.value[i],...p}
    else data.value.push({...p,id,groups:[]})
  }
  function deleteSection(id:string){
    const i=data.value.findIndex(s=>s.id===id)
    if(i>=0)data.value.splice(i,1)
    activeSectionId.value=data.value[0]?.id||''
  }

  function addGroup(id:string){
    const s=data.value.find(x=>x.id===id)
    if(!s)return
    s.groups.push({
      passage:"Teks baru",
      mediaUrl:"",
      mediaType:"image",
      isCollapsed:false,
      questions:[{id:'Q'+Date.now(),type:s.type,question:'Soal baru',options:['A','B'],correctAnswer:'A'}]
    })
  }
  function toggleGroup(id:string,i:number){
    const s=data.value.find(x=>x.id===id)
    if(!s)return
    s.groups[i].isCollapsed=!s.groups[i].isCollapsed
  }
  function moveGroup(id:string,i:number,d:number){
    const s=data.value.find(x=>x.id===id)
    if(!s)return
    const n=i+d;if(n<0||n>=s.groups.length)return
    const [g]=s.groups.splice(i,1);s.groups.splice(n,0,g)
  }
  function deleteGroup(id:string,i:number){
    const s=data.value.find(x=>x.id===id)
    if(!s)return;s.groups.splice(i,1)
  }
  function updateGroupMedia(id:string,i:number,f:string,v:string){
    const s=data.value.find(x=>x.id===id)
    if(!s)return
    if(f==='type')s.groups[i].mediaType=v
    else s.groups[i].mediaUrl=v
  }

  function addQuestion(id:string,i:number){
    const s=data.value.find(x=>x.id===id)
    if(!s)return
    s.groups[i].questions.push({id:'Q'+Date.now(),type:s.type,question:'Soal baru',options:['A','B'],correctAnswer:'A'})
  }
  function deleteQuestion(id:string,i:number,q:number){
    const s=data.value.find(x=>x.id===id);if(!s)return
    s.groups[i].questions.splice(q,1)
  }
  function moveQuestion(id:string,i:number,q:number,d:number){
    const s=data.value.find(x=>x.id===id);if(!s)return
    const qs=s.groups[i].questions
    const n=q+d;if(n<0||n>=qs.length)return
    const [x]=qs.splice(q,1);qs.splice(n,0,x)
  }
  function updateOption(id:string,i:number,q:number,o:number,t:string){
    const s=data.value.find(x=>x.id===id);if(!s)return
    s.groups[i].questions[q].options[o]=t
  }
  function addOption(id:string,i:number,q:number){
    const s=data.value.find(x=>x.id===id);if(!s)return
    s.groups[i].questions[q].options.push('Opsi baru')
  }
  function deleteOption(id:string,i:number,q:number,o:number){
    const s=data.value.find(x=>x.id===id);if(!s)return
    s.groups[i].questions[q].options.splice(o,1)
  }

  return {data,activeSectionId,isSidebarOpen,activeSection,
    setActiveSection,toggleSidebar,saveSectionDetails,deleteSection,
    addGroup,moveGroup,deleteGroup,toggleGroup,updateGroupMedia,
    addQuestion,deleteQuestion,moveQuestion,updateOption,addOption,deleteOption}
}
