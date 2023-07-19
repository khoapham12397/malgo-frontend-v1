import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../config/axiosInstance';
import { handleError } from '../utils/errorHandler';

const useUserProfile = () => {
  const { getAccessTokenSilently } = useAuth0();

  const userProfileQuery = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const username = localStorage.getItem('username');

        const response = await axiosInstance.get(`user/profile/${username}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        return response.data;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    staleTime: Infinity
  });

  return { userProfileQuery };
};

export default useUserProfile;
