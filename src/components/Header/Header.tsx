import { useAuth0 } from '@auth0/auth0-react';
import { FunctionComponent } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as FavLogo } from '../../../favicon.svg';
import './Header.css';

const Header: FunctionComponent = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();

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
          <Link to='/' className='nav-logo-container'>
            <FavLogo />
          </Link>

          <div className='nav-links'>
            <div className='subnav-container'>
              <div className='nav-link subnav-btn'>
                PROBLEM
                <div className='subnav-content'>
                  <Link to='coding' className='nav-link subnav-container-item'>
                    Coding
                  </Link>
                  <Link to='mathproblems' className='nav-link subnav-container-item'>
                    Math
                  </Link>
                </div>
              </div>
            </div>

            <Link to='contest' className='nav-link'>
              CONTEST
            </Link>

            <Link to='threads/All' className='nav-link'>
              DISCUSSION
            </Link>

            <Link to='rank' className='nav-link'>
              RANK
            </Link>
            <Link to='group' className='nav-link'>GROUP</Link>
            <Link to='dashboard/math' className='nav-link'>ADMIN</Link>

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
