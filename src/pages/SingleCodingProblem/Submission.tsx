import { FunctionComponent, useState } from 'react';
import { Card } from 'react-bootstrap';
import ModalCodingSubmissionDetail from '../../components/ModalCodingSubmissionDetail/ModalCodingSubmissionDetail';
import { formatDate } from '../../utils/formatDate';
import '../SingleCodingProblem/style.css';
import './CodingProblem.css';
import { languages } from './Constants/LanguageOptions';
import './Submission.css';

interface Props {
  submissions: CodingSubmission[] | undefined;
}

const Submission: FunctionComponent<Props> = ({ submissions }) => {
  const [submission, setSubmission] = useState<CodingSubmission | null>(
    submissions ? submissions[0] : null
  );
  const [showModalSubmissionDetail, setShowModalSubmissionDetail] =
    useState<boolean>(false);

  const handleClickSubmission = (submission: CodingSubmission) => {
    setSubmission(submission);
    setShowModalSubmissionDetail(true);
  };

  const handleCloseModalSubmissionDetail = () => {
    setShowModalSubmissionDetail(false);
  };

  return (
    <div id='submission' className='submission-container'>
      <ModalCodingSubmissionDetail
        submission={submission}
        showModalSubmissionDetail={showModalSubmissionDetail}
        handleCloseModalSubmissionDetail={handleCloseModalSubmissionDetail}
      />
      {submissions?.map((submission: CodingSubmission) => (
        <Card
          className='submission-card'
          key={submission.ID}
          onClick={() => handleClickSubmission(submission)}
        >
          <Card.Body>
            <Card.Title
              className={
                submission.Verdict === 'Accepted'
                  ? 'submission-accepted'
                  : submission.Verdict === 'Processing'
                  ? 'submission-processing'
                  : 'submission-failed'
              }
            >
              {submission.Verdict}
            </Card.Title>
            <Card.Subtitle className='mb-2 text-muted'>
              {formatDate(submission.SubmittedAt)}
            </Card.Subtitle>
            <div className='submission-card-item'>
              <span className='submission-card-item-title'>Language:</span>{' '}
              <span className='submission-card-item-content'>
                {
                  languages.find(item => item.id === submission.LanguageID)
                    ?.name
                }
              </span>
            </div>
            <div className='submission-card-item'>
              <span className='submission-card-item-title'>Time:</span>{' '}
              <span className='submission-card-item-content'>
                {submission.Time
                  ? (submission.Time * 1000).toFixed(0) + ' ms' // convert s to ms
                  : 'N/A'}
              </span>
            </div>
            <div className='submission-card-item'>
              <span className='submission-card-item-title'>Memory:</span>{' '}
              <span className='submission-card-item-content'>
                {submission.Memory
                  ? (submission.Memory / 1000).toFixed(3) + ' MB' // convert KB to MB
                  : 'N/A'}
              </span>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Submission;
