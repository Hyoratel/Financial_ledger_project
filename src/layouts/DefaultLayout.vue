<!--
  DefaultLayout.vue

  - 기본 레이아웃 구성
    (로그인 후 사용되는 내부 페이지 레이아웃에 적용)
  - 상단 고정 네비게이션 바 제공
  - 페이지 본문 영역 (RouterView) 표시
  - 하단 고정 거래 추가 버튼 표시 (홈 / 거래내역 페이지에서만 노출)
-->

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
            <RouterLink to="/transactions" :class="navClass('/transactions')"
              >거래내역</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/dashboard" :class="navClass('/dashboard')"
              >통계</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/profile" :class="navClass('/profile')"
              >설정</RouterLink
            >
          </li>
        </ul>
      </nav>
    </header>

    <!-- 페이지 본문 영역 -->
    <main class="main-content p-6">
      <RouterView />
    </main>

    <!-- 하단 고정 거래 추가 버튼 (홈 / 거래내역 페이지에서만 노출) -->
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

// 스토어 및 라우트 초기화
const modal = useTransactionModalStore();
const transactionStore = useTransactionStore();
const route = useRoute();

// 현재 활성화된 네비게이션 링크 여부 판단
const navClass = (path) => {
  return {
    'active-link': route.path.startsWith(path),
  };
};

// 거래 추가 버튼 노출 여부 판단
const showAddButton = computed(() => {
  return (
    route.path.startsWith('/home') || route.path.startsWith('/transactions')
  );
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

/* 거래 추가 버튼 스타일 (FAB) */
.fab {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px; /* 원 크기: 작고 단정한 크기 */
  height: 48px;
  background-color: #60584c;
  color: #daa520;
  font-size: 24px; /* + 기호 적당한 크기 */
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 50;

  /* 수직/수평 정렬 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab:hover {
  background-color: #4b3a2b;
}
</style>
