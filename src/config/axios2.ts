import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getAccessTokenFromStorage } from '../utils/getUser';
const host = 'http://localhost:8080/api';


const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {

  return response;
}, function (error) {
  //ignore ping
  if(!error.request.responseURL.endsWith('api/protected/ping')) {
    //alert(error.response.toString());
    alert(error.toString());
    if (error.response.data.error.message) {
      toast.error(error.response.data.error.message);
    } else {
      toast.error('Ooops, The server was unable to complete your request. We will be back soon :(');
    }
  }
  return Promise.reject(error);
});


const auth_type = 'Bearer';

const isEmptyString = (s: string | null)=> {
  return (s==null || s== "");
}

export const api = {
  get:  (url : string) => {
    let jwt =  getAccessTokenFromStorage();
    if (!isEmptyString(jwt)) {
      jwt = auth_type + ' ' + jwt;
    } else {
      jwt = '';
    };
    return  instance.get(`${url}`, {headers: {'Authorization': jwt}});
  },
  post:  (url: string, req: any) => {
    let jwt =  getAccessTokenFromStorage();
    if (!isEmptyString(jwt)) {
      jwt = auth_type + ' ' + jwt;
    } else {
      jwt = '';
    };
    return  instance.post(`${url}`, req, {headers: {'Authorization': jwt}});
  },
  put:  (url :string, req: any) => {
    let jwt =  getAccessTokenFromStorage();
    if (!isEmptyString(jwt)) {
      jwt = auth_type + ' ' + jwt;
    } else {
      jwt = '';
    };
    return  instance.put(`${url}`, req, {headers: {'Authorization': jwt}});
  },
  patch:  (url:string, req:any) => {
    let jwt =  getAccessTokenFromStorage();
    if (!isEmptyString(jwt)) {
      jwt = auth_type + ' ' + jwt;
    } else {
      jwt = '';
    };
    return  instance.patch(`${url}`, req,{headers: {'Authorization': jwt}});
  },
  delete: (url:string) => {
    let jwt =  getAccessTokenFromStorage();
    if (!isEmptyString(jwt)) {
      jwt = auth_type + ' ' + jwt;
    } else {
      jwt = '';
    };
    return instance.delete(`${url}`);
  }
}
export default api;