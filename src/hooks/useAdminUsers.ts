import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../config/axiosInstance';
import { handleError } from '../utils/errorHandler';
import { Role } from '../config/enums';

const useAdminUsers = () => {
  const { getAccessTokenSilently } = useAuth0();

  const adminUsersQuery = useQuery({
    queryKey: ['admin-get-all-users'],
    queryFn: async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await axiosInstance.get('admin/users', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data: User[] = response.data.users;

        // Sort the users by admin_type: super_admin > admin > regular_user
        const sortRoles = (a: User, b: User) => {
          if (a.admin_type === b.admin_type) {
            return 0;
          }
          if (a.admin_type === Role.super_admin) {
            return -1;
          }
          if (b.admin_type === Role.super_admin) {
            return 1;
          }
          if (a.admin_type === Role.admin) {
            return -1;
          }
          if (b.admin_type === Role.admin) {
            return 1;
          }
          return 0;
        };

        data.sort(sortRoles);

        return data;
      } catch (error: any) {
        handleError(error);
        throw error.message;
      }
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  return { adminUsersQuery };
};

export default useAdminUsers;
