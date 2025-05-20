<script setup>
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import MonthlySummary from '@/components/MonthlySummary.vue';
import RecentTransactionList from '@/components/RecentTransactionList.vue';

// ✅ Pinia 스토어 불러오기
const store = useTransactionStore();

// ✅ props로 넘겨줄 값들
const transactions = computed(() => store.transactions);
const selectedMonth = computed(() => store.selectedMonth);
</script>

<template>
  <!-- 390 x 844 기준 콘텐츠 박스 -->
  <div
    class="w-100 d-flex flex-column align-items-center"
    style="max-width: 390px; margin: 0 auto"
  >
    <!-- ✅ 콘텐츠 영역 -->
    <div class="w-100 p-3 d-flex flex-column gap-1">
      <MonthlySummary
        :transactions="transactions"
        :selectedMonth="selectedMonth"
      />
      <RecentTransactionList />
    </div>
  </div>
</template>

<style scoped>
/* 필요 시 스타일 작성 */
</style>
