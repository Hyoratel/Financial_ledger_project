<template>
  <div class="section-box">
    <h2 class="section-title">최근 거래</h2>
    <ul class="transaction-list">
      <li
        v-for="tx in recentTransactions"
        :key="tx.id"
        class="transaction-item"
      >
        <span class="tx-label">
          {{ formatDate(tx.date) }}
          ·
          <strong :class="tx.type === 'income' ? 'income' : 'expense'">
            {{ tx.type === 'income' ? '수입 ' : '지출 ' }}
          </strong>
        </span>
        <span :class="tx.type === 'income' ? 'income' : 'expense'">
          {{ Math.abs(tx.amount).toLocaleString() }} 원
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

const store = useTransactionStore();

// 컴포넌트 마운트 시 거래 데이터 불러오기
onMounted(() => {
  store.fetchTransactions();
});

const recentTransactions = computed(() =>
  [...store.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
</script>

<style scoped>
.section-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.transaction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.tx-label {
  font-size: 14px;
  color: #555;
}

.income {
  color: #4caf50;
  font-weight: bold;
}

.expense {
  color: #f44336;
  font-weight: bold;
}
</style>
