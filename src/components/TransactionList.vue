<template>
  <div class="transaction-list">
    <!-- 거래 내역이 있는 경우 리스트 표시 -->
    <TransactionItem
      v-for="tx in transactions"
      :key="tx.id"
      :transaction="tx"
    />

    <!-- 거래 내역이 없을 경우 안내 문구 -->
    <p v-if="transactions.length === 0" class="empty-message">
      거래내역이 없습니다.
    </p>
  </div>
</template>

<script setup>
import { useTransactionStore } from '@/stores/transactionStore';
import TransactionItem from './TransactionItem.vue';

// Props 정의
const props = defineProps({
  transactions: Array,
});

// 이벤트 정의 (부모에게 이벤트 전달)
const emit = defineEmits(['edit-transaction']);

// Pinia 스토어 사용
const transactionStore = useTransactionStore();

// 삭제 처리
const handleDelete = async (id) => {
  await transactionStore.deleteTransaction(id);
  await transactionStore.fetchTransactions(); // 삭제 후 목록 갱신
};
</script>

<style scoped>
.transaction-list {
  display: flex;
  flex-direction: column;
}
.empty-message {
  text-align: center;
  color: #888;
  margin: 1rem 0;
  font-size: 1rem;
}
</style>
