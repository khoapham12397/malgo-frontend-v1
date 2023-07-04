import { Dispatch, useContext, useEffect, useRef, useState } from 'react';
import { Button,  Form, Modal } from "react-bootstrap";
import {   BiCommentDetail, BiGroup, BiMessage, BiPlus, BiPlusCircle,  BiReply, BiSearch, BiSend, BiShare, BiSubdirectoryRight, BiUser } from 'react-icons/bi';
import './GroupPage.css';
import {MdTurnRight} from 'react-icons/md';
import {FcAdvertising, FcConferenceCall, FcFolder, FcPlus, FcReadingEbook} from 'react-icons/fc';
import ModalWritePost from '../../components/ThreadModal/modalWritePost';
import { UserContext } from '../../contexts/UserContext';
import parse from "html-react-parser";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state';
import {  addUserToGroup, createPostGroup, getGroupMembers, initSocketClient, loadChatSessionMessages, loadChatSessionP2PList, loadCurrentPost, loadGeneralChatMsg, loadGroups, loadInitFriendList, loadPosts, MESSAGE_TYPE, submitMessage } from '../../state/actions/chatAction';
import { Notification } from '../../components/Notification/Notification';
import { LoginPanel } from '../../components/TestLogin/LoginPanel';
import { getAvatarLink, getSummary } from '../../utils/utils';
import { CreateGroupModal } from '../../components/CreateGroupModal/CreateGroupModal';
import { getFixedUsername } from '../../utils/getUser';
import { FriendListModal } from '../../components/FriendListModal/FriendListModal';
import { changePageMode, setCurrentChat, setCurrentGroup, setGroupMode, toggleFriendsModal } from '../../state/reducers/chatReducer';

export const GROUP_PAGE_MODE = {
  CHAT_P2P: 'GENERAL_CHAT',
  GROUP: 'GROUP',
}

export const GROUP_MODE =  {
  GENERAL_CHAT: 'GENERAL_CHAT',
  POST_LARGE: 'POST_LARGE',
  POST_SMALL : 'POST_SMALL',

}


type PostData = {
  id: string;
  content: string;
  authorId: string;
  createdAt: number;
  groupId: string;
  title: string;
}

type PostSummaryProps = {
  postData: PostData;
  style: string;
}

const PostSummary =({postData, style}: PostSummaryProps)=>{
  return (
    <div className={style}>
      <div>{postData.authorId.split('@')[0]} posted at {new Date(postData.createdAt).toUTCString()}</div> 
      <p style={{color:"white"}}>{postData.title}</p>
      <div className='txt-content'>
        {parse(postData.content)}
      </div>
      <p><BiCommentDetail/> 0 </p>
    </div>
  )
}

function SearchBar() {
  const {user} = useContext(UserContext);
  const currentGroupId = useSelector((state: RootState)=> state.chat.currentGroupId) ;

  const handleSubmitThread = (params: CreateThreadParam)=>{
    if(user && currentGroupId) {
      const param : CreatePostGroupParam = {
        authorId: user.username,
        content: params.content,
        groupId: currentGroupId,
        title: params.title,
      }
      createPostGroup(param);
      
    }
  }   

  return (
    <div className='search-bar'>

      <div className="search-form">
      <Button className='btn-search'>
            <BiSearch/>
      </Button>
      <Form.Control 
          type="text"
          placeholder="Search"
          className="search-inp"
          aria-label="Search"
            />
          
      </div>
      <ModalWritePost handleSubmitThread={handleSubmitThread}/>
    </div>
  );
}

type PostItemProps = {
  postData: PostData;
}

