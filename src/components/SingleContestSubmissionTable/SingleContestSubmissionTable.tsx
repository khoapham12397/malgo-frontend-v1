import { FunctionComponent, useState } from 'react';
import { Table } from 'react-bootstrap';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { Link } from 'react-router-dom';
import useCodingContestProblems from '../../hooks/useContestProblems';
import useContestSubmissions from '../../hooks/useContestSubmissions';
import { languages } from '../../pages/ContestProblem/Constants/LanguageOptions';
import { formatDate } from '../../utils/formatDate';
import Spinner from '../Spinner/Spinner';
import './SingleContestSubmissionTable.css';

interface Props {
  contestId: string | undefined;
}

const SingleContestSubmissionTable: FunctionComponent<Props> = ({
  contestId
}) => {
  const { codingContestSubmissionsQuery } = useContestSubmissions(contestId);
  const { codingContestProblemsQuery } = useCodingContestProblems(contestId);
  const [page, setPage] = useState<number>(1);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  if (
    codingContestSubmissionsQuery.isLoading ||
    codingContestProblemsQuery.isLoading
  )
    return <Spinner />;

  if (codingContestSubmissionsQuery.isError)
    return <pre>{JSON.stringify(codingContestSubmissionsQuery.error)}</pre>;

  if (codingContestProblemsQuery.isError)
    return <pre>{JSON.stringify(codingContestProblemsQuery.error)}</pre>;

  return (
    <div className='single-contest-submission-table-container'>
      <PaginationControl
        page={page}
        between={3}
        total={codingContestSubmissionsQuery.data.length}
        limit={20}
        changePage={handleChangePage}
        ellipsis={1}
      />
      <Table striped bordered hover responsive size='sm'>
        <thead className='single-contest-submission-table-title'>
          <tr>
            <th style={{ width: '5%' }}>#</th>
            <th style={{ width: '10%' }}>Contestant</th>
            <th style={{ width: '15%' }}>Problem Name</th>
            <th style={{ width: '15%' }}>Submit At</th>
            <th style={{ width: '15%' }}>Language</th>
            <th style={{ width: '10%' }}>Time</th>
            <th style={{ width: '10%' }}>Memory</th>
            <th style={{ width: '5%' }}>Points</th>
            <th style={{ width: '15%' }}>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {codingContestSubmissionsQuery.data
            .slice((page - 1) * 20, (page - 1) * 20 + 20)
            .map((submission: CodingSubmissionRecord, index: number) => (
              <tr key={submission.id}>
                <td>{(page - 1) * 20 + index + 1}</td>
                <td>{submission.username.split('@')[0]}</td>
                <td>
                  <Link
                    to={`/contest/${contestId}/${submission.problem_id}`}
                    target='_blank'
                    className='single-contest-problems-link'
                  >
                    {
                      codingContestProblemsQuery.data.find(
                        (problem: CodingContestProblem) =>
                          problem.id === submission.problem_id
                      )?.name
                    }
                  </Link>
                </td>
                <td>{formatDate(submission.submitted_at)}</td>
                <td>
                  {
                    languages.find(item => item.id === submission.language_id)
                      ?.name
                  }
                </td>
                <td>
                  {
                    (submission.time * 1000).toFixed(0) + ' ms' // convert s to ms
                  }
                </td>
                <td>
                  {
                    (submission.memory / 1000).toFixed(1) + ' MB' // convert KB to MB
                  }
                </td>
                <td>{submission.points}</td>
                <td
                  className={
                    submission.verdict === 'Accepted'
                      ? 'single-contest-submission-table-verdict-accepted'
                      : 'single-contest-submission-table-verdict-failed'
                  }
                >
                  {submission.verdict}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <PaginationControl
        page={page}
        between={4}
        total={codingContestSubmissionsQuery.data.length}
        limit={20}
        changePage={handleChangePage}
        ellipsis={1}
      />
    </div>
  );
};

export default SingleContestSubmissionTable;
