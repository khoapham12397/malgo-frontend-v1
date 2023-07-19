import { Role } from '../config/enums';

export const formatRole = (role: string) => {
  switch (role) {
    case Role.admin:
      return 'Admin';
    case Role.super_admin:
      return 'Super Admin';
    default:
      return 'Regular User';
  }
};
