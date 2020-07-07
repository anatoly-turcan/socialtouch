import { api } from '../config.json';
import http from './httpService';

const signin = async (email, password) => {
  return await http.post(`${api}/auth/signin`, { email, password });
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
  getMe,
};
