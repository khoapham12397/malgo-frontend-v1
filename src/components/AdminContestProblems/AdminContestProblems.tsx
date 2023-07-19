import { FunctionComponent } from 'react';
import './AdminContestProblems.css';

interface Props {
  problems: any[];
}

const AdminContestProblems: FunctionComponent<Props> = ({ problems }) => {
  return (
    <div className='admin-contests-problems-container'>
      {problems.map(problem => (
        <div className='admin-contests-problems-container' key={problem.name}>
          <div className='admin-contests-problem-name'>{problem.name}</div>
          <div className='admin-contests-problem-name'>
            {problem.display_order}
          </div>
          <div className='admin-contests-problem-name'>
            {problem.time_limit}
          </div>
          <div className='admin-contests-problem-name'>
            {problem.memory_limit}
          </div>
          <div className='admin-contests-problem-name'>
            {problem.description}
          </div>
          <div className='admin-contests-problem-name'>{problem.points}</div>
          <div className='admin-contests-problem-name'>
            {problem.points_loss_per_min}
          </div>
          <div className='admin-contests-problem-name'>{problem.testcases}</div>
        </div>
      ))}
    </div>
  );
};

export default AdminContestProblems;
