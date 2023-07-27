import { MathJax } from 'better-react-mathjax';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { formatMathExpr, processText } from '../../utils/utils';
import parse from 'html-react-parser';
import { getMathSet } from '../../state/actions/mathProblemListAction';

export const SingleMathSet = () => {
  const { id } = useParams();

  const [problems, setProblems] = useState([]);

  useEffect(() => {
    if (id) {
      getMathSet(id).then(result => {
        if (result.successed) {
          setProblems(result.data.problemSet.problems);
        }
      });
    }
  }, [id]);
  return (
    <div className='container'>
      <div className='contain-all'>
        <div className='problem-list'>
          <Table style={{ border: '1px solid #DDD' }}>
            <thead className='filter-header'>
              <tr>
                <th>Title</th>
                <th>Problem</th>
                <th>Difficulty</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((item: any) => (
                <tr key={item.problem.id}>
                  <td>
                    <Link
                      style={{ fontWeight: 'bold', color: 'black' }}
                      to={'/mathproblem/' + item.problem.id}
                    >
                      {item.problem.title}
                    </Link>
                  </td>
                  <td>
                    <MathJax>
                      {parse(
                        formatMathExpr(processText(item.problem.description))
                      )}
                    </MathJax>
                  </td>

                  <td>{item.problem.difficulty}</td>
                  <td>Admin</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div style={{ height: '450px' }} />
        </div>
      </div>
    </div>
  );
};
