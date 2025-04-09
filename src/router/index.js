// 📁 router/index.js
// ✅ 라우팅 구성 설명 (최신 컴포넌트 전략 기반)
// - Dashboard: DashboardView (최근 거래, 월별 요약 포함)
// - Transactions: TransactionView (내역 조회/삭제 등)
// - TransactionForm: 거래 등록/수정용 입력 폼
// - Settings: 사용자 정보 설정
// - 공통 컴포넌트는 base에 위치 (BaseButton, BaseInput 등)

import { createRouter, createWebHistory } from 'vue-router';

// 이재성 추가
import IntroView from '@/views/IntroView.vue';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import TermsAgreementView from '@/views/TermsAgreementView.vue';
// 이재성 추가

// ⚠️ 아직 컴포넌트가 구현되지 않았다면 주석 처리 필요
// import DashboardView from '@/views/DashboardView.vue'
// import SettingsView from '@/views/SettingsView.vue'
// import TransactionFormView from '@/views/TransactionFormView.vue'
// import Homeview from '@/views/HomeView.vue';
import TransactionForm from '@/views/TransactionForm.vue';

const routes = [
  // 이재성 주석처리(top)
  // 더미 페이지 (각 기능상태를 보려면 주석처리)
  // {
  //   path: '/',
  //   name: 'Default',
  //   component: IntroView,
  //   meta: { layout: 'Default' },
  // },
  // 이재성 주석처리(down)

  // 이재성 추가
  {
    path: '/',
    name: 'Intro',
    component: IntroView,
    meta: { layout: 'auth' },
  },

  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { layout: 'auth' },
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView,
    meta: { layout: 'auth' },
  },
  {
    path: '/terms',
    name: 'TermsAgreement',
    component: TermsAgreementView,
    meta: { layout: 'auth' },
  },
  // ✅ 기본 리다이렉트 경로 (로그인 페이지로)
  // {
  //   path: '/',
  //   redirect: '/login',
  // },

  // ✅ 로그인 페이지: 구현되면 주석 해제
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: LoginView,
  //   meta: { layout: 'auth' },
  // },

  // ✅ 대시보드 페이지: 구현되면 주석 해제
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: DashboardView,
  //   meta: { requiresAuth: true },
  // },

  // ✅ 설정 페이지: 구현되면 주석 해제
  // {
  //   path: '/settings',
  //   name: 'Settings',
  //   component: SettingsView,
  //   meta: { requiresAuth: true },
  // },

  // ✅ 거래 등록 + 카테고리 선택 화면에서 사용
  // {
  //   path: '/transaction/new',
  //   name: 'TransactionForm',
  //   component: TransactionFormView,
  //   meta: { requiresAuth: true },
  // }

  // 임시로 router 등록
  {
    path: '/',
    name: 'InputView',
    component: TransactionForm,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ 인증 여부 확인용 라우터 가드 ( 구현되면 주석 해제)
// router.beforeEach((to, from, next) => {
//   const isLoggedIn = localStorage.getItem('token') // 또는 Pinia 상태 사용 가능
//   if (to.meta.requiresAuth && !isLoggedIn) {
//     next('/login')
//   } else {
//     next()
//   }
// })

export default router;
