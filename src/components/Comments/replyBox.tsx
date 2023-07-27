import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state';
import { BiSend, BiShare } from 'react-icons/bi';

import {
  postComment,
  PostCommentParam
} from '../../state/actions/threadAction';
import { processText, formatMathExpr, getAvatarLink } from '../../utils/utils';
import SmallLoader from '../SmallLoader/SmallLoader';
import { getUsernameFromStorage } from '../../utils/getUser';

type Props = {
  parentId: string;
  username: string;
  rootId: string;
};

export const ReplyBox = ({ parentId, username, rootId }: Props) => {
  const textArea = useRef<HTMLTextAreaElement>(null);
  const myUsername = getUsernameFromStorage();

  const box = useRef<HTMLDivElement>(null);
  const dispatch: Dispatch<any> = useDispatch();
  const threadId = useSelector(
    (state: RootState) => state.thread.threadData.id
  );
  const pendingReplyCommentID = useSelector(
    (state: RootState) => state.thread.pendingReplyCommentId
  );

  useEffect(() => {
    box.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
    textArea.current?.focus();
  }, [parentId]);

  const handlePost = () => {
    if (!textArea.current) return;

    const content = formatMathExpr(processText(textArea.current.value));
    //dispatch(setPendingReplyComment({commentId: parentId}));

    dispatch(
      postComment({
        parentCreator: username,
        content: content,
        parentId: parentId,
        rootId: rootId,
        threadId: threadId,
        username: myUsername ? myUsername : undefined
      } as PostCommentParam)
    );
  };

  return (
    <div className='d-flex' ref={box}>
      <div>
        <img src={getAvatarLink(username)} className='avatar-icon' />
      </div>
      <div style={{ paddingLeft: '10px', width: '100%' }}>
        <div>
          Reply:{' '}
          <span style={{ color: 'violet' }}>{username.split('@')[0]}</span>{' '}
          <BiShare />
          <textarea
            className='form-control'
            autoFocus
            rows={2}
            style={{ width: '100%' }}
            ref={textArea}
          />
          <Button className='reply-btn' onClick={handlePost}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {pendingReplyCommentID == parentId ? (
                <SmallLoader />
              ) : (
                <BiSend size={22} />
              )}{' '}
              Reply
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ReplyBox;
