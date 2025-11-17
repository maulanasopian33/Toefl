<template>
  <div
    v-if="item"
    class="fixed inset-0 z-40 bg-black/40 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <p class="text-sm font-semibold text-gray-900">Preview Media</p>
        <button
          class="text-gray-400 hover:text-gray-700"
          @click="$emit('close')"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>

      <div class="p-4 space-y-3">
        <p class="text-sm font-semibold text-gray-900">
          {{ item.originalName }}
        </p>
        <p class="text-xs text-gray-500">
          {{ item.mimeType }} • {{ formatSize(item.size) }} •
          {{ formatDate(item.createdAt) }}
        </p>

        <div
          class="mt-3 border border-dashed border-gray-200 rounded-lg p-3 flex items-center justify-center min-h-[120px] bg-gray-50"
        >
          <template v-if="item.type === 'image'">
            <img
              :src="item.url"
              :alt="item.originalName"
              class="max-h-64 max-w-full object-contain"
            />
          </template>
          <template v-else-if="item.type === 'audio'">
            <audio :src="item.url" controls class="w-full" />
          </template>
          <template v-else>
            <div class="flex flex-col items-center gap-2 text-gray-600 text-sm">
              <Icon name="lucide:file" class="w-8 h-8" />
              <span>Preview tidak tersedia. Unduh file untuk melihat.</span>
            </div>
          </template>
        </div>
      </div>

      <div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <button
          class="btn-small flex items-center gap-1"
          @click="$emit('download', item)"
        >
          <Icon name="lucide:download" class="w-3 h-3" />
          <span>Download</span>
        </button>
        <button
          class="btn-small text-red-600 border-red-100 hover:bg-red-50 flex items-center gap-1"
          @click="$emit('delete', item)"
        >
          <Icon name="lucide:trash-2" class="w-3 h-3" />
          <span>Hapus</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['item', 'formatSize', 'formatDate']);
defineEmits(['close', 'download', 'delete']);
</script>