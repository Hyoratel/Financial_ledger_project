<template>
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <div
      class="border shadow p-4 bg-white"
      style="width: 414px; height: 896px; overflow-y: auto"
    >
      <h1
        class="d-block mt-2 mb-4 text-warning fw-bold"
        style="font-size: 20px"
      >
        ** 뱅크
      </h1>

      <div
        v-if="isSignedUp"
        class="d-flex justify-content-center align-items-center text-center"
        style="height: 80%"
      >
        <p class="fw-bold fs-4 text-success">⭐ 가입 완료 ⭐</p>
      </div>

      <form v-else @submit.prevent="submitForm">
        <div class="mb-3 d-flex align-items-center">
          <input
            type="text"
            class="form-control me-2"
            v-model="form.id"
            placeholder="아이디"
            :disabled="isIdChecked"
          />
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            @click="checkDuplicateId"
            style="font-size: 0.75rem; height: 32px; min-width: 70px"
          >
            중복검사
          </button>
        </div>
        <p
          v-if="idCheckMessage"
          :class="idCheckValid ? 'text-success' : 'text-danger'"
          class="mb-2"
        >
          {{ idCheckMessage }}
        </p>

        <div class="mb-3">
          <input
            type="password"
            class="form-control"
            v-model="form.password"
            placeholder="비밀번호"
          />
          <small
            v-if="form.password"
            :class="isPasswordValid ? 'text-success' : 'text-danger'"
            >{{ passwordMessage }}</small
          >
        </div>

        <div class="mb-3">
          <input
            type="password"
            class="form-control"
            v-model="confirmPassword"
            placeholder="비밀번호 재확인"
          />
          <small
            v-if="confirmPassword"
            :class="isPasswordMatched ? 'text-success' : 'text-danger'"
            >{{ passwordMatchMessage }}</small
          >
        </div>

        <div class="mb-3">
          <input
            type="email"
            class="form-control"
            v-model="form.email"
            placeholder="이메일"
          />
        </div>

        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            v-model="form.name"
            placeholder="이름"
          />
        </div>

        <div class="mb-3">
          <input
            type="date"
            class="form-control"
            v-model="form.birth"
            :max="maxDate"
          />
        </div>

        <div class="mb-4">
          <select class="form-select" v-model="form.telecom">
            <option value="">통신사 선택</option>
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG">LG U+</option>
          </select>
        </div>

        <div class="mb-3">
          <input
            type="tel"
            class="form-control"
            v-model="form.phone"
            placeholder="휴대전화번호"
          />
        </div>

        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            v-model="form.authCode"
            placeholder="인증번호 6자리를 입력해주세요."
            maxlength="6"
            :disabled="!isAuthRequested"
          />
          <small v-if="!isAuthRequested" class="text-muted"
            >* 인증 요청을 먼저 해주세요.</small
          >
          <small
            v-if="isAuthRequested && remainingTime > 0"
            class="text-danger ms-1"
            >({{ remainingTime }}초 남음)</small
          >
        </div>

        <div class="form-check mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            id="agreeAll"
            v-model="form.agreeAll"
            @change="toggleAllAgreements"
          />
          <label class="form-check-label fw-bold" for="agreeAll"
            >[필수] 인증 약관 전체동의</label
          >
        </div>

        <div class="ms-3 mb-3" v-if="form.showAgreements">
          <div
            class="form-check"
            v-for="(value, key) in form.agreements"
            :key="key"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :id="key"
              v-model="form.agreements[key]"
              @change="checkIfAllAgreed"
            />
            <label class="form-check-label" :for="key">{{
              agreementLabels[key]
            }}</label>
          </div>
        </div>

        <button
          type="submit"
          class="btn w-100 mt-3 d-flex justify-content-center align-items-center"
          style="background-color: #5e4b3c; color: white"
          :disabled="!isFormValid || isLoading"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {{ isAuthRequested ? '가입 완료' : '인증 요청' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const isSignedUp = ref(false);
const isAuthRequested = ref(false);
const isLoading = ref(false);
const isIdChecked = ref(false);
const idCheckMessage = ref('');
const idCheckValid = ref(false);
const confirmPassword = ref('');
const remainingTime = ref(0);
let timerInterval = null;

const form = ref({
  id: '',
  password: '',
  email: '',
  name: '',
  birth: '',
  telecom: '',
  phone: '',
  authCode: '',
  agreeAll: false,
  showAgreements: false,
  agreements: { privacy: false, telecom: false, bank: false, authTerms: false },
});

const agreementLabels = {
  privacy: '개인정보 이용',
  telecom: '통신사 이용약관',
  bank: '** 뱅크 개인정보보호정책',
  authTerms: '인증사 이용약관',
};

const passwordMessage = computed(() => {
  const pw = form.value.password;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const count = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
    Boolean
  ).length;
  if ((count >= 3 && pw.length >= 8) || (count >= 2 && pw.length >= 10))
    return '사용 가능한 비밀번호입니다.';
  return '비밀번호는 3종류 이상 조합 8자리 이상 또는 2종류 조합 10자리 이상이어야 합니다.';
});

const isPasswordValid = computed(
  () => passwordMessage.value === '사용 가능한 비밀번호입니다.'
);
const isPasswordMatched = computed(
  () => form.value.password === confirmPassword.value
);
const passwordMatchMessage = computed(() =>
  isPasswordMatched.value
    ? '비밀번호가 일치합니다.'
    : '비밀번호가 일치하지 않습니다.'
);
const maxDate = new Date().toISOString().split('T')[0];

const isFormValid = computed(() => {
  const f = form.value;
  const filled =
    f.id &&
    f.password &&
    confirmPassword.value &&
    f.email &&
    f.name &&
    f.birth &&
    f.telecom &&
    f.phone &&
    f.agreeAll &&
    isIdChecked.value;
  return !isAuthRequested.value
    ? filled && isPasswordValid.value && isPasswordMatched.value
    : filled &&
        f.authCode.length === 6 &&
        isPasswordValid.value &&
        isPasswordMatched.value;
});

const toggleAllAgreements = () => {
  const check = form.value.agreeAll;
  for (const key in form.value.agreements) form.value.agreements[key] = check;
  form.value.showAgreements = check;
};

const checkIfAllAgreed = () => {
  const values = Object.values(form.value.agreements);
  form.value.agreeAll = values.every(Boolean);
  form.value.showAgreements = values.some(Boolean);
};

const checkDuplicateId = async () => {
  const userId = form.value.id.trim();
  if (!userId) {
    idCheckMessage.value = '아이디를 입력해주세요.';
    idCheckValid.value = false;
    return;
  }
  try {
    const res = await axios.get(`http://localhost:3000/users?id=${userId}`);
    if (res.data.length > 0) {
      idCheckMessage.value = '이미 사용 중인 아이디입니다.';
      idCheckValid.value = false;
      isIdChecked.value = false;
    } else {
      idCheckMessage.value = '사용 가능한 아이디입니다.';
      idCheckValid.value = true;
      isIdChecked.value = true;
    }
  } catch (error) {
    console.error('중복 검사 오류:', error);
    idCheckMessage.value = '중복 검사 중 오류가 발생했습니다.';
    idCheckValid.value = false;
    isIdChecked.value = false;
  }
};
// 타이머 설정 기능 추가 250420
const startTimer = () => {
  remainingTime.value = 30; // 클라이언트 부분 즉, 화면용
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) remainingTime.value--;
    else clearInterval(timerInterval);
  }, 1000);
};

