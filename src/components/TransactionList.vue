<template>
  <div class="transaction-list">
    <TransactionItem
      v-for="tx in transactions"
      :key="tx.id"
      :transaction="tx"
      @edit="$emit('edit-transaction', tx)"
      @delete="handleDelete(tx.id)"
    />
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
</style>
