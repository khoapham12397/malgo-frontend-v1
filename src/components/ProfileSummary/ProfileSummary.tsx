import { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, ModalBody } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { FcCheckmark, FcOk } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { GROUP_PAGE_MODE } from '../../pages/ChatPage/ChatPage';
import { RootState } from '../../state';
import {
  acceptFriend,
  changePageChatMode,
  getRelationship,
  loadChatSessionMessages,
  loadInitFriendList,
  MESSAGE_TYPE,
  requestFriend,
  submitMessage
} from '../../state/actions/chatAction';
import { getFixedUsername, getUsernameFromStorage } from '../../utils/getUser';
import { getAvatarLink } from '../../utils/utils';
import './ProfileSummary.css';
type Props = {
  userSummary: any;
  show: boolean;
  handleSetShow: (show: boolean) => void;
};
const RelTwoUser = {
  NONE: 'NONE',
  FRIEND: 'FRIEND',
  ONE_REQUEST_TWO: 'ORT',
  TWO_REQUEST_ONE: 'TRO'
};
export const ProfileSummary = ({ userSummary, show, handleSetShow }: Props) => {
  //    console.log(userSummary.username);
  const dispatch = useDispatch<any>();
  const [relationship, setRelationship] = useState<{
    relationship: string;
    id: string | null;
  } | null>(null);

  const myUsername = getUsernameFromStorage();
  const msgInpRef = useRef<HTMLInputElement>(null);
  const session = useSelector((state: RootState) => {
    if (!state.chat.sessionP2PList) return null;
    const sessions = state.chat.sessionP2PList.filter(
      session => session.partner === userSummary.username
    );
    if (sessions.length > 0)
      return {
        sessionId: sessions[0].sessionId,
        unseenCnt: sessions[0].unseenCnt
      };
    return null;
  });

  useEffect(() => {
    if (myUsername) {
      getRelationship(myUsername, userSummary.username).then(relationship => {
        //console.log(`relationship: ${relationship}`);

        setRelationship(relationship);
      });
    }
  }, [myUsername, userSummary]);

  const handleAddFriend = (username: string) => {
    if (myUsername) {
      requestFriend(myUsername, username).then(result => {
        toast.success('Send Friend Request Successed');
        setRelationship({
          relationship: RelTwoUser.ONE_REQUEST_TWO,
          id: result.id
        });
        dispatch(loadInitFriendList(myUsername));
      });
    }
  };

  const handleOnKeyDown = (e: any) => {
    if (!myUsername || !msgInpRef.current) return;
    if (e.key == 'Enter') {
      //console.log('submit msg');
      const param: SubmitMessageParam = {
        username: myUsername,
        recieverId: userSummary.username,
        referenceMessage: null,
        sessionId: null,
        groupId: null,
        message: msgInpRef.current.value,
        postId: null,
        type: MESSAGE_TYPE.MESSAGE_P2P
      };
      submitMessage(param);
      handleSetShow(false);
    }
  };

  const handleAcceptFriend = (senderId: string, reqId: string | null) => {
    if (!myUsername || !reqId) return;
    const params: AcceptFriendParam = {
      recieverId: myUsername,
      senderId: senderId,
      requestId: reqId
    };

    dispatch(acceptFriend(params));
  };
  const handleOpenChatSession = () => {
    if (session) {
      dispatch(changePageChatMode(GROUP_PAGE_MODE.CHAT_P2P));
      loadChatSessionMessages(
        session.sessionId,
        userSummary.username,
        session.unseenCnt
      );
      handleSetShow(false);
    } else {
      toast.error('some errors');
    }
  };
  const handleClose = () => {
    handleSetShow(false);
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose} size='sm'>
        <Modal.Body className='profile-summary-container'>
          <div>
            <img
              src={getAvatarLink(userSummary.username)}
              className='avatar-profile-summary'
            />
            <div className='add-friend-btn'>
              {relationship ? (
                relationship.relationship === RelTwoUser.NONE ? (
                  <div className='d-flex'>
                    <Button
                      style={{ fontSize: '15px', padding: '5px' }}
                      onClick={() => handleAddFriend(userSummary.username)}
                    >
                      {' '}
                      Add friend
                    </Button>
                    {session ? (
                      <Button
                        style={{
                          fontSize: '15px',
                          marginLeft: '10px',
                          padding: '5px'
                        }}
                        onClick={() => handleOpenChatSession()}
                      >
                        Open Chat
                      </Button>
                    ) : (
                      ''
                    )}
                  </div>
                ) : relationship.relationship === RelTwoUser.FRIEND ? (
                  <div className='d-flex'>
                    <Button className='friend-mark'>
                      <FcOk size={15} /> Friend
                    </Button>
                    <Button
                      style={{ fontSize: '13px' }}
                      onClick={handleOpenChatSession}
                    >
                      Open Chat
                    </Button>
                  </div>
                ) : relationship.relationship === RelTwoUser.ONE_REQUEST_TWO ? (
                  <Button>Sent Friend Request</Button>
                ) : relationship.relationship === RelTwoUser.TWO_REQUEST_ONE ? (
                  <Button
                    onClick={() =>
                      handleAcceptFriend(userSummary.username, relationship.id)
                    }
                  >
                    Accept Friend
                  </Button>
                ) : (
                  ''
                )
              ) : (
                ''
              )}
            </div>
          </div>
          <div>
            <div className='profile-name'>
              {getFixedUsername(userSummary.username)}
            </div>
            <div className='info-contain'>
              <div className='profile-hd'>About me</div>
              <div className='info-profile-item'>Nothing to say</div>
              <br />
              <div className='profile-hd'>Joined at</div>
              <div>{userSummary.create_time}</div>
              <br />
              <div className='profile-hd'>Role</div>
              <div className='info-profile-item'>GrandMaster</div>
            </div>
            <div className='search-bar'>
              {!session ? (
                <div
                  className='search-form-chat-page'
                  style={{ marginTop: '10px' }}
                >
                  <Form.Control
                    onKeyDown={handleOnKeyDown}
                    type='text'
                    ref={msgInpRef}
                    placeholder='Send message'
                    className='search-inp-chat-page send-msg-inp'
                  />
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
