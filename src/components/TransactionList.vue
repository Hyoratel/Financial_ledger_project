<!--
  TransactionList.vue

  - 거래 목록(배열)을 받아서 TransactionItem 컴포넌트로 렌더링
  - 거래 내역이 없으면 안내 문구 표시
  - edit-transaction / delete-transaction 이벤트를 부모로 emit
  - 거래내역 화면(TransactionView 등)에서 사용
-->

<template>
  <div class="transaction-list">
    <!-- 거래 내역이 있는 경우: 개별 항목 컴포넌트 반복 출력 -->
    <TransactionItem
      v-for="tx in transactions"
      :key="tx.id"
      :transaction="tx"
      @edit="$emit('edit-transaction', tx)"
      @delete="$emit('delete-transaction', tx.id)"
    />

    <!-- 거래 내역이 없을 경우 안내 문구 표시 -->
    <p v-if="transactions.length === 0" class="empty-message">
      거래내역이 없습니다.
    </p>
  </div>
</template>

<script setup>
// 컴포넌트 임포트
import TransactionItem from './TransactionItem.vue';

// props 정의 (거래 목록 전달받음)
const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});

// emit 정의 (수정/삭제 이벤트 전달)
const emit = defineEmits(['edit-transaction', 'delete-transaction']);
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
