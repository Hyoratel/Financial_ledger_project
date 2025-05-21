<script setup>
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import MonthlySummary from '@/components/MonthlySummary.vue';
import RecentTransactionList from '@/components/RecentTransactionList.vue';

const store = useTransactionStore();

const transactions = computed(() => store.filteredTransactionsByMonth);
const selectedMonth = computed(() => store.selectedMonth);

function changeMonth(offset) {
  const [year, month] = store.selectedMonth.split('-').map(Number);
  const newDate = new Date(year, month - 1 + offset);
  const newMonth = `${newDate.getFullYear()}-${String(
    newDate.getMonth() + 1
  ).padStart(2, '0')}`;
  store.setSelectedMonth(newMonth);
}
</script>

<template>
  <!-- 390 x 844 기준 콘텐츠 박스 -->
  <div
    class="w-100 d-flex flex-column align-items-center"
    style="max-width: 390px; margin: 0 auto"
  >
    <!-- ✅ 월 변경 버튼 -->
    <div class="w-100 d-flex justify-content-center align-items-center my-2">
      <button @click="changeMonth(-1)">◀</button>
      <span class="mx-3 fw-bold">{{ selectedMonth }}</span>
      <button @click="changeMonth(1)">▶</button>
    </div>

    <!-- ✅ 콘텐츠 영역 -->
    <div class="w-100 p-3 d-flex flex-column gap-1">
      <MonthlySummary
        :transactions="transactions"
        :selectedMonth="selectedMonth"
      />
      <RecentTransactionList :transactions="transactions" />
    </div>
  </div>
</template>
