import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BiPlus, BiSend } from 'react-icons/bi';
import { MdTurnRight } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import { MESSAGE_TYPE, submitMessage } from '../../state/actions/chatAction';
import { getUsernameFromStorage } from '../../utils/getUser';
import { getAvatarLink } from '../../utils/utils';
import { ChatMessageItem } from '../ChatMessageItem/ChatMessageItem';
import { PostItem } from '../PostItem/PostItem';

type ChatContainerProps = {
  sessionId: string | null;
  postData: PostData | null;
  typeChat: string;
};
type ChatHeaderProps = {
  typeChat: string;
};
const ChatHeader = ({ typeChat }: ChatHeaderProps) => {
  const currentSessionInfo = useSelector(
    (state: RootState) => state.chat.currentSessionInfo
  );
  const currentGroup = useSelector((state: RootState) => {
    return state.chat.groups?.filter(
      group => group.id === state.chat.currentGroupId
    )[0];
  });

  return (
    <div>
      {typeChat === MESSAGE_TYPE.MESSAGE_P2P ? (
        <div>
          <img
            src={getAvatarLink(
              currentSessionInfo ? currentSessionInfo.partnerId : ''
            )}
            className='avatar-icon'
          />{' '}
          {currentSessionInfo ? currentSessionInfo.title : ''}
        </div>
      ) : (
        <div>
          <img
            src={getAvatarLink(currentGroup ? currentGroup.name : '')}
            className='avatar-icon'
          />{' '}
          {currentGroup ? currentGroup.name : ''}
        </div>
      )}
    </div>
  );
};

export const ChatContainer = ({
  sessionId,
  postData,
  typeChat
}: ChatContainerProps) => {
  const chatInpRef = useRef<HTMLTextAreaElement>(null);
  const chatFormRef = useRef<HTMLDivElement>(null);

  const myUsername = getUsernameFromStorage();

  const [numRow, setNumRow] = useState(0);
  const [msgInp, setMsgInp] = useState('');
  const [msgReply, setMsgReply] = useState<ReferenceMessage | null>(null);

  const messageItems = useSelector(
    (state: RootState) => state.chat.messageItems
  );
  const currentGroupId = useSelector(
    (state: RootState) => state.chat.currentGroupId
  );
  const currentSessionInfo = useSelector(
    (state: RootState) => state.chat.currentSessionInfo
  );
  //const sessionId = useSelector((state: RootState)=> state.chat.currentSe)
  const styleChat =
    typeChat === MESSAGE_TYPE.MESSAGE_GROUP_POST
      ? 'chat-form'
      : 'chat-form-large';
  //const messageList = JSON.parse(JSON.stringify(messageItems)).reverse();

  const handleSubmitMessage = () => {
    if (!chatInpRef.current || !myUsername) return;

    if (msgInp && msgInp.length > 0) {
      const params: SubmitMessageParam = {
        username: myUsername,
        message: msgInp,
        type: typeChat,
        sessionId: sessionId,
        postId: postData ? postData.id : null,
        groupId: currentGroupId,
        recieverId: currentSessionInfo ? currentSessionInfo.partnerId : null,
        referenceMessage: msgReply ? msgReply : null
      };
      //console.log(params);
      submitMessage(params);
    }
    setMsgInp('');
    setMsgReply(null);
  };
  useEffect(() => {
    setNumRow(calNumRow());
  }, [msgInp]);

  const calNumRow = () => {
    let ans = 0,
      str = msgInp;
    for (let i = 0; i < str.length; i++) {
      ans += str[i] == '\n' ? 1 : 0;
    }
    return ans + 1;
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {typeChat !== MESSAGE_TYPE.MESSAGE_GROUP_POST ? (
        <div className='chat-header'>
          <ChatHeader typeChat={typeChat} />
        </div>
      ) : (
        ''
      )}
      <div className='chat-content'>
        {typeChat !== MESSAGE_TYPE.MESSAGE_GROUP_POST ? (
          <div style={{ height: '50px' }} />
        ) : (
          ''
        )}
        {postData ? <PostItem postData={postData} /> : ''}

        <div
          className={
            typeChat === MESSAGE_TYPE.MESSAGE_GROUP_POST
              ? 'message-list'
              : 'message-list-header'
          }
        >
          {messageItems.map((message: ChatMessages, ind: number) => (
            <ChatMessageItem
              isFocus={ind === messageItems.length - 1}
              setMessageReply={setMsgReply}
              key={message.id}
              chatMessage={message}
            />
          ))}
        </div>
      </div>

      <div className={styleChat} ref={chatFormRef}>
        {msgReply ? (
          <div className='reply-area'>
            <div>
              <MdTurnRight /> {msgReply.author.split('@')[0]}{' '}
              <span style={{ color: 'wheat' }}>{msgReply.summary}</span>
            </div>
            <div className='btn-off' onClick={() => setMsgReply(null)}>
              x
            </div>
          </div>
        ) : (
          ''
        )}
        <div className='d-flex' style={{ width: '100%' }}>
          <Button className='btn-search'>
            <BiPlus />
          </Button>

          <textarea
            ref={chatInpRef}
            value={msgInp}
            rows={numRow}
            className='chat-input'
            onChange={e => {
              setMsgInp(e.currentTarget.value);
            }}
          />
          <button
            className='btn-new-post'
            style={{ width: '5%' }}
            onClick={handleSubmitMessage}
          >
            <BiSend size={22} />
          </button>
        </div>
      </div>

      <div
        style={{
          height: chatFormRef.current
            ? chatFormRef.current.offsetHeight + 150
            : 150
        }}
      />
    </div>
  );
};
