import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { boardAPI } from '../api/board';

function BoardDetail() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [boardName, setBoardName] = useState('');
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchPosts();
  }, [boardId]);

  const fetchPosts = async () => {
    try {
      const response = await boardAPI.getBoardPosts(boardId);
      setPosts(response.data.posts);
      setPagination(response.data.pagination);

      if (response.data.posts.length > 0) {
        const boardsResponse = await boardAPI.getAllBoards();
        const board = boardsResponse.data.boards.find(b => b.id === parseInt(boardId));
        setBoardName(board?.name || '게시판');
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR');
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{boardName}</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/board/${boardId}/create`)}
          >
            글쓰기
          </button>
        </div>
        <div className="post-list">
          {posts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              게시글이 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="post-item"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="post-title">
                  {post.title}{' '}
                  {post.comment_count > 0 && (
                    <span style={{ color: '#c62917', fontSize: '14px' }}>
                      [{post.comment_count}]
                    </span>
                  )}
                </div>
                <div className="post-meta">
                  <span>{post.is_anonymous ? '익명' : post.nickname}</span>
                  <span>{formatDate(post.created_at)}</span>
                  <span>조회 {post.view_count}</span>
                  <span>좋아요 {post.like_count}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;
