import { api } from '../config.json';
import http from './httpService';

const signin = async ({ email, password }) => {
  return await http.post(`${api}/auth/signin`, { email, password });
};

const signup = async ({ username, email, password, passwordConfirm }) => {
  return await http.post(`${api}/auth/signup`, {
    username,
    email,
    password,
    passwordConfirm,
  });
};

const signout = async () => {
  return await http.post(`${api}/auth/signout`);
};

const forgotPassword = async ({ email }) => {
  return await http.post(`${api}/auth/forgotPassword`, { email });
};

const getMe = async () => {
  try {
    const result = await http.get(`${api}/users/me`);
    return result.data.data.user;
  } catch (error) {
    return null;
  }
};

export default {
  signin,
  signup,
  signout,
  forgotPassword,
  getMe,
};
