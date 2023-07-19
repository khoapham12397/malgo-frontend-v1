import { FunctionComponent } from 'react';
import { Button } from 'react-bootstrap';
import './AdminCreateContestProblems.css';

interface Props {
  problemName: React.RefObject<HTMLInputElement>;
  problemTimeLimit: React.RefObject<HTMLInputElement>;
  problemMemoryLimit: React.RefObject<HTMLInputElement>;
  problemDescription: React.RefObject<HTMLTextAreaElement>;
  problemPoints: React.RefObject<HTMLInputElement>;
  problemPointsLossPerMin: React.RefObject<HTMLInputElement>;
  fileTestcases: React.RefObject<HTMLInputElement>;
  handleUploadTestcases: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickAddProblem: () => void;
}

const AdminCreateContestProblems: FunctionComponent<Props> = ({
  problemName,
  problemTimeLimit,
  problemMemoryLimit,
  problemDescription,
  problemPoints,
  problemPointsLossPerMin,
  fileTestcases,
  handleUploadTestcases,
  handleClickAddProblem
}) => {
  return (
    <div className='admin-create-contest-problems-container'>
      <form className='admin-create-contest-form-container'>
        <div className='admin-create-contest-form-group'>
          <div className='admin-create-contest-form-item'>
            <label className='admin-create-contest-form-label'>
              Problem name
            </label>
            <input
              className='admin-create-contest-form-input'
              type='text'
              required
              ref={problemName}
            />
          </div>

          <div className='admin-create-contest-form-item'>
            <label className='admin-create-contest-form-label'>
              Time limit (in seconds)
            </label>
            <input
              className='admin-create-contest-form-input'
              type='number'
              required
              min={0}
              ref={problemTimeLimit}
            />
          </div>

          <div className='admin-create-contest-form-item'>
            <label className='admin-create-contest-form-label'>
              Memory limit (in KB)
            </label>
            <input
              className='admin-create-contest-form-input'
              type='number'
              required
              min={0}
              ref={problemMemoryLimit}
            />
          </div>

          <div className='admin-create-contest-form-item'>
            <label className='admin-create-contest-form-label'>
              Description
            </label>
            <textarea
              className='admin-create-contest-form-input'
              ref={problemDescription}
            />
          </div>

          <div className='admin-create-contest-form-item'>
            <label className='admin-create-contest-form-label'>Points</label>
            <input
              className='admin-create-contest-form-input'
              type='number'
              required
              min={0}
              ref={problemPoints}
            />
          </div>

          <div className='admin-create-contest-form-item'>
            <label className='admin-create-contest-form-label'>
              Points loss per minute
            </label>
            <input
              className='admin-create-contest-form-input'
              type='number'
              required
              min={0}
              ref={problemPointsLossPerMin}
            />
          </div>

          <div className='admin-create-contest-form-item'>
            <label className='admin-create-contest-form-label'>
              Testcases (in JSON format)
            </label>
            <input
              className='admin-create-contest-form-input'
              type='file'
              required
              ref={fileTestcases}
              onChange={handleUploadTestcases}
            />
          </div>
        </div>
      </form>
      <Button
        variant='primary'
        className='admin-create-contest-problem-button'
        onClick={handleClickAddProblem}
      >
        Add Problem
      </Button>
    </div>
  );
};

export default AdminCreateContestProblems;
