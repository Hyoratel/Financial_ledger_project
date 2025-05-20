<template>
  <!-- 월별 지출 추이 꺾은선 차트 -->
  <div class="bg-white p-6 rounded-xl shadow-md mb-8">
    <h2 class="text-lg font-bold mb-4">📈 월별 지출 그래프</h2>
    <Line :data="spendingLineData" :options="lineChartOptions" class="mb-6" />
  </div>

  <!-- 카테고리별 지출 도넛 차트 -->
  <div class="bg-white p-6 rounded-xl shadow-md">
    <h2 class="text-lg font-bold mb-4">💰 카테고리별 지출</h2>
    <Doughnut
      v-if="hasCategoryData"
      :data="categoryData"
      :options="categoryOptions"
    />
    <p v-else class="text-gray-500 text-sm">
      📌 지출 카테고리 데이터가 없습니다.
    </p>
  </div>
</template>

<script setup>
// 모듈 및 라이브러리 등록
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/authStore';
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

// 차트 구성요소 등록
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

// 스토어 및 데이터 로드
const store = useTransactionStore();
const authStore = useAuthStore();

// 컴포넌트 마운트 시 거래 내역 불러오기
onMounted(() => {
  store.fetchTransactions(); // 로그인한 사용자 거래만 가져오도록 이미 수정돼 있음
});

// 로그인한 사용자의 거래만 필터링
const userTransactions = computed(() =>
  store.transactions.filter((tx) => tx.userId === authStore.user.id)
);

// 월별 지출 추이 계산
const monthlySpending = computed(() => {
  const result = {};
  userTransactions.value.forEach((t) => {
    if (t.type === 'expense') {
      const key = t.date.slice(0, 7); // YYYY-MM
      result[key] = (result[key] || 0) + t.amount;
    }
  });
  return result;
});

// 카테고리별 지출 계산
const categorySpending = computed(() => {
  const result = {};
  userTransactions.value.forEach((t) => {
    if (t.type === 'expense') {
      const category = t.category || '기타';
      result[category] = (result[category] || 0) + t.amount;
    }
  });
  return result;
});

// 카테고리 데이터 유무 판단
const hasCategoryData = computed(
  () => Object.keys(categorySpending.value).length > 0
);

// 월별 꺾은선 차트 데이터
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

// 꺾은선 차트 옵션
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

// 도넛 차트 데이터 구성
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

// 도넛 차트 옵션 설정
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
