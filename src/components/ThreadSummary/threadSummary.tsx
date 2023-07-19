import DropDownMenu from './ThreeDotMenu';
import { BiCommentDetail, BiLike, BiShare } from 'react-icons/bi';
import parse from 'html-react-parser';
import { getAvatarLink } from '../../utils/utils';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { likeThreadInList } from '../../state/actions/threadListAction';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { setShareResource, toggleFriendsModal } from '../../state/reducers/chatReducer';
import { getFixedUsername, getUsernameFromStorage } from '../../utils/getUser';


interface ThreadItemProps {
  threadData: Thread;
}

export const ThreadSummary = ({ threadData }: ThreadItemProps) => {
  // id, author(username) + avatar username: + summary , created date , title
  
  const dispatch: Dispatch<any> = useDispatch();
  const myUsername = getUsernameFromStorage();  

  const handleShareClick = ()=>{
    const shareResource = {
      id: threadData.id, type: 'thread'
    }
    
    dispatch(setShareResource({shareResource}));

    dispatch(toggleFriendsModal({}));
    
  }
  const handleLike = () => {
    dispatch(likeThreadInList(threadData.id, myUsername ? myUsername : undefined));
  };

  return (
    <div className='thread-item'>
      <div className='space-between'>
        <div className='d-flex' style={{alignItems:'center'}}>
          <img
            src={getAvatarLink(threadData.author.username)}
            className='avatar-icon'
          />
          <div style={{ padding: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>
              {getFixedUsername(threadData.author.username)}
            </div>
            <div>{new Date(threadData.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <div>
          <DropDownMenu />
        </div>
      </div>
      <div className='title'>
        <Link to={'/thread/' + threadData.id} className='title-link'>
          {threadData.title}
        </Link>
      </div>
      <div id='summary-content'>
        <MathJaxContext>
          <MathJax>{parse(threadData.content)}</MathJax>
        </MathJaxContext>
      </div>

      <div className='space-between'>
        <div className='tag-thread-list'>
          {threadData.tags.map(item => (
            <div className='tag-thread-item' key={item}>
              {item}
            </div>
          ))}
        </div>
        <div className='d-flex'>
          <div className='interact-item'>
            <BiShare size={22} onClick = {handleShareClick}/>
            
          </div>
          <div className='interact-item'>
            <BiCommentDetail size={22} />
            {threadData.totalComments}
          </div>
          <div className='interact-item'>
            <BiLike
              size={22}
              color={threadData.isLike ? 'blue' : ''}
              onClick={handleLike}
            />
            <span style={{ color: threadData.isLike ? 'blue' : '' }}>
              {threadData.likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
