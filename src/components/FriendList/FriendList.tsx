import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state";
import { loadInitFriendList } from "../../state/actions/chatAction";
import { getUsernameFromStorage } from "../../utils/getUser";
import { MemberItem } from "../MemberItem/MemberItem";

export const FriendList= ()=>{
    const dispatch = useDispatch<any>();

    const username = getUsernameFromStorage();
    const friendList = useSelector((state: RootState)=> state.chat.friendList);
    console.log('create friend list');
    useEffect(()=>{
        if(username && !friendList) {
           dispatch(loadInitFriendList(username));
        }    
    },[username]);
    const onlineUsers = friendList?friendList.filter(item=>item.isOnline == true):null;
    const offlineUsers = friendList?friendList.filter(item => item.isOnline!=true):null;
    
    return (<div className='member-list'>
    <div className='member-list-title'>Online List</div>
    {onlineUsers?onlineUsers.map(item => 
      <MemberItem key={item.username} item={item}/>)
    :""}
    <div className='member-list-title'>Offline List</div>
    {offlineUsers?offlineUsers.map(item => 
      <MemberItem key={item.username} item={item}/>)

    :""}
  </div>)
}