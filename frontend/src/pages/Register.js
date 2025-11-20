import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    university: '',
    student_id: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await register(formData);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>회원가입</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>대학교</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>학번 (선택)</label>
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            가입하기
          </button>
        </form>
        <div className="auth-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
