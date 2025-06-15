/** GlobalModalStore
 * 애플리케이션 전역에서 사용하는 알림(Confirm/Alert) 모달 상태 및 동작을 관리하는 스토어
 */

import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalModalStore = defineStore('globalModal', () => {
  // 모달의 열림 여부
  const isOpen = ref(false);

  // 모달에 표시할 제목
  const title = ref('');

  // 모달에 표시할 메시지
  const message = ref('');

  // 확인(Confirm) 버튼 클릭 시 실행할 콜백 함수
  const onConfirm = ref(null);

  // Alert 모달 열기
  // - title: 모달 제목
  // - message: 모달 본문 메시지
  // - onConfirm: 확인 버튼 클릭 시 실행할 콜백 함수 (선택사항)
  const openAlert = ({ title: t, message: m, onConfirm: confirmFn = null }) => {
    title.value = t;
    message.value = m;
    onConfirm.value = confirmFn;
    isOpen.value = true;
  };

  // 모달 닫기 및 상태 초기화
  const close = () => {
    isOpen.value = false;
    title.value = '';
    message.value = '';
    onConfirm.value = null;
  };

  // 확인(Confirm) 버튼 클릭 시 동작 처리
  // - onConfirm 콜백 실행 후 모달 닫기
  const confirm = () => {
    if (onConfirm.value) onConfirm.value();
    close();
  };

  // 외부에서 사용할 상태 및 메서드 반환
  return {
    isOpen,
    title,
    message,
    onConfirm,
    openAlert,
    close,
    confirm,
  };
});
