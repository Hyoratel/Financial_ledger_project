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
import { computed } from 'vue';
import { onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import MonthlySummaryCard from '@/components/MonthlySummaryCard.vue';
import RecentTransactionList from '@/components/RecentTransactionList.vue';

const store = useTransactionStore();

onMounted(() => {
  store.fetchTransactions();
});

const transactions = computed(() => store.filteredTransactionsByMonth);
const selectedMonth = computed(() => store.selectedMonth);

// 총 수입 계산
const totalIncome = computed(() =>
  transactions.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

// 총 지출 계산
const totalExpense = computed(() =>
  transactions.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

// 순수입 계산
const netIncome = computed(() => totalIncome.value - totalExpense.value);

// 피드백 문구 계산
const feedbackComment = computed(() => {
  const ratio = totalIncome.value
    ? ((totalIncome.value - totalExpense.value) / totalIncome.value) * 100
    : 0;
  if (ratio >= 75) return '이번 달은 여유롭네요!';
  if (ratio >= 50) return '이번 달은 괜찮은 편이에요.';
  if (ratio >= 25) return '이번 달은 조금 아껴야 해요.';
  return '이번 달은 적자입니다...!';
});

// 월 변경 함수
function changeMonth(offset) {
  const [year, month] = store.selectedMonth.split('-').map(Number);
  const newDate = new Date(year, month - 1 + offset);
  const newMonth = `${newDate.getFullYear()}-${String(
    newDate.getMonth() + 1
  ).padStart(2, '0')}`;
  store.setSelectedMonth(newMonth);
}
</script>
