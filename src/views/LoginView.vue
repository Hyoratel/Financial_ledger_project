<!--
LoginView.vue
로그인 화면 구성 컴포넌트
- 아이디/비밀번호 입력 폼
- 유효성 검사 및 오류 메시지 표시
- 로그인 성공 시 글로벌 모달 표시 후 홈 화면으로 이동
- 로그인 실패 시 글로벌 모달로 오류 알림
- 회원가입 페이지로 이동하는 링크 제공
-->

<script setup>
// Vue 기능 import
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Pinia 스토어 import
import { useAuthStore } from '../stores/authStore';
import { useGlobalModalStore } from '../stores/GlobalModalStore';

import moneylogo from '@/assets/images/moneylogo.png';

// 입력값과 오류 메시지 상태 정의
const username = ref('');
const password = ref('');
const errors = ref({
  username: '',
  password: '',
});

// Router, Store 사용
const router = useRouter();
const authStore = useAuthStore();
const globalModal = useGlobalModalStore();

// 로그인 처리 함수
const login = async () => {
  let isValid = true;

  // 오류 메시지 초기화
  errors.value.username = '';
  errors.value.password = '';

  // 유효성 검사
  if (!username.value) {
    errors.value.username = '아이디를 입력해주세요.';
    isValid = false;
  }
  if (!password.value) {
    errors.value.password = '비밀번호를 입력해주세요.';
    isValid = false;
  }

  if (!isValid) return;

  // 로그인 시도
  const success = await authStore.login(username.value, password.value);

  if (success) {
    // 로그인 성공 시 모달 표시 후 홈으로 이동
    globalModal.openAlert({
      title: '로그인 성공',
      message: `${authStore.user.name}님, 환영합니다.`,
      onConfirm: () => {
        router.push('/home');
      },
    });
  } else {
    // 로그인 실패 시 모달 표시
    globalModal.openAlert({
      title: '로그인 실패',
      message: '아이디 또는 비밀번호가 일치하지 않습니다.',
    });
  }
};
</script>

<template>
  <!-- 전체 뷰포트 영역 가운데 정렬 -->
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <div
      class="border shadow bg-white"
      style="width: 414px; height: 896px; display: flex; flex-direction: column"
    >
      <div
        class="d-flex flex-column justify-content-center align-items-center flex-grow-1 px-4"
      >
        <!-- 로고 및 슬로건 영역 -->
        <div class="text-center my-5">
          <!-- 로고 이미지 -->
          <div class="mb-3">
            <img
              :src="moneylogo"
              alt="Moneylog 로고"
              class="img-fluid"
              style="max-width: 220px; width: 100%"
            />
          </div>

          <!-- 슬로건 텍스트 -->
          <p class="fw-semibold" style="font-size: 16px; color: #808080">
            24시 간편한 자산관리
          </p>
        </div>

        <!-- 로그인 폼 -->
        <form class="w-100" @submit.prevent="login">
          <!-- 아이디 입력 -->
          <div class="mt-5 mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="아이디"
              v-model="username"
            />
            <div v-if="errors.username" class="text-danger small">
              {{ errors.username }}
            </div>
          </div>

          <!-- 비밀번호 입력 -->
          <div class="mb-5">
            <input
              type="password"
              class="form-control"
              placeholder="비밀번호"
              v-model="password"
            />
            <div v-if="errors.password" class="text-danger small">
              {{ errors.password }}
            </div>
          </div>

          <!-- 로그인 버튼 -->
          <button
            type="submit"
            class="btn text-warning fw-bold w-100 mb-2"
            style="background-color: #60584c"
          >
            로그인
          </button>
        </form>

        <!-- 회원가입 링크 -->
        <div class="text-center mt-2" style="font-size: 14px">
          <router-link to="/terms" class="text-secondary text-decoration-none">
            회원가입
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
