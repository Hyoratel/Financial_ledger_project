<template>
  <!-- 전체 뷰 박스: 화면 중앙에 고정된 390x844 사이즈 -->
  <div
    class="d-flex justify-content-center align-items-center heigt-100 bg-white"
  >
    <!-- 실제 앱 UI를 감싸는 박스 -->
    <div
      class="border shadow bg-white position-relative"
      style="width: 390px; height: 844px"
    >
      <!-- 콘텐츠 영역 (스크롤 허용) -->
      <div class="px-3 py-2 overflow-y-auto" style="height: 100%">
        <div class="main-view">
          <!-- 보기 모드 토글 버튼 -->
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

          <!-- 수입/지출/순수입 요약 박스 -->
          <div class="summary-box">
            <div>
              <span class="text-primary"
                >총 수입: {{ totalIncome.toLocaleString() }} 원</span
              >
            </div>
            <div>
              <span class="text-danger"
                >총 지출: {{ totalExpense.toLocaleString() }} 원</span
              >
            </div>
            <div :class="netIncomeClass">
              <strong>순 수입:</strong> {{ netIncome.toLocaleString() }} 원
            </div>
          </div>

          <!-- 월 이동 버튼 -->
          <div class="month-navigation">
            <button @click="prevMonth">← 이전 달</button>
            <strong>{{ selectedMonth }}</strong>
            <button @click="nextMonth">다음 달 →</button>
          </div>

          <!-- 거래 리스트 -->
          <TransactionList
            v-if="viewMode === 'daily'"
            :transactions="transactionsForMonth"
            :selectedMonth="selectedMonth"
            @edit-transaction="onEditTransaction"
          />

          <!-- 월별 보기: 캘린더 -->
          <CalendarView
            v-if="viewMode === 'monthly'"
            :year="currentYear"
            :month="currentMonth"
            :transactions="transactions"
            @select-day="onSelectDay"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ✅ Vue API
import { ref, computed, onMounted } from 'vue';

// ✅ Pinia Stores
import { useTransactionStore } from '@/stores/transactionStore';
import { useTransactionModalStore } from '@/stores/TransactionModalStore';

// ✅ Components
import TransactionList from '@/components/TransactionList.vue';
import CalendarView from '@/views/CalendarView.vue';

// 보기 모드 상태
const viewMode = ref('daily');

// 현재 연도/월
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

// Stores
const store = useTransactionStore();
const modal = useTransactionModalStore();

// 거래 불러오기
onMounted(() => {
  store.fetchTransactions();
});

// 'YYYY-MM' 포맷
const selectedMonth = computed(() => {
  const y = currentYear.value;
  const m = (currentMonth.value + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
});

// 필터된 거래
const transactions = computed(() => store.transactions);
const transactionsForMonth = computed(() =>
  store.transactions.filter((tx) => tx.date.startsWith(selectedMonth.value))
);

// 총액 계산
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

// 월 이동
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// 날짜 클릭 → 모달 열기
const onSelectDay = (date) => {
  modal.openForm(date);
};

// 거래 수정 클릭 → 수정 모달 열기
const onEditTransaction = (tx) => {
  modal.editTransaction(tx);
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
  color: #5e4b3c;
  font-weight: bold;
}
.view-toggle button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 4px;
  background-color: #5e4b3c;
  border-radius: 4px 4px 0 0;
}

.summary-box {
  background: #ffc107;
  padding: 12px;
  margin: 12px 0;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
}

.month-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background-color: #f8f8f8;
  padding: 8px 0;
}
.month-navigation button {
  border: 1px solid #000;
  background: white;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 6px;
  transition: background 0.3s;
}
.month-navigation button:hover {
  background: #eee;
}
</style>
