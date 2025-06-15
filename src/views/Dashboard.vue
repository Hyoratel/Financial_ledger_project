<!--
DashboardPage.vue
대시보드 페이지의 레이아웃 컴포넌트
- 고정 크기 뷰(390x844)에 탭 메뉴와 서브 페이지 표시 영역 구성
- RouterLink로 '월별 요약', '수입 요약', '지출 요약' 탭 전환
- 각 탭 클릭 시 RouterView 영역에 해당 서브 페이지 표시
-->

<template>
  <!-- 전체 뷰포트 영역 가운데 정렬 -->
  <div
    class="d-flex justify-content-center align-items-center height-100 bg-white"
  >
    <!-- 고정 크기 박스 -->
    <div
      class="border shadow d-flex flex-column justify-content-start align-items-center"
      style="width: 390px; height: 844px"
    >
      <!-- 탭 및 페이지 영역 -->
      <div
        class="w-100 px-3 py-2 d-flex flex-column gap-3"
        style="flex: 1; overflow-y: auto"
      >
        <!-- 탭 메뉴 -->
        <div class="d-flex gap-3 border-bottom pb-2">
          <ul
            class="d-flex gap-3 list-unstyled mb-0 w-100 justify-content-around"
          >
            <!-- 월별 요약 탭 -->
            <li>
              <RouterLink
                to="/dashboard/summary"
                class="fw-semibold px-2 py-1 text-decoration-none rounded"
                :class="{
                  'text-danger border-bottom border-2 border-danger bg-light':
                    $route.path.includes('summary'),
                  'text-dark hover:text-danger':
                    !$route.path.includes('summary'),
                }"
              >
                월별 요약
              </RouterLink>
            </li>

            <!-- 수입 요약 탭 -->
            <li>
              <RouterLink
                to="/dashboard/income"
                class="fw-semibold px-2 py-1 text-decoration-none rounded"
                :class="{
                  'text-danger border-bottom border-2 border-danger bg-light':
                    $route.path.includes('income'),
                  'text-dark hover:text-danger':
                    !$route.path.includes('income'),
                }"
              >
                수입 요약
              </RouterLink>
            </li>

            <!-- 지출 요약 탭 -->
            <li>
              <RouterLink
                to="/dashboard/spending"
                class="fw-semibold px-2 py-1 text-decoration-none rounded"
                :class="{
                  'text-danger border-bottom border-2 border-danger bg-light':
                    $route.path.includes('spending'),
                  'text-dark hover:text-danger':
                    !$route.path.includes('spending'),
                }"
              >
                지출 요약
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- 서브 페이지 표시 영역 -->
        <div class="flex-grow-1 overflow-auto">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vue Router 기능 사용
import { RouterLink, RouterView, useRoute } from 'vue-router';

// 컴포넌트 이름 정의 (선택 사항)
defineOptions({
  name: 'DashboardPage',
});

// 현재 경로 정보 가져오기 (탭 활성화 여부 판별에 사용)
const $route = useRoute();
</script>

<style scoped>
/* 정확히 일치하는 라우터 링크 활성화 시 텍스트 볼드 처리 */
.router-link-exact-active {
  font-weight: bold;
}
</style>
