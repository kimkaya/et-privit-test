import axios from './axios';

export const postAPI = {
  createPost: (data) => axios.post('/posts', data),
  getPost: (postId) => axios.get(`/posts/${postId}`),
  updatePost: (postId, data) => axios.put(`/posts/${postId}`, data),
  deletePost: (postId) => axios.delete(`/posts/${postId}`),
  likePost: (postId) => axios.post(`/posts/${postId}/like`),
};
