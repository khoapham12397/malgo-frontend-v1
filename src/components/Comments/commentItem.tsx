import { Dispatch, useContext, useEffect, useRef } from 'react';
import { FaRegHandPointUp, FaRegHandPointDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state';
import { setFocusComment, setReply } from '../../state/reducers/threadReducer';
import parse from 'html-react-parser';
import { likeComment } from '../../state/actions/threadAction';
import { MathJax } from 'better-react-mathjax';
import SmallLoader from '../SmallLoader/SmallLoader';
import { getAvatarLink } from '../../utils/utils';
import { getFixedUsername, getUsernameFromStorage } from '../../utils/getUser';

type CommentItemProps = {
  commentData: CommentData;
  isFetched: boolean;
};

export const CommentItem = ({ commentData, isFetched }: CommentItemProps) => {
  const dispatch: Dispatch<any> = useDispatch();
  const myUsername = getUsernameFromStorage();

  const cmt = useRef<HTMLDivElement>(null);
  const focusComment = useSelector(
    (state: RootState) => state.thread.focusComment
  );
  const pendingLikeCommentId = useSelector(
    (state: RootState) => state.thread.pendingLikeCommentId
  );
  useEffect(() => {
    if (focusComment == commentData.id && cmt.current != null) {
      cmt.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
      setTimeout(() => dispatch(setFocusComment('')), 1000);
    }
  }, [focusComment]);

  useEffect(() => {
    if (!isFetched) {
      setTimeout(() => {
        if (cmt.current) {
          cmt.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 250);
    }
  }, []);

  // nen lam the nao dung:

  const handleLikeComment = () => {
    dispatch(
      likeComment(
        commentData.id,
        commentData.rootId,
        myUsername ? myUsername : undefined
      )
    );
  };
  return (
    <div ref={cmt}>
      <div className={focusComment == commentData.id ? 'focus-cmt' : 'd-flex'}>
        <div>
          <img
            src={getAvatarLink(commentData.creator.split('@')[0])}
            className='avatar-icon'
          />
        </div>
        <div style={{ paddingLeft: '10px' }}>
          <div style={{ fontWeight: 'bold' }}>
            {commentData.creator.split('@')[0]}
          </div>
          <div>
            {commentData.parent.id !== '' ? (
              <div>
                <span
                  onClick={e => {
                    dispatch(
                      setFocusComment({ commentId: commentData.parent.id })
                    );
                  }}
                  style={{ color: 'blueviolet' }}
                >
                  {getFixedUsername(commentData.parent.author)}{' '}
                </span>
                <MathJax> {parse(commentData.content)}</MathJax>
              </div>
            ) : (
              <div>
                <MathJax>{parse(commentData.content)}</MathJax>
              </div>
            )}
          </div>
          <div className='d-flex'>
            <div
              style={{ marginRight: '10px' }}
              className='interact-item'
              onClick={handleLikeComment}
            >
              {pendingLikeCommentId === commentData.id ? (
                <SmallLoader />
              ) : (
                <FaRegHandPointUp
                  size={18}
                  color={commentData.isLike ? 'blue' : ''}
                />
              )}
              {pendingLikeCommentId === commentData.id ? '' : commentData.likes}
            </div>
            <div className='interact-item'>
              <FaRegHandPointDown size={18} /> 10
            </div>
            <div
              className='interact-item'
              onClick={e =>
                dispatch(
                  setReply({
                    rootCmtId: commentData.rootId,
                    parent: {
                      parentId: commentData.id,
                      username: commentData.creator
                    }
                  })
                )
              }
            >
              Reply
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
