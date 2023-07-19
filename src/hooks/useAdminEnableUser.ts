import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../config/axiosInstance';
import { handleError } from '../utils/errorHandler';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const useAdminEnableUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const adminEnableUserMutation = useMutation({
    mutationFn: async (username: string | undefined) => {
      try {
        if (!username) return;
        const accessToken = await getAccessTokenSilently();
        const response = await axiosInstance.put(
          `admin/user/${username}/enable`,
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
      const enabledUser: User = data.enabledUser;
      queryClient.setQueryData(['admin-get-all-users'], (oldUsers: any) => {
        return oldUsers.map((user: User) => {
          if (user.username === enabledUser.username) {
            return { ...user, is_disabled: false };
          }
          return user;
        });
      });
      toast.success(
        `User ${enabledUser.username.split('@').at(0)} has been enabled!`
      );
    },
    retry: 0
  });

  return { adminEnableUserMutation };
};

export default useAdminEnableUser;
