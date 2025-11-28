import { api } from "./axios";

import { errorCatch } from "./api.helper";
import authServise from "@/servises/auth.servise";
import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, saveAccessToken, removeAccessToken } from "../token/token-helper";



api.interceptors.request.use(config => {
  const accessToken = getAccessToken();

  if (config?.headers && accessToken) {
    config.headers!.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (!originalRequest) throw error;

    const message = errorCatch(error);

    const isAuthError =
      error.response?.status === 401 &&
      (message === "Verification token failed" || message === "No token provided");

    if (!isAuthError) {
      throw error;
    }
    if (originalRequest._retry) {
      throw error;
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((newToken) => {
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;
    
    try {
      const {accessToken}  = await authServise.refreshTokens();

      saveAccessToken(accessToken)

      refreshQueue.forEach((cb) => cb(accessToken));
      refreshQueue = [];

      isRefreshing = false;

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (err) {

      refreshQueue.forEach((cb) => cb(null));
      refreshQueue = [];
      isRefreshing = false;
      window.location.replace('/login')
      removeAccessToken();
      throw err;
      
    }
  }
);

export default api;
