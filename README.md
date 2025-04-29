# 💰 Financial Ledger Project

일상 속 수입/지출을 간편하게 관리할 수 있는 **모바일 중심 가계부 앱**입니다.  
깔끔한 UI, 편리한 거래 입력, 월별 요약, 카테고리별 통계 기능을 제공합니다.

## 📚 목차

- [프로젝트 실행방법](#-프로젝트-실행-방법)
- [요구 사항 명세서](#-요구-사항-명세서)
- [프로젝트 구조](#-프로젝트-구조)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [담당 역할](#-담당-역할)
- [브랜치 전략](#️-브랜치-전략)
- [화면 예시](#-화면-예시)
- [기능 명세서](#-기능-명세서서)
- [참고 사항](#-참고사항)
- [Special Thanks](#-special-thanks)

---

## 🚀 프로젝트 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. Mock API 서버(`json-server`) 실행

**db.json** 파일을 이용한 로컬 서버를 실행해야 정상 동작합니다.

```bash
npx json-server --watch db.json --port 3000
```

- `db.json` 파일은 루트 디렉토리에 위치합니다.
- 포트는 기본 **3000번**을 사용합니다.

> 🛠 `json-server`가 없다면 아래 명령어로 설치하세요.
>
> ```bash
> npm install -g json-server
> ```

---

## ✅요구 사항 명세서

| No. | 도메인        | 기능명           | 설명                                                                      | 우선순위 | 담당자 |
| --- | ------------- | ---------------- | ------------------------------------------------------------------------- | -------- | ------ |
| 1   | 인증/설정     | 로그인           | 이메일, 비밀번호 입력 후 로그인 요청 및 인증 처리                         | ★★★      | 이재성 |
| 2   | 인증/설정     | 사용자 설정 변경 | 이름, 이메일 등 프로필 정보 수정 가능                                     | ★★       | 이재성 |
| 3   | 거래 등록     | 거래 입력        | 날짜, 금액, 카테고리, 메모 입력 후 저장                                   | ★★★      | 박다빈 |
| 4   | 거래 등록     | 거래 수정        | 기존 거래 내용을 불러와 수정 후 저장                                      | ★★       | 전효빈 |
| 5   | 거래 내역     | 거래 리스트 출력 | 전체 거래 내역을 리스트로 보여줌                                          | ★★★      | 전효빈 |
| 6   | 거래 내역     | 거래 삭제        | 개별 거래 항목을 삭제할 수 있음                                           | ★★       | 전효빈 |
| 7   | 거래 내역     | 거래 필터링      | 날짜/기간별 필터링 기능 제공                                              | ★★       | 전효빈 |
| 8   | 통계/대시보드 | 월별 재정 요약   | 해당 월의 수입, 지출, 순이익 요약 표시                                    | ★★★      | 양현모 |
| 9   | 통계/대시보드 | 차트 시각화      | 수입/지출 요약을 그래프(Chart.js)로 시각화<br>카테고리별 필터링 기능 제공 | ★★       | 양현모 |
| 10  | 카테고리 관리 | 카테고리 조회    | json-server에서 가져온 카테고리를 수입/지출로 분류하고 조회               | ★★       | 황동민 |
| 11  | 카테고리 관리 | 카테고리 관리    | 사용자가 카테고리를 추가/삭제하고 DB에 반영                               | ★★       | 황동민 |
| 12  | UI 공통       | 모달 오픈/닫기   | 거래 등록/수정 등의 입력 UI를 모달 형식으로 구성                          | ★★       | 양지윤 |
| 13  | UI 공통       | 반응형 레이아웃  | 모바일/PC 해상도에 대응되는 반응형 레이아웃 구성                          | ★        | 양지윤 |

---

## 🗂️ 프로젝트 구조

```
src/
├── assets/
├── components/                          # 재사용 가능한 UI 컴포넌트
│   ├── ChartMonthlyIncome.vue          ✅ 월별 수입 통계 차트 요약 컴포넌트
│   ├── ChartMonthlySpending.vue        ✅ 월별 지출 통계 차트 요약 컴포넌트
│   ├── ChartMonthlySummary.vue         ✅ 월별 수입/지출/순익 통계 요약 컴포넌트
│   ├── MonthlySummary.vue              ✅ 월별 수입/지출/순익 요약 컴포넌트(홈화면)
│   ├── RecentTransactionList.vue       ✅ 최근 거래내역 컴포넌트
│   ├── SelectCategory.vue              ✅ 카테고리 조회 및 선택
│   ├── TransactionItem.vue             ✅ 카테고리 조회 및 선택
│   ├── TransactionList.vue             ✅ 거래 리스트 내 리스트 아이템
│   └── base/ basemodal.vue             ✅ 전역 모달 UI
├── layouts/                            # 페이지 전체를 감싸는 레이아웃
│   ├── AuthLayout.vue                  ✅ 로그인 등 최소 구성 레이아웃
│   └── DefaultLayout.vue               ✅ Header/Footer 포함 기본 레이아웃
├── stores/                             # 상태 관리 (Pinia 모듈)
│   ├── authStore.js                    ✅ 로그인 상태, 사용자 정보
│   ├── categoryStore.js                ✅ 카테고리 리스트 및 선택 상태
│   ├── transactionStore.js             ✅ 거래 내역 목록 및 필터링/삭제
│   └── TransactionModalStore.js        ✅ 모달 상태, 로딩 등 전역 UI 관리
├── views/
│   ├── CalendarView.vue                ✅ 월별 거래내역 달력형태 화면
│   ├── Dashboard.vue                   ✅ 최근 거래 내역 및 월별 재정 요약 페이지
│   ├── HomeView.vue                    ✅ 로그인 후 보여지는 홈 화면
│   ├── IntroView.vue                   ✅ 첫 접속 시, 보여지는 로딩 화면
│   ├── LoginView.vue                   ✅ 사용자 로그인 화면
│   ├── ProfileView.vue                 ✅ 프로필 설정 화면
│   ├── SignUpView.vue                  ✅ 사용자 정보 입력 및 계정 생성 화면
│   ├── TermsAgreementView.vue          ✅ 필수 및 선택 약관 동의 화면
│   ├── TransactionForm.vue             ✅ 신규 거래 입력 및 등록 화면
│   └── TransactionView.vue             ✅ 거래 내역 조회 및 삭제 화면
├── router/
│   └── index.js                        ✅ Vue Router 설정
├── App.vue                             ✅ 루트 컴포넌트 (동적 레이아웃 처리 포함)
└── main.js
```

---

## 📌 주요 기능

| 기능 구분         | 상세 설명                                        |
| :---------------- | :----------------------------------------------- |
| 회원 관리         | 로그인, 로그아웃, 회원가입, 프로필 수정          |
| 거래 관리(회원별) | 수입/지출 추가, 수정, 삭제, 일별/월별 조회       |
| 카테고리 관리     | 수입/지출 카테고리 선택 및 관리                  |
| 통계 대시보드     | 월별 수입/지출/순이익 요약, 카테고리별 차트 제공 |
| 반응형 지원       | 모바일(390px) 최적화 레이아웃 구현               |

---

## 🛠️ 기술 스택

| 항목          | 사용 기술                                  |
| :------------ | :----------------------------------------- |
| Frontend      | Vue 3, Vite, Composition API, Pinia, Axios |
| UI 라이브러리 | Bootstrap Icons, FontAwesome               |
| Mock API      | json-server                                |

---

## 👥 담당 역할

| 팀원   | 담당 기능                          |
| :----- | :--------------------------------- |
| 이재성 | 로그인/회원가입/프로필 설정 화면   |
| 박다빈 | 거래 입력                          |
| 전효빈 | 거래 리스트 및 거래 수정/삭제 기능 |
| 양현모 | 대시보드 통계 및 차트 구현         |
| 황동민 | 카테고리 관리 기능                 |
| 양지윤 | 공통 UI 및 전역 모달 컴포넌트 구축 |

---

## 🛡️ 브랜치 전략

- `main` : 최종 배포 버전
- `feature/{기능명}` : 기능 단위 개발
- `fix/{버그명}` : 버그 수정 브랜치
- `release2` : 배포 준비용 통합 브랜치
- `Develop` : 기능 개발용 통합 브랜치

---

## 📸 화면 예시

<table>
  <tr>
    <td align="center">시작페이지</td>
    <td align="center">로그인화면</td>
  </tr>
  <tr>
    <td><img src="./screenshots/iPhone 12 Pro-17.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-16.png" width="300px"></td>
  </tr>

  <tr>
    <td align="center">회원가입 약관</td>
    <td align="center">회원가입 예외처리</td>
  </tr>
  <tr>
    <td><img src="./screenshots/iPhone 12 Pro-15.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-14.png" width="300px"></td>
  </tr>

  <tr>
    <td align="center">회원가입 정상화면</td>
    <td align="center">홈 화면</td>
  </tr>
  <tr>
    <td><img src="./screenshots/iPhone 12 Pro-13.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-12.png" width="300px"></td>
  </tr>

  <tr>
    <td align="center">홈 화면 거래 입력</td>
    <td align="center">거래 입력 예외 처리</td>
  </tr>
  <tr>
    <td><img src="./screenshots/iPhone 12 Pro-11.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-10.png" width="300px"></td>
  </tr>

  <tr>
    <td align="center">일일 거래 내역</td>
    <td align="center">일일 거래 내역 - 거래수정</td>
  </tr>
  <tr>
    <td><img src="./screenshots/iPhone 12 Pro-9.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-11.png" width="300px"></td>
  </tr>

  <tr>
    <td align="center">거래수정 - 카테고리 예외처리</td>
    <td align="center">월별 거래 내역</td>
  </tr>
  <tr>
    <td><img src="./screenshots/iPhone 12 Pro-8.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-7.png" width="300px"></td>
  </tr>

  <tr>
    <td align="center">월별 거래 내역 - 거래내역 없는 경우</td>
    <td align="center">월별 거래 내역 - 거래내역 있을 경우</td>
  </tr>
  <tr>
    <td><img src="./screenshots/iPhone 12 Pro-6.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-5.png" width="300px"></td>
  </tr>

  <tr>
    <td align="center">월별 거래 내역 - 삭제 팝업</td>
    <td align="center">통계 월별 요약</td>
  </tr>
  <tr>
    <td><img src="./screenshots/iPhone 12 Pro-4.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-3.png" width="300px"></td>
  </tr>

  <tr>
    <td align="center">통계 수입 추이</td>
    <td align="center">통계 지출 추이</td>
  </tr>
  <tr>
    <td><img src="./screenshots/iPhone 12 Pro-2.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-1.png" width="300px"></td>
  </tr>

  <tr>
    <td align="center" colspan="2">프로필 설정</td>
  </tr>
  <tr>
    <td colspan="2" align="center"><img src="./screenshots/iPhone 12 Pro.png" width="300px"></td>
  </tr>
</table>

## ✔️기능 명세서

### 📋인증/설정 (이재성)

| 기능        | 설명                                                                                                                                                                                                                                                           | 기술스택                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 로그인      | 이메일, 비밀번호 입력 후 로그인 요청 및 인증 처리<br>- 미입력 또는 비밀번호 불일치 시 경고 메시지 출력                                                                                                                                                         | Composition API, vue-router, pinia, Bootstrap5, json-server, 유효성 검사             |
| 약관 동의   | 필수 및 선택 약관 동의<br>- 필수 약관만 동의해도 회원가입 진행 가능                                                                                                                                                                                            | vue-router, Bootstrap5, fetch API, 유효성 검사                                       |
| 회원가입    | 아이디, 비밀번호, 이메일, 휴대폰 번호 입력<br>- 아이디 중복 검사<br>- 비밀번호 유효성 검사<br> (3종류 이상 조합 시 8자리 이상 / 2종류 이상 조합 시 10자리 이상)<br>- 인증번호 불일치 또는 3분 경과 시 만료 처리<br>- 필수 입력값 미입력 시 다음 단계 진행 불가 | Composition API, vue-router, axios, pinia, Bootstrap5, json-server, CryptoJS, 타이머 |
| 프로필 설정 | 이름, 이메일 수정 및 로그아웃/회원탈퇴 기능 제공                                                                                                                                                                                                               | Composition API, vue-router, axios, Bootstrap5, json-server                          |

### 📋거래 등록 (박다빈)

| 기능      | 설명                                                                                                                                                  | 기술스택                                               |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 거래 입력 | 날짜, 금액, 카테고리, 메모 입력 후 저장<br>- 음수 및 0 입력 불가<br>- 타입, 카테고리, 금액 미입력 시 저장 불가<br>- 타입 미선택 시 카테고리 선택 불가 | Composition API, vue-router, pinia, axios, json-server |

### 📋거래 내역 (전효빈)

| 기능             | 설명                                                                                             | 기술스택                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| 거래 리스트 출력 | 사용자별 전체 거래 내역 출력<br>- 양의 정수만 입력 가능<br>- 스크롤 가능<br>- 최신 거래부터 출력 | Composition API, vue-router, axios, components, pinia, Bootstrap5, json-server |
| 거래 수정        | 기존 거래 내용을 불러와 수정 및 저장                                                             | Composition API, vue-router, axios, components, pinia, Bootstrap5, json-server |
| 거래 삭제        | 개별 거래 항목 삭제 (DB 반영)                                                                    | Composition API, vue-router, axios, components, pinia, Bootstrap5, json-server |
| 거래 필터링      | 날짜/기간별 거래 필터링 기능 제공                                                                | Composition API, vue-router, axios, components, pinia, Bootstrap5, json-server |

### 📋통계/대시보드 (양현모)

| 기능                  | 설명                                                                    | 기술스택                                                                                 |
| --------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 월별 재정 요약        | 월별 수입, 지출, 순이익 요약 표시                                       | Composition API, vue-router, components, pinia, Bootstrap5, json-server, axios           |
| 거래내역 조회 및 추가 | 최근 거래내역 표시 및 빠른 거래 추가 기능 제공                          | Composition API, vue-router, components, pinia, Bootstrap5, json-server, axios           |
| 차트 시각화           | 수입/지출 Bar 차트, 순이익 Line 차트, 카테고리별 Doughnut 차트로 시각화 | Composition API, vue-router, components, pinia, Bootstrap5, json-server, axios, Chart.js |

### 📋카테고리 관리 (황동민)

| 기능          | 설명                                           | 기술스택                                               |
| ------------- | ---------------------------------------------- | ------------------------------------------------------ |
| 카테고리 조회 | 서버로부터 카테고리 목록 불러오기 및 분류 조회 | Composition API, axios, components, pinia, json-server |
| 카테고리 관리 | 수입/지출 카테고리 추가 및 삭제 기능 제공      | Composition API, axios, components, pinia, json-server |

### 📋공통 UI/모달 (양지윤)

| 기능            | 설명                                                                                    | 기술스택               |
| --------------- | --------------------------------------------------------------------------------------- | ---------------------- |
| 모달 오픈/닫기  | 거래 등록/수정 입력창을 모달 형식으로 구성<br>- 전역 모달 store 사용하여 통일된 UI 제공 | Composition API, pinia |
| 반응형 레이아웃 | 모바일(390x844) / PC 대응 반응형 구성                                                   | Bootstrap5             |

---

## ⚡ 참고사항

- `json-server`가 실행 중이지 않으면 데이터 통신이 실패합니다.
- 실제 서비스 배포 시에는 백엔드 서버와 연동해야 합니다.

---

## ✅ 사용자는 무엇을 할 수 있나요?

- 로그인하여 개인 가계부를 관리할 수 있습니다.
- 사용자별 개인의 입력한 데이터를 확인할 수 있습니다.
- 매일 또는 월별로 거래를 추가하고 수정할 수 있습니다.
- 지출/수입 패턴을 한 눈에 차트로 파악할 수 있습니다.
- 모바일에서도 편리하게 사용할 수 있습니다.

---

## 🔥 Special Thanks

- 이 프로젝트는 **DevelROKA 팀의 철학을 참고하여 심플한 UI**로 설계되었습니다.
