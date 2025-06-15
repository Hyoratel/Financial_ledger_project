<!--
  RecentTransactionList.vue

  - 최근 거래 내역 7건을 카드형 박스로 표시
  - 하단 '거래내역 더보기' 버튼으로 이동
  - 거래내역(TransactionList)와 연결 가능 / 홈 대시보드 영역에서 사용 가능
-->

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
    <div class="more-button">
      <button @click="goToTransactions">거래내역 더보기</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// props 정의
const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});

const router = useRouter();

// 거래내역 페이지로 이동
const goToTransactions = () => {
  router.push('/transactions');
};

// 최근 거래 7건 추출 (최신순 정렬 후 상위 7건)
const recentTransactions = computed(() =>
  [...props.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7)
);

// 날짜 포맷 함수 (MM월 DD일)
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
  color: rgba(13, 110, 253, 1);
  font-weight: bold;
}
.expense {
  color: #f44336;
  font-weight: bold;
}
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
  color: #60584c;
}
</style>