const submitForm = async () => {
  if (!isAuthRequested.value) {
    isLoading.value = true;
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const now = new Date().toISOString();
      await axios.post('http://localhost:3000/authCodes', {
        id: form.value.phone,
        phone: form.value.phone,
        code,
        createdAt: now,
      });
      console.log('인증번호:', code);
      alert('인증번호가 발송되었습니다.');
      isAuthRequested.value = true;
      startTimer();
    } catch (error) {
      alert('인증 요청 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  } else {
    try {
      const res = await axios.get(
        `http://localhost:3000/authCodes?id=${form.value.phone}`
      );
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const codeEntry = sorted[0];
      if (!codeEntry) {
        alert('인증번호를 먼저 요청해주세요.');
        return;
      }
      const now = new Date().getTime();
      const created = new Date(codeEntry.createdAt).getTime();
      if (now - created > 60000) {
        // 서버 기준 유효성 검사
        alert('인증번호가 만료되었습니다. 다시 요청해주세요.');
        return;
      }
      if (form.value.authCode.trim() !== codeEntry.code.trim()) {
        alert('인증번호가 일치하지 않습니다.');
        return;
      }
    } catch (error) {
      alert('인증번호 확인 중 오류 발생');
      console.error(error);
      return;
    }

    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const hashed = CryptoJS.SHA256(salt + form.value.password).toString();
    const newUser = {
      id: form.value.id,
      password: hashed,
      salt,
      email: form.value.email,
      name: form.value.name,
      birth: form.value.birth,
      telecom: form.value.telecom,
      phone: form.value.phone,
      agreements: form.value.agreements,
    };
    const success = await authStore.register(newUser);
    if (success) {
      isSignedUp.value = true;
      setTimeout(() => router.push('/login'), 2000);
    } else {
      alert('회원가입에 실패했습니다.');
    }
  }
};
</script>

<style scoped>
/* 스타일 필요 시 추가 */
</style>
