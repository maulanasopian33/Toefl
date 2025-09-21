<template>
  <div class="unauthorized-container">
    <div class="card">
      <h1>Akses Ditolak</h1>
      <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <p>Silakan kembali ke halaman yang dapat Anda akses.</p>
      <NuxtLink :to="link" class="btn-home">
        Kembali ke Halaman Utama
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
// Perbaikan logika: periksa jika data ada, lalu periksa rolenya.
const { data, error } = await useUserMe();
let link = ref("/"); // Berikan nilai default agar lebih aman

// Tangani kasus ketika data gagal diambil atau tidak ada.
// Jika ada error, arahkan ke halaman login (atau halaman lain yang sesuai).
if (error.value) {
    link.value = "/auth/login";
} else if (data.value) {
    // Jika data user tersedia, periksa rolenya
    if (data.value.role === "admin") {
        link.value = "/admin";
    } else {
        link.value = "/";
    }
}
</script>
<style scoped>
/* Styling sederhana agar tampilannya lebih rapi */
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: sans-serif;
  text-align: center;
}

.card {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

h1 {
  color: #d32f2f;
  margin-bottom: 10px;
}

p {
  color: #555;
  margin-bottom: 20px;
}

.btn-home {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-home:hover {
  background-color: #0056b3;
}
</style>