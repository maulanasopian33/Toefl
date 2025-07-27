<template>
  <!-- Notifikasi Pembayaran Belum Selesai -->
    <div id="paymentPendingNotification" class="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg mb-6">
        <p class="font-semibold mb-2">Peringatan: Pembayaran Belum Selesai!</p>
        <p>Tes terakhir Anda sudah selesai, namun sertifikat belum dapat diunduh karena pembayaran belum diverifikasi.</p>
        <button id="goToPaymentButton" class="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out">
            Lakukan Pembayaran
        </button>
    </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>