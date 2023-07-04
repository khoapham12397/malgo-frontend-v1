import { Dispatch } from '@reduxjs/toolkit';
import { useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { BiLink, BiStar } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ThreadItem } from '../../components/ThreadItem/threadItem';
import ModalWritePost from '../../components/ThreadModal/modalWritePost';
import { UserContext } from '../../contexts/UserContext';
import { RootState } from '../../state';
import { postThread , fetchThread} from '../../state/actions/threadAction';

const SingleThread = () => {
  const { user } = useContext(UserContext);
  const threadData = useSelector((state: RootState) => state.thread.threadData);
  const dispatch: Dispatch<any> = useDispatch();
  const location = useLocation();
  const handleSubmitThread = (params: CreateThreadParam) =>{
    postThread(params);
  }
  useEffect(() => {
    const threadId = location.pathname.substring(8);

    if (threadData && threadData.id === threadId) {
      //console.log("da co state nay");
      return;
    }

    const username = user ? user.username : undefined;
    dispatch(fetchThread(threadId, username));
  }, [location]);
  useEffect(() => {
    const username = user ? user.username : undefined;
    const threadId = location.pathname.substring(8);

    dispatch(fetchThread(threadId, username));
  }, [user]);
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
          <div className='header-item'>
            <ModalWritePost handleSubmitThread={handleSubmitThread}/>
          </div>
        </div>
        <div className='body-page'>
          <div className='thread-list'>
            <div className='d-flex'>
              <div className='tag'>Latest</div>
              <div className='tag'>Top</div>
              <div className='tag'>Hot</div>
              <div className='tag'>Closed</div>
            </div>
            <div></div>
            {threadData ? (
              threadData.id ? (
                <ThreadItem threadData={threadData} />
              ) : (
                ''
              )
            ) : (
              ''
            )}
            <div></div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button>More</Button>
            </div>
          </div>

          <div style={{ width: '22%' }}>
            <br />
            <br />
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
      <div id='footer'></div>
    </div>
  );
};
export default SingleThread;
