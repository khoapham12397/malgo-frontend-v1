import { useState } from 'react';
import { getFixedUsername } from '../../utils/getUser';
import { getAvatarLink } from '../../utils/utils';
import { ProfileSummary } from '../ProfileSummary/ProfileSummary';
import './MemberItem.css';

type MemberItemProps = {
  item: GroupUser;
};

const RelTwoUser = {
  NONE: 'NONE',
  FRIEND: 'FRIEND',
  ONE_REQUEST_TWO: 'ORT',
  TWO_REQUEST_ONE: 'TRO'
};

export const MemberItem = ({ item }: MemberItemProps) => {
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  /*
  const dispatch = useDispatch<any>();
  const [relationship, setRelationship] = useState<string|null>(null);

  const myUsername = getUsernameFromStorage();
  
  const session = useSelector((state: RootState)=> {
    if( !state.chat.sessionP2PList) return null;
    const sessions = state.chat.sessionP2PList.filter(session=> session.partner===item.username);
    if(sessions.length>0) return {
      sessionId: sessions[0].sessionId,
      unseenCnt: sessions[0].unseenCnt,
    }
    return null;
  });
  const sessionList = useSelector((state: RootState)=> state.chat.sessionP2PList);

  useEffect(()=>{
    
    if(myUsername) {
      getRelationship(myUsername,item.username)
      .then(relationship=>{
        //console.log(`relationship: ${relationship}`);
                
        setRelationship(relationship);
    });     
    }
    },[myUsername,item]);

  const handleAddFriend = (username: string)=>{
    if(myUsername) {
      requestFriend(myUsername, username)
      .then(result=>{
        toast.success("Send Friend Request Successed");
        setRelationship(RelTwoUser.ONE_REQUEST_TWO);
        dispatch(loadInitFriendList(myUsername));
      })
    }
  }
  

  const handleOpenChatSession = ()=>{
    if(session) {
      dispatch(changePageChatMode(GROUP_PAGE_MODE.CHAT_P2P));
      loadChatSessionMessages(session.sessionId, item.username, session.unseenCnt);
    }
    else {
      toast.error("some errors");
    }
  }
  */
  /*
    <Dropdown>
    <Dropdown.Toggle
        variant="none"
            style={{  backgroundColor:'transparent', border: 'none', padding: '0px',
                height: '50px',
            }}
        >
        <div key = {item.username} className='member-item'>
            <img src = {getAvatarLink(item.username)} className = 'avatar-msg'/> <span>{getFixedUsername(item.username)}</span> <span className="online-user"/>
        </div>

        </Dropdown.Toggle>
        
        <Dropdown.Menu className='member-menu'>
          <Dropdown.Item className="item" >
          {relationship==RelTwoUser.NONE?
          <div onClick={()=>handleAddFriend(item.username)}>
            Add friend</div>
          :
          relationship== RelTwoUser.FRIEND?<div onClick={handleOpenChatSession}><BiSend size={20}/> Open chat box</div>:
          relationship==RelTwoUser.ONE_REQUEST_TWO?"Sent Friend Request":
          "Accept friend request"
          }
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
  */
  return (
    <div>
      <div
        key={item.username}
        className='member-item'
        onClick={() => setShowProfileModal(true)}
      >
        <img src={getAvatarLink(item.username)} className='avatar-msg' />{' '}
        <span>{getFixedUsername(item.username)}</span>{' '}
        <span className='online-user' />
      </div>
      <ProfileSummary
        userSummary={item}
        show={showProfileModal}
        handleSetShow={setShowProfileModal}
      />
    </div>
  );
};
