import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import {
  loadChatSessionMessages,
  loadChatSessionP2PList,
  MESSAGE_TYPE
} from '../../state/actions/chatAction';
import { getUsernameFromStorage } from '../../utils/getUser';
import { ChatListItem } from '../ChatListItem/ChatListItem';
import { SearchUserBox } from '../SearchUserBox/SearchUserBox';

export const ChatList = () => {
  const sessionP2PList = useSelector(
    (state: RootState) => state.chat.sessionP2PList
  );
  //const currentSessionIdP2P = useSelector((state: RootState)=>state.chat.currentSessionIdP2P);

  const myUsername = getUsernameFromStorage();

  const handleLoadChatSession = (
    sessionId: string,
    partnerId: string,
    unseenCnt: number
  ) => {
    //console.log(`${currentSessionIdP2P} and ${sessionId}`);

    if (myUsername) loadChatSessionMessages(sessionId, partnerId, unseenCnt);
  };

  useEffect(() => {
    if (myUsername) {
      loadChatSessionP2PList();
    }
  }, [myUsername]);

  return (
    <div className='side-bar-content'>
      <SearchUserBox />
      <div style={{ borderBottom: '1px solid' }}>
        {sessionP2PList
          ? sessionP2PList.map((item: ChatSessionP2P) => (
              <ChatListItem
                item={item}
                key={item.sessionId}
                handleLoadChatSession={handleLoadChatSession}
              />
            ))
          : ''}
      </div>
    </div>
  );
};
