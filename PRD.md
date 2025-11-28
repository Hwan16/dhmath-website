# 김다희 수학 강사 개인 웹사이트 PRD

## 1. 프로젝트 개요

### 1.1 목적
- 고등 수학강사 '김다희'의 개인 브랜딩 웹사이트
- 수강 학생들이 실질적으로 이용할 수 있는 기능 제공

### 1.2 핵심 요구사항
- **반응형 필수**: PC와 모바일 모두에서 정상적으로 보여야 함
- **디자인 톤**: 밝고 따뜻한 느낌, 핑크/살구색 계열, 현대적이고 감각적인 스타일

### 1.3 기술 스택
| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| 백엔드/DB | Supabase (Auth, PostgreSQL) |
| CMS (블로그) | Sanity |
| 영상 | YouTube 임베드 |
| 달력 | FullCalendar + Google Calendar 연동 |
| 지도 | 네이버 지도 임베드 |
| 배포 | Vercel |

---

## 2. 사이트맵 및 페이지 구조

```
/ (홈)
├── /articles (아티클 목록)
│   └── /articles/[slug] (아티클 상세)
├── /strategy (입시 전략 목록)
│   └── /strategy/[slug] (입시 전략 상세)
├── /lectures (온라인 강의 수강)
│   └── /lectures/[id] (강의 상세/재생)
├── /schedule (다희쌤 시간표)
├── /auth
│   ├── /auth/login (로그인)
│   └── /auth/signup (회원가입)
└── /admin (관리자 페이지)
    ├── /admin/students (학생 관리)
    ├── /admin/lectures (영상 관리)
    └── /admin/permissions (권한 관리)
```

---

## 3. 페이지별 상세 기능

### 3.1 홈페이지 (/)

#### 레이아웃 구조 (위에서 아래로)

**A. 상단 네비게이션 바**
- 로고 (좌측)
- 메뉴: [아티클] [온라인 강의 수강] [입시 전략] [다희쌤 시간표]
- 회원가입/로그인 버튼 (우측)
- 로그인 시: 프로필 드롭다운 (마이페이지, 로그아웃)

**B. 최신 글 섹션**
- 아티클 최신 3개 (썸네일 + 제목 + 요약)
- 입시 전략 최신 3개 (썸네일 + 제목 + 요약)
- 고정 글 기능: Sanity에서 "고정" 체크한 글은 최상단에 표시
- "더보기" 버튼 → 각 목록 페이지로 이동

**C. 메인 브랜딩 섹션**
- 김다희 선생님 프로필 사진 (대형)
- 브랜딩 메시지/슬로건
- 강사 약력 리스트
- CTA 버튼 (예: "수업 문의하기")

**D. 푸터**
- 학원 위치 (네이버 지도 임베드)
- 네이버 블로그 바로가기
- 카카오톡 상담 바로가기
- 전화/문자 상담 바로가기

---

### 3.2 아티클 & 입시 전략 (/articles, /strategy)

#### 목록 페이지
- 격자형 레이아웃 (PC: 한 줄 3개, 모바일: 한 줄 1개)
- 각 카드: 썸네일 이미지 + 제목 + 작성일 + 요약
- 무한 스크롤 또는 페이지네이션
- 고정된 글은 상단에 "📌 고정" 배지와 함께 표시

#### 상세 페이지
- 제목, 작성일, 본문 내용
- Sanity의 Portable Text로 렌더링
- 이전/다음 글 네비게이션

---

### 3.3 온라인 강의 수강 (/lectures)

#### 목록 페이지
- 로그인 필수 (비로그인 시 로그인 페이지로 리다이렉트)
- 격자형 레이아웃 (썸네일 + 제목 + 설명)
- 권한 없는 영상: 썸네일에 자물쇠 아이콘 + "수강 권한이 필요합니다"
- 권한 있는 영상만 클릭 가능

#### 상세/재생 페이지
- YouTube 임베드 플레이어 (16:9 비율, 반응형)
- 영상 제목, 설명
- 관련 영상 목록 (사이드바 또는 하단)
- 임베드 옵션: `rel=0` (추천 영상 비활성화)

---

### 3.4 다희쌤 시간표 (/schedule)

#### 기능
- FullCalendar 기반 대형 달력
- 월간/주간 뷰 전환
- 타임슬롯 표시: 수업명, 시간, 장소
- Google Calendar 연동 (선생님이 구글 캘린더에서 일정 추가 → 자동 반영)
- 색상 구분: 수업 종류별 다른 색상

---

### 3.5 인증 (/auth)

#### 회원가입
- 이메일, 비밀번호, 이름, 전화번호
- Supabase Auth 사용
- 이메일 인증 (선택적)

#### 로그인
- 이메일/비밀번호 로그인
- "비밀번호 찾기" 기능

---

### 3.6 관리자 페이지 (/admin)

#### 접근 권한
- `role = 'admin'`인 사용자만 접근 가능
- 일반 사용자 접근 시 404 또는 홈으로 리다이렉트

#### 학생 관리 (/admin/students)
- 전체 학생 목록 (이름, 이메일, 가입일, 상태)
- 검색/필터 기능
- 학생별 상세 페이지: 권한 부여 현황

#### 영상 관리 (/admin/lectures)
- 영상 추가: 제목, 설명, YouTube URL, 썸네일
- 영상 수정/삭제
- 영상 순서 변경 (드래그앤드롭)

