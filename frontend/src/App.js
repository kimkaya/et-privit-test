import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BoardDetail from './pages/BoardDetail';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/board/:boardId"
              element={
                <PrivateRoute>
                  <BoardDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/post/:postId"
              element={
                <PrivateRoute>
                  <PostDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/board/:boardId/create"
              element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
