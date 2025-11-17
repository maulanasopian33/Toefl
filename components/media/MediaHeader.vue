<template>
  <div class="card">
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 border-b border-gray-100 pb-3"
    >
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Media Library</h2>
        <p class="text-xs text-gray-500">
          Kelola file audio, gambar, dan media pendukung soal TOAFL.
        </p>
      </div>

      <div class="flex gap-2 w-full md:w-auto justify-end">
        <button class="btn-primary px-4 py-2 text-xs sm:text-sm">
          Kelola Folder
        </button>
        <button
          class="btn-primary px-4 py-2 text-xs sm:text-sm"
          @click="$emit('openUpload')"
        >
          Upload Media
        </button>
      </div>
    </div>

    <!-- Stats ringkas -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 ring-1 ring-sky-100"
        >
          <Icon name="lucide:folder" class="w-5 h-5 text-sky-700" />
        </div>
        <div>
          <p class="text-[11px] text-gray-500 uppercase tracking-wide">
            Total Media
          </p>
          <p class="text-sm font-semibold text-gray-900">{{ totalItems }} file</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100"
        >
          <Icon name="lucide:image" class="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <p class="text-[11px] text-gray-500 uppercase tracking-wide">Gambar</p>
          <p class="text-sm font-semibold text-gray-900">{{ imageCount }} file</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100"
        >
          <Icon name="lucide:volume-2" class="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <p class="text-[11px] text-gray-500 uppercase tracking-wide">Audio</p>
          <p class="text-sm font-semibold text-gray-900">{{ audioCount }} file</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['totalItems', 'imageCount', 'audioCount']);
defineEmits(['openUpload']);
</script>