#### 권한 관리 (/admin/permissions)
- 학생별 영상 권한 부여/해제
- "전체 영상 열기" 토글
- 개별 영상 선택 체크박스
- 일괄 권한 부여 기능

---

## 4. 데이터베이스 구조 (Supabase)

### 4.1 users (Supabase Auth 기본 + 확장)
```sql
-- Supabase Auth의 auth.users 테이블 사용
-- 추가 정보는 public.profiles 테이블에 저장

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'student', -- 'student' | 'admin'
  all_access BOOLEAN DEFAULT FALSE, -- 전체 영상 접근 권한
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.2 lectures (영상)
```sql
CREATE TABLE public.lectures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.3 lecture_permissions (영상 권한)
```sql
CREATE TABLE public.lecture_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  granted_by UUID REFERENCES public.profiles(id),
  UNIQUE(user_id, lecture_id)
);
```

### 4.4 RLS (Row Level Security) 정책
```sql
-- profiles: 본인 정보만 읽기, admin은 전체 읽기
-- lectures: 모두 읽기 가능, admin만 쓰기
-- lecture_permissions: 본인 권한만 읽기, admin만 쓰기/삭제
```

---

## 5. Sanity 스키마 구조

### 5.1 post (아티클/입시전략)
```javascript
{
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'category', title: 'Category', type: 'string', 
      options: { list: ['article', 'strategy'] } },
    { name: 'thumbnail', title: 'Thumbnail', type: 'image' },
    { name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 },
    { name: 'body', title: 'Body', type: 'blockContent' },
    { name: 'isPinned', title: 'Pin to Top', type: 'boolean', initialValue: false },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
  ]
}
```

---

## 6. 구축 순서 (권장)

### Phase 1: 기반 구축 (1-2일)
1. Next.js 프로젝트 생성 + Tailwind 설정
2. 기본 레이아웃 (Header, Footer) 컴포넌트
3. 반응형 네비게이션 바
4. Supabase 프로젝트 생성 + 연동
5. 기본 인증 (회원가입/로그인) 구현

### Phase 2: 콘텐츠 시스템 (2-3일)
6. Sanity 프로젝트 생성 + 스키마 설정
7. Sanity ↔ Next.js 연동
8. 아티클/입시전략 목록 페이지
9. 아티클/입시전략 상세 페이지
10. 홈페이지 최신 글 섹션

### Phase 3: 강의 시스템 (2-3일)
11. DB 테이블 생성 (lectures, lecture_permissions)
12. 강의 목록 페이지 (권한 체크 포함)
13. 강의 상세/재생 페이지 (YouTube 임베드)
14. 관리자 - 영상 관리 페이지
15. 관리자 - 학생/권한 관리 페이지

### Phase 4: 부가 기능 (1-2일)
16. 시간표 페이지 (FullCalendar + Google Calendar)
17. 푸터 완성 (지도, 연락처 링크)
18. 메인 브랜딩 섹션 디자인

### Phase 5: 마무리 (1-2일)
19. 전체 반응형 점검 및 수정
20. SEO 메타태그 설정
21. 배포 (Vercel)
22. 도메인 연결

---

## 7. 디자인 가이드라인

### 7.1 컬러 팔레트
```css
--primary: #FF8FAB;      /* 메인 핑크 */
--primary-light: #FFB6C8; /* 연한 핑크 */
--secondary: #FFD4A3;    /* 살구/피치 */
--accent: #A8E6CF;       /* 민트 (포인트) */
--background: #FFFAF5;   /* 따뜻한 화이트 */
--text-primary: #2D2D2D; /* 진한 회색 */
--text-secondary: #6B6B6B; /* 중간 회색 */
```

### 7.2 타이포그래피
- 한글: Pretendard 또는 Noto Sans KR
- 영문: Inter
- 제목: Bold, 크게
- 본문: Regular, 가독성 좋은 크기 (16-18px)

### 7.3 컴포넌트 스타일
- 카드: 둥근 모서리 (rounded-xl), 부드러운 그림자
- 버튼: 둥근 모서리, 호버 시 부드러운 전환
- 여백: 넉넉하게 (padding, margin 충분히)

---

## 8. 참고사항

### 8.1 YouTube 임베드 설정
```html
<iframe 
  src="https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>
```
- `rel=0`: 관련 영상 비활성화
- `modestbranding=1`: YouTube 로고 최소화

### 8.2 반응형 브레이크포인트
```css
/* Tailwind 기본 사용 */
sm: 640px   /* 모바일 가로 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 작은 데스크톱 */
xl: 1280px  /* 데스크톱 */
```

---

## 9. 체크리스트

### 필수 기능
- [ ] 반응형 (PC/모바일) 완벽 지원
- [ ] 회원가입/로그인
- [ ] 아티클/입시전략 글 목록 및 상세
- [ ] 고정 글 기능
- [ ] 온라인 강의 (권한 있는 사용자만)
- [ ] 시간표 달력
- [ ] 관리자 페이지 (학생/영상/권한 관리)
- [ ] 푸터 (지도, 연락처)

### 선택 기능 (추후)
- [ ] 다크모드
- [ ] 댓글 기능
- [ ] 알림 기능
- [ ] 수강 진도율 표시
