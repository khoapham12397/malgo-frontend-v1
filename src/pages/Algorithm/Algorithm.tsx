import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { CodingProblemFilter } from '../../components/CodingProblemFilter/codingProblemFilter';
import Spinner from '../../components/Spinner/Spinner';
import useLogout from '../../hooks/useLogout';
import useUserAuth from '../../hooks/useUserAuth';
import { RootState } from '../../state';
import {
  fetchCProblems,
  fetchInit
} from '../../state/actions/codingProblemListAction';
import { toast } from 'react-hot-toast';
import { FcAddressBook, FcOk } from 'react-icons/fc';
import { useAuth0 } from '@auth0/auth0-react';

const Algorithm = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userAuthQuery } = useUserAuth();
  const { logoutUser } = useLogout();
  const dispatch: Dispatch<any> = useDispatch();
  const problems = useSelector(
    (state: RootState) => state.codingProblemList.problems
  );
  const filter = useSelector(
    (state: RootState) => state.codingProblemList.filter
  );

  const [searcParams] = useSearchParams();
  const page = searcParams.get('page');
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    //dispatch(fetchCpCategoriesAndTags());

    if (!page) {
      fetchInit(dispatch);
      return;
    }
    const params: GetProblemsParam = {
      category: filter.category,
      startDif: filter.startDif,
      endDif: filter.endDif,
      page: page ? Number(page) : null,
      q: filter.q,
      tagList: filter.tags
    };

    dispatch(fetchCProblems(params));
  }, [page]);
  if (isAuthenticated && userAuthQuery.isLoading) return <Spinner />;

  if (userAuthQuery.isError)
    return <pre>{JSON.stringify(userAuthQuery.error)}</pre>;

  if (userAuthQuery.data?.is_disabled) {
    toast.error('Your account has been disabled');
    logoutUser();
  }

  const handleChangePage = (page: number) => {
    navigate('/algorithm?page=' + page);
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
          <div style={{ width: '80%' }}>
            <Table striped bordered hover>
              <thead>
                <tr style={{ backgroundColor: 'dimgray', color: 'white' }}>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Difficulty</th>
                  <th>
                    <FcOk /> AC
                  </th>
                  <th>
                    <FcAddressBook />
                    SUB
                  </th>
                </tr>
              </thead>
              <tbody>
                {problems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <Link to={'/algorithm/' + item.id} className='link'>
                        {item.id}
                      </Link>
                    </td>
                    <td>
                      <div className='space-between'>
                        <Link to={'/algorithm/' + item.id} className='link'>
                          {item.title}
                        </Link>
                        <div
                          className='d-flex'
                          style={{ justifyContent: 'right' }}
                        >
                          {item.codeforcesTag.map((tag, index) => (
                            <div className='tag' key={tag}>
                              {tag}
                              {index !== item.codeforcesTag.length - 1
                                ? ','
                                : ''}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className='td-item'>{item.difficulty}</td>
                    <td className='td-item'>{item.acceptedNumber}</td>
                    <td className='td-item'>{item.submissionNumber}</td>
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
          <div style={{ paddingLeft: '1%' }}>
            <CodingProblemFilter />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Algorithm;
