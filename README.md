# 에브리타임 클론 코딩 프로젝트

React, Express, MySQL을 사용한 대학생 커뮤니티 플랫폼 '에브리타임' 클론 프로젝트입니다.

## 프로젝트 구조

```
.
├── backend/          # Express 백엔드 서버
│   ├── config/       # 데이터베이스 설정
│   ├── controllers/  # 컨트롤러
│   ├── database/     # 데이터베이스 스키마
│   ├── middleware/   # 미들웨어
│   ├── routes/       # API 라우트
│   └── server.js     # 서버 진입점
│
└── frontend/         # React 프론트엔드
    ├── public/       # 정적 파일
    └── src/          # 소스 코드
        ├── api/      # API 통신
        ├── context/  # Context API
        ├── pages/    # 페이지 컴포넌트
        └── App.js    # 메인 앱 컴포넌트
```

## 기술 스택

### Backend
- Node.js
- Express
- MySQL
- JWT (인증)
- bcryptjs (암호화)

### Frontend
- React
- React Router
- Axios
- Context API

## 주요 기능

1. **사용자 인증**
   - 회원가입 및 로그인
   - JWT 기반 인증
   - 대학교 정보 등록

2. **게시판 시스템**
   - 여러 게시판 지원 (자유게시판, 비밀게시판, 정보게시판, 질문게시판)
   - 익명 게시판 지원
   - 게시글 CRUD
   - 조회수, 좋아요 기능

3. **댓글 시스템**
   - 댓글 작성, 수정, 삭제
   - 익명 댓글 지원

## 설치 및 실행 방법

### 1. MySQL 데이터베이스 설정

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 스키마 실행
source backend/database/schema.sql
```

### 2. 백엔드 설정

```bash
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 데이터베이스 정보와 JWT_SECRET을 설정하세요

# 서버 실행
npm run dev
```

백엔드 서버는 http://localhost:5000 에서 실행됩니다.

### 3. 프론트엔드 설정

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

프론트엔드는 http://localhost:3000 에서 실행됩니다.

## 환경 변수 설정

backend/.env 파일에 다음 내용을 설정하세요:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=everytime_clone
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 게시판
- `GET /api/boards` - 모든 게시판 목록
- `GET /api/boards/:boardId/posts` - 게시판의 게시글 목록

### 게시글
- `POST /api/posts` - 게시글 작성
- `GET /api/posts/:postId` - 게시글 상세
- `PUT /api/posts/:postId` - 게시글 수정
- `DELETE /api/posts/:postId` - 게시글 삭제
- `POST /api/posts/:postId/like` - 좋아요/취소

### 댓글
- `GET /api/comments/posts/:postId` - 댓글 목록
- `POST /api/comments/posts/:postId` - 댓글 작성
- `PUT /api/comments/:commentId` - 댓글 수정
- `DELETE /api/comments/:commentId` - 댓글 삭제

## 라이선스

MIT
