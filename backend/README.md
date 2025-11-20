# Everytime Clone - Backend

Express와 MySQL을 사용한 에브리타임 클론 백엔드 서버입니다.

## 설치 방법

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

```bash
cp .env.example .env
```

3. MySQL 데이터베이스 설정
`database/schema.sql` 파일을 실행하여 데이터베이스와 테이블을 생성하세요.

```bash
mysql -u root -p < database/schema.sql
```

4. 서버 실행
```bash
npm run dev  # 개발 모드
npm start    # 프로덕션 모드
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보 조회 (인증 필요)

### 게시판
- `GET /api/boards` - 모든 게시판 목록 조회
- `GET /api/boards/:boardId/posts` - 특정 게시판의 게시글 목록 조회

### 게시글
- `POST /api/posts` - 게시글 작성 (인증 필요)
- `GET /api/posts/:postId` - 게시글 상세 조회
- `PUT /api/posts/:postId` - 게시글 수정 (인증 필요)
- `DELETE /api/posts/:postId` - 게시글 삭제 (인증 필요)
- `POST /api/posts/:postId/like` - 게시글 좋아요/취소 (인증 필요)

### 댓글
- `GET /api/comments/posts/:postId` - 게시글의 댓글 목록 조회
- `POST /api/comments/posts/:postId` - 댓글 작성 (인증 필요)
- `PUT /api/comments/:commentId` - 댓글 수정 (인증 필요)
- `DELETE /api/comments/:commentId` - 댓글 삭제 (인증 필요)

## 기술 스택

- Node.js
- Express
- MySQL
- JWT (JSON Web Token)
- bcryptjs
