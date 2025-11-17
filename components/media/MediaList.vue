<template>
  <div class="overflow-x-auto mt-2">
    <table class="w-full text-sm min-w-[640px]">
      <thead v-if="media.length">
        <tr
          class="text-left text-xs text-gray-500 bg-gray-50 border-y border-gray-100"
        >
          <th class="px-4 py-3 font-semibold">Nama Asli</th>
          <th class="px-4 py-3 font-semibold">Tipe</th>
          <th class="px-4 py-3 font-semibold">Ukuran</th>
          <th class="px-4 py-3 font-semibold">Diunggah</th>
          <th class="px-4 py-3 font-semibold text-right">Aksi</th>
        </tr>
      </thead>
      <tbody v-if="media.length">
        <tr
          v-for="item in media"
          :key="item.id"
          class="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
        >
          <td class="px-4 py-3 font-medium text-gray-800 truncate max-w-[220px]">
            {{ item.originalName }}
          </td>
          <td class="px-4 py-3">
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 capitalize"
            >
              <Icon
                v-if="item.type === 'image'"
                name="lucide:image"
                class="w-3 h-3"
              />
              <Icon
                v-else-if="item.type === 'audio'"
                name="lucide:volume-2"
                class="w-3 h-3"
              />
              <Icon v-else name="lucide:file" class="w-3 h-3" />
              {{ item.type }}
            </span>
          </td>
          <td class="px-4 py-3 text-gray-700">{{ formatSize(item.size) }}</td>
          <td class="px-4 py-3 text-gray-600">{{ formatDate(item.createdAt) }}</td>
          <td class="px-4 py-3 text-right">
            <div class="inline-flex items-center gap-1">
              <button
                class="btn-small text-[11px] flex items-center gap-1"
                @click="$emit('preview', item)"
              >
                <Icon name="lucide:eye" class="w-3 h-3" />
                Preview
              </button>
              <button
                class="btn-small text-[11px] flex items-center gap-1"
                @click="$emit('download', item)"
              >
                <Icon name="lucide:download" class="w-3 h-3" />
                Unduh
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="!media.length">
          <td colspan="5" class="py-6 text-center text-sm text-gray-500">
            Tidak ada media yang sesuai dengan filter.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps(['media', 'formatSize', 'formatDate']);
defineEmits(['preview', 'download']);
</script>