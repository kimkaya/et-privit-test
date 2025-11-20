const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// 회원가입
router.post('/register', [
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
  body('nickname').notEmpty().withMessage('닉네임을 입력해주세요.'),
  body('university').notEmpty().withMessage('대학교를 입력해주세요.')
], authController.register);

// 로그인
router.post('/login', [
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.')
], authController.login);

// 현재 사용자 정보 조회
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
