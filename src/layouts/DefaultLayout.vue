<template>
  <div class="app-container">
    <!-- ✅ 상단 고정 네비게이션 바 -->
    <header class="nav-fixed">
      <nav class="nav-bar">
        <ul class="nav-list">
          <li>
            <!-- 현재 경로에 따라 강조되는 홈 링크 -->
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

    <!-- ✅ 본문 영역 (스크롤 가능) -->
    <main class="main-content p-6">
      <!-- 각 라우트 페이지가 표시되는 영역 -->
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useTransactionStore } from '@/stores/transactionStore';
import { useTransactionModalStore } from '../stores/TransactionModalStore';
import { useRoute } from 'vue-router';

// 🧩 상태 관리 스토어 호출
const modal = useTransactionModalStore(); // 전역 모달 상태 관리
const transactionStore = useTransactionStore(); // 거래 내역 상태 관리
const route = useRoute(); // 현재 라우트 정보

// ✅ 거래 추가 완료 시 처리 함수
const onAddComplete = async () => {
  await transactionStore.fetchTransactions(); // 거래 목록 갱신
  modal.close(); // 모달 닫기
};

// ✅ 현재 경로와 매칭되는 링크에 활성화 클래스 부여
const navClass = (path) => {
  return {
    'active-link': route.path.startsWith(path),
  };
};
</script>

<style scoped>
/* 🧱 앱 전체 컨테이너: 모바일 기준 */
.app-container {
  max-width: 414px; /* 모바일 기준 너비 */
  height: 896px; /* 전체 높이 고정 (옵션) */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden; /* 헤더 고정, 메인만 스크롤 허용 */
}

/* 📌 네비게이션 바 고정 */
.nav-fixed {
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 414px;
  z-index: 10;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 📌 네비게이션 바 내부 */
.nav-bar {
  padding: 12px;
  display: flex;
  justify-content: center;
}

/* 📌 네비게이션 메뉴 항목 */
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

/* ✅ 현재 경로에 해당하는 메뉴에 강조 색상 */
.nav-list li a.active-link {
  background-color: #6c757d;
  color: white;
  font-weight: bold;
}

/* 📄 본문 영역 스타일 (패딩으로 헤더 높이 확보) */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 70px 16px 16px; /* 상단 네비게이션 높이 고려한 여백 */
}
</style>
