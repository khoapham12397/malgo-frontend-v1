import { FunctionComponent } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ModalProblemResult.css';

interface Props {
  problemName: string | undefined;
  showModalResult: boolean;
  problemResult: any;
  handleCloseModalResult: () => void;
}

const ModalProblemResult: FunctionComponent<Props> = ({
  problemName,
  showModalResult,
  problemResult,
  handleCloseModalResult
}) => {
  return (
    <Modal show={showModalResult} onHide={handleCloseModalResult}>
      <Modal.Header closeButton>
        <Modal.Title>
          {problemResult?.verdict === 'Accepted'
            ? 'Congratulations!'
            : 'Oops! Try Again!'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className='modal-problem-result-id'>{problemName}</h5>
        <div className='modal-problem-result-item'>
          <span className='modal-problem-result-item-title'>Verdict:</span>{' '}
          {problemResult?.verdict}
        </div>
        <div className='modal-problem-result-item'>
          <span className='modal-problem-result-item-title'>Time:</span>{' '}
          {problemResult?.time
            ? (problemResult?.time * 1000).toFixed(0) + ' ms' // convert s to ms
            : 'N/A'}
        </div>
        <div className='modal-problem-result-item'>
          <span className='modal-problem-result-item-title'>Memory:</span>{' '}
          {problemResult?.memory
            ? (problemResult?.memory / 1000).toFixed(3) + ' MB' // convert KB to MB
            : 'N/A'}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='primary'
          onClick={handleCloseModalResult}
          style={{ backgroundColor: '#3b5998', border: '#3b5998' }}
        >
          Get It
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalProblemResult;
