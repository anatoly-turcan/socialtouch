import axios from 'axios';

const transport = axios.create({ withCredentials: true });

export default {
  get: transport.get,
  post: transport.post,
  put: transport.put,
  patch: transport.patch,
  delete: transport.delete,
};
