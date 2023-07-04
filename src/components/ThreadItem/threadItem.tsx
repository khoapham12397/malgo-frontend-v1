import { FiEye } from 'react-icons/fi';
import DropDownMenu from '../ThreadSummary/ThreeDotMenu';
import { BiCommentDetail, BiLike } from 'react-icons/bi';
import React, { useContext, useRef, useState } from 'react';
import CommentRootList from '../Comments/commentsRootList';
import { Button } from 'react-bootstrap';
import { processText, formatMathExpr, getAvatarLink } from '../../utils/utils';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { BiSend } from 'react-icons/bi';
import ModalReviewCmt from '../Comments/modalReviewCmt';
import {
  fetchRootComment,
  likeThread,
  postComment,
  PostCommentParam
} from '../../state/actions/threadAction';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import parse from 'html-react-parser';
import { ThreadOptionMenu } from './threadOptionMenu';
import { RootState } from '../../state';
import SmallLoader from '../SmallLoader/SmallLoader';
import { UserContext } from '../../contexts/UserContext';

interface ThreadItemProps {
  threadData: Thread;
}

export const ThreadItem = ({ threadData }: ThreadItemProps) => {
  // id, author(username) + avatar username: + summary , created date , title

  const dispatch: Dispatch<any> = useDispatch();
  const { user } = useContext(UserContext);

  const cmtArea = useRef<HTMLTextAreaElement>(null);
  const pendingLikeThread = useSelector(
    (state: RootState) => state.thread.pendingLikeThread
  );
  const pendingSendComment = useSelector(
    (state: RootState) => state.thread.pendingSendComment
  );

  const [cmt, setCmt] = useState('');
  const [showRvCmt, setShowRvCmt] = useState(false);

  const handleCloseRvModal = (): void => {
    setShowRvCmt(false);
  };

  const handleSendCmt = () => {
    //if(!user) {toast.error("You're not logged in!"); return;}
    const param: PostCommentParam = {
      content: cmt,
      parentId: null,
      threadId: threadData.id,
      rootId: null,
      parentCreator: null,
      username: user ? user.username : undefined
    };

    dispatch(postComment(param));
    setShowRvCmt(false);
    setCmt('');
  };

  const handlePostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const cmt = cmtArea.current?.value;
    if (cmt == null || cmt == undefined) return;

    if (cmt != undefined) setCmt(formatMathExpr(processText(cmt)));
    setShowRvCmt(true);
  };
  const handleLoadRootCmts = () => {
    dispatch(fetchRootComment(threadData.id, user ? user.username : undefined));
  };
  return (
    <div className='thread-item'>
      <ModalReviewCmt
        comment={cmt}
        show={showRvCmt}
        handleClose={handleCloseRvModal}
        handleSendCmt={handleSendCmt}
      />
      <div className='space-between'>
        <div className='d-flex'>
          <img
            src={getAvatarLink(threadData.author.username)}
            className='avatar-icon'
          />
          <div style={{ padding: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>
              {threadData.author.username.split('@')[0]}
            </div>
            <div>{new Date(threadData.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <ThreadOptionMenu threadData={threadData} />
      </div>

      <div className='title'>
        <Link to={'/thread/' + threadData.id}>{threadData.title}</Link>
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
            <FiEye size={22} />
            {threadData.views}
          </div>
          <div className='interact-item'>
            <BiCommentDetail size={22} />
            {threadData.totalComments}
          </div>
          <div className='interact-item'>
            {pendingLikeThread ? (
              <SmallLoader />
            ) : (
              <BiLike
                size={22}
                color={threadData.isLike ? 'blue' : ''}
                onClick={e =>
                  dispatch(
                    likeThread(threadData.id, user ? user.username : undefined)
                  )
                }
              />
            )}
            {pendingLikeThread ? '' : threadData.likes}
          </div>
        </div>
      </div>
      <div>
        <div className='form-group'>
          <textarea
            ref={cmtArea}
            className='form-control'
            rows={3}
            placeholder={'add your comment'}
          />
          <div style={{ display: 'flex', marginTop: '10px' }}>
            <Button onClick={handlePostClick} className='d-flex'>
              {pendingSendComment ? <SmallLoader /> : <BiSend size={22} />} Post
            </Button>
          </div>
        </div>
      </div>
      <div>
        <CommentRootList />
        <div className='load-more' onClick={handleLoadRootCmts}>
          Load more commnents...
        </div>
      </div>
    </div>
  );
};
