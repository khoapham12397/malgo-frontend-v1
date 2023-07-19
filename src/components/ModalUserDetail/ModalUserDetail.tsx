import { FunctionComponent } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Role } from '../../config/enums';
import useAdminGetUserProfile from '../../hooks/useAdminGetUserProfile ';
import { formatDate } from '../../utils/formatDate';
import { formatRole } from '../../utils/formatRole';
import './ModalUserDetail.css';

interface Props {
  user: User | null;
  showModalUserDetail: boolean;
  handleCloseModalUserDetail: () => void;
  handleClickDisableUser: () => void;
  handleClickEnableUser: () => void;
}

const ModalUserDetail: FunctionComponent<Props> = ({
  user,
  showModalUserDetail,
  handleCloseModalUserDetail,
  handleClickDisableUser,
  handleClickEnableUser
}) => {
  const { adminGetUserProfileQuery } = useAdminGetUserProfile(user?.username);

  if (adminGetUserProfileQuery.isLoading) return <></>;

  if (adminGetUserProfileQuery.isError)
    return <pre>{JSON.stringify(adminGetUserProfileQuery.error)}</pre>;

  return (
    <Modal
      show={showModalUserDetail}
      onHide={handleCloseModalUserDetail}
      className='modal-user-detail'
    >
      <Modal.Header closeButton>
        <Modal.Title
          className={
            user?.admin_type === Role.super_admin
              ? 'user-detail-role super-admin'
              : user?.admin_type === Role.admin
              ? 'user-detail-role admin'
              : 'user-detail-role regular-user'
          }
        >
          {formatRole(user?.admin_type as string)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className='modal-user-detail-id'>
          {user?.username.split('@').at(0)}
        </h5>
        <div className='modal-user-detail-item'>
          <span className='modal-user-detail-item-title'>Avatar:</span>{' '}
          <img
            src={adminGetUserProfileQuery.data.picture}
            alt='avatar'
            width={96}
          />
        </div>
        <div className='modal-user-detail-item'>
          <span className='modal-user-detail-item-title'>Email:</span>{' '}
          {user?.email}
        </div>
        <div className='modal-user-detail-item'>
          <span className='modal-user-detail-item-title'>Name:</span>{' '}
          {adminGetUserProfileQuery.data.name}
        </div>

        <div className='modal-user-detail-item'>
          <span className='modal-user-detail-item-title'>Created:</span>{' '}
          {formatDate(user?.create_time as string)}
        </div>
        <div className='modal-user-detail-item'>
          <span className='modal-user-detail-item-title'>Is Disabled:</span>{' '}
          {user?.is_disabled ? 'Yes' : 'No'}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {user?.is_disabled ? (
          <Button variant='success' onClick={handleClickEnableUser}>
            Enable
          </Button>
        ) : (
          <Button variant='danger' onClick={handleClickDisableUser}>
            Disable
          </Button>
        )}
        <Button
          variant='primary'
          onClick={handleCloseModalUserDetail}
          style={{ backgroundColor: '#3b5998', border: '#3b5998' }}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUserDetail;
