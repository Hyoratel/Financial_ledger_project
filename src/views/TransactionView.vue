<!--
  TransactionView.vue

  - 거래 내역 화면 (일일/월별 보기 지원)
  - 상단 MonthlySummaryCard 에 월별 총 수입/총 지출/순수입/피드백 표시
  - 보기 모드 (일일/월별) 토글 가능
  - 거래 리스트(TransactionList) 또는 캘린더(CalendarView) 표시
  - 월별 요약 데이터는 useMonthlySummary composable 에서 계산
-->

<template>
  <div
    class="d-flex justify-content-center align-items-center heigt-100 bg-white"
  >
    <div
      class="border shadow bg-white position-relative"
      style="width: 390px; height: 844px"
    >
      <div class="px-3 py-2 overflow-y-auto" style="height: 100%">
        <div class="main-view">
          <!-- 보기 모드 토글 버튼 (일일 / 월별) -->
          <div class="view-toggle">
            <button
              @click="viewMode = 'daily'"
              :class="{ active: viewMode === 'daily' }"
            >
              일일
            </button>
            <button
              @click="viewMode = 'monthly'"
              :class="{ active: viewMode === 'monthly' }"
            >
              월별
            </button>
          </div>

          <!-- 공통 월간 요약 카드 -->
          <MonthlySummaryCard
            :selectedMonth="selectedMonth"
            :totalIncome="totalIncome"
            :totalExpense="totalExpense"
            :netIncome="netIncome"
            :feedbackComment="feedbackComment"
            @change-month="changeMonth"
          />

          <!-- 일일 보기일 경우: 거래 리스트 표시 -->
          <TransactionList
            v-if="viewMode === 'daily'"
            :transactions="transactionsForMonth"
            :selectedMonth="selectedMonth"
            @edit-transaction="onEditTransaction"
            @delete-transaction="onDeleteTransaction"
          />

          <!-- 월별 보기일 경우: 캘린더 표시 -->
          <CalendarView
            v-if="viewMode === 'monthly'"
            :year="calendarYear"
            :month="calendarMonth"
            :transactions="transactionsForMonth"
            @select-day="onSelectDay"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useTransactionModalStore } from '@/stores/TransactionModalStore';
import { useMonthlySummary } from '@/composables/useMonthlySummary';
import TransactionList from '@/components/TransactionList.vue';
import CalendarView from '@/views/CalendarView.vue';
import MonthlySummaryCard from '@/components/MonthlySummaryCard.vue';

// 보기 모드 (일일 / 월별) 상태
const viewMode = ref('daily');

// 스토어 사용
const store = useTransactionStore();
const modal = useTransactionModalStore();

// 거래 데이터 로드
onMounted(() => {
  store.fetchTransactions();
});

// 선택된 월 (YYYY-MM 형식)
const selectedMonth = computed(() => store.selectedMonth);

// 선택된 월의 거래 내역 필터링
const transactionsForMonth = computed(() =>
  store.transactions.filter((tx) => tx.date.startsWith(selectedMonth.value))
);

// 월별 계산/피드백 데이터 (useMonthlySummary 사용)
const { totalIncome, totalExpense, netIncome, feedbackComment } =
  useMonthlySummary(transactionsForMonth);

// 캘린더 표시용 연/월 계산
const calendarYear = computed(() => Number(selectedMonth.value.split('-')[0]));
const calendarMonth = computed(
  () => Number(selectedMonth.value.split('-')[1]) - 1
);

// 월 변경 처리
function changeMonth(offset) {
  const [year, month] = store.selectedMonth.split('-').map(Number);
  const newDate = new Date(year, month - 1 + offset);
  const newMonth = `${newDate.getFullYear()}-${String(
    newDate.getMonth() + 1
  ).padStart(2, '0')}`;
  store.setSelectedMonth(newMonth);
}

// 거래 삭제 처리
const onDeleteTransaction = (id) => {
  modal.openDeleteConfirm(id);
};

// 거래 수정 처리
const onEditTransaction = (tx) => {
  modal.openForm(tx.date, tx);
};

// 캘린더 날짜 클릭 시 처리
const onSelectDay = (date) => {
  modal.openList(date);
};
</script>

<style scoped>
.view-toggle {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
  border-bottom: 1px solid #ddd;
  background-color: #f9f9f9;
  padding: 12px 0;
}
.view-toggle button {
  flex: 1;
  background: none;
  border: none;
  font-size: 1rem;
  padding: 8px 16px;
  color: #333;
  cursor: pointer;
  border-radius: 12px 12px 0 0;
}
.view-toggle button.active {
  background-color: white;
  color: #60584c;
  font-weight: bold;
}
.view-toggle button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 4px;
  background-color: #60584c;
  border-radius: 4px 4px 0 0;
}
</style>
