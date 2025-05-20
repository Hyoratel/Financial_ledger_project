<template>
  <!-- 화면 전체를 중앙 정렬 -->
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <!-- 약관 동의 박스 -->
    <div
      class="border shadow bg-white p-4"
      style="width: 414px; height: 896px; overflow-y: auto"
    >
      <!-- 상단 로고 -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold text-warning mb-0" style="font-size: 20px">
          Moneylog
        </h3>
      </div>

      <!-- 전체 동의 체크박스 -->
      <div class="form-check mb-2">
        <input
          class="form-check-input"
          type="checkbox"
          id="checkAll"
          v-model="allChecked"
          @change="toggleAll"
        />
        <label class="form-check-label fw-bold" for="checkAll">
          전체 동의하기
        </label>
        <p class="text-muted small mt-1">
          필수 및 선택 약관 전체 동의에 포함됩니다.
        </p>
      </div>

      <hr class="my-3" />

      <!-- 개별 약관 목록 반복 -->
      <div class="form-check mb-3" v-for="(term, index) in terms" :key="index">
        <input
          class="form-check-input"
          type="checkbox"
          :id="'check-' + index"
          v-model="term.checked"
          @change="syncAllCheck"
        />
        <label class="form-check-label" :for="'check-' + index">
          <!-- 필수/선택 뱃지 + 약관 제목 -->
          <span
            class="badge me-1"
            :class="term.required ? 'bg-warning' : 'bg-secondary'"
          >
            {{ term.required ? '필수' : '선택' }}
          </span>
          {{ term.title }}
        </label>

        <!-- 약관 내용 미리보기 (스크롤이 필요한 경우만) -->
        <textarea
          v-if="term.scroll"
          class="form-control mt-2"
          rows="4"
          readonly
          >{{ term.content }}</textarea
        >
      </div>

      <!-- 다음 버튼: 필수 약관을 모두 체크한 경우 활성화 -->
      <router-link
        v-if="canProceed"
        to="/signup"
        class="btn w-100 mt-4 text-warning fw-bold"
        style="background-color: #5e4b3c"
      >
        다음
      </router-link>
      <!-- 체크 미완료 시 비활성 버튼 -->
      <button
        v-else
        class="btn w-100 mt-4 text-white fw-bold"
        style="background-color: #5e4b3c"
        disabled
      >
        다음
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allChecked: false, // 전체 동의 상태
      terms: [], // 약관 목록 데이터
    };
  },
  computed: {
    // 필수 항목들이 모두 체크되어야 다음으로 진행 가능
    canProceed() {
      return this.terms
        .filter((term) => term.required) // 필수 항목만 필터링
        .every((term) => term.checked); // 모두 체크됐는지 확인
    },
  },
  methods: {
    // 전체 동의 체크 시 개별 항목들도 모두 선택
    toggleAll() {
      this.terms.forEach((term) => {
        term.checked = this.allChecked;
      });
    },

    // 개별 항목 체크 시 전체 동의 상태 자동 갱신
    syncAllCheck() {
      this.allChecked = this.terms.every((term) => term.checked);
    },

    // 약관 내용 불러오기 (스크롤 가능한 항목만)
    async loadTermContents() {
      for (const term of this.terms) {
        if (term.scroll && term.contentUrl) {
          try {
            const response = await fetch(term.contentUrl);
            term.content = await response.text(); // 텍스트 형태로 저장
          } catch (err) {
            term.content = '약관을 불러오는 데 실패했습니다.';
          }
        }
      }
    },
  },
  async mounted() {
    // 컴포넌트가 마운트될 때 약관 json 파일 로딩
    try {
      const res = await fetch('/terms.json');
      this.terms = await res.json();
      await this.loadTermContents(); // 약관 내용 동기 로딩
    } catch (error) {
      console.error('약관 데이터를 불러오는 중 오류:', error);
    }
  },
};
</script>

<style scoped>
textarea {
  transition: opacity 0.2s ease-in-out;
  white-space: pre-wrap; /* 줄바꿈 보이게 */
}
</style>
