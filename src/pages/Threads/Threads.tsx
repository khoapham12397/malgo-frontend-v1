import { Dispatch } from '@reduxjs/toolkit';
import { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { Root } from 'react-dom/client';
import { toast } from 'react-hot-toast';
import { BiLink, BiStar } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { FriendListModal } from '../../components/FriendListModal/FriendListModal';
import { LoginPanel } from '../../components/TestLogin/LoginPanel';
import ModalWritePost from '../../components/ThreadModal/modalWritePost';
import { ThreadSummary } from '../../components/ThreadSummary/threadSummary';
import { UserContext } from '../../contexts/UserContext';
import { RootState } from '../../state';
import { postShareResource } from '../../state/actions/chatAction';
import { postThread } from '../../state/actions/threadAction';
import { fetchCategoriesAndTags } from '../../state/actions/threadBaseAction';
import { fetchThreads } from '../../state/actions/threadListAction';

const Threads = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const location = useLocation();
  const dispatch: Dispatch<any> = useDispatch();
  const [params] = useSearchParams();
  const state = useSelector((state: RootState) => state.threadList);
  const shareResource = useSelector((state: RootState)=> state.chat.shareResource);

  const [showFriendListMd, setShowFriendListMd] = useState(false);

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
    const page = Number(params.get('page') ? params.get('page') : '1');

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
          user ? user.username : undefined
        )
      );
    }
  }, [location, threadCategories]);

  useEffect(() => {
    if (user)
      dispatch(
        fetchThreads(
          state.category,
          state.categoryId,
          state.type,
          state.page,
          user ? user.username : undefined
        )
      );
  }, [user]);

  const handleSubmitThread = (params: CreateThreadParam)=>{
    postThread(params);
  }
  const handleShare = (username: string)=>{
    console.log("vao share")
    if(user && shareResource) {
      console.log("share ne");
      const params: ShareResourceParams = {
        id: shareResource.id,
        type: shareResource.type,
        recieverId: username,
        senderId: user.username,
        resourceLink: `thread/${shareResource.id}`
      }
      postShareResource(params);
    }
  } 

  return (
    <div id='discuss-page'>
      <div className='container'>
        <div className='header-bar'>
          <div className='header-item'>All</div>
          <div className='header-item'>Combinatorics</div>
          <div className='header-item'>Number Theory</div>
          <div className='header-item'>Dynamic Programming</div>
          <div className='header-item'>Data structure</div>
          <div className='header-item'>Geometry</div>
          <div className='header-item'></div>
        </div>
        <div className='space-between'>
          <div>
            <ModalWritePost handleSubmitThread={handleSubmitThread} />
          </div>

          <FriendListModal handleChooseItem={handleShare} exlusiveList ={[]}/>
          <div className='d-flex'>
            <div
              className={state.type == 'latest' ? 'tag-chosen' : 'tag'}
              onClick={e => {
                navigate('/threads/' + state.category + '?type=latest');
              }}
            >
              Latest
            </div>
            <div
              className={state.type == 'top' ? 'tag-chosen' : 'tag'}
              onClick={e => {
                navigate('/threads/' + state.category + '?type=top');
              }}
            >
              Top
            </div>
            <div
              className={state.type == 'oldest' ? 'tag-chosen' : 'tag'}
              onClick={e => {
                navigate('/threads/' + state.category + '?type=oldest');
              }}
            >
              Oldest
            </div>
          </div>
          <div className='d-flex' style={{alignItems : 'center'}}>
            
            {user ? (
              <div>{user.username.split('@')[0]}</div>
            ) : ""} 
            

          </div>
        </div>
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
        <div className='d-flex'>
          <div className='thread-list'>
            {state.threadList.map(item => (
              <ThreadSummary threadData={item} key={item.id} />
            ))}
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
            <div className='box-side-bar'>
              <div
                className='d-flex'
                style={{ borderBottom: '0.5px solid #ddd', padding: '10px' }}
              >
                <BiStar size={25} />
                <div style={{ fontSize: '18px', paddingLeft: '15px' }}>
                  Topics
                </div>
              </div>
              <ul style={{ padding: '0px' }}>
                <li className='category-item'>
                  <img
                    className='category-icon'
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSRFk2hweVv3xQk_bqeX1Lu32uNF-UoXEABQ&usqp=CAU'
                  />{' '}
                  <span>Graph Theory</span>
                </li>
                <li className='category-item'>
                  <img
                    className='category-icon'
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNWuCJ2KEs0tRMCSIKxGr6bRpZgktOWS7mvA&usqp=CAU'
                  />{' '}
                  Combinatorics
                </li>
                <li className='category-item'>
                  <img
                    className='category-icon'
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBksnoLXg7skp1nLsUOyikXT6Um-k1kmxFAQ&usqp=CAU'
                  />{' '}
                  Euclidean Geometry
                </li>
                <li className='category-item'>
                  <img
                    className='category-icon'
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8BShlUB_18D5U9xKyb759sVxXzzguV3evGQ&usqp=CAU'
                  />{' '}
                  Number theory
                </li>
                <li className='category-item'>
                  <img
                    className='category-icon'
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoOtZ1RXfCrSji7PJiBlZg6KSFrV1AUGIk9Q&usqp=CAU'
                  />{' '}
                  Algebra
                </li>
                <li className='category-item'>
                  <img
                    className='category-icon'
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyVC5mnwliyPPgTOQ95hKwobdIUScrtNoIQQ&usqp=CAU'
                  />{' '}
                  Algorithm
                </li>
              </ul>
            </div>
            <div className='box-side-bar'>
              <div
                className='d-flex'
                style={{ borderBottom: '0.5px solid #ddd', padding: '10px' }}
              >
                <BiStar size={25} />
                <div style={{ fontSize: '18px', paddingLeft: '15px' }}>
                  Must Read Post
                </div>
              </div>
              <ul>
                <li>Vi du thu nhat</li>
                <li>Vi du thu nhat</li>
                <li>Vi du thu nhat</li>
              </ul>
              <div
                className='d-flex'
                style={{ borderBottom: '0.5px solid #ddd', padding: '10px' }}
              >
                <BiLink size={25} />
                <div style={{ fontSize: '18px', paddingLeft: '15px' }}>
                  Must Read Post
                </div>
              </div>
              <ul>
                <li>Vi du thu nhat</li>
                <li>Vi du thu nhat</li>
                <li>Vi du thu nhat</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Threads;
