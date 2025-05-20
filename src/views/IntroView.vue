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
        <p class="text-warning fw-bold mb-2 fs-3">24시 간편한 자산관리</p>
        <div
          class="text-white px-4 py-2 fw-bold rounded mb-4"
          style="background-color: #5e4b3c"
        >
          <div class="p-2 fs-1">Moneylog</div>
        </div>
      </div>

      <!-- 로딩 -->
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
import { onMounted, nextTick } from 'vue';
// nextTick 공부 필요
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      router.push('/login'); // ✅ 렌더링 완료 후 이동
    }, 2000);
  });
});
</script>
