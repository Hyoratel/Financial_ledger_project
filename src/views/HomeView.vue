<script setup>
import MonthlySummary from '@/components/MonthlySummary.vue';
import RecentTransactionList from '@/components/RecentTransactionList.vue';
</script>

<template>
  <!-- 390 x 844 기준 콘텐츠 박스 -->
  <div
    class="w-100 d-flex flex-column align-items-center"
    style="max-width: 390px; margin: 0 auto"
  >
    <!-- ✅ 콘텐츠 영역 -->
    <div class="w-100 p-3 d-flex flex-column gap-1">
      <MonthlySummary />
      <RecentTransactionList />
    </div>
  </div>
</template>

<style scoped>
/* 필요 시 스타일 작성 */
</style>
