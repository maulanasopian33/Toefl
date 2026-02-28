<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-left align-middle shadow-xl transition-all border border-gray-100">
              <DialogTitle as="h3" class="text-2xl font-black leading-6 text-gray-900 mb-8 flex items-center gap-3">
                 <div class="p-2 bg-emerald-100 rounded-2xl">
                    <Icon name="lucide:plus-circle" class="w-6 h-6 text-emerald-600" />
                 </div>
                 Tambah Pembayaran Manual
              </DialogTitle>
              
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Search & Select Participant -->
                <div class="space-y-2">
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none px-1">Pilih Peserta</label>
                  <div class="relative group">
                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                      <Icon name="lucide:search" class="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      v-model="searchQuery"
                      placeholder="Cari nama atau email peserta..."
                      class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 text-sm"
                      @input="handleSearch"
                    />
                  </div>
                  
                  <!-- Dropdown Hasil Pencarian -->
                  <div v-if="isSearching || searchResults.length" class="mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto z-10 p-2 space-y-1">
                    <div v-if="isSearching" class="p-4 text-center">
                       <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin text-emerald-500" />
                    </div>
                    <template v-else>
                      <button 
                        v-for="p in searchResults" 
                        :key="p.id"
                        type="button"
                        @click="selectParticipant(p)"
                        :class="['w-full text-left p-3 rounded-xl transition-all flex items-center justify-between', selectedParticipant?.id === p.id ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'hover:bg-gray-50']"
                      >
                        <div>
                          <p class="text-sm font-black">{{ p.user?.name || p.name }}</p>
                          <p class="text-[10px] font-bold text-gray-400">{{ p.user?.email || p.email }}</p>
                        </div>
                        <div class="text-right">
                           <span class="text-[9px] font-black uppercase tracking-wider bg-gray-100 px-1.5 py-0.5 rounded-md text-gray-500">{{ p.batch?.namaBatch || '-' }}</span>
                        </div>
                      </button>
                    </template>
                  </div>
                </div>

                <!-- Selected Participant Badge -->
                <div v-if="selectedParticipant" class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                   <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-emerald-100 text-emerald-600 shadow-sm">
                         <Icon name="lucide:user" class="w-5 h-5" />
                      </div>
                      <div>
                        <p class="text-xs font-black text-emerald-900 leading-tight">{{ selectedParticipant.user?.name || selectedParticipant.name }}</p>
                        <p class="text-[10px] font-bold text-emerald-600/70">{{ selectedParticipant.batch?.namaBatch || '-' }}</p>
                      </div>
                   </div>
                   <button @click="selectedParticipant = null" type="button" class="p-2 hover:bg-emerald-100 rounded-xl text-emerald-400 hover:text-emerald-600 transition-colors">
                      <Icon name="lucide:x" class="w-4 h-4" />
                   </button>
                </div>

                <!-- Amount Input -->
                <div class="space-y-2">
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none px-1">Jumlah Pembayaran (IDR)</label>
                  <div class="relative group">
                    <div class="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300 group-focus-within:text-emerald-500 transition-colors">Rp</div>
                    <input 
                      type="number" 
                      v-model.number="form.amount" 
                      required
                      placeholder="0"
                      class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-black text-gray-700 text-lg tabular-nums" 
                    />
                  </div>
                </div>

                <!-- Method -->
                <div class="space-y-2">
                   <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none px-1">Metode Pembayaran</label>
                   <div class="grid grid-cols-2 gap-3">
                      <button 
                        v-for="m in ['manual_transfer', 'manual']" 
                        :key="m"
                        type="button"
                        @click="form.method = m"
                        :class="['p-3 rounded-2xl border font-bold text-xs capitalize transition-all flex items-center justify-center gap-2', form.method === m ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' : 'bg-white text-gray-500 border-gray-100 hover:border-emerald-200']"
                      >
                         <Icon :name="m === 'manual_transfer' ? 'lucide:send' : 'lucide:coins'" class="w-4 h-4" />
                         {{ m.replace('_', ' ') }}
                      </button>
                   </div>
                </div>

                <!-- Footer Actions -->
                <div class="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
                  <button 
                    type="button"
                    @click="closeModal"
                    class="px-6 py-3 rounded-2xl text-gray-700 hover:bg-gray-100 font-bold transition-colors text-sm"
                  >
                     Batal
                  </button>
                  <button 
                    type="submit"
                    :disabled="!selectedParticipant || !form.amount || isSubmitting"
                    class="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-600/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                     <Icon v-if="isSubmitting" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                     <Icon v-else name="lucide:check-circle" class="w-4 h-4" />
                     Simpan Pembayaran
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { usePayments } from '@/composables/usePayments';
import { useFirebaseToken } from '@/composables/FirebaseToken';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'created']);

const { createPayment } = usePayments();
const isSubmitting = ref(false);

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const selectedParticipant = ref(null);

const form = reactive({
  participantId: '',
  amount: null,
  method: 'manual_transfer',
});

let searchTimeout = null;

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  searchTimeout = setTimeout(async () => {
    try {
      const config = useRuntimeConfig();
      const token = await useFirebaseToken();
      // Search participants endpoint
      const response = await $fetch(`${config.public.API_URL}/participants`, {
        params: { search: searchQuery.value, limit: 10 },
        headers: { Authorization: `Bearer ${token}` }
      });
      searchResults.value = response.data || [];
    } catch (e) {
      console.error('Search failed', e);
    } finally {
      isSearching.value = false;
    }
  }, 500);
};

const selectParticipant = (p) => {
  selectedParticipant.value = p;
  form.participantId = p.id;
  searchQuery.value = '';
  searchResults.value = [];
};

const closeModal = () => {
  emit('update:modelValue', false);
  // Reset form
  selectedParticipant.value = null;
  form.participantId = '';
  form.amount = null;
  searchQuery.value = '';
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    await createPayment(form);
    emit('created');
    closeModal();
  } catch (e) {
    console.error('Create payment failed', e);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
