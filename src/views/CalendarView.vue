<template>
  <!-- 요일 헤더 -->
  <div class="weekday-header">
    <div class="weekday" v-for="day in weekdays" :key="day">
      {{ day }}
    </div>
  </div>

  <!-- 달력 본체 -->
  <div class="calendar-grid">
    <div
      v-for="day in calendarDays"
      :key="day.date + day.label"
      class="calendar-cell"
      :class="{ 'outside-month': !day.isCurrentMonth }"
      @click="day.isCurrentMonth && handleDateClick(day.date)"
    >
      <div class="date">{{ day.label }}</div>

      <!-- 해당 날짜에 거래가 있을 경우 -->
      <div v-if="day.transactions.length && day.isCurrentMonth" class="tx-wrap">
        <!-- 최대 2개까지 거래 표시 -->
        <div
          v-for="(t, idx) in day.transactions.slice(0, 2)"
          :key="t.id"
          class="summary"
        >
          <span :class="t.type">{{ t.category }}</span>
          <span :class="t.type">{{ t.amount.toLocaleString() }}원</span>
        </div>

        <!-- 초과 시 개수 표시 -->
        <div v-if="day.transactions.length > 2" class="more-indicator">
          +{{ day.transactions.length - 2 }}개
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vue 기능
import { computed } from 'vue';

// Props 정의: 연도와 월, 거래 목록을 상위로부터 받음
const props = defineProps({
  year: Number,
  month: Number,
  transactions: {
    type: Array,
    required: true,
  },
});

// 상위 컴포넌트로 날짜 클릭 이벤트 전달
const emit = defineEmits(['select-day']);

// 날짜 클릭 시 선택한 날짜를 상위에 전달
function handleDateClick(dateStr) {
  emit('select-day', dateStr);
}

// 요일 헤더
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

// 달력 셀 계산 (총 42칸)
const calendarDays = computed(() => {
  const days = [];

  const year = props.year;
  const month = props.month;

  const firstDay = new Date(year, month, 1);
  const startWeekDay = firstDay.getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevMonthLastDate = new Date(year, month, 0).getDate();

  // 전달 남은 칸 채우기
  for (let i = startWeekDay - 1; i >= 0; i--) {
    days.push({
      date: '',
      label: prevMonthLastDate - i,
      transactions: [],
      isCurrentMonth: false,
    });
  }

  // 이번 달 날짜 채우기
  for (let d = 1; d <= lastDate; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      d
    ).padStart(2, '0')}`;
    const tx = props.transactions.filter((t) => t.date === dateStr);
    days.push({
      date: dateStr,
      label: d,
      transactions: tx,
      isCurrentMonth: true,
    });
  }

  // 다음 달 남은 칸 채우기 (42칸 유지)
  while (days.length < 42) {
    days.push({
      date: '',
      label: days.length - (startWeekDay + lastDate) + 1,
      transactions: [],
      isCurrentMonth: false,
    });
  }

  return days;
});
</script>

<style scoped>
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

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 110px);
}

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

.calendar-cell:hover {
  background-color: #f8f8f8;
}

.calendar-cell.outside-month {
  background-color: #f2f2f2;
  color: #aaa;
  pointer-events: none;
}

.date {
  font-weight: bold;
  font-size: 0.8em;
  margin-bottom: 4px;
}

.tx-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow: hidden;
}

.summary {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-indicator {
  font-size: 0.68rem;
  color: #888;
  text-align: right;
}

.income {
  color: #007bff;
}
.expense {
  color: #dc3545;
}
</style>
