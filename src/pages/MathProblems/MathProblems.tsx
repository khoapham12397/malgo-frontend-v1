import { Dispatch } from '@reduxjs/toolkit';
import { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import { MathProblemFilter } from '../../components/MathProblemFilter/MathProblemFilter';
import CreateMathProblemModal from '../../components/MathProblemModal/CreateMathProblemModal';
import { RootState } from '../../state';
import {
  fetchInit,
  fetchMathProblems,
  getMathProblemSets
} from '../../state/actions/mathProblemListAction';
import './MathProblems.css';
import parse from 'html-react-parser';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { formatMathExpr, processText } from '../../utils/utils';
import { getFixedUsername, getUsernameFromStorage } from '../../utils/getUser';

const MathProblems = () => {
  const dispatch: Dispatch<any> = useDispatch();

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [problemSetList, setProblemSetList] = useState<any>(null);

  const location = useLocation();

  const categories = useSelector(
    (state: RootState) => state.mathProblemList.problemCategories
  );

  const problems = useSelector(
    (state: RootState) => state.mathProblemList.problems
  );
  const filter = useSelector(
    (state: RootState) => state.mathProblemList.filter
  );
  const myUsername = getUsernameFromStorage();
  useEffect(() => {
    
    if(!problemSetList) {
      getMathProblemSets()
      .then(result => {
        if (result.successed) {
          setProblemSetList(result.data.problemSetList);
        } else setProblemSetList([]);
      }); 
    }

    if (categories.length > 0) {
      const endDiff =
        params.get('endDiff') == null || params.get('endDiff') == 'null'
          ? null
          : 400;
      const param: GetProblemsParam = {
        category:
          params.get('category') == 'null' ? null : params.get('category'),
        endDif: endDiff,
        startDif:
          params.get('startDiff') == 'null'
            ? null
            : Number(params.get('startDiff')),
        q: params.get('q') == 'null' ? null : params.get('q'),
        tagList: params.getAll('tag'),
        page: params.get('page') ? Number(params.get('page')) : 1
      };
      dispatch(fetchMathProblems(param));
    } else {
      const page = params.get('page') ? Number(params.get('page')) : 1;
      fetchInit(dispatch, page);
    }
  }, [location]);

  const handleChangePage = (page: number) => {
    let link =
      '?category=' +
      filter.category +
      '&startDiff=' +
      filter.startDif +
      '&endDiff=' +
      filter.endDif +
      '&q=' +
      filter.q +
      '&page=' +
      page;
    filter.tags.forEach((item: any) => {
      link += '&tag=' + item;
    });

    navigate('/math' + link);
  };
  

  return (
    <>
      <div className='container'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px'
          }}
        >
          <CreateMathProblemModal />
          <div>
            {myUsername ? (
              <div>Wellcome {getFixedUsername(myUsername)}</div>
            ):'' 
            }
          </div>
        </div>
        {filter.total ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'left',
              marginTop: '10px'
            }}
          >
            <PaginationControl
              page={
                params.get('page') == 'null' ? 1 : Number(params.get('page'))
              }
              between={4}
              total={filter.total == null ? 0 : filter.total}
              limit={filter.itemPerPage}
              changePage={handleChangePage}
              ellipsis={1}
            />
          </div>
        ) : (
          ''
        )}
        <div className='contain-all'>
          <div className='problem-list'>
            <Table style={{ border: '1px solid #DDD' }}>
              <thead className='filter-header'>
                <tr>
                  <th>Title</th>
                  <th>Problem</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Author</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((item: MathProbSummary) => (
                  <tr key = {item.id}>
                    <td>
                      <Link
                        style={{ fontWeight: 'bold', color: 'black' }}
                        to={'/math/' + item.id}
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td>
                      <MathJaxContext>
                        <MathJax dynamic>
                          {parse(formatMathExpr(processText(item.description)))}
                        </MathJax>
                      </MathJaxContext>
                    </td>
                    <td>{item.category.name}</td>
                    <td>{item.difficulty}</td>
                    <td>Admin</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div style={{ display: 'flex', justifyContent: 'left' }}>
              {filter.total ? (
                <PaginationControl
                  page={
                    params.get('page') == 'null'
                      ? 1
                      : Number(params.get('page'))
                  }
                  between={4}
                  total={filter.total == null ? 0 : filter.total}
                  limit={filter.itemPerPage}
                  changePage={handleChangePage}
                  ellipsis={1}
                />
              ) : (
                ''
              )}
            </div>
          </div>
          <div style={{ paddingLeft: '1%' }}>
            <MathProblemFilter page={0} />
            <br />
            <div style={{ border: '1px solid #ddd' }}>
              <div className='filter-header'>Problem Set</div>
              <ul>
                {problemSetList
                  ? problemSetList.map((item: any) => (
                      <li>
                        <Link to={'/mathset/' + item.id}>{item.title}</Link>
                      </li>
                    ))
                  : ''}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MathProblems;
