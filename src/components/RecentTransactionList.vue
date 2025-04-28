<template>
  <!-- 최근 거래 내역 박스 -->
  <div class="section-box">
    <!-- 섹션 제목 -->
    <h2 class="section-title">최근 거래</h2>
    <!-- 거래 목록 -->
    <ul class="transaction-list">
      <li
        v-for="tx in recentTransactions"
        :key="tx.id"
        class="transaction-item"
      >
        <!-- 날짜 및 거래 타입 -->
        <span class="tx-label">
          {{ formatDate(tx.date) }}
          ·
          <strong :class="tx.type === 'income' ? 'income' : 'expense'">
            {{ tx.type === 'income' ? '수입 ' : '지출 ' }}
          </strong>
        </span>
        <!-- 거래 금액 -->
        <span :class="tx.type === 'income' ? 'income' : 'expense'">
          {{ Math.abs(tx.amount).toLocaleString() }} 원
        </span>
      </li>
    </ul>
    <!-- ✅ '거래내역 더보기' 버튼 추가 -->
    <div class="more-button">
      <button @click="goToTransactions">거래내역 더보기</button>
    </div>
  </div>
</template>

<script setup>
// 트랜잭션 스토어 불러오기
import { computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useRouter } from 'vue-router';
const router = useRouter();

const goToTransactions = () => {
  router.push('/transactions');
};
const store = useTransactionStore();

// 컴포넌트 마운트 시 거래 데이터 불러오기
onMounted(() => {
  store.fetchTransactions();
});

// 최근 거래 정렬하여 추출
const recentTransactions = computed(() =>
  [...store.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7)
);

// 날짜 문자열 변환
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
</script>

<style scoped>
/* 섹션 전체 스타일 */
.section-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* 제목 스타일 */
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

/* 목록 스타일 초기화 */
.transaction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 거래 항목 스타일 */
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
  color: rgba(13, 110, 253, 1);
  font-weight: bold;
}

.expense {
  color: #f44336;
  font-weight: bold;
}
/* 버튼 스타일 추가 */
.more-button {
  text-align: center;
  margin-top: 12px;
}
.more-button button {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
}
.more-button button:hover {
  color: #5e4b3c;
}
</style>
