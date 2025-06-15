/**
 * AuthStore
 *
 * 사용자 인증 관련 상태 및 기능을 전역으로 관리하는 Pinia 스토어입니다.
 * 주요 기능:
 * - 로그인 / 로그아웃 처리
 * - 회원가입
 * - 사용자 정보 수정
 * - 회원 탈퇴
 *
 * 로그인 상태 및 사용자 정보를 localStorage에 저장하여 페이지 새로고침 후에도 유지됩니다.
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export const useAuthStore = defineStore('auth', () => {
  /**
   * 전역 상태 정의
   */
  const user = ref(null); // 로그인한 사용자 정보
  const isLoggedIn = ref(false); // 로그인 여부

  /**
   * 로그인 함수
   * @param {string} id - 사용자 아이디
   * @param {string} password - 사용자 비밀번호
   * @returns {boolean} 로그인 성공 여부
   */
  const login = async (id, password) => {
    try {
      // 사용자 아이디로 사용자 정보 조회
      const res = await axios.get(`http://localhost:3000/users?id=${id}`);

      // 해당 아이디의 사용자가 없는 경우 false 반환
      if (res.data.length === 0) return false;

      const foundUser = res.data[0];

      // 입력한 비밀번호 + salt를 이용하여 암호화 후 비교
      const hash = CryptoJS.SHA256(foundUser.salt + password).toString();

      if (hash === foundUser.password) {
        // 로그인 성공 시 사용자 정보와 로그인 상태 업데이트
        user.value = foundUser;
        isLoggedIn.value = true;

        // localStorage에 로그인 정보 저장
        localStorage.setItem('user', JSON.stringify(foundUser));

        return true;
      } else {
        // 비밀번호 불일치 시 false 반환
        return false;
      }
    } catch (err) {
      // 예외 발생 시 에러 출력 및 false 반환
      console.error('로그인 에러:', err);
      return false;
    }
  };

  /**
   * 회원가입 함수
   * @param {Object} newUser - 등록할 사용자 정보 객체
   * @returns {boolean} 회원가입 성공 여부
   */
  const register = async (newUser) => {
    try {
      // 사용자 정보를 서버에 등록 (POST 요청)
      const res = await axios.post('http://localhost:3000/users', newUser);

      // 회원가입 후 자동 로그인 처리
      user.value = res.data;
      isLoggedIn.value = true;

      // localStorage에 로그인 정보 저장
      localStorage.setItem('user', JSON.stringify(res.data));

      return true;
    } catch (err) {
      // 예외 발생 시 에러 출력 및 false 반환
      console.error('회원가입 에러:', err);
      return false;
    }
  };

  /**
   * 사용자 정보 수정 함수
   * @param {Object} updatedUser - 수정할 사용자 정보 객체
   * @returns {boolean} 수정 성공 여부
   */
  const updateUser = async (updatedUser) => {
    try {
      // 사용자 정보 수정 (PUT 요청)
      const res = await axios.put(
        `http://localhost:3000/users/${updatedUser.id}`,
        updatedUser
      );

      // 수정된 사용자 정보 업데이트
      user.value = res.data;

      // localStorage에 수정된 사용자 정보 저장
      localStorage.setItem('user', JSON.stringify(res.data));

      return true;
    } catch (err) {
      // 예외 발생 시 에러 출력 및 false 반환
      console.error('수정 에러:', err);
      return false;
    }
  };

  /**
   * 로그아웃 함수
   * 사용자 상태 초기화 및 localStorage 정보 제거
   */
  const logout = () => {
    user.value = null;
    isLoggedIn.value = false;

    // localStorage에서 사용자 정보 제거
    localStorage.removeItem('user');
  };

  /**
   * 회원 탈퇴 함수
   * 서버에서 사용자 정보 삭제 후 상태 초기화
   */
  const deleteUser = async () => {
    try {
      // 사용자 정보 삭제 (DELETE 요청)
      await axios.delete(`http://localhost:3000/users/${user.value.id}`);

      // 상태 초기화 (로그아웃 처리)
      logout();
    } catch (err) {
      // 예외 발생 시 에러 출력
      console.error('회원 탈퇴 에러:', err);
    }
  };

  /**
   * 외부에서 사용할 state 및 함수 반환
   */
  return {
    user,
    isLoggedIn,
    login,
    register,
    updateUser,
    logout,
    deleteUser,
  };
});
