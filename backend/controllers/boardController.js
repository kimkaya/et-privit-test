const db = require('../config/database');

// 모든 게시판 목록 조회
exports.getAllBoards = async (req, res) => {
  try {
    const [boards] = await db.query(
      'SELECT * FROM boards ORDER BY id ASC'
    );

    res.json({ boards });
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 특정 게시판의 게시글 목록 조회
exports.getBoardPosts = async (req, res) => {
  try {
    const { boardId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [posts] = await db.query(
      `SELECT
        p.id, p.title, p.content, p.is_anonymous, p.view_count, p.like_count, p.created_at,
        u.nickname,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.board_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?`,
      [boardId, limit, offset]
    );

    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM posts WHERE board_id = ?',
      [boardId]
    );

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get board posts error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
