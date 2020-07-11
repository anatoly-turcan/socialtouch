import axios from 'axios';

export const transport = axios.create({ withCredentials: true });

export default {
  http: axios,
  get: transport.get,
  post: transport.post,
  put: transport.put,
  patch: transport.patch,
  delete: transport.delete,
};
