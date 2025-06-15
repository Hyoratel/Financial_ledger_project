<!--
ProfileView.vue
프로필 설정 화면 구성 컴포넌트
- 로그인한 사용자 정보(이름, 이메일, 휴대폰번호, 생년월일, 통신사) 수정 가능
- 정보 저장 기능 제공
- 로그아웃 / 회원 탈퇴 기능 제공
- 비로그인 시 로그인 유도 메시지 표시
-->

<template>
  <!-- 전체 화면 중앙 정렬 및 배경 설정 -->
  <div
    class="container-fluid bg-light d-flex justify-content-center align-items-center height-100"
  >
    <!-- 고정된 프로필 설정 박스 -->
    <div
      class="bg-white shadow rounded d-flex flex-column"
      style="width: 390px; height: 844px"
    >
      <!-- 상단 타이틀 -->
      <div class="px-4 py-3 border-bottom">
        <h5 class="text-center fw-bold mb-0">프로필 설정</h5>
      </div>

      <!-- 입력 폼 영역 (스크롤 가능) -->
      <div class="flex-grow-1 overflow-auto px-4 pt-3 pb-1">
        <!-- 로그인된 사용자가 있을 경우 -->
        <div v-if="user">
          <!-- 이름 입력 -->
          <div class="mb-2">
            <label class="form-label">이름</label>
            <input v-model="editUser.name" class="form-control" />
          </div>

          <!-- 이메일 입력 -->
          <div class="mb-2">
            <label class="form-label">이메일</label>
            <input v-model="editUser.email" class="form-control" />
          </div>

          <!-- 휴대폰번호 입력 -->
          <div class="mb-2">
            <label class="form-label">휴대폰번호</label>
            <input v-model="editUser.phone" class="form-control" />
          </div>

          <!-- 생년월일 입력 (오늘 날짜 이전까지만 선택 가능) -->
          <div class="mb-2">
            <label class="form-label">생년월일</label>
            <input
              type="date"
              v-model="editUser.birth"
              class="form-control"
              :max="maxDate"
            />
          </div>

          <!-- 통신사 선택 -->
          <div class="mb-3">
            <label class="form-label">통신사</label>
            <select v-model="editUser.telecom" class="form-select">
              <option value="">통신사 선택</option>
              <option value="SKT">SKT</option>
              <option value="KT">KT</option>
              <option value="LG">LG U+</option>
            </select>
          </div>

          <!-- 정보 저장 버튼 -->
          <button class="btn btn-warning w-100 mt-2" @click="saveChanges">
            정보 저장
          </button>
        </div>

        <!-- 로그인하지 않은 사용자에게 메시지 표시 -->
        <div v-else class="text-center mt-5">
          <p>로그인이 필요합니다.</p>
          <router-link to="/login" class="text-primary">
            로그인하러 가기
          </router-link>
        </div>
      </div>

      <!-- 하단 버튼 (항상 하단 고정) -->
      <div class="mt-auto w-100 px-3" style="padding-bottom: 16px">
        <!-- 로그아웃 버튼 -->
        <button class="btn btn-outline-secondary w-100 mb-2" @click="logout">
          로그아웃
        </button>
        <!-- 회원 탈퇴 버튼 -->
        <button class="btn btn-outline-danger w-100" @click="deleteAccount">
          회원 탈퇴
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 인증 스토어 import (로그인 사용자 정보 및 관련 메서드 접근)
import { useAuthStore } from '../stores/authStore';

// 페이지 이동을 위한 Vue Router 사용
import { useRouter } from 'vue-router';

// 반응형 객체 생성을 위한 reactive import
import { reactive } from 'vue';

// 인증 스토어 및 라우터 객체 초기화
const authStore = useAuthStore();
const router = useRouter();

// 현재 로그인된 사용자 정보 가져오기
const user = authStore.user;

// 사용자 정보를 수정할 수 있도록 복사하여 반응형 객체로 생성
const editUser = reactive({ ...user });

// 생년월일 선택의 최대값으로 오늘 날짜 제한
const maxDate = new Date().toISOString().split('T')[0];

// 사용자 정보 저장 함수
const saveChanges = async () => {
  const success = await authStore.updateUser(editUser);
  if (success) {
    alert('정보가 수정되었습니다.');
  } else {
    alert('수정 실패');
  }
};

// 로그아웃 함수
const logout = () => {
  authStore.logout(); // 스토어 초기화
  router.push('/login'); // 로그인 페이지로 이동
};

// 회원 탈퇴 함수
const deleteAccount = async () => {
  const confirmed = confirm('정말로 회원 탈퇴하시겠습니까?');
  if (!confirmed) return;

  await authStore.deleteUser(); // 사용자 삭제 요청
  alert('탈퇴 완료');
  router.push('/login'); // 로그인 페이지로 이동
};
</script>

<style scoped>
/* 기본 폼 스타일이 부트스트랩에서 제공되므로 커스텀 불필요 */
</style>