const PostItem = ({postData}: PostItemProps) => {
  return (<div className='post-item'>
    <div className='p-title'>
      <BiMessage size={45} color = {"white"}/>
      <br/>
      <br/>
      <h4  style ={{color:"white"}}>{postData.title}</h4>
    </div>
    <div>
    <br/>
    <div className='d-flex'>
          <img
            src={getAvatarLink(postData.authorId)}
            className='avatar-icon'
          />
          <div style={{ paddingLeft: '10px' }}>
            <div style={{ fontWeight: 'bold',color:"grey" }}>
                {postData.authorId.split('@')[0]}
            </div>
            <div>{new Date(postData.createdAt).toUTCString()}</div>
          </div>
    </div>
    {parse(postData.content)}
  <div>
    <br/>
    <img width={400} height="auto" src ='https://media.discordapp.net/attachments/1119239110176018513/1119239110821949612/image.png?width=707&height=603'/>

  </div>
    </div>
  </div>)
}

type ChatItemProps = {
  chatMessage : ChatMessages;
  setMessageReply : (msg : ReferenceMessage) => void;
  isFocus: boolean
}

const ChatMessageItem = ({chatMessage, setMessageReply, isFocus}: ChatItemProps) =>{
  console.log(chatMessage.referenceMessage);
  const messageRef = useRef<HTMLDivElement>(null);
  const handleReply = ()=>{
    
    setMessageReply({
      author: chatMessage.authorId,
      id: chatMessage.id,
      summary: getSummary(chatMessage.content, 50),
    } as ReferenceMessage);

  }
  useEffect(()=>{
    if(messageRef.current && isFocus){
      messageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  },[])
  
  return (<div className='chat-message-container' ref={messageRef}>
    {
      chatMessage.referenceMessage?
      <div className='ref-item' style={{margin:"0px", padding:"0px"}}>
      <div style={{width: "30px"}}></div>
      <div style={{color :"grey"}}>
          <MdTurnRight/> {chatMessage.referenceMessage.author.split('@')[0]} <span style={{color: 'white'}}>{chatMessage.referenceMessage.summary}</span>
      </div>
      </div>:""
    }
    
    
    <div className='chat-message'>
        
          <img
            src={getAvatarLink(chatMessage.authorId)}
            className='avatar-msg'
          />
          <div className='txt-message'>
         
            <div style={{width:'100%', fontWeight: 'bold',color:"darkcyan", display:'flex', justifyContent:'space-between' }}>
              <span>{chatMessage.authorId.split('@')[0]}</span> <span  style={{color:'gray', paddingLeft:"10px"}}> {new Date(chatMessage.createdAt).toLocaleString()}</span>
              <span className='reply' onClick = {handleReply}> <BiReply/>reply</span>
            </div>
            <div >{chatMessage.content}</div>
          </div>
    </div>
  </div>)
}


type ChatContainerProps = {
  sessionId: string | null;
  postData: PostData | null;
  typeChat: string; 
} 

const ChatHeader = ()=>{
  const currentSessionInfo = useSelector((state: RootState)=> state.chat.currentSessionInfo);
  return (<div >
    <img src={getAvatarLink(currentSessionInfo?currentSessionInfo.partnerId:'') }
      className='avatar-icon'
    /> {currentSessionInfo?currentSessionInfo.title:''}
  </div>)
}

const ChatContainer = ({sessionId,postData,typeChat }: ChatContainerProps)=>{
  
  const chatInpRef = useRef<HTMLTextAreaElement>(null);
  const chatFormRef = useRef<HTMLDivElement>(null);
  const {user} = useContext(UserContext);
  const [numRow, setNumRow] = useState(0);
  const [msgInp, setMsgInp] = useState('');
  const [msgReply, setMsgReply] = useState<ReferenceMessage | null>(null);
  
  const messageItems = useSelector((state: RootState)=> state.chat.messageItems);
  const currentGroupId = useSelector((state: RootState)=>state.chat.currentGroupId);
  const currentSessionInfo = useSelector((state: RootState)=> state.chat.currentSessionInfo);
  
  const styleChat = typeChat===MESSAGE_TYPE.MESSAGE_GROUP_POST?'chat-form':'chat-form-large'
  
  const handleSubmitMessage = () =>{
    if(!chatInpRef.current || !user) return;

    if(msgInp && msgInp.length > 0){
    
      const params : SubmitMessageParam = {
        username: user.username,
        message: msgInp,
        type: typeChat,
        sessionId: sessionId, 
        postId: postData?postData.id:null,
        groupId: currentGroupId,
        recieverId: currentSessionInfo?currentSessionInfo.partnerId:null,
        referenceMessage: msgReply?msgReply:null,
      }
    
      submitMessage(params);   
    }
    setMsgInp('');
    setMsgReply(null);
  }
  useEffect(()=>{
    setNumRow(calNumRow());
  },[msgInp]);
  
  const calNumRow = () =>{
    
    let ans = 0, str = msgInp;
    for(let i=0;i<str.length;i++) {
      ans += (str[i]=='\n')?1:0;
    }
    return ans+1;
  }

  return (<div style={{position:'relative', height:"100%"}}>
    {(typeChat===MESSAGE_TYPE.MESSAGE_P2P)?<div className='chat-header'>
      <ChatHeader/>
    </div>:''}
    <div className='chat-content'>
      {postData?<PostItem postData={postData}/>:''}

      <div className={postData?'message-list':'message-list-header'}>
      {messageItems.map((message: ChatMessages,ind: number) => 
      <ChatMessageItem 
        setMessageReply={setMsgReply} 
        key ={message.id} 
        chatMessage={message}
        isFocus = {ind===messageItems.length-1}
        />)}
      
      </div>    
    </div>
    
      <div className={styleChat} ref= {chatFormRef}>
        {msgReply?
        <div className='reply-area'>
          <div><MdTurnRight/> {msgReply.author.split('@')[0]} <span style={{color:'wheat'}}>{msgReply.summary}</span></div>
          <div className='btn-off' onClick={()=>setMsgReply(null)}>x</div>
        </div>:''}
      <div className='d-flex' style={{width:'100%'}}>
      <Button className='btn-search'>
        <BiPlus/>
      </Button>
      
      <textarea
          ref = {chatInpRef}
          value = {msgInp}
          rows = {numRow}
          className="chat-input"
          onChange= {(e)=> {setMsgInp(e.currentTarget.value)}}
        />
      <button className='btn-new-post' style={{width:'5%'}}
              onClick = {handleSubmitMessage}
      ><BiSend size={22}/></button>
      </div>
      
      </div>
      
    <div style={{height: chatFormRef.current?(chatFormRef.current.offsetHeight+100):100}}/>
  </div>)
}

const MemberList = ()=>{
  const currentGroupId = useSelector((state: RootState)=> state.chat.currentGroupId);
  const {user} = useContext(UserContext);
  
  const members = useSelector((state: RootState)=> {
    const x = state.chat.groupUsers.filter(item => item.groupId==currentGroupId);
    if(x.length > 0) return x[0].users;
    else return null;
  });
  const groupUsers = useSelector((state: RootState)=> state.chat.groupUsers);
   
  useEffect(()=>{
    if(user && currentGroupId) {
      if(groupUsers.filter(item=> item.groupId === currentGroupId).length==0)
        getGroupMembers(currentGroupId,user.username);
    }
  },[currentGroupId]);
  return (<div className='member-list'>
    {members?members.map(item => 
      <div key = {item.username} className ='member-item'>
        <img src = {getAvatarLink(item.username)} className = 'avatar-msg'/> {getFixedUsername(item.username)}
      </div>)
    :""}
  </div>)
}





const GroupContent = () =>{
  const dispatch: Dispatch<any> = useDispatch();    

  const {user} = useContext(UserContext);
  const groups = useSelector((state: RootState) => state.chat.groups);
  const currentGroupId = useSelector((state: RootState)=> state.chat.currentGroupId);
  const groupPosts = useSelector((state: RootState)=> state.chat.groupPosts);
  const currentGroupMode = useSelector((state: RootState)=> state.chat.currentGroupMode);
  const currentPosts = useSelector((state: RootState) => state.chat.currentPosts);
  const currentPost = useSelector((state: RootState) => state.chat.currentPost);

  const handleGetPostList = (groupId: string)=>{
    if(user) {
      dispatch(loadPosts(groupId, user.username, 'desc'));
    }
  }
  const handleLoadPost = (post: PostData) =>{
    if(user) {
      dispatch(loadCurrentPost(post, user.username));
      if(currentGroupMode !== GROUP_MODE.POST_SMALL) {
        dispatch(setGroupMode({groupId: currentGroupId, mode: GROUP_MODE.POST_SMALL}));
      }
    }
  }
  return (
      <div className='main-content'>
      {currentGroupMode!==GROUP_MODE.GENERAL_CHAT?<div className={currentGroupMode===GROUP_MODE.POST_SMALL?'post-list':'post-list-large'}>
              <SearchBar/>
              <div >
              {currentPosts.map(post=>
                 <div onClick={() => handleLoadPost(post)} key ={post.id}>
                   <PostSummary postData={post} style = {currentGroupMode===GROUP_MODE.POST_SMALL?'post-summary':'post-summary-large'}/>
                  </div>
              )}
              </div>
              <div style={{clear: 'left'}}/>
              <div className='btn-more-area'>
                <Button className='btn btn-info' onClick={()=> {
                if(currentGroupId) handleGetPostList(currentGroupId)}
                }>More Post
                </Button></div>
              
               <div style={{height:"100px"}}></div>
            </div>:''}
            {
              currentGroupMode !== GROUP_MODE.POST_LARGE?<div className='chat-container'>
              <ChatContainer 
                  sessionId={currentGroupMode===GROUP_MODE.GENERAL_CHAT?currentGroupId:currentPost?currentPost.id:null} 
                  postData={currentPost} 
                  typeChat = {currentGroupMode
                  ===GROUP_MODE.GENERAL_CHAT?MESSAGE_TYPE.MESSAGE_GROUP:MESSAGE_TYPE.MESSAGE_GROUP_POST}/>
            </div>:""
            }
            {currentGroupMode!== GROUP_MODE.POST_SMALL?<MemberList/>:""}
    </div>
  )
}

const ChatList = ()=>{
  const friendList = useSelector((state: RootState)=> state.chat.friendList);
  const dispatch: Dispatch<any> = useDispatch();    
  const {user} = useContext(UserContext);
  const sessionP2PList= useSelector((state: RootState)=> state.chat.sessionP2PList);
  const currentSessionIdP2P = useSelector((state: RootState)=>state.chat.currentSessionIdP2P);

  const handleCreateSessionTemp = (username: string)=>{
    const sessionInfo : ChatSessionInfo = {
      title: username,
      partnerId: username,
    }

    dispatch(setCurrentChat({
      chatType: MESSAGE_TYPE.MESSAGE_P2P, 
      sessionInfo: sessionInfo,
      sessionId: null,
    }));   
    
  }
  
  const handleLoadChatSession = (sessionId: string, partnerId: string)=>{
    console.log(`${currentSessionIdP2P} and ${sessionId}`);

    const sessionInfo : ChatSessionInfo = {
      title: partnerId,
      partnerId: partnerId,
    }
    if(user) loadChatSessionMessages(sessionId,partnerId);
  }
  
  useEffect(()=>{
    if(user) {
      if(!sessionP2PList) {
        loadChatSessionP2PList();
      }
    }
  },[user]);

  return (<div className='side-bar-content' >
    <div className='group-item'>
      {sessionP2PList?sessionP2PList.map(item=>(
        <div key={item.sessionId} className={currentSessionIdP2P===item.sessionId?'friend-item chosen':'friend-item'} onClick ={()=>handleLoadChatSession(item.sessionId, item.partner)}>
          <img className='avatar-msg' src = {getAvatarLink(item.partner)}/> {getFixedUsername(item.partner)}
        </div>
      )):''}
    </div>
    <div className='group-item'>
      
      {friendList?friendList.map(item=> (
        <div className='friend-item' key = {item.username} onClick={()=>handleCreateSessionTemp(item.username)}>
          <img className='avatar-msg' src = {getAvatarLink(item.username)}/> {getFixedUsername(item.username)}
        </div>
      )):""}
    </div>
  </div>);
}
const GroupSideBar = ()=>{
  const dispatch: Dispatch<any> = useDispatch();    

  const {user} = useContext(UserContext);
  const groups = useSelector((state: RootState) => state.chat.groups);
  const currentGroupId = useSelector((state: RootState)=> state.chat.currentGroupId);
  const groupPosts = useSelector((state: RootState)=> state.chat.groupPosts);
  const currentGroupMode = useSelector((state: RootState)=> state.chat.currentGroupMode);
  

  const handleChooseGroup = (groupId: string)=>{
    if(user && groupPosts && currentGroupId!=groupId ){
      const ind = groupPosts.findIndex(item=> item.groupId ===groupId);
      if(ind == -1) {
        dispatch(loadPosts(groupId, user.username, 'desc'));
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
    if(user && currentGroupId) {
      addUserToGroup({username1: user.username, username2: username, groupId: currentGroupId}); 
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
          <div className='sb-greeting'>{user?"Wellcome "+getFixedUsername(user.username):"You're not logined"}</div>
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
          
          <FriendListModal handleChooseItem={handleAddUserToGroup} exlusiveList = {[]}/>
        </div>
  )
}
const GroupPage = () => {
    const dispatch: Dispatch<any> = useDispatch();    
    
    const pageMode = useSelector((state: RootState) => state.chat.pageMode);

    //const [mode, setMode] = useState(GROUP_PAGE_MODE.GROUP);

    const currentGroupId = useSelector((state: RootState)=> state.chat.currentGroupId);
    const currentSessionId = useSelector((state: RootState)=> state.chat.currentSessionId);
    const currenChatType  = useSelector((state: RootState) => state.chat.currentChatType);
    const currentSessionIdP2P = useSelector((state:RootState)=>state.chat.currentSessionIdP2P);

    const {user} = useContext(UserContext);
    

    const friendList = useSelector((state: RootState)=> state.chat.friendList);
    
    useEffect(()=>{
      if(user) {
        initSocketClient(user.username);
        dispatch(loadGroups(user.username));      
        if(!friendList) {
          dispatch(loadInitFriendList(user.username));                    
        } 
      }
    },[user]);

    const handleChangeMode = (mode: string)=>{
      dispatch(changePageMode({mode: mode}));
    }

    return(
        <div className='group-page'>
        <div style={{display: 'flex'}}>
        <div className='control-bar'>
          <div className= {pageMode===GROUP_PAGE_MODE.CHAT_P2P?'control-item chosen2':'control-item'} onClick={()=>handleChangeMode(GROUP_PAGE_MODE.CHAT_P2P)}>
            <BiMessage size={24}/>  
          </div>
          <div className={pageMode===GROUP_PAGE_MODE.GROUP?'control-item chosen2':'control-item'} onClick={()=>handleChangeMode(GROUP_PAGE_MODE.GROUP)}>
            <BiGroup size={24}/>  
          </div>
          <div className='control-item' >
            <CreateGroupModal/>
          </div>
          <div className='control-item' >
            <Notification/>
          </div>
          <LoginPanel/>
        </div>
          <div className='side-bar'>
            {pageMode===GROUP_PAGE_MODE.GROUP?
            <GroupSideBar/>
            :<ChatList/>}
          </div>
          {pageMode===GROUP_PAGE_MODE.GROUP && currentGroupId?<GroupContent/>:
          <div className='main-content'>
          <div className='chat-container'>
          <ChatContainer 
            postData={null} 
            sessionId={currentSessionIdP2P} 
            typeChat = {currenChatType?currenChatType:''} />
          </div>
          </div>
          }

        </div>
        
      </div>
    
    )   
}

export default GroupPage;