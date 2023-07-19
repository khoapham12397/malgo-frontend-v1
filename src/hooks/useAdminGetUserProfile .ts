import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../config/axiosInstance';
import { handleError } from '../utils/errorHandler';

const useAdminGetUserProfile = (username: string | undefined) => {
  const { getAccessTokenSilently } = useAuth0();

  const adminGetUserProfileQuery = useQuery({
    queryKey: ['admin-get-user-profile', username],
    queryFn: async () => {
      try {
        if (!username) {
          return;
        }

        const accessToken = await getAccessTokenSilently();
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

  return { adminGetUserProfileQuery };
};

export default useAdminGetUserProfile;
