const db = require('../config/database');
const { validationResult } = require('express-validator');

// 게시글의 댓글 목록 조회
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const [comments] = await db.query(
      `SELECT
        c.id, c.content, c.is_anonymous, c.created_at,
        u.nickname
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC`,
      [postId]
    );

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 댓글 작성
exports.createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { postId } = req.params;
    const { content, is_anonymous } = req.body;
    const userId = req.user.userId;

    // 게시글 존재 확인
    const [posts] = await db.query('SELECT id FROM posts WHERE id = ?', [postId]);
    if (posts.length === 0) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    const [result] = await db.query(
      'INSERT INTO comments (post_id, user_id, content, is_anonymous) VALUES (?, ?, ?, ?)',
      [postId, userId, content, is_anonymous || false]
    );

    res.status(201).json({
      message: '댓글이 작성되었습니다.',
      commentId: result.insertId
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    // 댓글 작성자 확인
    const [comments] = await db.query('SELECT user_id FROM comments WHERE id = ?', [commentId]);

    if (comments.length === 0) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    if (comments[0].user_id !== userId) {
      return res.status(403).json({ message: '댓글을 수정할 권한이 없습니다.' });
    }

    await db.query('UPDATE comments SET content = ? WHERE id = ?', [content, commentId]);

    res.json({ message: '댓글이 수정되었습니다.' });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    // 댓글 작성자 확인
    const [comments] = await db.query('SELECT user_id FROM comments WHERE id = ?', [commentId]);

    if (comments.length === 0) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    if (comments[0].user_id !== userId) {
      return res.status(403).json({ message: '댓글을 삭제할 권한이 없습니다.' });
    }

    await db.query('DELETE FROM comments WHERE id = ?', [commentId]);

    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
