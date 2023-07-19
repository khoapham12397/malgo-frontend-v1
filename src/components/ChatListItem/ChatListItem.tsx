import { useSelector } from "react-redux";
import { RootState } from "../../state";
import { getFixedUsername } from "../../utils/getUser";
import { CHAT_MESSAGE_TYPE, getAvatarLink, getSummary, processChatMessage } from "../../utils/utils";

type ChatListItemProps = {
    item: ChatSessionP2P;
    handleLoadChatSession : (sessionId: string, partnerId: string,unseenCnt: number) =>void;
  }
  
export const ChatListItem = ({item, handleLoadChatSession}: ChatListItemProps)=>{
    const currentSessionIdP2P=useSelector((state: RootState)=>state.chat.currentSessionIdP2P);
    const processedMsg = processChatMessage(item.lastMessage.message);
    let msgContent = '';
    
    if(processedMsg.type === CHAT_MESSAGE_TYPE.TEXT_MESSAGE) {
      msgContent = processedMsg.content;
    }
    
    if(processedMsg.type === CHAT_MESSAGE_TYPE.SHARE_MESSAGE) {
      msgContent = 'share 1 resource with you';
    }

    return (
      <div className='chat-list-item'>
        <div key={item.sessionId} className={currentSessionIdP2P===item.sessionId?'chat-item chosen':'chat-item'} 
          onClick ={()=>handleLoadChatSession(item.sessionId, item.partner,item.unseenCnt)}>
            <img className='chat-item-avatar' src = {getAvatarLink(item.partner)}/>
            <div style={{paddingLeft:'10px'}}> 
              <span style={{color: 'white'}}>{getFixedUsername(item.partner)}</span>
            <div>
              {item.lastMessage?(getSummary(getFixedUsername(item.lastMessage.authorId)+': '+msgContent,30)):''}
            </div>
            </div>
          </div>
        {item.unseenCnt>0?<div className='unseen-msg'>{item.unseenCnt}</div>:''}
      </div>
    );
  }