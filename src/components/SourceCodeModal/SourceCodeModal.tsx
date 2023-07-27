import { AnyAsyncThunk } from '@reduxjs/toolkit/dist/matchers';
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { calColor } from '../../utils/utils';

type Props = {
  showSrcModal: boolean;
  toggleSrcModal: () => void;
  submission: SubmissionData | null;
};
export const judgeStatus = [
  'NONE',
  'PENDING',
  'JUDGING',
  'ACCEPTED',
  'WRONG_ANSWER',
  'REAL_TIME_LIMIT_EXCEEDED',
  'COMPILE_ERROR',
  'RUNTIME_ERROR'
];
export const SourceCodeModal = ({
  showSrcModal,
  toggleSrcModal,
  submission
}: Props) => {
  const handleClose = () => {
    toggleSrcModal();
  };

  return (
    <>
      <Modal show={showSrcModal} onHide={handleClose} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <pre style={{ backgroundColor: 'lightblue' }}>
              <code>{atob(submission ? submission.code : '')}</code>
            </pre>
            <div>
              <ul>
                {submission
                  ? submission.status.map((item: any, index) => (
                      <li key={index}>
                        Test {index + 1}:{' '}
                        <span className={calColor(judgeStatus[item.id])}>
                          {judgeStatus[item.id]}
                        </span>
                      </li>
                    ))
                  : ''}
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
