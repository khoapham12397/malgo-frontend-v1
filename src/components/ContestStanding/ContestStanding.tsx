import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { toast } from 'react-hot-toast';
import api from '../../config/axios2';
import { getFixedUsername } from '../../utils/getUser';
import Spinner from '../Spinner/Spinner';
import './ContestStanding.css';

type Props = {
  contestId: string | undefined;
  problems: Array<any>;
};

const itemPerPage = 50;

export const ContestStanding = ({ contestId, problems }: Props) => {
  const [page, setPage] = useState(1);
  const [ctlPagination, setCtlPagination] = useState<any>(null);

  const [contestStanding, setContestStanding] = useState<any>(null);

  useEffect(() => {
    if (!contestId) return;
    const start = (page - 1) * itemPerPage,
      end = page * itemPerPage;
    //console.log("loading contest standing");
    const url = `/contest/standing/${contestId}?start=${start}&end=${end}`;
    api
      .get(url)
      .then(result => {
        const ctl = {
          total: result.data.data.total,
          itemPerPage: itemPerPage
        };
        setCtlPagination(ctl);
        const standing = result.data.data.standing;

        //console.log(standing);

        const fixStanding = standing.map((item: any) => {
          const scores = problems.map(probId => {
            let row = {
              score: 0,
              time: 0,
              failedCnt: 0
            };
            const lst = item.scores.filter((x: any) => x.problemId === probId);

            if (lst.length > 0) {
              row.failedCnt = lst[0].failedCnt;
              row.time = lst[0].time;
              row.score = lst[0].score;
            }
            return row;
          });
          return {
            totalScore: item.totalScore,
            username: item.username,
            scores: scores
          };
        });
        //console.log(fixStanding);
        setContestStanding(fixStanding);
      })

      .catch(error => {
        toast.error(error);
      });
  }, [contestId]);

  const handleChangePage = (page: number) => {
    setPage(page);
  };
  if (contestStanding && ctlPagination)
    return (
      <div>
        <h3 className='task-header'>Standing</h3>
        {contestStanding && problems && ctlPagination ? (
          <div>
            <PaginationControl
              page={Number(page)}
              between={4}
              total={ctlPagination ? ctlPagination.total : 10}
              limit={ctlPagination ? ctlPagination.itemPerPage : 4}
              changePage={handleChangePage}
              ellipsis={1}
            />
            <Table className='table-striped table-bordered'>
              <thead>
                <tr>
                  <th className='td-item'>Rank</th>
                  <th className='td-item'>Username</th>
                  <th className='td-item'>Score</th>
                  {problems.map((item: string) => (
                    <th className='td-item'>{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contestStanding.map((item: any, index: number) => (
                  <tr>
                    <td className=''>{(page - 1) * itemPerPage + index + 1}</td>
                    <td className='td-name'>
                      <span className='red'>
                        {getFixedUsername(item.username)}
                      </span>
                    </td>
                    <td className='td-item'>
                      <span className='blue'>{item.totalScore}</span>
                    </td>
                    {item.scores.map((x: any) => (
                      <td className='td-item'>
                        <div className='green'>
                          {x.score > 0 ? x.score : ''}
                        </div>
                        <div>
                          <span className='gray'>
                            {x.time > 0 ? x.time : ''}
                          </span>
                          <span className='red'>
                            {x.failedCnt > 0 ? x.failedCnt : ''}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
            <PaginationControl
              page={Number(page)}
              between={4}
              total={ctlPagination ? ctlPagination.total : 10}
              limit={ctlPagination ? ctlPagination.itemPerPage : 4}
              changePage={handleChangePage}
              ellipsis={1}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  else return <div/>;
};
