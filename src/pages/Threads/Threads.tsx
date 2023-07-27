import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { SearchThreadBox } from '../../components/SearchThreadBox/SearchThreadBox';
import ModalWritePost from '../../components/ThreadModal/modalWritePost';
import { ThreadSideBar } from '../../components/ThreadSideBar/ThreadSideBar';
import { ThreadSummaryList } from '../../components/ThreadSummary/threadSummaryList';
import { ThreadTypeBar } from '../../components/ThreadTypeBar/ThreadTypeBar';
import { RootState } from '../../state';
import { postThread } from '../../state/actions/threadAction';
import { fetchCategoriesAndTags } from '../../state/actions/threadBaseAction';
import { fetchThreads } from '../../state/actions/threadListAction';
import { getUsernameFromStorage } from '../../utils/getUser';
import './Threads.css';

const Threads = () => {
  const navigate = useNavigate();
  const myUsername = getUsernameFromStorage();
  const location = useLocation();
  const dispatch: Dispatch<any> = useDispatch();
  const [params] = useSearchParams();
  const state: ThreadListState = useSelector((state: RootState) => state.threadList);
  const threadCategories = useSelector(
    (state: RootState) => state.threadBase.categories
  );

  useEffect(() => {
    if (threadCategories.length == 0) dispatch(fetchCategoriesAndTags());
  }, []);

  useEffect(() => {
    let category = location.pathname.substring(9);
    let categoryId = '0';

    if (threadCategories) {
      for (let i = 0; i < threadCategories.length; i++) {
        if (threadCategories[i].title == category) {
          categoryId = threadCategories[i].id.toString();
          break;
        }
      }
    }

    let type = params.get('type');
    type = type ? type : 'latest';
    //const page = Number(params.get('page') ? params.get('page') : '1');
    const page = params.get('page')?Number(params.get('page')):state.page>0?state.page:1;
    if (
      state.category !== category ||
      state.type !== type ||
      state.page !== page
    ) {
      dispatch(
        fetchThreads(
          category,
          categoryId,
          type,
          page,
          myUsername ? myUsername : undefined
        )
      );
    }
  }, [location, threadCategories]);

  useEffect(() => {
    if (myUsername)
      dispatch(
        fetchThreads(
          state.category,
          state.categoryId,
          state.type,
          state.page,
          myUsername ? myUsername : undefined
        )
      );
  }, [myUsername]);

  const handleSubmitThread = (params: CreateThreadParam) => {
    postThread(params);
  };

  return (
    <div id='discuss-page'>
      <div className='container'>
        <div>
          <br />
          <div className='d-flex' style={{ justifyContent: 'center' }}>
            <div style={{ marginTop: '10px' }}>
              <ModalWritePost
                handleSubmitThread={handleSubmitThread}
                type='thread'
              />
            </div>
            <div>
              <SearchThreadBox />
            </div>
          </div>

          <div className='space-between'>
            <ThreadTypeBar />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {state.itemPerPage > 0 ? (
              <PaginationControl
                page={state.page}
                between={4}
                total={state.totalThreads}
                limit={state.itemPerPage}
                changePage={page => {
                  navigate(
                    '/threads/' +
                      state.category +
                      '?type=' +
                      state.type +
                      '&page=' +
                      page
                  );
                }}
                ellipsis={1}
              />
            ) : (
              ''
            )}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        ></div>
        <div className='d-flex'>
          <div className='thread-list'>
            <ThreadSummaryList />
            <div style={{ display: 'flex', justifyContent: 'left' }}>
              {state.itemPerPage > 0 ? (
                <PaginationControl
                  page={state.page}
                  between={4}
                  total={state.totalThreads}
                  limit={state.itemPerPage}
                  changePage={page => {
                    navigate(
                      '/threads/' +
                        state.category +
                        '?type=' +
                        state.type +
                        '&page=' +
                        page
                    );
                  }}
                  ellipsis={1}
                />
              ) : (
                ''
              )}
            </div>
          </div>

          <div style={{ width: '25%' }}>
            <ThreadSideBar />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Threads;
