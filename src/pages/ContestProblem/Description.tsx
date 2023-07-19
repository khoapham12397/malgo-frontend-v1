import { MathJax, MathJaxContext } from 'better-react-mathjax';
import parse from 'html-react-parser';
import { FunctionComponent } from 'react';
import { formatMathExpr } from '../../utils/utils';
import '../SingleCodingProblem/style.css';
import './CodingProblem.css';

interface Props {
  problem: CodingContestProblem | undefined;
}

const Description: FunctionComponent<Props> = ({ problem }) => {
  return (
    <div id='description' style={{ padding: '10px' }}>
      <h2>{problem?.name}</h2>
      <MathJaxContext>
        <MathJax>
          {parse(formatMathExpr(problem?.description as string))}
        </MathJax>
        <MathJax></MathJax>
      </MathJaxContext>
    </div>
  );
};

export default Description;
