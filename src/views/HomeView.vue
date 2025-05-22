<template>
  <div
    class="w-100 d-flex flex-column align-items-center"
    style="max-width: 390px; margin: 0 auto"
  >
    <!-- 공통 상단 요약 카드 -->
    <MonthlySummaryCard
      :selectedMonth="selectedMonth"
      :totalIncome="totalIncome"
      :totalExpense="totalExpense"
      :netIncome="netIncome"
      :feedbackComment="feedbackComment"
      @change-month="changeMonth"
    />

    <!-- 거래 리스트 -->
    <div class="w-100 p-3 d-flex flex-column gap-1">
      <RecentTransactionList :transactions="transactions" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMonthlySummary } from '@/composables/useMonthlySummary'; // ✅ 통합된 로직
import MonthlySummaryCard from '@/components/MonthlySummaryCard.vue';
import RecentTransactionList from '@/components/RecentTransactionList.vue';

const store = useTransactionStore();

onMounted(() => {
  store.fetchTransactions();
});

const selectedMonth = computed(() => store.selectedMonth);

// 현재 월의 거래 내역
const transactions = computed(() => store.filteredTransactionsByMonth);

// ✅ 통합된 계산 로직 사용 (수입/지출/순수입/비율/피드백)
const { totalIncome, totalExpense, netIncome, feedbackComment } =
  useMonthlySummary(transactions);

// ✅ 월 변경 함수
function changeMonth(offset) {
  const [year, month] = store.selectedMonth.split('-').map(Number);
  const newDate = new Date(year, month - 1 + offset);
  const newMonth = `${newDate.getFullYear()}-${String(
    newDate.getMonth() + 1
  ).padStart(2, '0')}`;
  store.setSelectedMonth(newMonth);
}
</script>
