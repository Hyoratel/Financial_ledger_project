<!--
  MonthlySummaryCard.vue

  - 선택한 월의 총 수입/총 지출/순 수입과 피드백 문구를 카드 형태로 표시
  - 피드백 문구는 반드시 부모에서 props로 전달
  - showMonthNav prop 으로 월 변경 버튼 표시 여부 제어
  - 계산 책임은 composable (useMonthlySummary) 에서 담당 → 중복 제거
-->

<template>
  <div class="summary-card">
    <!-- 월 변경 버튼 (옵션) -->
    <div v-if="showMonthNav" class="month-nav">
      <button @click="$emit('change-month', -1)" class="arrow-btn text-dark">
        <i class="bi bi-chevron-left"></i>
      </button>
      <span class="month-label">{{ selectedMonth }}</span>
      <button @click="$emit('change-month', 1)" class="arrow-btn text-dark">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <!-- 피드백 문구 -->
    <p class="headline">한달을 돌아보며</p>
    <p class="feedback">{{ feedbackComment }}</p>

    <!-- 수입/지출/순수입 요약 -->
    <div class="summary-box">
      <div class="income">
        총 수입: {{ (totalIncome ?? 0).toLocaleString() }} 원
      </div>
      <div class="expense">
        총 지출: {{ (totalExpense ?? 0).toLocaleString() }} 원
      </div>
      <div class="net">순 수입: {{ (netIncome ?? 0).toLocaleString() }} 원</div>
    </div>
  </div>
</template>

<script setup>
// props 정의
const props = defineProps({
  selectedMonth: String,
  totalIncome: Number,
  totalExpense: Number,
  netIncome: Number,
  feedbackComment: String, // 반드시 부모에서 전달받음 (내부 계산 제거)
  showMonthNav: { type: Boolean, default: true },
});

// emit 정의 (월 변경)
const emit = defineEmits(['change-month']);
</script>

<style scoped>
.summary-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  max-width: 390px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.month-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.arrow-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
}

.month-label {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.headline {
  color: #ffc107;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 4px;
}

.feedback {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.summary-box {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  color: #222;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.income {
  color: #007bff;
}
.expense {
  color: #dc3545;
}
.net {
  color: #228b22;
}
</style>
