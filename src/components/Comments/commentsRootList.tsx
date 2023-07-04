import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import { CommentItem } from './commentItem';
import CommentChildList from './commentsChildList';
import ReplyBox from './replyBox';

type Props = {
  totalComment: number;
  threadId: string;
};

const CommentRootList = () => {
  const commentList = useSelector(
    (state: RootState) => state.thread.manageRootCmt.rootCommentList
  );

  return (
    <>
      {commentList.map((item, index) => (
        <div
          key={item.commentData.id}
          style={{
            borderBottom: '1px solid #dddddd',
            paddingBottom: '10px',
            paddingTop: '10px'
          }}
        >
          <CommentItem
            commentData={item.commentData}
            isFetched={item.isFetched}
          />
          <CommentChildList
            manageChildCmt={item.manageChildCmt}
            rootCmtId={item.commentData.id}
          />
          {item.reply.active ? (
            <ReplyBox
              key={'reply-' + item.commentData.id}
              parentId={item.reply.replyFor ? item.reply.replyFor.parentId : ''}
              username={item.reply.replyFor ? item.reply.replyFor.username : ''}
              rootId={item.commentData.id}
            />
          ) : (
            ''
          )}
        </div>
      ))}
    </>
  );
};
export default CommentRootList;
