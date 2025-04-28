# 💰 Financial Ledger Project

## 📚 목차

- [프로젝트 소개](#-프로젝트-소개)
- [프로젝트 실행방법](#-프로젝트-실행-방법)
- [프로젝트 구조](#-프로젝트-구조)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [담당 역할](#-담당-역할)
- [브랜치 전략](#️-브랜치-전략)
- [화면 예시](#-화면-예시)
- [참고 사항](#-참고사항)
- [Special Thanks](#-special-thanks)

---

## 📝 프로젝트 소개

일상 속 수입/지출을 간편하게 관리할 수 있는 **모바일 중심 가계부 앱**입니다.  
깔끔한 UI, 편리한 거래 입력, 월별 요약, 카테고리별 통계 기능을 제공합니다.

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

시작페이지 | 로그인화면

<tr>
    <td><img src="./screenshots/iPhone 12 Pro-17.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-16.png" width="300px"></td>
</tr>

회원가입 약관 | 회원가입 예외처리

<tr>
    <td><img src="./screenshots/iPhone 12 Pro-15.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-14.png" width="300px"></td>
</tr>

회원가입 정상화면 | 홈 화면

<tr>
    <td><img src="./screenshots/iPhone 12 Pro-13.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-12.png" width="300px"></td>
</tr>

홈 화면 거래 입력 | 거래 입력 예외 처리

<tr>
    <td><img src="./screenshots/iPhone 12 Pro-11.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-10.png" width="300px"></td>
</tr>

일일 거래 내역 | 일일 거래 내역 - 거래수정

<tr>
    <td><img src="./screenshots/iPhone 12 Pro-9.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-11.png" width="300px"></td>
</tr>

거래수정 - 카테고리 예외처리 | 월별 거래 내역

<tr>
    <td><img src="./screenshots/iPhone 12 Pro-8.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-7.png" width="300px"></td>
</tr>

월별 거래 내역-거래내역 없는 경우 | 월별 거래 내역-거래내역 있을 경우

<tr>
    <td><img src="./screenshots/iPhone 12 Pro-6.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-5.png" width="300px"></td>
</tr>

월별 거래 내역-삭제 팝업 | 통계 월별 요약

<tr>
    <td><img src="./screenshots/iPhone 12 Pro-4.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-3.png" width="300px"></td>
</tr>

통계 수입 추이 | 통계 지출 추이

<tr>
    <td><img src="./screenshots/iPhone 12 Pro-2.png" width="300px"></td>
    <td><img src="./screenshots/iPhone 12 Pro-1.png" width="300px"></td>
</tr>

프로필 설정

<td><img src="./screenshots/iPhone 12 Pro.png" width="300px"></td>

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
