<template>
  <div
    class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 border-b border-gray-100 pb-3"
  >
    <h3 class="card-title mb-0">Daftar Media</h3>

    <div class="flex flex-col md:flex-row md:items-center gap-2 w-full lg:w-auto">
      <!-- Filter Tipe -->
      <div
        class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full md:w-auto"
      >
        <Icon name="lucide:filter" class="w-4 h-4 text-gray-400 flex-shrink-0" />
        <select
          :value="selectedType"
          @input="$emit('update:selectedType', $event.target.value)"
          class="input !border-0 !bg-transparent !px-0 !py-0 text-xs sm:text-sm"
        >
          <option value="">Semua Tipe</option>
          <option value="image">Gambar</option>
          <option value="audio">Audio</option>
          <option value="file">File Lainnya</option>
        </select>
      </div>

      <!-- Search -->
      <div
        class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64"
      >
        <Icon name="lucide:search" class="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          :value="q"
          @input="$emit('update:q', $event.target.value)"
          placeholder="Cari nama asli file..."
          class="input !border-0 !bg-transparent !px-0 !py-0 text-xs sm:text-sm"
        />
      </div>

      <!-- Toggle view -->
      <div
        class="inline-flex items-center rounded-lg border border-gray-200 overflow-hidden bg-gray-50"
      >
        <button
          @click="$emit('update:viewMode', 'grid')"
          :class="[
            'px-3 py-1.5 text-xs flex items-center gap-1',
            viewMode === 'grid'
              ? 'bg-white text-gray-900'
              : 'text-gray-500 hover:text-gray-800',
          ]"
        >
          <Icon name="lucide:grid-3x3" class="w-3 h-3" />
          Grid
        </button>
        <button
          @click="$emit('update:viewMode', 'list')"
          :class="[
            'px-3 py-1.5 text-xs flex items-center gap-1 border-l border-gray-200',
            viewMode === 'list'
              ? 'bg-white text-gray-900'
              : 'text-gray-500 hover:text-gray-800',
          ]"
        >
          <Icon name="lucide:list" class="w-3 h-3" />
          List
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['q', 'selectedType', 'viewMode']);
defineEmits(['update:q', 'update:selectedType', 'update:viewMode']);
</script>