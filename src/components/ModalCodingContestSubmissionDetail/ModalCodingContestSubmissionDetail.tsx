import { Editor, loader } from '@monaco-editor/react';
import { FunctionComponent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import useCodingContestSubmissionDetail from '../../hooks/useCodingContestSubmissionDetail';
import { languages } from '../../pages/ContestProblem/Constants/LanguageOptions';
import './ModalCodingContestSubmissionDetail.css';

interface Props {
  submission: CodingContestSubmission | null;
  showModalSubmissionDetail: boolean;
  handleCloseModalSubmissionDetail: () => void;
}

const ModalCodingContestSubmissionDetail: FunctionComponent<Props> = ({
  submission,
  showModalSubmissionDetail,
  handleCloseModalSubmissionDetail
}) => {
  const [theme, setTheme] = useState('');
  const { codingContestSubmissionDetailQuery } =
    useCodingContestSubmissionDetail(submission?.contest_id, submission?.id);

  if (codingContestSubmissionDetailQuery.isError)
    return (
      <pre>{JSON.stringify(codingContestSubmissionDetailQuery.error)}</pre>
    );

  loader.init().then(monaco => {
    import('monaco-themes/themes/Oceanic Next.json').then((data: any) => {
      monaco.editor.defineTheme('darkTheme', data);
      if (theme === '') setTheme('darkTheme');
    });

    import('monaco-themes/themes/GitHub Light.json').then((data: any) => {
      monaco.editor.defineTheme('lightTheme', data);
    });
  });

  return (
    <Modal
      show={showModalSubmissionDetail}
      onHide={handleCloseModalSubmissionDetail}
      className='submission-detail-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title
          className={
            submission?.verdict === 'Accepted'
              ? 'submission-detail-accepted'
              : 'submission-detail-failed'
          }
        >
          {submission?.verdict}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='submission-detail-item'>
          <span className='submission-detail-item-title'>Language:</span>{' '}
          {languages.find(item => item.id === submission?.language_id)?.name}
        </div>
        <div className='submission-detail-item'>
          <span className='submission-detail-item-title'>Points:</span>{' '}
          {submission?.points}
        </div>
        <div className='submission-detail-item'>
          <span className='submission-detail-item-title'>Time:</span>{' '}
          {submission?.time
            ? (submission?.time * 1000).toFixed(0) + ' ms' // convert s to ms
            : 'N/A'}
        </div>
        <div className='submission-detail-item'>
          <span className='submission-detail-item-title'>Memory:</span>{' '}
          {submission?.memory
            ? (submission?.memory / 1000).toFixed(3) + ' MB' // convert KB to MB
            : 'N/A'}
        </div>
        <div className='submission-detail-item1'>
          <span className='submission-detail-item-title'>Source Code:</span>{' '}
          <Editor
            height='50vh'
            defaultLanguage={
              languages.find(item => item.id === submission?.language_id)?.value
            }
            defaultValue={
              submission?.source_code
                ? submission?.source_code
                : `
                # Mock code
                def factorial(n):
                  if n == 0:
                    return 1
                  return n * factorial(n  - 1)
            
                print(factorial(int(input())))`
            }
            theme={theme}
            options={{
              readOnly: true,
              scrollBeyondLastLine: false,
              fontSize: 16
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='primary'
          onClick={handleCloseModalSubmissionDetail}
          style={{ backgroundColor: '#3b5998', border: '#3b5998' }}
        >
          Get It
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCodingContestSubmissionDetail;
