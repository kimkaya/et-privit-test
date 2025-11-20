const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

// 모든 게시판 목록 조회
router.get('/', boardController.getAllBoards);

// 특정 게시판의 게시글 목록 조회
router.get('/:boardId/posts', boardController.getBoardPosts);

module.exports = router;
