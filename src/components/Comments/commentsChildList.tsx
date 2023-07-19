import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { fetchChildComment } from '../../state/actions/threadAction';
import { getUsernameFromStorage } from '../../utils/getUser';
import { CommentItem } from './commentItem';

type Props = {
  manageChildCmt: ManageChildCmt;
  rootCmtId: string;
};

const CommentChildList = ({ manageChildCmt, rootCmtId }: Props) => {
  const dispatch: Dispatch<any> = useDispatch();
  const myUsername = getUsernameFromStorage();

  return (
    <div>
      <div style={{ marginLeft: '60px' }}>
        {manageChildCmt.childCommentList.map((item: ChildComment, index) => (
          <CommentItem
            key={item.commentData.id}
            commentData={item.commentData}
            isFetched={item.isFetched}
          />
        ))}
        {manageChildCmt.size < manageChildCmt.totalChildCmt ? (
          <div
            className='load-more'
            onClick={e => {
              dispatch(
                fetchChildComment(
                  rootCmtId,
                  manageChildCmt.size,
                  10,
                  myUsername ? myUsername : undefined
                )
              );
            }}
          >
            Load more {manageChildCmt.totalChildCmt - manageChildCmt.size}{' '}
            replies...
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
export default CommentChildList;
