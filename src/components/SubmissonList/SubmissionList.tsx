import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { useInterval } from 'usehooks-ts';
import api from '../../config/axios2';
import { languages } from '../../pages/SingleCodingProblem/Constants/LanguageOptions';
import { getFixedUsername, getUsernameFromStorage } from '../../utils/getUser';
import { calColor } from '../../utils/utils';
import { judgeStatus } from '../SourceCodeModal/SourceCodeModal';
import './SubmissionList.css';

type Props = {
  problemId: string | undefined;
  problemTitle: string | undefined;
  cnt: number;
};

export const SubmissionList = ({ problemId, problemTitle, cnt }: Props) => {
  const [onlyMe, setOnlyMe] = useState(true);
  const [submissions, setSubmissions] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [ctlPagination, setCtlPagination] = useState<any>(null);
  const [showDetailArr, setShowDetailArr] = useState<any>(null);

  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    let url = `/submission/problem/${problemId}/${page}`;
    //console.log(`get submissions of problem ${problemId}`);
    if (onlyMe) url += `?username=${getUsernameFromStorage()}`;
    api
      .get(url)
      .then(result => {
        if (result.status === 200) {
          setSubmissions(result.data.data.submissions);
          const ctl = {
            total: result.data.data.total,
            itemPerPage: result.data.data.itemPerPage
          };
          setCtlPagination(ctl);
          setShowDetailArr(
            result.data.data.submissions.map((item: any) => false)
          );
          setIsPolling(true);
        }
      })
      .catch(error => {});
  }, [onlyMe, problemId, page, cnt]);

  const hanldeToggleShowDetail = (index: number) => {
    //console.log('toggle '+index);
    const lst = [...showDetailArr];

    lst[index] = !lst[index];
    setShowDetailArr(lst);
  };

  const pollingStatus = async () => {
    let first = true;
    let strQuery = '';
    console.log('running polling function');
    submissions.forEach((item: any) => {
      if (item.result == 'PENDING' || item.result === 'JUDGING') {
        if (!first) {
          strQuery += ',' + item.id;
        } else {
          first = false;
          strQuery += item.id;
        }
      }
    });
    if (strQuery.length > 0) {
      const url = '/submission/status?submissionId=' + strQuery;
      const result = await api.get(url);
      const lst = JSON.parse(JSON.stringify(submissions));

      if (result.status === 200) {
        for (let j = 0; j < result.data.data.statuses.length; j++) {
          const item = result.data.data.statuses[j];
          //console.log(item);

          for (let i = 0; i < lst.length; i++) {
            //console.log(lst[i].id);
            //console.log(item.id);
            if (lst[i].id == item.id) {
              lst[i].status = item.status;
              lst[i].result = item.result;
              break;
            }
          }
        }
        setSubmissions(lst);
      }
    } else {
      console.log('Turn off polling ');
      setIsPolling(false);
    }
  };

  useInterval(
    async () => {
      await pollingStatus();
    },
    isPolling ? 2000 : null
  );
  const handleChangePage = (page: number) => {
    setPage(page);
  };
  return (
    <div>
      {submissions ? (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'left',
              marginLeft: '10px'
            }}
          >
            <PaginationControl
              page={Number(page)}
              between={4}
              total={ctlPagination ? ctlPagination.total : 10}
              limit={ctlPagination ? ctlPagination.itemPerPage : 4}
              changePage={handleChangePage}
              ellipsis={1}
            />
          </div>
          <div className='submission-list'>
            {submissions.map((item: SubmissionData, index: number) => (
              <div
                className={
                  'submission-item ' +
                  (item.result === 'ACCEPTED' ? 'accepted-row' : 'normal-row')
                }
              >
                <div className='submission-row'>
                  <span className='info-item time'>
                    {new Date(item.createTime).toLocaleString()}
                  </span>
                  <div className='info-item user-acc'>
                    {getFixedUsername(item.username)}
                  </div>

                  <div className='info-item'>
                    <span className={calColor(item.result)}>{item.result}</span>
                  </div>
                  <div
                    className='info-item'
                    onClick={() => hanldeToggleShowDetail(index)}
                  >
                    <Button>
                      {showDetailArr[index] ? (
                        <BsFillCaretDownFill />
                      ) : (
                        <BsFillCaretUpFill />
                      )}{' '}
                      Detail
                    </Button>
                  </div>
                </div>
                <div
                  className={showDetailArr[index] ? 'show' : 'hidden'}
                  style={{ fontSize: '18px' }}
                >
                  <SyntaxHighlighter
                    language={
                      languages.filter(x => Number(item.language) === x.id)[0]
                        .value
                    }
                  >
                    {atob(item.code)}
                  </SyntaxHighlighter>
                  <ul>
                    {item.status.map((tc, index) => (
                      <li>
                        {' '}
                        <span className='testcase-item'>
                          Testcase {index + 1}:
                        </span>{' '}
                        <span className={calColor(judgeStatus[tc.id])}>
                          {tc.id > 7 ? 'RUNTIME_ERROR' : judgeStatus[tc.id]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'left',
              marginLeft: '10px'
            }}
          >
            <PaginationControl
              page={Number(page)}
              between={4}
              total={ctlPagination ? ctlPagination.total : 10}
              limit={ctlPagination ? ctlPagination.itemPerPage : 4}
              changePage={handleChangePage}
              ellipsis={1}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
