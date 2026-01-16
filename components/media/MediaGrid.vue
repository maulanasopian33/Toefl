<template>
  <div class="mt-2">
    <div
      v-if="media.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <div
        v-for="item in media"
        :key="item.id"
        class="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-sm transition-shadow"
      >
        <!-- Preview -->
        <div class="h-32 bg-gray-50 flex items-center justify-center relative group">
          <template v-if="item.type === 'image'">
            <img
              :src="getFullUrl ? getFullUrl(item.url) : item.url"
              :alt="item.originalName"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </template>
          <template v-else-if="item.type === 'audio'">
            <Icon name="lucide:volume-2" class="w-8 h-8 text-amber-600" />
            <div class="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </template>
          <template v-else>
            <Icon name="lucide:file" class="w-8 h-8 text-slate-500" />
          </template>

          <span
            class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white capitalize z-10"
          >
            {{ item.type }}
          </span>
        </div>

        <!-- Info -->
        <div class="px-3 py-3 space-y-1">
          <p class="text-xs font-semibold text-gray-900 truncate" :title="item.originalName">
            {{ item.originalName }}
          </p>
          <p class="text-[11px] text-gray-500 truncate" :title="item.filename">
            {{ item.filename }}
          </p>
          <p class="text-[11px] text-gray-400">
            {{ formatSize(item.size) }} • {{ formatDate(item.createdAt) }}
          </p>

          <div class="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
            <button
               class="px-2 py-1 bg-white hover:bg-gray-100 text-[11px] font-medium text-gray-700 border border-gray-200 rounded-lg flex items-center gap-1.5 transition-colors"
               @click="$emit('preview', item)"
            >
               <Icon name="lucide:eye" class="w-3 h-3" />
               Preview
            </button>
            <button
               class="px-2 py-1 bg-white hover:bg-blue-50 text-[11px] font-medium text-blue-600 border border-blue-100 rounded-lg flex items-center gap-1.5 transition-colors"
               @click="$emit('download', item)"
            >
               <Icon name="lucide:download" class="w-3 h-3" />
               Unduh
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-12 text-center flex flex-col items-center text-gray-500">
       <Icon name="lucide:filter-x" class="w-8 h-8 mb-2 opacity-50" />
       Tidak ada media yang sesuai dengan filter.
    </div>
  </div>
</template>

<script setup>
defineProps(['media', 'formatSize', 'formatDate', 'getFullUrl']);
defineEmits(['preview', 'download']);
</script>