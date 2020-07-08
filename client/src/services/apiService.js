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

export default {
  signin,
  signup,
  signout,
  forgotPassword,
  getMe,
  getUser,
};
