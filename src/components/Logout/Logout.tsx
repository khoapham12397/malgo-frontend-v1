import { FunctionComponent } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { disconnectSocket } from '../../state/actions/chatAction';
import useLogout from '../../hooks/useLogout';
import './Logout.css';

const Logout: FunctionComponent = () => {
  const { logoutUser } = useLogout();

  return (
    <button
      className='logout-button'
      onClick={() => {
        disconnectSocket();
        logoutUser();
      }}
    >
      <span>Log Out</span>
    </button>
  );
};

export default Logout;
