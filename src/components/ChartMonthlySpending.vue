<template>
  <div class="bg-white p-6 rounded-xl shadow-md">
    <h2 class="text-lg font-bold mb-4">💸 지출 분석</h2>
    <!-- 꺾은선 차트 -->
    <Line :data="spendingLineData" :options="lineChartOptions" class="mb-6" />
  </div>
  <div class="bg-white p-6 rounded-xl shadow-md">
    <h2 class="text-lg font-bold mb-4">💰 카테고리별 지출</h2>
    <!-- 도넛 차트 -->
    <Doughnut
      v-if="hasCategoryData"
      :data="categoryData"
      :options="categoryOptions"
      @click="handleClick"
    />
    <p v-else class="text-gray-500 text-sm">
      📌 지출 카테고리 데이터가 없습니다.
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { Line, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement
);

const store = useTransactionStore();
const selected = ref(null);

onMounted(async () => {
  await store.fetchTransactions();
});

// ✅ 월별 지출 데이터
const monthlySpending = computed(() => {
  const result = {};
  store.transactions.forEach((t) => {
    if (t.type === 'expense') {
      const key = t.date.slice(0, 7); // YYYY-MM
      result[key] = (result[key] || 0) + t.amount;
    }
  });
  return result;
});

// ✅ 카테고리별 지출 데이터
const categorySpending = computed(() => {
  const result = {};
  store.transactions.forEach((t) => {
    if (t.type === 'expense') {
      const category = t.category || '기타';
      result[category] = (result[category] || 0) + t.amount;
    }
  });
  return result;
});

const hasCategoryData = computed(
  () => Object.keys(categorySpending.value).length > 0
);

// ✅ 라인 차트 데이터
const spendingLineData = computed(() => {
  const labels = Object.keys(monthlySpending.value).sort();
  const values = labels.map((label) => monthlySpending.value[label]);

  return {
    labels,
    datasets: [
      {
        label: '월별 지출',
        data: values,
        borderColor: '#f87171',
        backgroundColor: '#fecaca',
        tension: 0.3,
      },
    ],
  };
});

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // X축 격자 제거
      },
    },
    y: {
      grid: {
        display: false, // Y축 격자 제거
      },
    },
  },
};

// ✅ 도넛 차트 데이터
const categoryData = computed(() => {
  const labels = Object.keys(categorySpending.value);
  const data = labels.map((label) => categorySpending.value[label]);

  return {
    labels,
    datasets: [
      {
        label: '카테고리별 지출',
        data,
        backgroundColor: [
          '#f87171',
          '#fb923c',
          '#facc15',
          '#34d399',
          '#60a5fa',
          '#a78bfa',
        ],
        borderColor: '#fff',
        borderWidth: 2,
        cutout: '50%',
        hoverOffset: 30,
      },
    ],
  };
});

const categoryOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.parsed;
          return `${value.toLocaleString()} 원`;
        },
      },
    },
  },
};
</script>
