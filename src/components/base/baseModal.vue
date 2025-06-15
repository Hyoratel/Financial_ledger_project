<!--
  BaseModal.vue

  - 거래내역 삭제 확인, 거래 입력/수정 등 전역 confirm 모달로 사용됨
  - GlobalModalStore 를 통해 전역 상태 및 confirmCallback 관리
  - ESC 키 / Enter 키 입력 처리 지원
-->
<template>
  <!-- Overlay 영역 클릭 시 confirm() 실행 -->
  <div class="overlay" @click.self="modal.confirm">
    <!-- Modal Content: 내부 클릭 시 이벤트 전파 방지 -->
    <div class="modal-content" @click.stop>
      <!-- Modal Header -->
      <header class="modal-header">
        <div class="modal-title">
          <slot name="header"></slot>
        </div>
        <!-- 닫기 버튼 클릭 시 close 이벤트 emit -->
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </header>

      <!-- Modal Body -->
      <section class="modal-body">
        <slot name="body"></slot>
      </section>

      <!-- Modal Footer -->
      <footer class="modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useGlobalModalStore } from '@/stores/GlobalModalStore';

const modal = useGlobalModalStore();
const emit = defineEmits(['close']);

// 키보드 입력 핸들링
function handleKeydown(event) {
  if (event.key === 'Escape') {
    emit('close');
  }
  if (event.key === 'Enter') {
    modal.confirm();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  padding: 0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out;
  position: relative;
  overflow: hidden;
}

.modal-header {
  background-color: #60584c;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: #ffc107;
  font-size: 1.2rem;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-footer button {
  padding: 8px 16px;
  background-color: #60584c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-footer button:hover {
  background-color: #4b3a2b;
}
/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
