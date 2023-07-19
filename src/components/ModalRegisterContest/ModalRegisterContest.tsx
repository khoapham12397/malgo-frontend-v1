import { FunctionComponent } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getDuration } from '../../utils/getDuration';
import './ModalRegisterContest.css';

interface Props {
  showModalRegisterContest: boolean;
  contest: AlgorithmContest | null;
  handleClickCancel: () => void;
  handleClickRegister: () => void;
  handleClickUnregister: () => void;
}

const ModalRegisterContest: FunctionComponent<Props> = ({
  showModalRegisterContest,
  contest,
  handleClickCancel,
  handleClickRegister,
  handleClickUnregister
}) => {
  return (
    <Modal show={showModalRegisterContest} onHide={handleClickCancel}>
      <Modal.Header closeButton>
        <Modal.Title>You are register for</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className='modal-register-contest-name'>{contest?.name}</h5>
        <div className='modal-register-contest-item'>
          <span className='modal-register-contest-item-title'>Start time:</span>{' '}
          {new Date(contest?.start_time as number).toLocaleString()}
        </div>
        <div className='modal-register-contest-item'>
          <span className='modal-register-contest-item-title'>Last in:</span>{' '}
          {getDuration(contest?.duration ? contest.duration : 0)}
        </div>
        <div className='modal-register-contest-item'>
          <span className='modal-register-contest-item-title'>
            Your rating should be in range:
          </span>{' '}
          {contest?.rating_floor} - {contest?.rating_ceil}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClickCancel}>
          Cancel
        </Button>
        {contest?.has_register ? (
          <Button variant='danger' onClick={handleClickUnregister}>
            Leave
          </Button>
        ) : (
          <Button
            variant='primary'
            onClick={handleClickRegister}
            style={{ backgroundColor: '#3b5998', border: '#3b5998' }}
          >
            Register
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegisterContest;
