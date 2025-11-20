import axios from './axios';

export const boardAPI = {
  getAllBoards: () => axios.get('/boards'),
  getBoardPosts: (boardId, page = 1, limit = 20) =>
    axios.get(`/boards/${boardId}/posts?page=${page}&limit=${limit}`),
};
