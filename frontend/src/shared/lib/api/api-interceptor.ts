import { api } from "./axios";
import { errorCatch } from "./api.helper";
import authServise from "@/servises/auth.servise";
import { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, saveAccessToken, removeAccessToken } from "../token/token-helper";

api.interceptors.request.use(config => {
  const accessToken = getAccessToken();

  if (config?.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (!originalRequest) return Promise.reject(error);

    const message = errorCatch(error);
    const isAuthError =
      error.response?.status === 401 &&
      (message === "Verification token failed" || message === "No token provided");

    if (!isAuthError || originalRequest._retry) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (token) {
            originalRequest.headers = new AxiosHeaders(originalRequest.headers);
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            resolve(api(originalRequest));
          } else {
            reject(new Error("Token refresh failed"));
          }
        });
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const { accessToken } = await authServise.refreshTokens();
      saveAccessToken(accessToken);

      originalRequest.headers = new AxiosHeaders(originalRequest.headers);
      originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);

      refreshQueue.forEach((callback) => callback(accessToken));
      refreshQueue = [];
      isRefreshing = false;

      return api(originalRequest);
    } catch (refreshError) {
      refreshQueue.forEach((callback) => callback(null));
      refreshQueue = [];
      isRefreshing = false;
      removeAccessToken();

      return Promise.reject(refreshError);
    }
  }
);


export default api;