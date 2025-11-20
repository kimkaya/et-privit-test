const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

// 게시글의 댓글 목록 조회
router.get('/posts/:postId', commentController.getComments);

// 댓글 작성
router.post('/posts/:postId', authMiddleware, [
  body('content').notEmpty().withMessage('댓글 내용을 입력해주세요.')
], commentController.createComment);

// 댓글 수정
router.put('/:commentId', authMiddleware, commentController.updateComment);

// 댓글 삭제
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;
