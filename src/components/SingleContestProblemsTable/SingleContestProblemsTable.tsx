import { FunctionComponent } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useCodingContestProblems from '../../hooks/useContestProblems';
import Spinner from '../Spinner/Spinner';
import './SingleContestProblemsTable.css';

interface Props {
  contestId: string | undefined;
}

const SingleContestProblemsTable: FunctionComponent<Props> = ({
  contestId
}) => {
  const { codingContestProblemsQuery } = useCodingContestProblems(contestId);

  if (codingContestProblemsQuery.isLoading) return <Spinner />;

  if (codingContestProblemsQuery.isError)
    return <pre>{JSON.stringify(codingContestProblemsQuery.error)}</pre>;

  return (
    <div className='single-contest-problems-table-container'>
      <Table striped bordered hover responsive size='sm'>
        <thead className='single-contest-problems-table-title'>
          <tr>
            <th style={{ width: '10%' }}>#</th>
            <th style={{ width: '50%' }}>Problem Name</th>
            <th style={{ width: '10%' }}>Points</th>
            <th style={{ width: '15%' }}>Time Limit (ms)</th>
            <th style={{ width: '15%' }}>Memory Limit (MB)</th>
          </tr>
        </thead>
        <tbody>
          {codingContestProblemsQuery.data.map(
            (problem: CodingContestProblem, index: number) => (
              <tr key={problem.id}>
                <td>{index + 1}</td>
                <td>
                  <Link
                    to={`/contest/${contestId}/${problem.id}`}
                    target='_blank'
                    className='single-contest-problems-link'
                  >
                    {problem.name}
                  </Link>
                </td>
                <td>{problem.points}</td>
                <td>{problem.time_limit * 1000}</td>
                <td>{problem.memory_limit / 1000}</td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SingleContestProblemsTable;
