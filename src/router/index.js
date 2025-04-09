// 📁 router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// auth 레이아웃용 뷰들
import IntroView from '@/views/IntroView.vue';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import TermsAgreementView from '@/views/TermsAgreementView.vue';
import ProfileView from '@/views/ProfileView.vue';
import Home from '@/views/HomeView.vue';

// Pinia store
import { useAuthStore } from '@/stores/authStore';

const routes = [
  {
    path: '/',
    redirect: '/intro',
  },
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
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { layout: 'default', requiresAuth: true },
  },
  {
    path: '/',
    name: 'InputView',
    component: TransactionForm,
},
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
  }
]
// ⚠️ 아직 컴포넌트가 구현되지 않았다면 주석 처리 필요
// import LoginView from '@/views/LoginView.vue'
// import DashboardView from '@/views/DashboardView.vue'
// import SettingsView from '@/views/SettingsView.vue'
// import TransactionFormView from '@/views/TransactionFormView.vue'
// import Homeview from '@/views/HomeView.vue';
import TransactionForm from '@/views/TransactionForm.vue';


  // 더미 페이지 (각 기능상태를 보려면 주석처리)
  // {
    // path: '/',
    // name: 'Default',
    // component: Homeview,
    // meta: { layout: 'Default' },
  // },
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

// ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * ✅ 라우터 가드: 로그인 필요 페이지는 authStore에서 로그인 여부 확인
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
