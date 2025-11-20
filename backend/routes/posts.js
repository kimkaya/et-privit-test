const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

// 게시글 작성
router.post('/', authMiddleware, [
  body('board_id').isInt().withMessage('유효한 게시판 ID를 입력해주세요.'),
  body('title').notEmpty().withMessage('제목을 입력해주세요.'),
  body('content').notEmpty().withMessage('내용을 입력해주세요.')
], postController.createPost);

// 게시글 상세 조회
router.get('/:postId', postController.getPost);

// 게시글 수정
router.put('/:postId', authMiddleware, postController.updatePost);

// 게시글 삭제
router.delete('/:postId', authMiddleware, postController.deletePost);

// 게시글 좋아요
router.post('/:postId/like', authMiddleware, postController.likePost);

module.exports = router;
