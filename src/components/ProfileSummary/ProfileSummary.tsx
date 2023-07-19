import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, ModalBody } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { GROUP_PAGE_MODE } from "../../pages/ChatPage/ChatPage";
import { RootState } from "../../state";
import { changePageChatMode, getRelationship, loadChatSessionMessages, loadInitFriendList, MESSAGE_TYPE, requestFriend, submitMessage } from "../../state/actions/chatAction";
import { getFixedUsername, getUsernameFromStorage } from "../../utils/getUser";
import { getAvatarLink } from "../../utils/utils";
import "./ProfileSummary.css";
type Props = {
    userSummary: any;
    show: boolean;
    handleSetShow: (show: boolean)=>void; 
}
const RelTwoUser= {
    NONE: 'NONE',
    FRIEND: 'FRIEND',
    ONE_REQUEST_TWO: 'ORT',
    TWO_REQUEST_ONE: 'TRO',
}
export const ProfileSummary = ({userSummary, show, handleSetShow}: Props) =>{
//    console.log(userSummary.username);
const dispatch = useDispatch<any>();
  const [relationship, setRelationship] = useState<string|null>(null);

  const myUsername = getUsernameFromStorage();
  const msgInpRef = useRef<HTMLInputElement>(null);
  const session = useSelector((state: RootState)=> {
    if( !state.chat.sessionP2PList) return null;
    const sessions = state.chat.sessionP2PList.filter(session=> session.partner===userSummary.username);
    if(sessions.length>0) return {
      sessionId: sessions[0].sessionId,
      unseenCnt: sessions[0].unseenCnt,
    }
    return null;
  });
  const sessionList = useSelector((state: RootState)=> state.chat.sessionP2PList);
  const [showProfileModal,setShowProfileModal] = useState<boolean>(false);

  useEffect(()=>{
    
    if(myUsername) {
      getRelationship(myUsername,userSummary.username)
      .then(relationship=>{
        //console.log(`relationship: ${relationship}`);
                
        setRelationship(relationship);
    });     
    }
    },[myUsername,userSummary]);

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

  const handleOnKeyDown = (e: any)=>{
    if(!myUsername || !msgInpRef.current) return;
    if(e.key=='Enter'){
        console.log('submit msg');
        const param : SubmitMessageParam = {
            username: myUsername,
            recieverId: userSummary.username,
            referenceMessage: null,
            sessionId: null,
            groupId: null,
            message: msgInpRef.current.value,
            postId: null,
            type: MESSAGE_TYPE.MESSAGE_P2P,
        }
        submitMessage(param);
        handleSetShow(false);
    }
  }
  const handleOpenChatSession = ()=>{
    if(session) {
      dispatch(changePageChatMode(GROUP_PAGE_MODE.CHAT_P2P));
      loadChatSessionMessages(session.sessionId, userSummary.username, session.unseenCnt);
    }
    else {
      toast.error("some errors");
    }
  }
    const handleClose = ()=>{
        handleSetShow(false);
    }

    return (<div>
        <Modal show={show} onHide={handleClose} size='sm'>
            <Modal.Body className='profile-summary-container'>
            <div >
            <img src = {getAvatarLink(userSummary.username)} className='avatar-profile-summary'/>
            <div className="add-friend-btn">
            {relationship?relationship===RelTwoUser.NONE?
            <Button style={{fontSize: '15px'}}
            onClick={()=>handleAddFriend(userSummary.username)}> Add friend</Button>
            :relationship===RelTwoUser.FRIEND?
            <Button style={{fontSize: '13px'}}>Open Chat</Button>
            :relationship===RelTwoUser.ONE_REQUEST_TWO?
            <Button>Sent Friend Request</Button>
            :relationship===RelTwoUser.TWO_REQUEST_ONE?
            <Button>Accept Friend</Button>:'':''
            }
            </div>
        </div>
        <div>

            <div className="profile-name">{getFixedUsername(userSummary.username)}</div>
            <div className="info-contain">
                <div className='profile-hd'>About me</div>
                <div className="info-profile-item">Nothing to say</div>
                <br/>
                <div className='profile-hd'>Joined at</div>
                <div>{userSummary.create_time}</div>
                <br/>
                <div className='profile-hd'>Role</div>
                <div className="info-profile-item">GrandMaster</div>
            </div>
            <div className='search-bar'>

      <div className="search-form">
      
      <Form.Control 
        onKeyDown= {handleOnKeyDown}
        type="text"
        ref = {msgInpRef}
        placeholder="Send message"
        className="search-inp send-msg-inp"
        />
          
      </div>
    </div>
        </div>
            </Modal.Body>
        </Modal>
        
    </div>);
}