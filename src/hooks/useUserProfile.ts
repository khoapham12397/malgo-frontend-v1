import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import axiosInstance from '../config/axiosInstance';
import { UserContext } from '../contexts/UserContext';
import { handleError } from '../utils/errorHandler';

const useUserProfile = () => {
  const { user } = useContext(UserContext);
  const { getAccessTokenSilently } = useAuth0();

  const userProfileQuery = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      try {
        const accessToken = await getAccessTokenSilently();

        const response = await axiosInstance.get(
          `user/profile/${user?.username}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        console.log(response.data);
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

