<template>
  <div class="transaction-item">
    <!-- 왼쪽: 날짜 + 거래정보 -->
    <div class="info">
      <div class="date">{{ transaction.date }}</div>
      <div class="content">
        <span class="category">{{ transaction.category }}</span>
        <span :class="['amount', transaction.type]">
          {{ transaction.amount.toLocaleString() }}원
        </span>
      </div>
    </div>

    <!-- 오른쪽: 수정/삭제 버튼 -->
    <div class="actions">
      <button class="edit" @click="handleEdit">수정</button>
      <button class="delete" @click="$emit('delete', transaction.id)">
        삭제
      </button>
    </div>
  </div>
</template>

<script setup>
import { useTransactionModalStore } from '@/stores/TransactionModalStore';

const modal = useTransactionModalStore();

const props = defineProps({
  transaction: Object,
});

function handleEdit() {
  modal.openForm(props.transaction.date, props.transaction);
}
</script>

<style scoped>
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid #eee;
}

/* 왼쪽 정보 영역 */
.info {
  display: flex;
  flex-direction: column;
}

.date {
  font-size: 0.7rem;
  color: #888;
  margin-bottom: 4px;
}

.content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category {
  font-size: 1rem;
  font-weight: bold;
}

/* 금액에 타입별 색상 적용 */
.amount {
  font-size: 1rem;
}

.income {
  color: #007bff; /* 수입은 파란색 */
  font-weight: bold;
}

.expense {
  color: #dc3545; /* 지출은 빨간색 */
  font-weight: bold;
}

/* 버튼 영역 */
.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 버튼 디자인 */
.actions button {
  padding: 4px 10px;
  font-size: 0.8rem;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.actions button:hover {
  background-color: #eee;
}

/* 수정/삭제 색상 구분 필요하면 여기에 */
.edit {
  color: #333;
}

.delete {
  color: #dc3545;
}
</style>
