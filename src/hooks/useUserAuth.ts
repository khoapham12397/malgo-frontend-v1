import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../config/axiosInstance';
import { initSocketClient } from '../state/actions/chatAction';
import { handleError } from '../utils/errorHandler';
import { setAccessTokenToStorage } from '../utils/getUser';

const useUserAuth = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const userAuthQuery = useQuery({
    queryKey: ['user-auth'],
    queryFn: async () => {
      try {
        const accessToken = await getAccessTokenSilently();

        const response = await axiosInstance.post('auth/check', {
          accessToken
        });
        return response.data;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    onSuccess: data => {
      // console.log(data);
      localStorage.setItem('username', data.username);
      sessionStorage.setItem('username', data.username);
      setAccessTokenToStorage(data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', data.role);
      initSocketClient(data.username);
      // toast.success(`Welcome back, ${data.username.split('@').at(0)}!`);
    },
    staleTime: Infinity,
    enabled: isAuthenticated
  });

  return { userAuthQuery, isAuthenticated };
};

export default useUserAuth;
