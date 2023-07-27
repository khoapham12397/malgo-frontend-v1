import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state';
import {
  loadChatSessionP2PList,
  loadInitFriendList
} from '../../state/actions/chatAction';
import { toggleFriendsModal } from '../../state/reducers/chatReducer';
import { getFixedUsername, getUsernameFromStorage } from '../../utils/getUser';
import { getAvatarLink } from '../../utils/utils';
import './FriendListModal.css';

type FriendsModalProps = {
  handleChooseItem: (username: string, sessionId: string | null) => void;
  exlusiveList: Array<string>;
};

export const FriendListModal = ({
  handleChooseItem,
  exlusiveList
}: FriendsModalProps) => {
  //const friendList = useSelector((state: RootState)=> state.chat.friendList);
  const dispatch = useDispatch<any>();
  const sessionP2PList = useSelector(
    (state: RootState) => state.chat.sessionP2PList
  );

  const myUsername = getUsernameFromStorage();

  const showFriendListModal = useSelector(
    (state: RootState) => state.chat.showFriendListModal
  );
  const sessionLst = sessionP2PList
    ? sessionP2PList.filter(session => {
        exlusiveList.indexOf(session.partner) === -1;
      })
    : [];

  useEffect(() => {
    //console.log("init friendList");

    if (myUsername && !sessionP2PList) {
      loadChatSessionP2PList();
    }
  }, [myUsername]);

  const handleClose = () => {
    dispatch(toggleFriendsModal({}));
  };

  return (
    <Modal show={showFriendListModal} onHide={handleClose} size='sm'>
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {sessionP2PList ? (
          <ul>
            {sessionP2PList.map((item: ChatSessionP2P) => (
              <li
                className='friend-item'
                key={item.sessionId}
                onClick={() => handleChooseItem(item.partner, item.sessionId)}
              >
                <img
                  className='friend-item-avatar'
                  src={getAvatarLink(item.partner)}
                />
                <span className='name'>{getFixedUsername(item.partner)}</span>
              </li>
            ))}
          </ul>
        ) : (
          ''
        )}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
