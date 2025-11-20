import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../api/post';
import { commentAPI } from '../api/comment';

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentAnonymous, setCommentAnonymous] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPost(postId);
      setPost(response.data.post);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getComments(postId);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      await postAPI.likePost(postId);
      fetchPost();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) return;

    try {
      await commentAPI.createComment(postId, {
        content: commentContent,
        is_anonymous: commentAnonymous,
      });

      setCommentContent('');
      setCommentAnonymous(false);
      fetchComments();
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  if (!post) {
    return <div>Loading...</div>;
  }

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
        <div className="post-detail">
          <div className="post-header">
            <h2>{post.title}</h2>
            <div className="post-meta" style={{ marginTop: '10px' }}>
              <span>{post.is_anonymous ? '익명' : post.nickname}</span>
              <span>{formatDate(post.created_at)}</span>
              <span>조회 {post.view_count}</span>
            </div>
          </div>
          <div className="post-content">
            {post.content}
          </div>
          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={handleLike}>
              좋아요 {post.like_count}
            </button>
            <button
              className="btn btn-secondary"
              style={{ marginLeft: '10px' }}
              onClick={() => navigate(`/board/${post.board_id}`)}
            >
              목록으로
            </button>
          </div>

          <div className="comments-section">
            <h3>댓글 {comments.length}</h3>
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {comment.is_anonymous ? '익명' : comment.nickname}
                </div>
                <div>{comment.content}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  {formatDate(comment.created_at)}
                </div>
              </div>
            ))}

            <form onSubmit={handleCommentSubmit} className="comment-form">
              <div className="form-group">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="댓글을 입력하세요"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={commentAnonymous}
                    onChange={(e) => setCommentAnonymous(e.target.checked)}
                  />
                  {' '}익명으로 작성
                </label>
                <button type="submit" className="btn btn-primary">
                  댓글 작성
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
