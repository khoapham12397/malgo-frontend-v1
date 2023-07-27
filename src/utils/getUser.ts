import { resetChatState } from '../state/actions/chatAction';

export const getFixedUsername = (username: string | undefined) => {
  if (!username) return '';
  return username.split('@')[0];
};
export const setAccessTokenToStorage = (accessToken: string) => {
  sessionStorage.setItem('access-token', accessToken);
};
export const getAccessTokenFromStorage = () => {
  return sessionStorage.getItem('access-token');
};

export const setUsernameToStorage = (username: string) => {
  resetChatState();
  sessionStorage.setItem('username', username);
};

export const getUsernameFromStorage = () => {
  return sessionStorage.getItem('username');
};
