<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Dashboard Overview</h2>

    <DashboardStatGrid>
      <DashboardStatCard label="Total Pengguna" :value="counts?.user">
        <template #icon>
          <div class="bg-indigo-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </template>
      </DashboardStatCard>

      <DashboardStatCard label="Batch Aktif" :value="counts?.activeBatch">
        <template #icon>
          <div class="bg-green-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </template>
      </DashboardStatCard>

      <DashboardStatCard label="Total Soal" :value="counts?.question">
        <template #icon>
          <div class="bg-yellow-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </template>
      </DashboardStatCard>

      <DashboardStatCard label="Sesi Selesai" :value="counts?.finishedBatch">
        <template #icon>
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </template>
      </DashboardStatCard>
    </DashboardStatGrid>

    <div class="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Chart Section -->
      <div class="lg:col-span-2">
        <DashboardLineChart
          title="Pertumbuhan & Aktivitas"
          :categories="['Batch', 'Group']"
          seriesName="Total Data"
          :data="[{ data: series }]"
          color="#10b981"
        />
      </div>

      <!-- Recent Users -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
           <h3 class="font-bold text-slate-800 text-lg">Pendaftar Terbaru</h3>
           <NuxtLink to="/admin/users" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">Lihat Semua</NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th class="px-4 py-3 rounded-l-lg">User</th>
                <th class="px-4 py-3 rounded-r-lg">Waktu</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in recentActivity.users" :key="user.id" class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td class="px-4 py-3">
                  <div class="font-medium text-slate-900">{{ user.name || 'No Name' }}</div>
                  <div class="text-xs text-slate-500">{{ user.email }}</div>
                </td>
                <td class="px-4 py-3 text-slate-500 font-mono text-xs">
                  {{ new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) }}
                </td>
              </tr>
              <tr v-if="!recentActivity.users?.length">
                <td colspan="2" class="px-4 py-8 text-center text-slate-400 italic">Belum ada user baru.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Payments -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
           <h3 class="font-bold text-slate-800 text-lg">Transaksi Terakhir</h3>
           <NuxtLink to="/admin/payments" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">Lihat Semua</NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th class="px-4 py-3 rounded-l-lg">Nominal</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 rounded-r-lg">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pay, idx) in recentActivity.payments" :key="idx" class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td class="px-4 py-3 font-medium text-slate-900">
                  Rp {{ Number(pay.amount).toLocaleString('id-ID') }}
                </td>
                <td class="px-4 py-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    :class="{
                      'bg-green-100 text-green-700': pay.status === 'paid',
                      'bg-yellow-100 text-yellow-700': pay.status === 'pending',
                      'bg-red-100 text-red-700': pay.status === 'failed'
                    }">
                    {{ pay.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-500 font-mono text-xs">
                  {{ new Date(pay.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) }}
                </td>
              </tr>
              <tr v-if="!recentActivity.payments?.length">
                <td colspan="3" class="px-4 py-8 text-center text-slate-400 italic">Belum ada transaksi.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: stats, error, refresh } = useAdminStats()

const counts = computed(() => stats.value?.data?.counts || {})
const recentActivity = computed(() => stats.value?.data?.recentActivity || {})

const series = computed(() => [
  counts.value.batch || 0, 
  counts.value.group || 0
])
</script>

<script>
definePageMeta({
  layout: "admin",
  middleware: ['auth', 'role-check'],
  permission: 'dashboard.view',
})
</script>
