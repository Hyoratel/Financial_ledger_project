<template>
  <!-- 🔹 요일 헤더 -->
  <div class="weekday-header">
    <div class="weekday" v-for="day in weekdays" :key="day">
      {{ day }}
      <!-- 일~토 요일 표시 -->
    </div>
  </div>

  <!-- 🔹 날짜 셀 (달력 본체) -->
  <div class="calendar-grid">
    <div
      v-for="day in calendarDays"
      :key="day.date + day.label"
      class="calendar-cell"
      :class="{ 'outside-month': !day.isCurrentMonth }"
      @click="day.isCurrentMonth && handleDateClick(day.date)"
    >
      <div class="date">{{ day.label }}</div>
      <!-- 일 숫자 출력 -->

      <!-- 해당 날짜에 거래내역이 있을 때 표시 -->
      <div v-if="day.transactions.length && day.isCurrentMonth" class="tx-wrap">
        <!-- 거래 최대 2개만 표시 -->
        <div
          v-for="(t, idx) in day.transactions.slice(0, 2)"
          :key="t.id"
          class="summary"
        >
          <span :class="t.type">{{ t.category }}</span>
          <span :class="t.type">{{ t.amount.toLocaleString() }}원</span>
        </div>

        <!-- 거래가 2개 초과하면 추가 갯수 표시 -->
        <div v-if="day.transactions.length > 2" class="more-indicator">
          +{{ day.transactions.length - 2 }}개
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 🔹 vue 기능 import
import { computed } from 'vue';

// 🔹 pinia store import
import { useTransactionStore } from '@/stores/transactionStore';
import { useTransactionModalStore } from '@/stores/TransactionModalStore';

// 🔹 모달과 거래 스토어 초기화
const modal = useTransactionModalStore();
const transactionStore = useTransactionStore();

// 🔹 props로 현재 보고 있는 연/월(year, month) 받아오기
const props = defineProps({
  year: Number,
  month: Number,
});

// 🔹 부모 컴포넌트에 선택한 날짜 알려주는 이벤트 정의 (현재 사용은 안함)
defineEmits(['selectDay']);

// 🔹 날짜 클릭 시 처리 함수
async function handleDateClick(dateStr) {
  await transactionStore.fetchTransactions(); // 클릭할 때 거래내역 새로고침
  modal.openList(dateStr); // 해당 날짜 거래 리스트 모달 오픈
}

// 🔹 요일 이름 배열
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

// 🔹 달력에 표시할 모든 날짜 계산
const calendarDays = computed(() => {
  const days = [];

  const year = props.year;
  const month = props.month;

  const firstDay = new Date(year, month, 1); // 해당 달의 1일
  const startWeekDay = firstDay.getDay(); // 1일의 요일 (0=일요일)
  const lastDate = new Date(year, month + 1, 0).getDate(); // 마지막 날짜
  const prevMonthLastDate = new Date(year, month, 0).getDate(); // 전달 마지막 날짜

  // 🔹 전달 남은 칸 채우기
  for (let i = startWeekDay - 1; i >= 0; i--) {
    days.push({
      date: '', // 클릭 못하게 빈 문자열
      label: prevMonthLastDate - i, // 전달 날짜 출력
      transactions: [],
      isCurrentMonth: false, // 이번 달 아님 표시
    });
  }

  // 🔹 이번 달 날짜 채우기
  for (let d = 1; d <= lastDate; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      d
    ).padStart(2, '0')}`;
    const tx = transactionStore.transactions.filter((t) => t.date === dateStr); // 해당 날짜 거래 찾기
    days.push({
      date: dateStr,
      label: d,
      transactions: tx,
      isCurrentMonth: true, // 이번 달 날짜
    });
  }

  // 🔹 다음 달 남은 칸 채우기 (총 6주 = 42칸)
  while (days.length < 42) {
    days.push({
      date: '',
      label: days.length - (startWeekDay + lastDate) + 1, // 다음달 시작 숫자
      transactions: [],
      isCurrentMonth: false, // 다음 달
    });
  }

  return days;
});
</script>

<style scoped>
/* 🔹 요일 헤더 스타일 */
.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  background: #f1f1f1;
  font-weight: bold;
}
.weekday {
  padding: 6px 0;
  font-size: 0.8rem;
}

/* 🔹 달력 그리드 스타일 */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 110px); /* 높이 고정 */
}

/* 🔹 날짜 셀 스타일 */
.calendar-cell {
  border: 1px solid #e0e0e0;
  padding: 6px;
  box-sizing: border-box;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
}

/* 🔹 마우스 오버시 배경색 */
.calendar-cell:hover {
  background-color: #f8f8f8;
}

/* 🔹 이번 달이 아닌 셀 스타일 */
.calendar-cell.outside-month {
  background-color: #f2f2f2;
  color: #aaa;
  pointer-events: none; /* 클릭 불가 */
}

/* 🔹 날짜 숫자 스타일 */
.date {
  font-weight: bold;
  font-size: 0.8em;
  margin-bottom: 4px;
}

/* 🔹 거래 요약 wrap */
.tx-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow: hidden;
}

/* 🔹 거래 요약 (카테고리+금액 한 줄) */
.summary {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 🔹 더보기 표시 스타일 */
.more-indicator {
  font-size: 0.68rem;
  color: #888;
  text-align: right;
}

/* 🔹 수입/지출 글자 색 */
.income {
  color: #007bff;
}
.expense {
  color: #dc3545;
}
</style>
