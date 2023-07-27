import { useEffect, useRef } from 'react';
import { BiReply } from 'react-icons/bi';
import { MdTurnRight } from 'react-icons/md';
import {
  CHAT_MESSAGE_TYPE,
  getAvatarLink,
  getSummary,
  processChatMessage,
  processText
} from '../../utils/utils';
import { ShareData, ShareSummary } from '../ShareSummary/ShareSummary';
import parse from 'html-react-parser';

type ChatItemProps = {
  chatMessage: ChatMessages;
  setMessageReply: (msg: ReferenceMessage) => void;
  isFocus: boolean;
};

export const ChatMessageItem = ({
  chatMessage,
  setMessageReply,
  isFocus
}: ChatItemProps) => {
  //console.log(chatMessage.referenceMessage);
  const messageRef = useRef<HTMLDivElement>(null);
  const handleReply = () => {
    setMessageReply({
      author: chatMessage.authorId,
      id: chatMessage.id,
      summary: getSummary(chatMessage.content, 50)
    } as ReferenceMessage);
  };

  useEffect(() => {
    if (messageRef.current && isFocus) {
      messageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, []);
  let content: any = '';
  const processedMsg = processChatMessage(chatMessage.content);

  if (processedMsg.type === CHAT_MESSAGE_TYPE.TEXT_MESSAGE) {
    content = parse(processText(processedMsg.content));
  }

  if (processedMsg.type === CHAT_MESSAGE_TYPE.SHARE_MESSAGE) {
    content = <ShareSummary shareData={processedMsg.share as ShareData} />;
  }

  return (
    <div className='chat-message-container' ref={messageRef}>
      {chatMessage.referenceMessage ? (
        <div className='ref-item' style={{ margin: '0px', padding: '0px' }}>
          <div style={{ width: '30px' }}></div>
          <div style={{ color: 'grey' }}>
            <MdTurnRight /> {chatMessage.referenceMessage.author.split('@')[0]}{' '}
            <span style={{ color: 'white' }}>
              {chatMessage.referenceMessage.summary}
            </span>
          </div>
        </div>
      ) : (
        ''
      )}

      <div className='chat-message'>
        <img src={getAvatarLink(chatMessage.authorId)} className='avatar-msg' />

        <div className='txt-message'>
          <div
            style={{
              width: '100%',
              fontWeight: 'bold',
              color: 'darkcyan',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>{chatMessage.authorId.split('@')[0]}</span>{' '}
            <span style={{ color: 'gray', paddingLeft: '10px' }}>
              {' '}
              {new Date(chatMessage.createdAt).toLocaleString()}
            </span>
            <span className='reply link' onClick={handleReply}>
              {' '}
              <BiReply />
              reply
            </span>
          </div>
          <div>{content}</div>
        </div>
      </div>
    </div>
  );
};
