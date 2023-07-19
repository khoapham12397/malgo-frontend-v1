import { FunctionComponent, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SingleContestProblemsTable from '../../components/SingleContestProblemsTable/SingleContestProblemsTable';
import SingleContestStandingTable from '../../components/SingleContestStandingTable/SingleContestStandingTable';
import SingleContestSubmissionTable from '../../components/SingleContestSubmissionTable/SingleContestSubmissionTable';
import './SingleContest.css';

const SingleContest: FunctionComponent = () => {
  const { id: contestId } = useParams();
  const [tab, setTab] = useState('problems');

  return (
    <Container className='single-contest-container'>
      <div className='single-contest-submenu mb-5'>
        <ul className='single-contest-submenu-list'>
          <li
            className={
              tab === 'problems'
                ? 'single-contest-submenu-item submenu-item-active'
                : 'single-contest-submenu-item'
            }
            onClick={e => setTab('problems')}
          >
            Problems
          </li>
          <li
            className={
              tab === 'submission'
                ? 'single-contest-submenu-item submenu-item-active'
                : 'single-contest-submenu-item'
            }
            onClick={e => setTab('submission')}
          >
            Submissions
          </li>
          <li
            className={
              tab === 'standing'
                ? 'single-contest-submenu-item submenu-item-active'
                : 'single-contest-submenu-item'
            }
            onClick={e => setTab('standing')}
          >
            Standing
          </li>
        </ul>
      </div>
      <div className='single-contest-table'>
        {tab === 'problems' ? (
          <SingleContestProblemsTable contestId={contestId} />
        ) : tab === 'submission' ? (
          <SingleContestSubmissionTable contestId={contestId} />
        ) : (
          <SingleContestStandingTable contestId={contestId} />
        )}
      </div>
    </Container>
  );
};

export default SingleContest;
