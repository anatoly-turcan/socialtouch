import { api } from '../config.json';
import http from './httpService';

const endpoint = `${api}/users`;

export const getUser = async (link) => {
  const result = await http.get(`${endpoint}/${link}`);
  return result.data.data.user;
};

export const getPosts = async (userLink, page = 1, limit = 10) => {
  const result = await http.get(
    `${endpoint}/${userLink}/posts?page=${page}&limit=${limit}&fields=link,content,previewLimit,createdAt`
  );
  return result.data.data.posts;
};

export const getFriends = async (userLink, limit = 5) => {
  let query = `${endpoint}/${userLink}/friends`;
  if (limit) query = `${query}?limit=${limit}`;
  const result = await http.get(query);

  return result.data.data.friends;
};

export const getUserGroups = async (userLink, limit = 5) => {
  let query = `${endpoint}/${userLink}/groups`;
  if (limit) query = `${query}?limit=${limit}`;
  const result = await http.get(query);

  return result.data.data.groups;
};

export const getSettings = async (userLink) => {
  const result = await http.get(`${endpoint}/${userLink}/settings`);
  return result.data.data.settings;
};

export const getFriendsCount = async (userLink) => {
  const result = await http.get(`${endpoint}/${userLink}/friendsCount`);
  return result.data.data.count;
};

export const getGroupsCount = async (userLink) => {
  const result = await http.get(`${endpoint}/${userLink}/groupsCount`);
  return result.data.data.count;
};

export const findUsers = async (query) => {
  const result = await http.get(`${endpoint}/search?query=${query}`);
  return result.data.data.users;
};

export const addFriend = async (friendLink) => {
  const result = await http.post(`${endpoint}/${friendLink}/friends`);
  return result.status === 204;
};

export const confirmFriendship = async (friendLink) => {
  const result = await http.post(`${endpoint}/${friendLink}/confirmFriendship`);
  return result.status === 204;
};

export const unfriend = async (friendLink) => {
  const result = await http.delete(`${endpoint}/${friendLink}/friends`);
  return result.status === 204;
};
