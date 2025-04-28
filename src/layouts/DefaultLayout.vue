<template>
  <div class="app-container">
    <!-- 상단 고정 네비게이션 바 -->
    <header class="nav-fixed">
      <nav class="nav-bar">
        <ul class="nav-list">
          <li>
            <RouterLink to="/home" :class="navClass('/home')">홈</RouterLink>
          </li>
          <li>
            <RouterLink to="/transactions" :class="navClass('/transactions')">거래내역</RouterLink>
          </li>
          <li>
            <RouterLink to="/dashboard" :class="navClass('/dashboard')">통계</RouterLink>
          </li>
          <li>
            <RouterLink to="/profile" :class="navClass('/profile')">설정</RouterLink>
          </li>
        </ul>
      </nav>
    </header>

    <!-- 본문 -->
    <main class="main-content p-6">
      <RouterView />
    </main>

    <!-- 하단 고정 거래 추가 버튼 -->
    <button v-if="showAddButton" class="fab" @click="modal.openForm()">
      +
    </button>
  </div>
</template>

<script setup>
import { useTransactionStore } from '@/stores/transactionStore';
import { useTransactionModalStore } from '@/stores/TransactionModalStore';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const modal = useTransactionModalStore();
const transactionStore = useTransactionStore();
const route = useRoute();

const navClass = (path) => {
  return {
    'active-link': route.path.startsWith(path),
  };
};

const showAddButton = computed(() => {
  return route.path.startsWith('/home') || route.path.startsWith('/transactions');
});
</script>

<style scoped>
.app-container {
  max-width: 414px;
  height: 896px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #ddd;
  position: relative;
  overflow: hidden;
}

.nav-fixed {
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 414px;
  z-index: 10;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-bar {
  padding: 12px;
  display: flex;
  justify-content: center;
}

.nav-list {
  display: flex;
  justify-content: space-around;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li a {
  padding: 6px 12px;
  text-decoration: none;
  color: #333;
  border-radius: 6px;
}

.nav-list li a.active-link {
  background-color: #6c757d;
  color: white;
  font-weight: bold;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 70px 16px 16px;
}

/* + 버튼 스타일 */
.fab {
  position: fixed;
  bottom: 20px; /* 🔥 화면 하단 기준 20px 위 (지금보다 더 내림) */
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  background-color: #5e4b3c;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab:hover {
  background-color: #4b3a2b;
}
</style>
