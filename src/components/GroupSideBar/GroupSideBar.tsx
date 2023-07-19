import { Dispatch } from "react";
import { FcAdvertising, FcConferenceCall, FcFolder, FcPlus, FcReadingEbook } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { GROUP_MODE } from "../../pages/ChatPage/ChatPage";
import { RootState } from "../../state";
import { addUserToGroup, loadGeneralChatMsg, loadPosts } from "../../state/actions/chatAction";
import { setCurrentGroup, setGroupMode, toggleFriendsModal } from "../../state/reducers/chatReducer";
import { getFixedUsername, getUsernameFromStorage } from "../../utils/getUser";
import { getAvatarLink } from "../../utils/utils";
import { FriendListModal } from "../FriendListModal/FriendListModal";

export const GroupSideBar = ()=>{
    const dispatch: Dispatch<any> = useDispatch();    
  
    const groups = useSelector((state: RootState) => state.chat.groups);
    const currentGroupId = useSelector((state: RootState)=> state.chat.currentGroupId);
    const groupPosts = useSelector((state: RootState)=> state.chat.groupPosts);
    const currentGroupMode = useSelector((state: RootState)=> state.chat.currentGroupMode);
    const myUsername = getUsernameFromStorage();

    const exclusiveLst = useSelector((state: RootState)=> {
      const group = state.chat.groupUsers.filter(group => group.groupId === currentGroupId)[0];
      
      return group?group.users.map(item => item.username):[];
    });
    const handleChooseGroup = (groupId: string)=>{
      if(myUsername && groupPosts && currentGroupId!=groupId ){
        const ind = groupPosts.findIndex(item=> item.groupId ===groupId);
        if(ind == -1) {
          dispatch(loadPosts(groupId, myUsername, 'desc'));
        }
        else dispatch(setCurrentGroup({groupId: groupId}));
      }
    }
  
    const handleShowFriendsModal = () =>{
      dispatch(toggleFriendsModal({}));
    }
    
    const handleShowMembers = ()=>{
  
      if(currentGroupMode !== GROUP_MODE.POST_LARGE) {
        dispatch(setGroupMode({groupId: currentGroupId, mode: GROUP_MODE.POST_LARGE}));
      }
    }
    
  
    const handleAddUserToGroup =(username: string)=>{
      if(myUsername && currentGroupId) {
        addUserToGroup({username1: myUsername, username2: username, groupId: currentGroupId}); 
      }
    }
  
    const handleGeneralChat = ()=>{
      //dispatch(setGroupMode({groupId: currentGroupId, mode: GROUP_MODE.GENERAL_CHAT}));
      if(currentGroupId) loadGeneralChatMsg(currentGroupId);
      
    }
  
    const handlePostMode = () =>{
      dispatch(setGroupMode({groupId: currentGroupId, mode: GROUP_MODE.POST_LARGE}));
    }
    return (
  
      <div className='side-bar-content'>
            <div className='sb-greeting'>{myUsername?"Wellcome "+getFixedUsername(myUsername):"You're not logined"}</div>
            {groups?groups.map(group=>
            <div key={group.id}>
              <div onClick = {()=> handleChooseGroup(group.id)} className={group.id == currentGroupId?'group-item-active':'group-item'}><img className='control-item' src= {getAvatarLink(group.name)}/>
                <div className='group-name'> {group.name}</div> 
              </div>
              {currentGroupId===group.id?
              <div>
              <div className={currentGroupMode===GROUP_MODE.POST_SMALL?'sb-item chosen1':'sb-item'} onClick={handlePostMode}># <FcReadingEbook/> Posts</div>
            
              <div className={currentGroupMode===GROUP_MODE.GENERAL_CHAT?'sb-item chosen1':'sb-item'} onClick = {handleGeneralChat}># <FcAdvertising/>General Chat</div>
              <div className='sb-item'># <FcFolder/> Resource</div>
              <div className={currentGroupMode===GROUP_MODE.POST_LARGE?'sb-item chosen1':'sb-item'} onClick={handleShowMembers}># <FcConferenceCall/> All Member</div>
              <div className='sb-item' onClick={handleShowFriendsModal}># <FcPlus/> Add Member</div>
              </div>:''}
              
            </div>):""}
            <div style={{height:'200px'}}/>
            
            <FriendListModal handleChooseItem={handleAddUserToGroup} exlusiveList = {exclusiveLst}/>
          </div>
    )
  }