<!--
  ChartMonthlySummary.vue

  - 로그인한 사용자의 월별 수입/지출/순이익 요약을 Bar + Line 혼합 차트로 시각화
  - TransactionStore, AuthStore 사용
  - Chart.js + vue-chartjs 이용
-->

<template>
  <div class="bg-white p-6 rounded-xl shadow-md">
    <h2 class="text-lg font-bold mb-4">📊 월별 요약</h2>
    <Chart type="bar" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/authStore';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { Chart } from 'vue-chartjs';

// Chart.js 구성 요소 등록 (Bar + Line 혼합 차트 사용)
ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement
);

// 스토어 사용
const store = useTransactionStore();
const authStore = useAuthStore();

// 거래 데이터 불러오기
onMounted(() => {
  store.fetchTransactions();
});

// 로그인한 사용자의 거래 내역 필터링
const userTransactions = computed(() =>
  store.transactions.filter((tx) => tx.userId === authStore.user.id)
);

// 월별 수입/지출/순이익 요약 데이터 계산
const summaryByMonth = computed(() => {
  const summary = {};

  userTransactions.value.forEach((t) => {
    const month = t.date.slice(0, 7);
    if (!summary[month]) {
      summary[month] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') summary[month].income += t.amount;
    else if (t.type === 'expense') summary[month].expense += t.amount;
  });

  return summary;
});

// 차트 데이터 구성 (Bar: 수입/지출, Line: 순이익)
const chartData = computed(() => {
  const labels = Object.keys(summaryByMonth.value).sort();
  const incomeData = labels.map((label) => summaryByMonth.value[label].income);
  const expenseData = labels.map(
    (label) => summaryByMonth.value[label].expense
  );
  const netProfit = labels.map(
    (label) =>
      summaryByMonth.value[label].income - summaryByMonth.value[label].expense
  );

  return {
    labels,
    datasets: [
      {
        type: 'line',
        label: '순이익',
        data: netProfit,
        borderColor: '#22c55e',
        backgroundColor: '#bbf7d0',
        fill: false,
        tension: 0.3,
      },
      {
        type: 'bar',
        label: '수입',
        data: incomeData,
        backgroundColor: '#93c5fd',
      },
      {
        type: 'bar',
        label: '지출',
        data: expenseData,
        backgroundColor: '#fca5a5',
      },
    ],
  };
});

// 차트 옵션 설정
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};
</script>
