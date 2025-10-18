<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Dashboard Overview</h2>

    <DashboardStatGrid>
      <DashboardStatCard label="Total Batch" :value="stats?.batchCount">
        <template #icon>
          <div class="bg-blue-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3h12v2H4V3zM4 7h12v2H4V7zM4 11h12v2H4v-2zM4 15h12v2H4v-2z"/>
            </svg>
          </div>
        </template>
      </DashboardStatCard>

      <DashboardStatCard label="Total Group" :value="stats?.groupCount">
        <template #icon>
          <div class="bg-green-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 100 12 6 6 0 000-12zM2 18a8 8 0 1116 0H2z"/>
            </svg>
          </div>
        </template>
      </DashboardStatCard>

      <DashboardStatCard label="Total Questions" :value="stats?.questionCount">
        <template #icon>
          <div class="bg-yellow-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3h12v14H4V3z"/>
            </svg>
          </div>
        </template>
      </DashboardStatCard>

      <DashboardStatCard label="Total Audio" :value="stats?.audioCount">
        <template #icon>
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 10c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7z"/>
            </svg>
          </div>
        </template>
      </DashboardStatCard>
    </DashboardStatGrid>

    <div class="mt-10">
      <DashboardLineChart
        title="Jumlah User Per Bulan"
        :categories="['Batch', 'Group']"
        seriesName="User Baru"
        :data="[{ data: series }]"
        color="#10b981"
      />
    </div>
  </div>
</template>

<script setup>
const { data: stats, error, refresh } = useAdminStats()
const series = [stats.value?.batchCount || 0, stats.value?.groupCount || 0]
const options = {
  chart: { type: 'bar' },
  xaxis: { categories: ['Batch', 'Group'] }
}
</script>

<script>
definePageMeta({
  layout: "admin"
})
</script>
