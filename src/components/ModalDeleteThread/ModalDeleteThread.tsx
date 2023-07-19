import { FunctionComponent } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ModalDeleteThread.css';

interface Props {
  thread: Thread;
  showModalDeleteThread: boolean;
  handleClickCancel: () => void;
  handleClickDelete: () => void;
}

const ModalDeleteThread: FunctionComponent<Props> = ({
  thread,
  showModalDeleteThread,
  handleClickCancel,
  handleClickDelete
}) => {
  return (
    <Modal show={showModalDeleteThread} onHide={handleClickCancel}>
      <Modal.Header closeButton>
        <Modal.Title>You are deleting thread</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className='modal-delete-thread-id'>ID: {thread?.id}</h5>
        <div className='modal-delete-thread-item'>
          <span className='modal-delete-thread-item-title'>Author:</span>{' '}
          {thread?.author.username.split('@')[0]}
        </div>
        <div className='modal-delete-thread-item'>
          <span className='modal-delete-thread-item-title'>Title:</span>{' '}
          {thread?.title}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClickCancel}>
          Cancel
        </Button>
        <Button variant='danger' onClick={handleClickDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteThread;
