<script setup>
// Vue에서 반응형 변수(ref)를 사용하기 위한 import
import { ref } from 'vue';
// 페이지 이동을 위한 Vue Router 사용
import { useRouter } from 'vue-router';
// 인증 관련 상태 관리를 위한 Pinia 스토어 import
import { useAuthStore } from '../stores/authStore';
// 비밀번호 암호화를 위한 CryptoJS 라이브러리 import (현재 이 코드에서는 사용되지 않음)
import CryptoJS from 'crypto-js';
// 글로벌 모달 추가가
import { useGlobalModalStore } from '../stores/GlobalModalStore';

// 사용자 입력값을 저장할 반응형 변수 선언
const username = ref('');
const password = ref('');

// 라우터 객체 사용 (페이지 이동을 위함)
const router = useRouter();
// 인증 스토어 사용 (로그인 처리 및 사용자 정보 접근을 위함)
const authStore = useAuthStore();
// 전역 모달 사용 등록
const globalModal = useGlobalModalStore();
// 로그인 함수 정의
const login = async () => {
  // 입력값이 비어 있으면 경고 표시
  // 기존  alert 에서 팝업으로 변경
  if (!username.value || !password.value) {
    globalModal.openAlert({
      title: '입력 오류',
      message: '아이디와 비밀번호를 입력해주세요.',
    });
    return;
  }

  // authStore의 login 메서드 호출 (성공 여부 반환)
  const success = await authStore.login(username.value, password.value);

  if (success) {
    globalModal.openAlert({
      title: '로그인 성공',
      message: `${authStore.user.name}님, 환영합니다.`,
      onConfirm: () => {
        router.push('/home');
      },
    });
  } else {
    globalModal.openAlert({
      title: '로그인 실패',
      message: '아이디 또는 비밀번호가 일치하지 않습니다.',
    });
  }
};
</script>

<template>
  <!-- 전체 화면 중앙 정렬 -->
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <!-- 로그인 박스 영역 (고정된 크기) -->
    <div
      class="border shadow bg-white"
      style="width: 414px; height: 896px; display: flex; flex-direction: column"
    >
      <!-- 로그인 콘텐츠 중앙 정렬 -->
      <div
        class="d-flex flex-column justify-content-center align-items-center flex-grow-1 px-4"
      >
        <!-- 타이틀 영역 -->
        <h1 class="fw-bold mb-5" style="font-size: 24px; color: burlywood">
          <!-- Moneylog: 노란색, 기존보다 크게 -->
          <span class="d-block" style="font-size: 24px; color: #ffc107"
            >Moneylog</span
          >

          <!-- 자산관리: 원래 Moneylog 스타일 (작고 갈색) -->
          <span style="font-size: 18px; color: #5e4b3c"
            >24시 간편한 자산관리</span
          >
        </h1>

        <!-- 로그인 입력 폼 -->
        <form class="w-100" @submit.prevent="login">
          <!-- 아이디 입력 필드 -->
          <div class="mt-5 mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="아이디"
              v-model="username"
            />
          </div>
          <!-- 비밀번호 입력 필드 -->
          <div class="mb-5">
            <input
              type="password"
              class="form-control"
              placeholder="비밀번호"
              v-model="password"
            />
          </div>

          <!-- 로그인 버튼 -->
          <button
            type="submit"
            class="btn text-warning fw-bold w-100 mb-2"
            style="background-color: #5e4b3c"
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
