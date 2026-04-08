# Community Lounge

네온 테마 커뮤니티 게시판

## 기술 스택

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel

## 기능

- 회원가입/로그인/로그아웃 (Supabase Auth)
- 게시글 CRUD (작성자 권한)
- 댓글/대댓글 시스템 (1-depth 제한)
- 네온 테마 + 글라스모피즘 디자인

## 시작하기

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 대시보드에서 URL과 anon key 확인

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 데이터베이스 스키마 실행

`supabase/migrations/001_initial_schema.sql`의 내용을 Supabase SQL Editor에서 실행

### 4. Storage Buckets 생성

Supabase 대시보드에서 Storage buckets 생성:

1. `avatars` (public, max 2MB)
2. `post-images` (public, max 5MB)

### 5. 개발 서버 실행

```bash
npm install
npm run dev
```

http://localhost:3000에서 확인

## 프로젝트 구조

```
community-board/
├── app/
│   ├── (auth)/          # 인증 페이지
│   │   ├── login/
│   │   └── register/
│   ├── (main)/          # 메인 페이지
│   │   └── posts/
│   ├── api/             # API routes
│   ├── layout.tsx       # 공통 레이아웃
│   └── globals.css      # 네온 테마
├── components/
│   ├── ui/              # 기본 UI 컴포넌트
│   ├── Header.tsx
│   └── CommentsSection.tsx
├── lib/
│   ├── supabase/        # Supabase 클라이언트
│   ├── auth/            # 인증 Server Actions
│   ├── posts/           # 게시글 Server Actions
│   └── comments/        # 댓글 Server Actions
└── supabase/
    └── migrations/      # DB 스키마
```

## Vercel 배포

1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 import
3. 환경변수 설정 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
4. 배포