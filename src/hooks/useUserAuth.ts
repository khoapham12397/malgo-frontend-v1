import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../config/axiosInstance';
import { UserContext } from '../contexts/UserContext';
import { handleError } from '../utils/errorHandler';
import { setAccessTokenToStorage } from '../utils/getUser';

const useUserAuth = () => {
  const { setUser } = useContext(UserContext);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const userAuthQuery = useQuery({
    queryKey: ['user-auth'],
    queryFn: async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await axiosInstance.post('auth/check', {
          accessToken
        });
        setAccessTokenToStorage(response.data.token);        
        return response.data;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    onSuccess: data => {
      
      console.log(data);
      setUser({
        username: data.username,
        email: data.email
      });
      toast.success(`Welcome back, ${data.username.split('@').at(0)}!`);
    },
    onError : (error)=>{
      setAccessTokenToStorage('');
    },
    staleTime: Infinity,
    enabled: isAuthenticated
  });

  return { userAuthQuery, isAuthenticated };
};

export default useUserAuth;
