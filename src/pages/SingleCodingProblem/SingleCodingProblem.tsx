import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { MathJax } from 'better-react-mathjax';
import parse from 'html-react-parser';

import { Button } from 'react-bootstrap';
import '../SingleCodingProblem/style.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import { formatMathExpr } from '../../utils/utils';

export function SingleCodingProblem() {
  const { problemId } = useParams();
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [tags, setTags] = useState<Array<string>>([]);

  const problemTags = useSelector(
    (state: RootState) => state.codingProblemList.problemTags
  );

  useEffect(() => {
    const url = 'http://localhost:8080/api/codingproblem/problem/' + problemId;
    fetch(url)
      .then(res => res.json())
      .then(result => {
        const problem: CodingProblem = result.data;
        setProblem(problem);
        let lst: Array<string> = [];
        problem.tags.forEach(item => {
          for (let i = 0; i < problemTags.length; i++) {
            if (problemTags[i].id == item.tagId) {
              lst.push(problemTags[i].name);
              break;
            }
          }
        });
        setTags(lst);
      });
  }, []);

  return (
    <div className='container'>
      <h2 style={{ borderBottom: '1px solid #dddd', paddingBottom: '10px' }}>
        {problem != null ? problem.title : ''}
      </h2>

      <div style={{ display: 'flex' }}>
        <div style={{ width: '75%', padding: '2%' }}>
          <MathJax>
            {problem == null ? '' : parse(formatMathExpr(problem.description))}
          </MathJax>
        </div>
        <div className='sidebar'>
          <div className='sidebar-item'>
            <Button className='btn-submit'>Submit Solution</Button>
          </div>
          <div className='sidebar-item'>
            <div>
              <Link to='' className='link'>
                All Submission
              </Link>
            </div>
            <div>
              <Link to='' className='link'>
                Best Submission
              </Link>
            </div>
          </div>
          <div className='sidebar-item'>
            <div>
              <span className='bold'>Practice Point:</span>{' '}
              {problem?.practicePoint}
            </div>
            <div>
              <span className='bold'>Time limit:</span> {problem?.timeLimit}s
            </div>
            <div>
              <span className='bold'>Memory Limit:</span> {problem?.memoryLimit}
              MB
            </div>
            <div>
              <span className='bold'>Input:</span> stdin
            </div>
            <div>
              <span className='bold'>Ouput:</span> stdout
            </div>
          </div>
          <div className='sidebar-item'>
            <span className='bold'>Author:</span>
            {problem == null || problem.authors.length == 0
              ? ' admin'
              : problem.authors.map(item => (
                  <div key={item.username}>{item.username}</div>
                ))}
          </div>
          <div className='sidebar-item'>
            <span className='bold'>Problem Type</span>
            <div>
              {tags.map(item => (
                <div>{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
