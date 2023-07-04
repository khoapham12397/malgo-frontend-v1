import { Dispatch } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CodingProblemFilter } from '../../components/CodingProblemFilter/codingProblemFilter';
import {
  fetchCProblems,
  fetchInit
} from '../../state/actions/codingProblemListAction';
import Table from 'react-bootstrap/Table';
import { RootState } from '../../state';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useNavigate } from 'react-router';
//import NavScrollExample from "../../components/BaseHeader/commonHeader";
import { Link } from 'react-router-dom';

const CodingProblems = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const navigate = useNavigate();
  const problems = useSelector(
    (state: RootState) => state.codingProblemList.problems
  );
  const filter = useSelector(
    (state: RootState) => state.codingProblemList.filter
  );

  useEffect(() => {
    //dispatch(fetchCpCategoriesAndTags());
    fetchInit(dispatch);
  }, []);
  const handleChangePage = (page: number) => {
    const params: GetProblemsParam = {
      category: filter.category,
      startDif: filter.startDif,
      endDif: filter.endDif,
      page: page,
      q: filter.q,
      tagList: filter.tags
    };
    dispatch(fetchCProblems(params));
  };
  return (
    <div>
      <div className='container'>
        <div style={{ display: 'flex', justifyContent: 'left' }}>
          <PaginationControl
            page={filter.page == null ? 1 : filter.page}
            between={4}
            total={filter.total == null ? 0 : filter.total}
            limit={20}
            changePage={handleChangePage}
            ellipsis={1}
          />
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{ width: '75%' }}>
            <Table striped bordered hover>
              <thead>
                <tr style={{ backgroundColor: 'dimgray', color: 'white' }}>
                  <th>Problem</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Practice Point</th>
                  <th>Accepted</th>
                  <th>Submission</th>
                </tr>
              </thead>
              <tbody>
                {problems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <Link
                        to={'/codingproblemV2/' + item.id}
                        style={{ textDecoration: 'none' }}
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td>{item.category.name}</td>
                    <td>{item.difficulty}</td>
                    <td>{item.practicePoint}</td>
                    <td>{item.acceptedNumber}</td>
                    <td>{item.submissionNumber}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div style={{ display: 'flex', justifyContent: 'left' }}>
              <PaginationControl
                page={filter.page == null ? 1 : filter.page}
                between={4}
                total={filter.total == null ? 0 : filter.total}
                limit={20}
                changePage={handleChangePage}
                ellipsis={1}
              />
            </div>
          </div>
          <div style={{ width: '23%', paddingLeft: '1%' }}>
            <CodingProblemFilter />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CodingProblems;
