import { useContext, useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap"
import { BiBell } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { RootState } from "../../state";
import { acceptFriend, getFriendRequest } from "../../state/actions/chatAction";
import { getShares, postLookedShare } from "../../state/actions/notificationActions";
import { getFixedUsername } from "../../utils/getUser";
import { getAvatarLink } from "../../utils/utils";
import './Notification.css';


type FriendEvtContentProps = {
  friendEvent: FriendEvent;
}

const FRIEND_EVENT_TYPE = {
  FRIEND_REQUEST: 'FRIEND_REQUEST',
  FRIEND_ACCEPTED: 'FRIEND_ACCEPTED',
}
export const FRIEND_REQUEST_STATUS = {
  UNSEEN : 'UNSEEN',
  ACCEPT : 'ACCEPT',
  DELETE : 'DELETE',
}

const FriendRequestEvt = ({friendEvent}: FriendEvtContentProps)=>{
  const dispatch = useDispatch<any>();

  const handleAcceptFriend = ()=>{
    const params: AcceptFriendParam = {
      recieverId : friendEvent.recieverId,
      senderId: friendEvent.senderId,
      requestId: friendEvent.id,
    }

    dispatch(acceptFriend(params));
  }
  
  const requestMsg = `${getFixedUsername(friendEvent.senderId)} sent you a friend request`;
  return (
    <>
      <div style={{padding: '5px'}}>
        <div style={{marginBottom: '10px'}}>
            <img className="avatar-msg" src= {getAvatarLink(friendEvent.senderId)}/>  {requestMsg}
        </div>
        {friendEvent.status==FRIEND_REQUEST_STATUS.UNSEEN?
        <div className="space-between">
          <Button onClick = {handleAcceptFriend}>Accept</Button>
          <Button>Delete</Button>
        </div>
        :<div className="d-flex">
          <div style={{width: '40px'}}/> {friendEvent.content}</div>
        }
      </div>
    </>
  )
  
}


const FriendEventContent = ({friendEvent}: FriendEvtContentProps) =>{
  
  
  return (
    <div style={{padding : '5px'}}>
      {
        friendEvent.type == FRIEND_EVENT_TYPE.FRIEND_REQUEST?
        <FriendRequestEvt friendEvent={friendEvent}/>
        :
        friendEvent.type == FRIEND_EVENT_TYPE.FRIEND_ACCEPTED?
        ""
        :""
      }
    </div>
  )
}

export const Notification = () =>{
    const dispatch = useDispatch<any>();

    const {user} = useContext(UserContext);
    const [lookedNotif, setLookedNotif] = useState(false);

    //const [notifications, setNotifications] = useState(null);
    const shares = useSelector((state: RootState)=> state.notification.shares);
    const friendEvents = useSelector((state: RootState)=> state.notification.friendEvents);

    const handleShareClick = (shareId: string) => {
      if(user) postLookedShare(shareId, user.username);
    }
    
    useEffect(()=>{
        if(user) {
           
            dispatch(getShares(user.username));
            dispatch(getFriendRequest(user.username));
        }
    },[user]);

    return (<Dropdown >
        <Dropdown.Toggle
            className="dropdown-btn"
        >
          <div style={{position: 'relative'}}  onClick={()=>setLookedNotif(true)}>
            
            <BiBell className='bell-icon'
            size={24}
            />
            {
            (shares && friendEvents && (shares.length + friendEvents.length)>0 && !lookedNotif)?
            <div className="number-noti">{shares.length + friendEvents.length}</div>
            :""
            }
            
          </div>
          
        </Dropdown.Toggle>
  
        <Dropdown.Menu style={{backgroundColor:'#22272e' }}>
            {shares?shares.map(share=>           
            <Link key = {share.id} className='dropdown-item noti-item' to={`http://localhost:3000/${share.resourceLink}`} onClick={()=>handleShareClick(share.id)}>
              <img src= {getAvatarLink(share.senderId)} className='avatar-msg'/> {getFixedUsername(share.senderId)} shared {share.resourceId} with you 
            </Link>
            ):""}
            {
            friendEvents?friendEvents.map(fEvent=> 
            <div className='dropdown-item noti-item' key = {fEvent.id}>
              <FriendEventContent friendEvent={fEvent}/>
              
            </div>):""
            }
         
        </Dropdown.Menu>
      </Dropdown>)
}