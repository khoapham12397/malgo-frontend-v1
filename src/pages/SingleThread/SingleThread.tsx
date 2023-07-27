import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BiLink, BiStar } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import { ThreadItem } from '../../components/ThreadItem/threadItem';
import { ThreadSideBar } from '../../components/ThreadSideBar/ThreadSideBar';
import { RootState } from '../../state';
import { fetchThread } from '../../state/actions/threadAction';
import { getUsernameFromStorage } from '../../utils/getUser';

const SingleThread = () => {
  const threadData = useSelector((state: RootState) => state.thread.threadData);
  const dispatch: Dispatch<any> = useDispatch();
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentHeight, setCurrentHeight] = useState(0);
  const username = getUsernameFromStorage();

  useEffect(() => {
    const threadId = location.pathname.substring(8);
    //console.log('fetch thread ve');
    if (threadData && threadData.id === threadId) {
      return;
    }

    const username = getUsernameFromStorage();
    dispatch(fetchThread(threadId, username ? username : undefined));
  }, [location]);

  useEffect(() => {
    const threadId = location.pathname.substring(8);
    dispatch(fetchThread(threadId, username ? username : undefined));
  }, [username]);

  if (threadData && threadData.id)
    return (
      <div id='discuss-page'>
        <div className='container' ref={contentRef}>
          <br />
          <div className='d-flex'>
            <div className='thread-list'>
              <ThreadItem threadData={threadData} />
            </div>

            <div style={{ width: '25%' }}>
              <ThreadSideBar />
            </div>
          </div>
        </div>
        <div style={{ height: currentHeight + 'px' }} />
      </div>
    );
  else return <Spinner />;
};

export default SingleThread;
