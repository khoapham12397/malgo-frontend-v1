import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../../config/axios2';
import './CodingProblemSolTab.css';

type Props = {
  problem: CodingProblem | null;
};
export const CodingProblemSolTab = ({ problem }: Props) => {
  const [relatedProblems, setRelatedProblems] = useState<any>(null);

  useEffect(() => {
    if (!problem) return;
    const postData = {
      codeforcesTags: problem.codeforcesTag.map(item => item.codeforcesTagId),
      difficulty: problem.difficulty
    };
    const url = '/codingproblem/related';

    api
      .post(url, postData)
      .then(result => {
        if (result.status === 200) {
          const lst = result.data.data.problems.sort(
            (x: any, y: any) => x.difficulty - y.difficulty
          );
          setRelatedProblems(lst);
        }
      })
      .catch(error => {
        toast.error(error);
      });
  }, [problem]);

  if (problem)
    return (
      <div className='container-sol-tab'>
        <div className='detail-box'>
          <h4 className='header-sol-tab'>Problem Detail</h4>
          <Table className='table-striped table-bordered'>
            <tbody>
              <tr>
                <th>Difficulty</th>
                <td>{problem.difficulty}</td>
              </tr>
              <tr>
                <th>Practice Point</th>
                <td>{problem.practicePoint}</td>
              </tr>
              <tr>
                <th>Contest</th>
                <td>{problem.contest ? problem.contest.id : 'No Contest'}</td>
              </tr>
              <tr>
                <th>Tags</th>
                <td className='tag-lst'>
                  {problem.codeforcesTag.map(item => (
                    <div className='codeforces-tag'>{item.codeforcesTagId}</div>
                  ))}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className='detail-box'>
          <h4 className='header-sol-tab'>Related Problem</h4>
          {relatedProblems ? (
            <Table className='table-bordered'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Problem Title</th>
                  <th>Difficulty</th>
                  <th>Tags</th>
                </tr>
              </thead>
              <tbody>
                {relatedProblems.map((item: any) => (
                  <tr>
                    <td>
                      <Link className='link' to={'/algorithm/' + item.id}>
                        {item.id}
                      </Link>
                    </td>
                    <td>
                      <Link className='link' to={'/algorithm/' + item.id}>
                        {item.title}
                      </Link>
                    </td>
                    <td>{item.difficulty}</td>
                    <td>
                      {item.codeforcesTag.map((tag: any) => (
                        <div className='codeforces-tag'>
                          {tag.codeforcesTagId}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  else return <></>;
};
