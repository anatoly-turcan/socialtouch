import { api } from '../config.json';
import http from './httpService';

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

export default {
  signin,
  signup,
  signout,
  forgotPassword,
  getMe,
  getUser,
  getPosts,
  getFriends,
  createPost,
  deletePost,
  getSettings,
  getUserGroups,
  getFriendsCount,
  getGroupsCount,
};
