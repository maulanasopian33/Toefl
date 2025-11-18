<template>
  <article
    class="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-slate-200 hover:bg-slate-50/80 sm:p-5"
  >
    <div class="flex items-start gap-4">
      <!-- Icon level -->
      <div
        :class="levelInfo.bgColor"
        class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-black/5"
      >
        <Icon
          :name="levelInfo.icon"
          :class="levelInfo.iconColor"
          class="h-5 w-5 "
        />
      </div>

      <!-- Content -->
      <div class="flex-1 space-y-2">
        <!-- Header: message + user + time -->
        <div class="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <div class="space-y-1">
            <p class="text-sm font-semibold text-slate-900">
              {{ log.message }}
            </p>
            <p v-if="log.user" class="text-xs text-slate-500">
              Dilakukan oleh
              <span class="font-medium text-slate-700">
                {{ log.user }}
              </span>
            </p>
          </div>

          <p class="mt-0.5 flex-shrink-0 whitespace-nowrap text-xs text-slate-400">
            {{ formattedTimestamp }}
          </p>
        </div>

        <!-- Badges & actions -->
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px]">
          <span
            :class="levelInfo.badgeColor"
            class="inline-flex items-center rounded-full px-2.5 py-1 font-semibold"
          >
            {{ levelLabel }}
          </span>

          <span
            class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-mono font-medium text-slate-700"
          >
            {{ log.action }}
          </span>

          <span
            v-if="log.paymentId"
            class="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-500"
          >
            ID: {{ log.paymentId }}
          </span>

          <button
            v-if="hasDetails"
            @click="showDetails = !showDetails"
            class="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>
              {{ showDetails ? 'Sembunyikan Detail' : 'Lihat Detail' }}
            </span>
            <Icon
              name="lucide:chevron-down"
              class="h-3.5 w-3.5 transition-transform"
              :class="showDetails ? 'rotate-180' : ''"
            />
          </button>
        </div>

        <!-- Details -->
        <div v-if="showDetails && hasDetails" class="overflow-hidden rounded-lg border border-slate-200 bg-slate-100/80">
          <div
            class="border-b border-slate-200 bg-slate-200/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
          >
            Detail Perubahan
          </div>
          <div class="max-h-64 overflow-auto p-3 text-xs text-slate-800">
            <pre class="whitespace-pre-wrap break-all font-mono leading-relaxed text-xs">{{ formattedDetails }}</pre>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  log: {
    type: Object,
    required: true,
  },
});

const showDetails = ref(false);

const hasDetails = computed(() => {
  return props.log.details && Object.keys(props.log.details).length > 0;
});

const levelInfo = computed(() => {
  switch (props.log.level?.toLowerCase()) {
    case 'error':
      return {
        icon: 'lucide:shield-x',
        bgColor: 'bg-red-50',
        iconColor: 'text-red-600',
        badgeColor: 'bg-red-100 text-red-800',
      };
    case 'warn':
      return {
        icon: 'lucide:shield-alert',
        bgColor: 'bg-amber-50',
        iconColor: 'text-amber-600',
        badgeColor: 'bg-amber-100 text-amber-800',
      };
    default: // info
      return {
        icon: 'lucide:shield-check',
        bgColor: 'bg-sky-50',
        iconColor: 'text-blue-600',
        badgeColor: 'bg-blue-100 text-blue-800',
      };
  }
});

const levelLabel = computed(() => {
  switch (props.log.level?.toLowerCase()) {
    case 'error':
      return 'Error';
    case 'warn':
      return 'Peringatan';
    default:
      return 'Info';
  }
});

const formattedTimestamp = computed(() => {
  if (!props.log.timestamp) return '-';
  try {
    const d = new Date(props.log.timestamp);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch (e) {
    return props.log.timestamp;
  }
});

const formattedDetails = computed(() =>
  props.log.details ? JSON.stringify(props.log.details, null, 2) : ''
);
</script>
