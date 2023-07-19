import { FunctionComponent, useState } from 'react';
import { Container } from 'react-bootstrap';
import AdminContests from '../../components/AdminContests/AdminContests';
import AdminUsers from '../../components/AdminUsers/AdminUsers';
import './Admin.css';

const Admin: FunctionComponent = () => {
  const [tab, setTab] = useState<string>('users');

  return (
    <Container className='admin-container'>
      <div className='admin-submenu mb-5'>
        <ul className='admin-submenu-list'>
          <li
            className={
              tab === 'users'
                ? 'admin-submenu-item admin-submenu-item-active'
                : 'admin-submenu-item'
            }
            onClick={e => setTab('users')}
          >
            Users
          </li>
          <li
            className={
              tab === 'contests'
                ? 'admin-submenu-item admin-submenu-item-active'
                : 'admin-submenu-item'
            }
            onClick={e => setTab('contests')}
          >
            Contests
          </li>
        </ul>
      </div>
      <div className='admin-table'>
        {tab === 'users' ? <AdminUsers /> : <AdminContests />}
      </div>
    </Container>
  );
};

export default Admin;
