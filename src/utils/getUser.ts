export const getFixedUsername = (username: string) => {
  return username.split('@')[0];
};
export const setAccessTokenToStorage =(accessToken: string) =>{
  sessionStorage.setItem('access-token', accessToken);
}
export const getAccessTokenFromStorage = ()=>{
  return sessionStorage.getItem('access-token');
}