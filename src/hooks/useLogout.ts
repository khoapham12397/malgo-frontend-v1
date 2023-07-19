import { useAuth0 } from '@auth0/auth0-react';

const useLogout = () => {
  const { logout } = useAuth0();

  const logoutUser = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    logout({
      logoutParams: {
        returnTo: import.meta.env.VITE_CALLBACK_URL as string
      }
    });
  };

  return { logoutUser };
};

export default useLogout;
