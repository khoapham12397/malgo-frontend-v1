import { Dispatch, useEffect } from 'react';
import { BiGroup, BiMessage } from 'react-icons/bi';
import './ChatPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state';
import {
  initSocketClient,
  loadChatSessionP2PList,
  loadGroups,
  loadInitFriendList
} from '../../state/actions/chatAction';
import { Notification } from '../../components/Notification/Notification';
import { LoginPanel } from '../../components/TestLogin/LoginPanel';
import { CreateGroupModal } from '../../components/CreateGroupModal/CreateGroupModal';
import { getUsernameFromStorage } from '../../utils/getUser';
import { changePageMode } from '../../state/reducers/chatReducer';
import { FriendList } from '../../components/FriendList/FriendList';
import { ChatContainer } from '../../components/ChatContainer/ChatContainer';
import { ChatList } from '../../components/ChatList/ChatList';
import { GroupContent } from '../../components/GroupContent/GroupContent';
import { GroupSideBar } from '../../components/GroupSideBar/GroupSideBar';

export const GROUP_PAGE_MODE = {
  CHAT_P2P: 'GENERAL_CHAT',
  GROUP: 'GROUP'
};

export const GROUP_MODE = {
  GENERAL_CHAT: 'GENERAL_CHAT',
  POST_LARGE: 'POST_LARGE',
  POST_SMALL: 'POST_SMALL'
};

const GroupPage = () => {
  const dispatch: Dispatch<any> = useDispatch();

  const pageMode = useSelector((state: RootState) => state.chat.pageMode);

  const currentGroupId = useSelector(
    (state: RootState) => state.chat.currentGroupId
  );
  const currenChatType = useSelector(
    (state: RootState) => state.chat.currentChatType
  );
  const currentSessionIdP2P = useSelector(
    (state: RootState) => state.chat.currentSessionIdP2P
  );

  const myUsername = getUsernameFromStorage();

  const friendList = useSelector((state: RootState) => state.chat.friendList);

  useEffect(() => {
    if (myUsername) {
      initSocketClient(myUsername);
      dispatch(loadGroups(myUsername));

      dispatch(loadInitFriendList(myUsername));
      //dispatch(loadChatSessionP2PList());
    }
  }, [myUsername]);

  const handleChangeMode = (mode: string) => {
    dispatch(changePageMode({ mode: mode }));
  };

  return (
    <div className='group-page'>
      <div style={{ display: 'flex' }}>
        <div className='control-bar'>
          <div
            className={
              pageMode === GROUP_PAGE_MODE.CHAT_P2P
                ? 'control-item chosen2'
                : 'control-item'
            }
            onClick={() => handleChangeMode(GROUP_PAGE_MODE.CHAT_P2P)}
          >
            <BiMessage size={24} />
          </div>
          <div
            className={
              pageMode === GROUP_PAGE_MODE.GROUP
                ? 'control-item chosen2'
                : 'control-item'
            }
            onClick={() => handleChangeMode(GROUP_PAGE_MODE.GROUP)}
          >
            <BiGroup size={24} />
          </div>
          <div className='control-item'>
            <CreateGroupModal />
          </div>
          <div className='control-item'>
            <Notification />
          </div>
          <LoginPanel />
        </div>
        <div
          className={
            pageMode === GROUP_PAGE_MODE.GROUP ? 'side-bar' : 'side-bar-large'
          }
        >
          {pageMode === GROUP_PAGE_MODE.GROUP ? <GroupSideBar /> : <ChatList />}
        </div>
        {pageMode === GROUP_PAGE_MODE.GROUP ? (
          currentGroupId ? (
            <GroupContent />
          ) : (
            ''
          )
        ) : (
          <div className='main-content'>
            <div className='chat-container'>
              {currentSessionIdP2P ? (
                <ChatContainer
                  postData={null}
                  sessionId={currentSessionIdP2P}
                  typeChat={currenChatType ? currenChatType : ''}
                />
              ) : (
                ''
              )}
            </div>
            <FriendList />
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
