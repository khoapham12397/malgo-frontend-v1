import { FunctionComponent, useState } from 'react';
import { Card } from 'react-bootstrap';
import { formatDate } from '../../utils/formatDate';
import '../SingleCodingProblem/style.css';
import './CodingProblem.css';
import { languages } from './Constants/LanguageOptions';
import './Submission.css';
import ModalCodingContestSubmissionDetail from '../../components/ModalCodingContestSubmissionDetail/ModalCodingContestSubmissionDetail';

interface Props {
  submissions: CodingContestSubmission[] | undefined;
}

const Submission: FunctionComponent<Props> = ({ submissions }) => {
  const [submission, setSubmission] = useState<CodingContestSubmission | null>(
    submissions ? submissions[0] : null
  );
  const [showModalSubmissionDetail, setShowModalSubmissionDetail] =
    useState<boolean>(false);

  const handleClickSubmission = (submission: CodingContestSubmission) => {
    setSubmission(submission);
    setShowModalSubmissionDetail(true);
  };

  const handleCloseModalSubmissionDetail = () => {
    setShowModalSubmissionDetail(false);
  };

  return (
    <div id='submission' className='submission-container'>
      <ModalCodingContestSubmissionDetail
        submission={submission}
        showModalSubmissionDetail={showModalSubmissionDetail}
        handleCloseModalSubmissionDetail={handleCloseModalSubmissionDetail}
      />
      {submissions?.map((submission: CodingContestSubmission) => (
        <Card
          className='submission-card'
          key={submission.id}
          onClick={() => handleClickSubmission(submission)}
        >
          <Card.Body>
            <Card.Title
              className={
                submission.verdict === 'Accepted'
                  ? 'submission-accepted'
                  : submission.verdict === 'Processing'
                  ? 'submission-processing'
                  : 'submission-failed'
              }
            >
              {submission.verdict}
            </Card.Title>
            <Card.Subtitle className='mb-2 text-muted'>
              {formatDate(submission.submitted_at)}
            </Card.Subtitle>
            <div className='submission-card-item'>
              <span className='submission-card-item-title'>Language:</span>{' '}
              <span className='submission-card-item-content'>
                {
                  languages.find(item => item.id === submission.language_id)
                    ?.name
                }
              </span>
            </div>
            <div className='submission-card-item'>
              <span className='submission-card-item-title'>Time:</span>{' '}
              <span className='submission-card-item-content'>
                {submission.time
                  ? (submission.time * 1000).toFixed(0) + ' ms' // convert s to ms
                  : 'N/A'}
              </span>
            </div>
            <div className='submission-card-item'>
              <span className='submission-card-item-title'>Memory:</span>{' '}
              <span className='submission-card-item-content'>
                {submission.memory
                  ? (submission.memory / 1000).toFixed(3) + ' MB' // convert KB to MB
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
