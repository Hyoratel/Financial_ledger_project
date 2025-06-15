<!--
  ChartMonthlyIncome.vue

  - 로그인한 사용자의 월별 수입 추이(Line 차트) 및 카테고리별 수입 분포(Doughnut 차트)를 시각화
  - TransactionStore, AuthStore 사용
  - Chart.js + vue-chartjs 이용
-->

<template>
  <!-- 월별 수입 추이 -->
  <div class="bg-white p-6 rounded-xl shadow-md mb-8">
    <h2 class="text-lg font-bold mb-4">📈 월별 수입 그래프</h2>
    <Line v-if="hasData" :data="chartData" :options="chartOptions" />
    <p v-else class="text-gray-500 text-sm">📌 수입 데이터가 없습니다.</p>
  </div>

  <!-- 카테고리별 수입 분포 -->
  <div class="bg-white p-6 rounded-xl shadow-md">
    <h2 class="text-lg font-bold mb-4">💰 카테고리별 수입</h2>
    <Doughnut
      v-if="hasCategoryData"
      :data="categoryChartData"
      :options="categoryChartOptions"
    />
    <p v-else class="text-gray-500 text-sm">
      📌 수입 카테고리 데이터가 없습니다.
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/authStore';
import { Line, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

// Chart.js 구성 요소 등록
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
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

// 월별 수입 데이터 계산
const monthlyIncome = computed(() => {
  const result = {};
  userTransactions.value.forEach(({ type, date, amount }) => {
    if (type === 'income') {
      const key = date.slice(0, 7);
      result[key] = (result[key] || 0) + amount;
    }
  });
  return result;
});

// 월별 수입 차트 데이터 구성
const chartData = computed(() => {
  const labels = Object.keys(monthlyIncome.value).sort();
  return {
    labels,
    datasets: [
      {
        label: '수입',
        data: labels.map((label) => monthlyIncome.value[label]),
        borderColor: '#4ade80',
        backgroundColor: '#bbf7d0',
        fill: false,
        tension: 0.3,
      },
    ],
  };
});

// 월별 수입 차트 옵션 설정
const chartOptions = {
  responsive: true,
  plugins: { legend: { position: 'top' } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: false } },
  },
};

// 수입 데이터 존재 여부 판단
const hasData = computed(() => Object.keys(monthlyIncome.value).length > 0);

// 카테고리별 수입 데이터 계산
const categoryIncome = computed(() => {
  const result = {};
  userTransactions.value.forEach(({ type, category, amount }) => {
    if (type === 'income') {
      const key = category || '기타';
      result[key] = (result[key] || 0) + amount;
    }
  });
  return result;
});

// 카테고리별 수입 차트 데이터 구성
const categoryChartData = computed(() => {
  const labels = Object.keys(categoryIncome.value);
  const values = Object.values(categoryIncome.value);
  const colors = [
    '#60a5fa',
    '#34d399',
    '#fbbf24',
    '#a78bfa',
    '#fb7185',
    '#4ade80',
    '#facc15',
    '#38bdf8',
    '#c084fc',
  ];
  return {
    labels,
    datasets: [
      {
        label: '수입',
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 1,
        cutout: '50%',
        hoverOffset: 30,
      },
    ],
  };
});

// 카테고리별 수입 차트 옵션 설정
const categoryChartOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom' } },
};

// 카테고리 데이터 존재 여부 판단
const hasCategoryData = computed(
  () => Object.keys(categoryIncome.value).length > 0
);
</script>
