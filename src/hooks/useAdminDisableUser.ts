import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../config/axiosInstance';
import { handleError } from '../utils/errorHandler';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const useAdminDisableUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const adminDisableUserMutation = useMutation({
    mutationFn: async (username: string | undefined) => {
      try {
        if (!username) return;
        const accessToken = await getAccessTokenSilently();
        const response = await axiosInstance.put(
          `admin/user/${username}/disable`,
          {}, // no body
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        return response.data;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    // Refetch after the mutation is successful
    onSuccess: data => {
      const disabledUser: User = data.disabledUser;
      queryClient.setQueryData(['admin-get-all-users'], (oldUsers: any) => {
        return oldUsers.map((user: User) => {
          if (user.username === disabledUser.username) {
            return { ...user, is_disabled: true };
          }
          return user;
        });
      });
      toast.success(
        `User ${disabledUser.username.split('@').at(0)} has been disabled!`
      );
    },
    retry: 0
  });

  return { adminDisableUserMutation };
};

export default useAdminDisableUser;
