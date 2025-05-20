<template>
  <!-- 바깥 클릭 시 confirm 실행 -->
  <div class="overlay" @click.self="modal.confirm">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <div class="modal-title">
          <slot name="header"></slot>
        </div>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </header>

      <section class="modal-body">
        <slot name="body"></slot>
      </section>

      <footer class="modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useGlobalModalStore } from '@/stores/GlobalModalStore'; // ✅ 경로 확인

const modal = useGlobalModalStore();
const emit = defineEmits(['close']);

// ESC 또는 Enter 키 이벤트 처리
function handleKeydown(event) {
  if (event.key === 'Escape') {
    emit('close');
  }

  // ✅ Enter 키로 confirm 처리
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
  background-color: #5e4b3c;
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
  background-color: #5e4b3c;
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
