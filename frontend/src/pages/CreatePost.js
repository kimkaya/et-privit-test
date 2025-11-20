import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../api/post';
import { boardAPI } from '../api/board';

function CreatePost() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_anonymous: false,
  });
  const [boardName, setBoardName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBoardName();
  }, [boardId]);

  const fetchBoardName = async () => {
    try {
      const response = await boardAPI.getAllBoards();
      const board = response.data.boards.find(b => b.id === parseInt(boardId));
      setBoardName(board?.name || '게시판');
    } catch (error) {
      console.error('Failed to fetch board:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await postAPI.createPost({
        board_id: boardId,
        ...formData,
      });

      navigate(`/board/${boardId}`);
    } catch (error) {
      setError(error.response?.data?.message || '게시글 작성에 실패했습니다.');
    }
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <h1 onClick={() => navigate('/')}>에브리타임</h1>
          <div className="header-info">
            <span>{user?.nickname}님</span>
            <button className="btn btn-logout" onClick={logout}>
              로그아웃
            </button>
          </div>
        </div>
      </header>
      <div className="container">
        <h2>{boardName} - 글쓰기</h2>
        <div className="post-detail">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>제목</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>내용</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                style={{ minHeight: '200px' }}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="is_anonymous"
                  checked={formData.is_anonymous}
                  onChange={handleChange}
                />
                {' '}익명으로 작성
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                작성하기
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/board/${boardId}`)}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
