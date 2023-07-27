import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getAccessTokenFromStorage } from '../utils/getUser';
const host = 'http://localhost:8080/api';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

const auth_type = 'Bearer';

const isEmptyString = (s: string | null) => {
  return s == null || s == '';
};

export const api = {
  get: (url: string) => {
    let jwt = getAccessTokenFromStorage();
    if (!isEmptyString(jwt)) {
      jwt = auth_type + ' ' + jwt;
    } else {
      jwt = '';
    }
    return instance.get(`${url}`, { headers: { Authorization: jwt } });
  },
  post: (url: string, req: any) => {
    let jwt = getAccessTokenFromStorage();
    if (!isEmptyString(jwt)) {
      jwt = auth_type + ' ' + jwt;
    } else {
      jwt = '';
    }
    return instance.post(`${url}`, req, { headers: { Authorization: jwt } });
  },
  put: (url: string, req: any) => {
    let jwt = getAccessTokenFromStorage();
    if (!isEmptyString(jwt)) {
      jwt = auth_type + ' ' + jwt;
    } else {
      jwt = '';
    }
    return instance.put(`${url}`, req, { headers: { Authorization: jwt } });
  },
  patch: (url: string, req: any) => {
    let jwt = getAccessTokenFromStorage();
    if (!isEmptyString(jwt)) {
      jwt = auth_type + ' ' + jwt;
    } else {
      jwt = '';
    }
    return instance.patch(`${url}`, req, { headers: { Authorization: jwt } });
  },
  delete: (url: string) => {
    let jwt = getAccessTokenFromStorage();
    if (!isEmptyString(jwt)) {
      jwt = auth_type + ' ' + jwt;
    } else {
      jwt = '';
    }
    return instance.delete(`${url}`);
  }
};
export default api;
