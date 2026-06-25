const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_ID_KEY = 'token_id';
const USER_INFO_TOKEN = 'user_info_token';

export const tokenService = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getUserInfoToken(): string | null {
    return localStorage.getItem(USER_INFO_TOKEN);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getTokenId(): string | null {
    return localStorage.getItem(TOKEN_ID_KEY);
  },

  setTokens(accessToken: string, refreshToken?: string, tokenId?: string, userInfoToken?: string) {
    if (userInfoToken) {
      localStorage.setItem(USER_INFO_TOKEN, userInfoToken);
    }
    // Store tokens in localStorage
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    if (tokenId) {
      localStorage.setItem(TOKEN_ID_KEY, tokenId);
    }
  },

  clear() {
    // Clear tokens from localStorage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_ID_KEY);
    localStorage.removeItem(USER_INFO_TOKEN);
  },
};
