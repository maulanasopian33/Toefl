<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Buat Pembayaran Manual</h1>
        <p class="text-sm text-gray-500 mt-1">
          Membuat tagihan baru untuk peserta secara manual.
        </p>
      </div>
      <NuxtLink to="/admin/payments" class="btn-small">
        &larr; Kembali
      </NuxtLink>
    </div>

    <div class="card">
      <form @submit.prevent="submitPayment" class="p-6 space-y-6">
        <!-- Peserta -->
        <div>
          <label for="participant" class="label">Pilih Peserta</label>
          <select id="participant" v-model="form.participantId" class="input w-full" required>
            <option disabled value="">Pilih salah satu peserta...</option>
            <option v-for="p in participants" :key="p.id" :value="p.id">
              {{ p.user.name }} ({{ p.user.email }}) - Batch: {{ p.batch.namaBatch }}
            </option>
          </select>
          <p v-if="participantsLoading" class="text-xs text-gray-500 mt-1">Memuat daftar peserta...</p>
          <p v-if="participantsError" class="text-xs text-red-500 mt-1">Gagal memuat peserta.</p>
        </div>

        <!-- Jumlah -->
        <div>
          <label for="amount" class="label">Jumlah (Amount)</label>
          <input id="amount" type="number" v-model.number="form.amount" class="input w-full" placeholder="Contoh: 150000" required />
        </div>

        <!-- Metode -->
        <div>
          <label for="method" class="label">Metode Pembayaran</label>
          <select id="method" v-model="form.method" class="input w-full" required>
            <option value="manual_transfer">Transfer Manual</option>
            <option value="manual">Manual (Lainnya)</option>
          </select>
        </div>

        <!-- Tombol Aksi -->
        <div class="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting">Menyimpan...</span>
            <span v-else>Simpan Pembayaran</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { usePayments } from '@/composables/usePayments';
import { useNotification } from '@/composables/useNotification';

definePageMeta({
  title: 'Add Payment - Admin Panel',
  layout: 'admin',
});

const { createPayment } = usePayments();
const { showNotification } = useNotification();
const router = useRouter();

const form = reactive({
  participantId: '',
  amount: null,
  method: 'manual_transfer',
});

const isSubmitting = ref(false);

// --- Fetch Participants ---
const participants = ref([]);
const participantsLoading = ref(false);
const participantsError = ref(null);

const fetchParticipants = async () => {
  participantsLoading.value = true;
  participantsError.value = null;
  try {
    // Asumsi endpoint untuk mengambil semua peserta adalah /api/participants
    const { data } = await useFetch('/participants', {
      headers: { Authorization: `Bearer ${await useFirebaseToken()}` },
    });
    participants.value = data.value?.data || [];
  } catch (err) {
    participantsError.value = err;
  } finally {
    participantsLoading.value = false;
  }
};

onMounted(fetchParticipants);

const submitPayment = async () => {
  isSubmitting.value = true;
  try {
    await createPayment(form);
    showNotification('Pembayaran baru berhasil dibuat.', 'success');
    router.push('/admin/payments');
  } catch (err) {
    console.error('Gagal membuat pembayaran:', err);
    showNotification(err.data?.message || 'Gagal membuat pembayaran.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>