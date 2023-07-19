import { Editor, loader } from '@monaco-editor/react';
import { FunctionComponent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import useCodingSubmissionDetail from '../../hooks/useCodingSubmissionDetail';
import { languages } from '../../pages/ContestProblem/Constants/LanguageOptions';
import './ModalCodingSubmissionDetail.css';

interface Props {
  submission: CodingSubmission | null;
  showModalSubmissionDetail: boolean;
  handleCloseModalSubmissionDetail: () => void;
}

const ModalCodingSubmissionDetail: FunctionComponent<Props> = ({
  submission,
  showModalSubmissionDetail,
  handleCloseModalSubmissionDetail
}) => {
  const [theme, setTheme] = useState('');
  const { codingSubmissionDetail } = useCodingSubmissionDetail(submission?.ID);

  if (codingSubmissionDetail.isError)
    return <pre>{JSON.stringify(codingSubmissionDetail.error)}</pre>;

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
            submission?.Verdict === 'Accepted'
              ? 'submission-detail-accepted'
              : 'submission-detail-failed'
          }
        >
          {submission?.Verdict}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='submission-detail-item'>
          <span className='submission-detail-item-title'>Language:</span>{' '}
          {languages.find(item => item.id === submission?.LanguageID)?.name}
        </div>
        <div className='submission-detail-item'>
          <span className='submission-detail-item-title'>Time:</span>{' '}
          {submission?.Time
            ? (submission?.Time * 1000).toFixed(0) + ' ms' // convert s to ms
            : 'N/A'}
        </div>
        <div className='submission-detail-item'>
          <span className='submission-detail-item-title'>Memory:</span>{' '}
          {submission?.Memory
            ? (submission?.Memory / 1000).toFixed(3) + ' MB' // convert KB to MB
            : 'N/A'}
        </div>
        <div className='submission-detail-item1'>
          <span className='submission-detail-item-title'>Source Code:</span>{' '}
          <Editor
            height='50vh'
            defaultLanguage={
              languages.find(item => item.id === submission?.LanguageID)?.value
            }
            defaultValue={
              submission?.SourceCode
                ? submission?.SourceCode
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

export default ModalCodingSubmissionDetail;
