const db = require('../config/database');
const { validationResult } = require('express-validator');

// 게시글 작성
exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { board_id, title, content, is_anonymous } = req.body;
    const userId = req.user.userId;

    // 게시판 존재 확인
    const [boards] = await db.query('SELECT * FROM boards WHERE id = ?', [board_id]);
    if (boards.length === 0) {
      return res.status(404).json({ message: '게시판을 찾을 수 없습니다.' });
    }

    const [result] = await db.query(
      'INSERT INTO posts (board_id, user_id, title, content, is_anonymous) VALUES (?, ?, ?, ?, ?)',
      [board_id, userId, title, content, is_anonymous || false]
    );

    res.status(201).json({
      message: '게시글이 작성되었습니다.',
      postId: result.insertId
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 상세 조회
exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // 조회수 증가
    await db.query('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [postId]);

    const [posts] = await db.query(
      `SELECT
        p.*,
        u.nickname,
        b.name as board_name,
        b.is_anonymous as board_is_anonymous
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN boards b ON p.board_id = b.id
      WHERE p.id = ?`,
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.json({ post: posts[0] });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 수정
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const userId = req.user.userId;

    // 게시글 작성자 확인
    const [posts] = await db.query('SELECT user_id FROM posts WHERE id = ?', [postId]);

    if (posts.length === 0) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    if (posts[0].user_id !== userId) {
      return res.status(403).json({ message: '게시글을 수정할 권한이 없습니다.' });
    }

    await db.query(
      'UPDATE posts SET title = ?, content = ? WHERE id = ?',
      [title, content, postId]
    );

    res.json({ message: '게시글이 수정되었습니다.' });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 삭제
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    // 게시글 작성자 확인
    const [posts] = await db.query('SELECT user_id FROM posts WHERE id = ?', [postId]);

    if (posts.length === 0) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    if (posts[0].user_id !== userId) {
      return res.status(403).json({ message: '게시글을 삭제할 권한이 없습니다.' });
    }

    await db.query('DELETE FROM posts WHERE id = ?', [postId]);

    res.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 게시글 좋아요
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    // 이미 좋아요를 눌렀는지 확인
    const [existing] = await db.query(
      'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existing.length > 0) {
      // 좋아요 취소
      await db.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
      await db.query('UPDATE posts SET like_count = like_count - 1 WHERE id = ?', [postId]);
      return res.json({ message: '좋아요가 취소되었습니다.', liked: false });
    } else {
      // 좋아요 추가
      await db.query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
      await db.query('UPDATE posts SET like_count = like_count + 1 WHERE id = ?', [postId]);
      return res.json({ message: '좋아요를 눌렀습니다.', liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
