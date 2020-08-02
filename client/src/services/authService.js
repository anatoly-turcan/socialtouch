import { api } from '../config.json';
import http from './httpService';

const endpoint = `${api}/auth`;

export const signin = async ({ email, password }) => {
  const result = await http.post(`${endpoint}/signin`, { email, password });
  return result.data.data.user;
};

export const signup = async ({
  username,
  email,
  password,
  passwordConfirm,
}) => {
  const result = await http.post(`${endpoint}/signup`, {
    username,
    email,
    password,
    passwordConfirm,
  });
  return result.data.data.user;
};

export const signout = async () => {
  return await http.post(`${endpoint}/signout`);
};

export const forgotPassword = async ({ email }) => {
  const result = await http.post(`${endpoint}/forgotPassword`, { email });
  return result.data.message;
};

export const resetPassword = async (token, data) => {
  const result = await http.patch(`${endpoint}/resetPassword/${token}`, data);
  return result.data.status === 'success';
};

export const updatePassword = async (data) => {
  const result = await http.patch(`${api}/auth/updatePassword`, data);
  return result.data.status === 'success';
};
