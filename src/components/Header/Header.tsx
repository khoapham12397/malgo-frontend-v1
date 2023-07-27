import { useAuth0 } from '@auth0/auth0-react';
import { FunctionComponent } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as FavLogo } from '../../../favicon.svg';
import './Header.css';
import { Role } from '../../config/enums';

const Header: FunctionComponent = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const role = localStorage.getItem('role');

  const handleClickIcon = async () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      loginWithRedirect();
    }
  };

  return (
    <>
      <nav className='nav-container'>
        <div className='nav-container-item nav-left-items'>
          <Link to='algorithm' className='nav-logo-container'>
            <FavLogo />
          </Link>

          <div className='nav-links'>
            <Link to='algorithm' className='nav-link'>
              ALGORITHM
            </Link>

            <Link to='math' className='nav-link'>
              MATH
            </Link>

            <Link to='threads' className='nav-link'>
              THREAD
            </Link>

            <Link to='rank' className='nav-link'>
              RANK
            </Link>
            <Link to='submission/1' className='nav-link'>
              STATUS
            </Link>
            {isAuthenticated &&
              (role === Role.admin || role === Role.super_admin) && (
                <Link to='admin' className='nav-link'>
                  ADMIN
                </Link>
              )}
            <Link to='chat' className='nav-link'>
              CHAT
            </Link>
            <Link to='game' className='nav-link'>
              GAME
            </Link>
            <Link to='contest2' className='nav-link'>
              CONTEST
            </Link>
            <Link to='lesson' className='nav-link'>
              LESSON
            </Link>
            <Link to='dashboard/math' className='nav-link'>
              MATH-AD
            </Link>
          </div>
        </div>

        <div className='nav-container-item nav-right-items'>
          <FaUserAlt className='nav-icon-user' onClick={handleClickIcon} />
        </div>
      </nav>
    </>
  );
};

export default Header;
