<template>
  <div class="transaction-item">
    <!-- 왼쪽: 날짜, 카테고리, 금액 표시 -->
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
      <button class="delete" @click="handleDelete">삭제</button>
    </div>
  </div>
</template>

<script setup>
// 상위 컴포넌트로부터 거래 데이터 전달
const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

// 상위 컴포넌트로 이벤트 전달을 위한 emit 정의
const emit = defineEmits(['edit', 'delete']);

// 수정 버튼 클릭 시 상위에 거래 객체 전달
function handleEdit() {
  emit('edit', props.transaction);
}

// 삭제 버튼 클릭 시 상위에 거래 ID 전달
function handleDelete() {
  emit('delete', props.transaction.id);
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

.amount {
  font-size: 1rem;
}

.income {
  color: #007bff;
  font-weight: bold;
}

.expense {
  color: #dc3545;
  font-weight: bold;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

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

.edit {
  color: #333;
}

.delete {
  color: #dc3545;
}
</style>
