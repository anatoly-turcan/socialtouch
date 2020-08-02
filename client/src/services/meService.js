import { api } from '../config.json';
import http from './httpService';

const endpoint = `${api}/users/me`;

export const getMe = async () => {
  const result = await http.get(`${endpoint}`);
  return result.data.data.user;
};

export const updateMe = async (data) => {
  const result = await http.patch(`${endpoint}`, data);
  return result.status === 204;
};

export const updateMySettings = async (data) => {
  const result = await http.patch(`${endpoint}/settings`, data);
  return result.status === 204;
};

export const updateMyImage = async (data) => {
  const result = await http.patch(`${endpoint}/updateImage`, data);
  return result.status === 204;
};

export const deleteMe = async () => {
  const result = await http.delete(`${endpoint}`);
  return result.status === 204;
};

export const getFriendRequests = async () => {
  const result = await http.get(`${endpoint}/friendRequests`);
  return result.data.data.requests;
};
