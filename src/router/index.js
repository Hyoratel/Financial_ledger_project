/**
 * Vue Router 설정 파일
 *
 * 주요 기능
 * - 프로젝트 전역 라우터 정의
 * - 기본 레이아웃과 인증 레이아웃 구분 적용
 * - 로그인 여부에 따른 페이지 접근 제어 (전역 라우터 가드 적용)
 * - Dashboard 페이지는 children 구조로 구성
 */

// Vue Router 기능 import
import { createRouter, createWebHistory } from 'vue-router';

// 인증 레이아웃에서 사용하는 페이지들 import
import IntroView from '@/views/IntroView.vue';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import TermsAgreementView from '@/views/TermsAgreementView.vue';

// 기본 레이아웃에서 사용하는 내부 페이지들 import
import ProfileView from '@/views/ProfileView.vue';
import Home from '@/views/HomeView.vue';
import TransactionForm from '@/views/TransactionForm.vue';
import TransactionView from '@/views/TransactionView.vue';

// Pinia 스토어 import (로그인 상태 확인용)
import { useAuthStore } from '@/stores/authStore';

// 라우트 정의
const routes = [
  /**
   * 루트 경로 접근 시 Intro 페이지로 리다이렉트
   */
  {
    path: '/',
    redirect: '/intro',
  },

  /**
   * 인증 레이아웃 페이지
   */
  {
    path: '/intro',
    name: 'Intro',
    component: IntroView,
    meta: { layout: 'auth', requiresAuth: false },
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

  /**
   * 기본 레이아웃 페이지 (로그인 후 접근 가능)
   */
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { layout: 'default', requiresAuth: true },
  },
  {
    path: '/inputview',
    name: 'InputView',
    component: TransactionForm,
    meta: { layout: 'default' },
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: TransactionView,
    meta: { layout: 'default', requiresAuth: true },
  },

  /**
   * 대시보드 페이지
   * - children 구조 사용하여 summary, income, spending 페이지 구성
   * - 최초 접근 시 summary 페이지로 리다이렉트
   */
  {
    path: '/dashboard',
    redirect: '/dashboard/summary',
    component: () => import('@/views/Dashboard.vue'),
    meta: { layout: 'default', requiresAuth: true },
    children: [
      {
        path: 'summary',
        name: 'DashboardSummary',
        component: () => import('@/components/ChartMonthlySummary.vue'),
      },
      {
        path: 'income',
        name: 'DashboardIncome',
        component: () => import('@/components/ChartMonthlyIncome.vue'),
      },
      {
        path: 'spending',
        name: 'DashboardSpending',
        component: () => import('@/components/ChartMonthlySpending.vue'),
      },
    ],
  },

  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { layout: 'default', requiresAuth: true },
  },
];

// Router 인스턴스 생성
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 전역 라우터 가드
 *
 * 기능
 * - requiresAuth가 true인 페이지 접근 시 로그인 여부 확인
 * - 로그인 상태가 아니면 로그인 페이지로 리다이렉트
 * - 로그인 상태이면 정상적으로 페이지 이동 허용
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    alert('로그인이 필요합니다.');
    next('/login');
  } else {
    next();
  }
});

export default router;
