<template>
  <div class="transaction-item">
    <!-- 거래 정보 표시 -->
    <div class="info">
      <div class="top">
        <span class="date">{{ transaction.date }}</span>
        <span class="category">{{ transaction.category }}</span>
      </div>
      <div class="bottom">
        <span class="amount">{{ transaction.amount.toLocaleString() }}원</span>
        <span class="memo" v-if="transaction.memo"
          >- {{ transaction.memo }}</span
        >
      </div>
    </div>

    <!-- 수정/삭제 버튼 영역 -->
    <div class="actions" @click.stop>
      <button @click="$emit('edit', transaction)">수정</button>
      <button @click="$emit('delete', transaction.id)">삭제</button>
    </div>
  </div>
</template>

<script setup>
// ✅ props와 emits 정의
defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});
defineEmits(['edit', 'delete']);
</script>

<style scoped>
.transaction-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}
.info {
  flex: 1;
}
.top,
.bottom {
  display: flex;
  gap: 1rem;
}
.actions button {
  margin-left: 0.5rem;
}
</style>
