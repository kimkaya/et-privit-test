const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Everytime Clone API Server' });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
