import { api } from '../config.json';
import http from './httpService';

const signin = async ({ email, password }) => {
  const result = await http.post(`${api}/auth/signin`, { email, password });
  return result.data.data.user;
};

const signup = async ({ username, email, password, passwordConfirm }) => {
  const result = await http.post(`${api}/auth/signup`, {
    username,
    email,
    password,
    passwordConfirm,
  });
  return result.data.data.user;
};

const signout = async () => {
  return await http.post(`${api}/auth/signout`);
};

const forgotPassword = async ({ email }) => {
  const result = await http.post(`${api}/auth/forgotPassword`, { email });
  return result.data.message;
};

const getMe = async () => {
  const result = await http.get(`${api}/users/me`);
  return result.data.data.user;
};

const getUser = async (link) => {
  const result = await http.get(`${api}/users/${link}`);
  return result.data.data.user;
};

const getPosts = async (userLink, page = 1, limit = 10) => {
  const result = await http.get(
    `${api}/users/${userLink}/posts?page=${page}&limit=${limit}&fields=link,content,previewLimit,createdAt`
  );
  return result.data.data.posts;
};

const getFriends = async (userLink, limit = 5) => {
  let query = `${api}/users/${userLink}/friends`;
  if (limit) query = `${query}/?limit=${limit}`;
  const result = await http.get(query);

  return result.data.data.friends;
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
};
