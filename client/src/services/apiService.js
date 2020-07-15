import { api } from '../config.json';
import http from './httpService';
import { async } from 'validate.js';

export const signin = async ({ email, password }) => {
  const result = await http.post(`${api}/auth/signin`, { email, password });
  return result.data.data.user;
};

export const signup = async ({
  username,
  email,
  password,
  passwordConfirm,
}) => {
  const result = await http.post(`${api}/auth/signup`, {
    username,
    email,
    password,
    passwordConfirm,
  });
  return result.data.data.user;
};

export const signout = async () => {
  return await http.post(`${api}/auth/signout`);
};

export const forgotPassword = async ({ email }) => {
  const result = await http.post(`${api}/auth/forgotPassword`, { email });
  return result.data.message;
};

export const getMe = async () => {
  const result = await http.get(`${api}/users/me`);
  return result.data.data.user;
};

export const getUser = async (link) => {
  const result = await http.get(`${api}/users/${link}`);
  return result.data.data.user;
};

export const getPosts = async (userLink, page = 1, limit = 10) => {
  const result = await http.get(
    `${api}/users/${userLink}/posts?page=${page}&limit=${limit}&fields=link,content,previewLimit,createdAt`
  );
  return result.data.data.posts;
};

export const getFriends = async (userLink, limit = 5) => {
  let query = `${api}/users/${userLink}/friends`;
  if (limit) query = `${query}?limit=${limit}`;
  const result = await http.get(query);

  return result.data.data.friends;
};

export const getUserGroups = async (userLink, limit = 5) => {
  let query = `${api}/users/${userLink}/groups`;
  if (limit) query = `${query}?limit=${limit}`;
  const result = await http.get(query);

  return result.data.data.groups;
};

export const createPost = async (formData) => {
  const result = await http.post(`${api}/posts`, formData);
  return result.data.status === 'success';
};

export const deletePost = async (link) => {
  const result = await http.delete(`${api}/posts/${link}`);
  return result.status === 204;
};

export const updatePost = async (link, content) => {
  const result = await http.patch(`${api}/posts/${link}`, { content });
  return result.status === 204;
};

export const getSettings = async (userLink) => {
  const result = await http.get(`${api}/users/${userLink}/settings`);
  return result.data.data.settings;
};

export const getFriendsCount = async (userLink) => {
  const result = await http.get(`${api}/users/${userLink}/friendsCount`);
  return result.data.data.count;
};

export const getGroupsCount = async (userLink) => {
  const result = await http.get(`${api}/users/${userLink}/groupsCount`);
  return result.data.data.count;
};

export const getPostComments = async (postLink, page = 1, limit = 10) => {
  let query = `${api}/posts/${postLink}/comments`;
  if (page && limit) query = `${query}?page=${page}&limit=${limit}`;
  const result = await http.get(query);

  return result.data.data.comments;
};

export const createComment = async (postLink, content) => {
  const result = await http.post(`${api}/posts/${postLink}/comments`, {
    content,
  });
  return result.data.status === 'success';
};

export const deleteComment = async (postLink, commentLink) => {
  const result = await http.delete(
    `${api}/posts/${postLink}/comments/${commentLink}`
  );
  return result.status === 204;
};

export const updateComment = async (postLink, commentLink, content) => {
  const result = await http.patch(
    `${api}/posts/${postLink}/comments/${commentLink}`,
    { content }
  );
  return result.status === 204;
};

export const getNews = async (page = 1, limit = 20) => {
  const result = await http.get(
    `${api}/posts/news?page=${page}&limit=${limit}`
  );
  return result.data.data.news;
};

export const findUsers = async (query) => {
  const result = await http.get(`${api}/users/search?query=${query}`);
  return result.data.data.users;
};

export const findGroups = async (query) => {
  const result = await http.get(`${api}/groups/search?query=${query}`);
  return result.data.data.groups;
};

export const updatePassword = async (data) => {
  const result = await http.patch(`${api}/auth/updatePassword`, data);
  return result.data.status === 'success';
};

export const updateMe = async (data) => {
  const result = await http.patch(`${api}/users/me`, data);
  return result.status === 204;
};

export const updateMySettings = async (data) => {
  const result = await http.patch(`${api}/users/me/settings`, data);
  return result.status === 204;
};

export const updateMyImage = async (data) => {
  const result = await http.patch(`${api}/users/me/updateImage`, data);
  return result.status === 204;
};

export const deleteMe = async () => {
  const result = await http.delete(`${api}/users/me`);
  return result.status === 204;
};
