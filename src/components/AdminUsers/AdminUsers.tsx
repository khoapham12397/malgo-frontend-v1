import { FunctionComponent, useState } from 'react';
import { Table } from 'react-bootstrap';
import { AiOutlineCheck } from 'react-icons/ai';
import ModalUserDetail from '../../components/ModalUserDetail/ModalUserDetail';
import Spinner from '../../components/Spinner/Spinner';
import { Role } from '../../config/enums';
import useAdminDisableUser from '../../hooks/useAdminDisableUser';
import useAdminUsers from '../../hooks/useAdminUsers';
import { formatDate } from '../../utils/formatDate';
import { formatRole } from '../../utils/formatRole';
import './AdminUsers.css';
import useAdminEnableUser from '../../hooks/useAdminEnableUser';

const AdminUsers: FunctionComponent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showModalUserDetail, setShowModalUserDetail] =
    useState<boolean>(false);
  const { adminUsersQuery } = useAdminUsers();
  const { adminDisableUserMutation } = useAdminDisableUser();
  const { adminEnableUserMutation } = useAdminEnableUser();

  const handleClickUser = (user: User) => {
    setUser(user);
    setShowModalUserDetail(true);
  };

  const handleCloseModalUserDetail = () => {
    setShowModalUserDetail(false);
  };

  const handleClickDisableUser = () => {
    adminDisableUserMutation.mutate(user?.username);
    setShowModalUserDetail(false);
  };

  const handleClickEnableUser = () => {
    adminEnableUserMutation.mutate(user?.username);
    setShowModalUserDetail(false);
  };

  if (
    adminUsersQuery.isLoading ||
    adminDisableUserMutation.isLoading ||
    adminEnableUserMutation.isLoading
  )
    return <Spinner />;

  if (adminUsersQuery.isError)
    return <pre>{JSON.stringify(adminUsersQuery.error)}</pre>;

  return (
    <div className='admin-users-container'>
      {showModalUserDetail && (
        <ModalUserDetail
          user={user}
          showModalUserDetail={showModalUserDetail}
          handleCloseModalUserDetail={handleCloseModalUserDetail}
          handleClickDisableUser={handleClickDisableUser}
          handleClickEnableUser={handleClickEnableUser}
        />
      )}
      <Table striped bordered hover responsive size='sm'>
        <thead className='admin-users-table-title'>
          <tr>
            <th style={{ width: '5%' }}>#</th>
            <th style={{ width: '25%' }}>Username</th>
            <th style={{ width: '35%' }}>Email</th>
            <th style={{ width: '10%' }}>Role</th>
            <th style={{ width: '15%' }}>Created Time</th>
            <th style={{ width: '10%' }}>Is Disabled</th>
          </tr>
        </thead>
        <tbody>
          {adminUsersQuery.data.map((user: User, index: number) => (
            <tr key={user.username}>
              <td>{index + 1}</td>
              <td
                className={
                  user.is_disabled
                    ? 'admin-users-table-username user-disabled'
                    : 'admin-users-table-username'
                }
                onClick={() => handleClickUser(user)}
              >
                {user.username.split('@').at(0)}
              </td>
              <td
                className={
                  user.is_disabled ? 'user-disabled' : 'admin-users-table-email'
                }
              >
                {user.email}
              </td>
              <td
                className={
                  user.admin_type === Role.super_admin
                    ? 'admin-users-table-role super-admin'
                    : user.admin_type === Role.admin
                    ? 'admin-users-table-role admin'
                    : 'admin-users-table-role regular-user'
                }
              >
                {formatRole(user.admin_type)}
              </td>
              <td>{formatDate(user.create_time)}</td>
              <td className='admin-users-table-disable'>
                {user.is_disabled ? (
                  <AiOutlineCheck style={{ color: 'green' }} />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminUsers;
