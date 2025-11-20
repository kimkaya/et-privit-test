import axios from './axios';

export const commentAPI = {
  getComments: (postId) => axios.get(`/comments/posts/${postId}`),
  createComment: (postId, data) => axios.post(`/comments/posts/${postId}`, data),
  updateComment: (commentId, data) => axios.put(`/comments/${commentId}`, data),
  deleteComment: (commentId) => axios.delete(`/comments/${commentId}`),
};
