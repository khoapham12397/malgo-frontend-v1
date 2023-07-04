import { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { UserContext } from "../../contexts/UserContext";
import { RootState } from "../../state";
import { loadInitFriendList } from "../../state/actions/chatAction";
import { toggleFriendsModal } from "../../state/reducers/chatReducer";
import { getFixedUsername } from "../../utils/getUser";
import { getAvatarLink } from "../../utils/utils";
import './FriendListModal.css';
type FriendsModalProps = {
    handleChooseItem : (username: string) => void;
    exlusiveList: Array<string>;
}

export const FriendListModal = ({handleChooseItem, exlusiveList}: FriendsModalProps)=>{
    const friendList = useSelector((state: RootState)=> state.chat.friendList);
    const dispatch = useDispatch<any>();
    const {user, setUser} = useContext(UserContext);
    
    const showFriendListModal = useSelector((state:RootState)=>state.chat.showFriendListModal);

    useEffect(()=>{
      console.log("init friendList");
      if(user && !friendList) {
      
        dispatch(loadInitFriendList(user.username));
      }
    },[user]);
  
    const handleClose = ()=>{
      dispatch(toggleFriendsModal({}));
    }
  
    return (<Modal show={showFriendListModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {friendList?friendList.map(item=> 
            <li className='friend-item' key={item.username}
              onClick ={()=>handleChooseItem(item.username)}
              >
              <img className="avatar-msg" src = {getAvatarLink(item.username)}/> {getFixedUsername(item.username)}
            </li>):""}
          </ul>
            
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
    </Modal>)
}