import { MathJax, MathJaxContext } from 'better-react-mathjax';
import parse from 'html-react-parser';
import { FunctionComponent } from 'react';
import { Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatMathExpr } from '../../utils/utils';
import '../SingleCodingProblem/style.css';
import './CodingProblem.css';

interface Props {
  problem: CodingProblem | null;
}

const Description: FunctionComponent<Props> = ({ problem }) => {
  return (
    <div id='description' style={{ padding: '10px' }}>
      <h2>{problem != null ? problem.title : ''}</h2>
      <MathJaxContext>
        <MathJax>
          {problem == null ? '' : parse(formatMathExpr(problem.description))}
        </MathJax>
        <MathJax></MathJax>
      </MathJaxContext>
      <Accordion style={{ marginTop: '30px' }}>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>Similar Problems</Accordion.Header>
          <Accordion.Body
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Link to={'/algorithm/atcoder_dp_z'} style={{ color: '#3b5998' }}>
              Atcoder Educational DP Contest Z - Frog 3
            </Link>
            <Link to={'/algorithm/atcoder_dp_z'} style={{ color: '#3b5998' }}>
              Atcoder Educational DP Contest Z - Frog 3
            </Link>
            <Link to={'/algorithm/atcoder_dp_z'} style={{ color: '#3b5998' }}>
              Atcoder Educational DP Contest Z - Frog 3
            </Link>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Description;
