// src/api/axios.ts
import axios from "axios";
import { useUserStore } from "../store/userStore";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // use .env for backend URL
  withCredentials: true, // if you're using cookies
});

const setLoading = useUserStore.getState().setLoading;

instance.interceptors.request.use(
  config => {
    setLoading(true);
    const token = useUserStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  response => {
    setLoading(false);
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      useUserStore.getState().clearUser?.();
    }
    setLoading(false);
    return Promise.reject(error);
  },
);

export default instance;
