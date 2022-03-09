import axios from 'axios';
import jwt from 'jsonwebtoken';

import { STORAGE_KEY } from '../../constants';

const LOGIN_PAGE = '/login';

export const handleAxiosErrors = (error) => {
  if (error.config && ((error || {}).response || {}).status === 403) {
    window.location.pathname = '/403';
  }
  if (error.config && ((error || {}).response || {}).status === 401) {
    window.location.pathname = LOGIN_PAGE;
    localStorage.removeItem(STORAGE_KEY);
  }
  return Promise.reject(error);
};

export const handleAxiosResponse = (response) => {
  if ((((response || {}).request || {}).responseURL || '').includes('/auth/')) {
    if (jwt.decode(response.data)) {
      localStorage.setItem(STORAGE_KEY, response.data);
    }
  }
  return response;
};


const getConfig = (config = {}) => {
  const headers = {
    ...config.headers,
    ...(localStorage.getItem(STORAGE_KEY) ? { Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}` } : {})
  };

  return { headers, ...config };
};

const createRequestInstance = (customConfig = {}) => {
  const instance = axios.create({ ...getConfig(), ...customConfig, });
  const { get, post, put, delete: del } = instance;

  instance.interceptors.response.use(handleAxiosResponse, handleAxiosErrors);

  instance.get = (url, config) => get.call(this, url, getConfig(config));
  instance.post = (url, data, config) => post.call(this, url, data, getConfig(config));
  instance.put = (url, data, config) => put.call(this, url, data, getConfig(config));
  instance.delete = (url, config) => del.call(this, url, getConfig(config));

  return instance;
};

const getBase = (service, localhost = 'http://localhost:3100') => (path = '') => `${localhost}/${service}${path}`;
const request = createRequestInstance();
const externalRequest = axios.create({});

export { request, externalRequest, getBase };
