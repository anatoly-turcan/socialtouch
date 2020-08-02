import { api } from '../config.json';
import http from './httpService';

export const getChats = async () => {
  const result = await http.get(`${api}/chats`);
  return result.data.data.chats;
};

export const getMessages = async (room, offset = 0, limit = 20) => {
  const result = await http.get(
    `${api}/chats/messages/${room}?offset=${offset}&limit=${limit}`
  );
  return result.data.data.messages;
};
