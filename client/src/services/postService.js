import { api } from '../config.json';
import http from './httpService';

const endpoint = `${api}/posts`;

export const createPost = async (formData) => {
  const result = await http.post(`${endpoint}`, formData);
  return result.status === 204;
};

export const deletePost = async (link) => {
  const result = await http.delete(`${endpoint}/${link}`);
  return result.status === 204;
};

export const updatePost = async (link, content) => {
  const result = await http.patch(`${endpoint}/${link}`, { content });
  return result.status === 204;
};

export const getPostComments = async (postLink, page = 1, limit = 10) => {
  let query = `${endpoint}/${postLink}/comments`;
  if (page && limit) query = `${query}?page=${page}&limit=${limit}`;
  const result = await http.get(query);

  return result.data.data.comments;
};

export const createComment = async (postLink, content) => {
  const result = await http.post(`${endpoint}/${postLink}/comments`, {
    content,
  });
  return result.data.status === 'success';
};

export const deleteComment = async (postLink, commentLink) => {
  const result = await http.delete(
    `${endpoint}/${postLink}/comments/${commentLink}`
  );
  return result.status === 204;
};

export const updateComment = async (postLink, commentLink, content) => {
  const result = await http.patch(
    `${endpoint}/${postLink}/comments/${commentLink}`,
    { content }
  );
  return result.status === 204;
};

export const getNews = async (page = 1, limit = 20) => {
  const result = await http.get(`${endpoint}/news?page=${page}&limit=${limit}`);
  return result.data.data.news;
};
