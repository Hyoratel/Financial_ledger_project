<template>
  <!-- 월간 피드백 카드 -->
  <div class="card p-3 mb-4 shadow-sm text-center w-100 Bbox">
    <div class="d-flex align-items-center gap-2 my-6 px-2">
      <p class="fw-bold fs-3" style="color: #ffc107">한달을 돌아보며...</p>
    </div>
    <p class="small fw-semibold text-muted fs-6 px-2">
      {{ feedbackComment }}
    </p>
    <div class="summary-box text-start text-center">
      <div>
        <span class="fw-bold text-primary">
          총 수입: {{ totalIncome.toLocaleString() }} 원
        </span>
      </div>
      <div>
        <span class="fw-bold text-danger">
          총 지출: {{ totalExpense.toLocaleString() }} 원
        </span>
      </div>
      <div>
        <span :class="netIncomeClass" class="fw-bold">
          순 수입 : {{ (totalIncome - totalExpense).toLocaleString() }} 원
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  selectedMonth: {
    type: String,
    required: true,
  },
});

// 선택된 월의 거래 필터링
const transactionsForMonth = computed(() =>
  props.transactions.filter((tx) => tx.date.startsWith(props.selectedMonth))
);

const totalIncome = computed(() =>
  transactionsForMonth.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

const totalExpense = computed(() =>
  transactionsForMonth.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

const netIncome = computed(() => totalIncome.value - totalExpense.value);

const netIncomeClass = computed(() => {
  if (netIncome.value > 0) return 'text-primary';
  if (netIncome.value < 0) return 'text-danger';
  return '';
});

const balanceRatio = computed(() => {
  const inc = totalIncome.value;
  const exp = totalExpense.value;
  if (inc === 0) return 0;
  return Math.max(0, Math.min(100, ((inc - exp) / inc) * 100));
});

const feedbackComment = computed(() => {
  const ratio = balanceRatio.value;
  if (ratio >= 75) return '이번 달은 여유롭네요!';
  if (ratio >= 50) return '이번 달은 괜찮은 편이에요.';
  if (ratio >= 25) return '이번 달은 조금 아껴야 해요.';
  return '이번 달은 지출이 너무 많아요...!';
});
</script>

<style scoped>
.summary-box {
  background: #ffc107;
  padding: 10px;
  border-radius: 8px;
}
.Bbox {
  background-color: #f8f9fa;
}
</style>
