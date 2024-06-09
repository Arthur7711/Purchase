import axios, { type InternalAxiosRequestConfig } from 'axios';
import { getCookie } from '../helpers/getCookies';
import useError from '@/store/errorStore';
import { redirect } from '@/helpers/redirect';
import Cookies from 'js-cookie';
import isAuth from '@/helpers/isAuth';
import router from '@/router';

export const API = axios.create({
  baseURL: import.meta.env.VITE_VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getCookie('Access-Token=')}`,
    'Accept-Language': localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en'
  }
});

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> => {
    if (!Cookies.get('Access-Token')) {
      redirect();
    }
    return {
      ...config
    };
  }
);
API.interceptors.response.use(
  function (response) {
    isAuth.setAuth(true);
    return response;
  },
  function (error) {
    if (error.response.status === 403) {
      redirect();
    }
    if (error.response.status === 401) {
      if (router.currentRoute.value.meta?.requiresAuth) {
        router.push('/access_denied');
      }
    }
    useError.setError(error.response.data.message);
    throw new Error(error.response.status);
  }
);

export const APIFormData = axios.create({
  baseURL: import.meta.env.VITE_VUE_APP_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${getCookie('Access-Token=')}`
  }
});
