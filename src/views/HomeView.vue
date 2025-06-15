<!--
HomeView.vue
홈 화면 구성 컴포넌트
- 상단에 월별 요약 카드 표시
- 하단에 최근 거래 리스트 표시
- 월 변경 기능 제공
- 거래 데이터는 transactionStore에서 관리
- 월별 총 수입/지출/순수입/피드백 데이터를 계산하여 표시
-->

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
// Vue 기능 import
import { computed, onMounted } from 'vue';

// Pinia store 사용 (거래 데이터 관리)
import { useTransactionStore } from '@/stores/transactionStore';

// 월별 요약 계산용 커스텀 composable 사용
import { useMonthlySummary } from '@/composables/useMonthlySummary';

// 컴포넌트 import
import MonthlySummaryCard from '@/components/MonthlySummaryCard.vue';
import RecentTransactionList from '@/components/RecentTransactionList.vue';

// 거래 store 인스턴스 생성
const store = useTransactionStore();

// 컴포넌트 마운트 시 거래 데이터 불러오기
onMounted(() => {
  store.fetchTransactions();
});

// 현재 선택된 월
const selectedMonth = computed(() => store.selectedMonth);

// 현재 월의 거래 내역 (필터링된 결과)
const transactions = computed(() => store.filteredTransactionsByMonth);

// 월별 총 수입, 총 지출, 순수입, 피드백 계산 결과 가져오기
const { totalIncome, totalExpense, netIncome, feedbackComment } =
  useMonthlySummary(transactions);

// 월 변경 함수
function changeMonth(offset) {
  // 현재 월 정보 분리
  const [year, month] = store.selectedMonth.split('-').map(Number);

  // 새로운 월 계산 (offset 적용)
  const newDate = new Date(year, month - 1 + offset);

  // 'YYYY-MM' 형식으로 변환 후 store에 설정
  const newMonth = `${newDate.getFullYear()}-${String(
    newDate.getMonth() + 1
  ).padStart(2, '0')}`;

  store.setSelectedMonth(newMonth);
}
</script>
