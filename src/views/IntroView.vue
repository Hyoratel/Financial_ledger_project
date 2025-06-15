<!--
IntroView.vue
앱 시작 시 표시되는 인트로(로딩) 화면
- 중앙에 Moneylog 로고 및 슬로건 표시
- Spinner 로딩 애니메이션 표시
- 2초 후 자동으로 /login 페이지로 이동
-->

<template>
  <!-- 전체 뷰포트 영역 가운데 정렬 -->
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <!-- 고정 크기 박스 -->
    <div
      class="border shadow d-flex flex-column justify-content-center align-items-center p-4"
      style="width: 414px; height: 896px"
    >
      <!-- 메인 텍스트 -->
      <div class="text-center mt-auto">
        <p class="text-warning fw-bold mb-3 fs-5">24시 간편한 자산관리</p>

        <!-- 로고 이미지 삽입 -->
        <div class="mb-4 px-4 py-2 rounded">
          <img
            :src="moneylogo"
            alt="Moneylog 로고"
            class="img-fluid"
            style="max-width: 240px; width: 100%"
          />
        </div>
      </div>

      <!-- 로딩 Spinner -->
      <div class="text-secondary my-5">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- 하단 문구 -->
      <div class="text-center small text-warning fw-semibold mb-auto">
        고객의 행복과 더 나은 세상을 만들어 갑니다.
      </div>
    </div>
  </div>
</template>

<script setup>
// Vue 기능 import
import { onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

import moneylogo from '@/assets/images/moneylogo.png';

// Router 인스턴스 사용
const router = useRouter();

// 컴포넌트 마운트 시 실행
onMounted(() => {
  // nextTick 사용하여 렌더링 완료 후 비동기 처리
  nextTick(() => {
    // 2초 후 /login 페이지로 이동
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  });
});
</script>
