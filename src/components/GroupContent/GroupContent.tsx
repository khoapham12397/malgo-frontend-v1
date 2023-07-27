import { Dispatch } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { GROUP_MODE } from '../../pages/ChatPage/ChatPage';
import { RootState } from '../../state';
import {
  createPostGroup,
  loadCurrentPost,
  loadPosts,
  MESSAGE_TYPE
} from '../../state/actions/chatAction';
import { setGroupMode } from '../../state/reducers/chatReducer';
import { getUsernameFromStorage } from '../../utils/getUser';
import { ChatContainer } from '../ChatContainer/ChatContainer';
import { MemberList } from '../MemberList/MemberList';
import { PostSummary } from '../PostSummary/PostSummary';
import ModalWritePost from '../ThreadModal/modalWritePost';

function SearchBar() {
  const currentGroupId = useSelector(
    (state: RootState) => state.chat.currentGroupId
  );
  const myUsername = getUsernameFromStorage();
  const handleSubmitThread = (params: CreateThreadParam) => {
    if (myUsername && currentGroupId) {
      const param: CreatePostGroupParam = {
        authorId: myUsername,
        content: params.content,
        groupId: currentGroupId,
        title: params.title
      };
      createPostGroup(param);
    }
  };

  return (
    <div className='search-bar-chat-page'>
      <div className='search-form-chat-page'>
        <Button className='btn-search'>
          <BiSearch />
        </Button>
        <Form.Control
          type='text'
          placeholder='Search'
          className='search-inp-chat-page'
          aria-label='Search'
        />
      </div>
      <ModalWritePost
        handleSubmitThread={handleSubmitThread}
        type='grouppost'
      />
    </div>
  );
}
export const GroupContent = () => {
  const dispatch: Dispatch<any> = useDispatch();

  const groups = useSelector((state: RootState) => state.chat.groups);
  const currentGroupId = useSelector(
    (state: RootState) => state.chat.currentGroupId
  );
  const groupPosts = useSelector((state: RootState) => state.chat.groupPosts);
  const currentGroupMode = useSelector(
    (state: RootState) => state.chat.currentGroupMode
  );
  const currentPosts = useSelector(
    (state: RootState) => state.chat.currentPosts
  );
  const currentPost = useSelector((state: RootState) => state.chat.currentPost);
  const currentGeneralSessionId = useSelector(
    (state: RootState) => state.chat.currentGeneralSessionId
  );

  const myUsername = getUsernameFromStorage();

  const handleGetPostList = (groupId: string) => {
    if (myUsername) {
      dispatch(loadPosts(groupId, myUsername, 'desc'));
    }
  };
  const handleLoadPost = (post: PostData) => {
    if (myUsername) {
      dispatch(loadCurrentPost(post, myUsername));
      if (currentGroupMode !== GROUP_MODE.POST_SMALL) {
        dispatch(
          setGroupMode({ groupId: currentGroupId, mode: GROUP_MODE.POST_SMALL })
        );
      }
    }
  };
  return (
    <div className='main-content'>
      {currentGroupMode !== GROUP_MODE.GENERAL_CHAT ? (
        <div
          className={
            currentGroupMode === GROUP_MODE.POST_SMALL
              ? 'post-list'
              : 'post-list-large'
          }
        >
          <SearchBar />
          <div>
            {currentPosts.map(post => (
              <div onClick={() => handleLoadPost(post)} key={post.id}>
                <PostSummary
                  postData={post}
                  style={
                    currentGroupMode === GROUP_MODE.POST_SMALL
                      ? 'post-summary'
                      : 'post-summary-large'
                  }
                />
              </div>
            ))}
          </div>
          <div style={{ clear: 'left' }} />
          <div className='btn-more-area'>
            <Button
              className='btn btn-info'
              onClick={() => {
                if (currentGroupId) handleGetPostList(currentGroupId);
              }}
            >
              More Post
            </Button>
          </div>

          <div style={{ height: '100px' }}></div>
        </div>
      ) : (
        ''
      )}
      {currentGroupMode !== GROUP_MODE.POST_LARGE ? (
        <div className='chat-container'>
          <ChatContainer
            sessionId={
              currentGroupMode === GROUP_MODE.GENERAL_CHAT
                ? currentGeneralSessionId
                : currentPost
                ? currentPost.id
                : null
            }
            postData={
              currentGroupMode === GROUP_MODE.POST_SMALL ? currentPost : null
            }
            typeChat={
              currentGroupMode === GROUP_MODE.GENERAL_CHAT
                ? MESSAGE_TYPE.MESSAGE_GROUP
                : MESSAGE_TYPE.MESSAGE_GROUP_POST
            }
          />
        </div>
      ) : (
        ''
      )}
      {currentGroupMode !== GROUP_MODE.POST_SMALL ? <MemberList /> : ''}
    </div>
  );
};
