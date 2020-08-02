import { api } from '../config.json';
import http from './httpService';

const endpoint = `${api}/groups`;

export const findGroups = async (query) => {
  const result = await http.get(`${endpoint}/search?query=${query}`);
  return result.data.data.groups;
};

export const createGroup = async (data) => {
  const result = await http.post(`${endpoint}`, data);
  return result.data.data.group.link;
};

export const getGroupPosts = async (groupLink, page = 1, limit = 20) => {
  const result = await http.get(
    `${endpoint}/${groupLink}/posts?page=${page}&limit=${limit}&fields=link,content,previewLimit,createdAt`
  );
  return result.data.data.posts;
};

export const createGroupPost = async (groupLink, formData) => {
  const result = await http.post(`${endpoint}/${groupLink}/posts`, formData);
  return result.status === 204;
};

export const getGroup = async (groupLink) => {
  const result = await http.get(`${endpoint}/${groupLink}`);
  return result.data.data.group;
};

export const deleteGroupPost = async (groupLink, postLink) => {
  const result = await http.delete(
    `${endpoint}/${groupLink}/posts/${postLink}`
  );
  return result.status === 204;
};

export const updateGroupPost = async (groupLink, postLink, content) => {
  const result = await http.patch(
    `${endpoint}/${groupLink}/posts/${postLink}`,
    {
      content,
    }
  );
  return result.status === 204;
};

export const getSubscribersCount = async (groupLink) => {
  const result = await http.get(`${endpoint}/${groupLink}/subscribersCount`);
  return result.data.data.count;
};

export const subscribe = async (groupLink) => {
  const result = await http.post(`${endpoint}/${groupLink}/subscribe`);
  return result.status === 204;
};

export const unsubscribe = async (groupLink) => {
  const result = await http.post(`${endpoint}/${groupLink}/unsubscribe`);
  return result.status === 204;
};

export const updateGroupImage = async (groupLink, data) => {
  const result = await http.patch(`${endpoint}/${groupLink}/updateImage`, data);
  return result.status === 204;
};

export const updateGroup = async (groupLink, data) => {
  const result = await http.patch(`${endpoint}/${groupLink}`, data);
  return result.status === 204;
};

export const deleteGroup = async (groupLink) => {
  const result = await http.delete(`${endpoint}/${groupLink}`);
  return result.status === 204;
};
