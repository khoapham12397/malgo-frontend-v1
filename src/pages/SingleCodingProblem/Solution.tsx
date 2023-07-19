import { FunctionComponent } from 'react';
import '../SingleCodingProblem/style.css';
import './CodingProblem.css';

interface Props {
  problem: CodingProblem | null;
}

const Solution: FunctionComponent<Props> = ({ problem }) => {
  return (
    <div id='solution' style={{ padding: '10px' }}>
      This is the solution of the problem.
    </div>
  );
};

export default Solution;
