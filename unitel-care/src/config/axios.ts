import i18n from '@/i18n';
import { redirectWithMessage } from '@/lib/redirect';
import { tokenService } from '@/lib/token';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  withCredentials: false,
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!config.headers['Accept-Language']) {
      const langMap: Record<string, string> = {
        vi: 'vi-VN',
        en: 'en-US',
        lo: 'lo-LA',
        km: 'km-KH',
      };
      const lang = i18n.language || 'vi-VN';
      config.headers['Accept-Language'] = langMap[lang] ?? lang;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

// export const refreshAccessToken = async (): Promise<string> => {
//   const refreshToken = tokenService.getRefreshToken();
//   const tokenId = tokenService.getTokenId();
//   const userInfoToken = tokenService.getUserInfoToken();

//   if (!refreshToken || !tokenId || !userInfoToken) {
//     throw new Error('No refresh token or user info');
//   }

//   const userInfo = JSON.parse(userInfoToken);
//   const data: RefreshTokenParams = {
//     refreshToken,
//     tokenId,
//     tenantCode: userInfo['cth-tenant-code'] || '',
//     departmentCode: userInfo['cth-post-code'] || '',
//   };

//   try {
//     const res = await authService.refreshToken(data);

//     const { accessToken: newAccessToken, refreshToken: newRefreshToken, tokenId: newTokenId } = res;

//     if (!newAccessToken || !newRefreshToken || !newTokenId) {
//       throw new Error('Invalid refresh token response');
//     }

//     tokenService.setTokens(newAccessToken, newRefreshToken, newTokenId);

//     return newAccessToken;
//   } catch (error) {
//     console.log(error, 'error');
//     throw error;
//   }
// };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Do chưa có api refresh token nên tạm thời throw error
        throw new Error('No refresh token or user info');
        // const newToken = await refreshAccessToken();
        // processQueue(null, newToken);

        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // return api(originalRequest);
      } catch (err) {
        processQueue(err);
        tokenService.clear();
        redirectWithMessage('/login', 'messages.sessionExpired');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
