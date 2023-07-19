import { FunctionComponent } from 'react';
import { Table } from 'react-bootstrap';
import useCodingContestProblems from '../../hooks/useContestProblems';
import useContestStanding from '../../hooks/useContestStanding';
import Spinner from '../Spinner/Spinner';
import './SingleContestStanding.css';

interface Props {
  contestId: string | undefined;
}

const SingleContestStandingTable: FunctionComponent<Props> = ({
  contestId
}) => {
  const { codingContestStandingQuery } = useContestStanding(contestId);
  const { codingContestProblemsQuery } = useCodingContestProblems(contestId);

  const formatTime = (minutesToSolve: number) => {
    // 4 minutes to 04:00
    // 64 minutes to 01:04:00
    const hours = Math.floor(minutesToSolve / 60);
    const minutes = minutesToSolve % 60;
    const timeString = `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;
    return timeString;
  };

  if (
    codingContestStandingQuery.isLoading ||
    codingContestProblemsQuery.isLoading
  )
    return <Spinner />;

  if (codingContestStandingQuery.isError)
    return <pre>{JSON.stringify(codingContestStandingQuery.error)}</pre>;

  if (codingContestProblemsQuery.isError)
    return <pre>{JSON.stringify(codingContestProblemsQuery.error)}</pre>;

  return (
    <div className='single-contest-standing-table-container'>
      <Table striped bordered hover responsive size='sm'>
        <thead className='single-contest-standing-table-title'>
          <tr>
            <th style={{ width: '5%' }}>Rank</th>
            <th style={{ width: '15%' }}>Contestant</th>
            <th style={{ width: '10%' }}>Total Points</th>
            {codingContestStandingQuery.data[0].problem_statuses.map(
              (problem: CodingContestProblemStatus) => (
                <th key={problem.problem_id} style={{ width: '10%' }}>
                  <div className='standing-header'>
                    {
                      codingContestProblemsQuery.data.find(
                        (problemRecord: CodingContestProblem) =>
                          problemRecord.id === problem.problem_id
                      )?.name
                    }
                  </div>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className='single-contest-standing-table-body'>
          {codingContestStandingQuery.data.map(
            (standing: CodingContestStanding, index: number) => (
              <tr key={standing.rank}>
                <td>{standing.rank}</td>
                <td>{standing.username.split('@')[0]}</td>
                <td>{standing.total_points}</td>
                {standing.problem_statuses.map(
                  (problem: CodingContestProblemStatus) => (
                    <td key={problem.problem_id}>
                      <div className='standing-points' title='Points'>
                        {problem.points ? problem.points : 0}
                      </div>
                      <div className='standing-penalty' title='Problem Penalty'>
                        {problem.penalty ? problem.penalty : 0}
                      </div>
                      <div
                        className='standing-minutes'
                        title='Time To Solve: HH : MM'
                      >
                        {problem.minutes_to_solve
                          ? formatTime(problem.minutes_to_solve)
                          : 0}
                      </div>
                    </td>
                  )
                )}
              </tr>
            )
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SingleContestStandingTable;
