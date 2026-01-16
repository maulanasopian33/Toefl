<template>
  <div
    v-if="item"
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
           <h3 class="text-sm font-bold text-gray-900 truncate max-w-[250px]">{{ item.originalName }}</h3>
           <p class="text-xs text-gray-500">{{ item.mimeType }} • {{ formatSize(item.size) }}</p>
        </div>
        <button
          class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          @click="$emit('close')"
        >
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 bg-gray-50 flex-1 overflow-y-auto flex items-center justify-center">
        <div class="w-full flex items-center justify-center">
           <template v-if="item.type === 'image'">
             <div class="relative rounded-lg overflow-hidden shadow-sm bg-white border border-gray-200">
               <img
                 :src="getFullUrl ? getFullUrl(item.url) : item.url"
                 :alt="item.originalName"
                 class="max-h-[60vh] max-w-full object-contain"
               />
             </div>
           </template>
           <template v-else-if="item.type === 'audio'">
             <div class="w-full max-w-sm bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div class="flex items-center justify-center mb-4 text-amber-500">
                   <div class="p-3 bg-amber-50 rounded-full">
                      <Icon name="lucide:music" class="w-8 h-8" />
                   </div>
                </div>
                <audio :src="getFullUrl ? getFullUrl(item.url) : item.url" controls class="w-full" />
             </div>
           </template>
           <template v-else>
             <div class="flex flex-col items-center gap-3 text-gray-400 py-10">
               <Icon name="lucide:file-question" class="w-16 h-16 opacity-50" />
               <span class="text-sm font-medium">Pratinjau tidak tersedia</span>
             </div>
           </template>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-5 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
        <button
          class="flex-1 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
          @click="$emit('download', item)"
        >
          <Icon name="lucide:download" class="w-4 h-4" />
          <span>Download</span>
        </button>
        <button
          class="flex-1 px-4 py-2 bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
          @click="$emit('delete', item)"
        >
          <Icon name="lucide:trash-2" class="w-4 h-4" />
          <span>Hapus File</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['item', 'formatSize', 'formatDate', 'getFullUrl']);
defineEmits(['close', 'download', 'delete']);
</script>