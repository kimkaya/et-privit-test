import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { boardAPI } from '../api/board';

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await boardAPI.getAllBoards();
      setBoards(response.data.boards);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
    }
  };

  const handleBoardClick = (boardId) => {
    navigate(`/board/${boardId}`);
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
        <h2>게시판</h2>
        <div className="board-list">
          {boards.map((board) => (
            <div
              key={board.id}
              className="board-card"
              onClick={() => handleBoardClick(board.id)}
            >
              <h3>{board.name}</h3>
              <p>{board.description}</p>
              {board.is_anonymous && (
                <span style={{ fontSize: '12px', color: '#c62917' }}>익명 게시판</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
