import { createSlice, current } from '@reduxjs/toolkit';
import { GROUP_MODE, GROUP_PAGE_MODE } from '../../pages/ChatPage/ChatPage';
import { MESSAGE_TYPE } from '../actions/chatAction';

export const initialChatState: ChatState = {
    groups : null,
    groupPosts: [],
    groupUsers: [],
    currentPosts: [],
    postMessages: [],
    messageItems: [],

    currentGroupId: null,
    currentSessionId: null,
    
    currentPost : null,   
    
    friendList: null,
    showFriendListModal: false,
    
    shareResource: null,
    currentGroupMode: null,
    groupGeneralMessages: [],
    
    currentSessionIdP2P: null,
    currentChatType: null,
    currentSessionInfo: null,

    sessionP2PList: null,
    sessionP2PMessages: [],

    currentMessageGroupMode: [],
    currentMessageP2PMode: [],

    pageMode : GROUP_PAGE_MODE.GROUP,
    currentGeneralSessionId: null,
}   


const chatSlice = createSlice({
    initialState : initialChatState,
    name: "chat",
    reducers : {
        resetState: (state,action) =>{
            state = initialChatState;
        },
        setGroups: (state,action) =>{
            state.groups = action.payload.groups;      
        },
        addOneGroup: (state,action) =>{
            console.log('add one group');
            console.log(action.payload.group);
            if(state.groups) state.groups.push(action.payload.group);
            else state.groups = [action.payload.group]; 
        },
        
        setPostForGroup: (state, action) =>{
            console.log(`set posts of groups: `);
            const groupId = action.payload.groupManagePost.groupId;

            if(action.payload.isNew) {
                state.groupPosts.push(action.payload.groupManagePost);                
            }          
            else {
                for(let i = 0;i < state.groupPosts.length;i++) {            
                    if(state.groupPosts[i].groupId === groupId){
                        state.groupPosts[i] = action.payload.groupManagePost;
                    }
                }
            }
            console.log(`isNew: ${action.payload.isNew}`);
            state.currentPosts = action.payload.groupManagePost.posts;
            console.log(action.payload.groupManagePost.posts);
            if(action.payload.groupManagePost.groupId !== state.currentGroupId) {
                state.currentPost = null;
                state.messageItems = [];
            }
            state.currentGroupId = action.payload.groupManagePost.groupId;
            
            if(state.groups){
                const group =  state.groups.filter(item=>item.id===groupId)[0];
                state.currentGeneralSessionId = group.generalChatSessionId;

                if(!action.payload.isNew) {
                    state.currentGroupMode = group.mode
                }
                else{ 
                    for(let i=0;i<state.groups.length;i++) {
                        if(state.groups[i].id === groupId) {
                            state.groups[i].mode = GROUP_MODE.POST_LARGE;
                            state.currentGroupMode = GROUP_MODE.POST_LARGE;
                            break;
                        }
                    }
                }
            }
            
        },
        setCurrentGroup: (state,action)=>{
            state.currentGroupId = action.payload.groupId;
            const grs = state.groupPosts.filter(item => item.groupId === action.payload.groupId);
            console.log(`set current group: ${action.payload.groupId}`);
            if(grs.length>0){
                state.currentPost = grs[0].currentPost;
                state.currentSessionId  = grs[0].currentPost?grs[0].currentPost.id:null;
                console.log(grs[0].currentPost);
                if(grs[0].currentPost){
                    const postId = grs[0].currentPost.id;
                    console.log(`set messageItem of post: ${grs[0].currentPost.id}`);    
                    state.messageItems = state.postMessages.filter(item=> item.postId === postId)[0].messages;
                }
                else state.messageItems= [];
            }
            state.currentPosts = state.groupPosts.filter(item => item.groupId === action.payload.groupId)[0].posts;
            if(state.groups) {
                const x = state.groups.filter(item  => item.id == action.payload.groupId)[0];
                
                state.currentGroupMode = x.mode;
                console.log(`set group: ${action.payload.groupId}`);
                console.log(`set general session id: ${x.generalChatSessionId}`);
                state.currentGeneralSessionId = x.generalChatSessionId;
            }            
        },
        setCurrentPost: (state, action) => {
            state.currentSessionId = action.payload.post.id;
            state.currentPost = action.payload.post;
            
            const p = state.postMessages.filter(item => item.postId == action.payload.post.id);
            if(p.length > 0){
                state.messageItems = p[0].messages;
            }

            for(let i=0;i<state.groupPosts.length;i++){
                if(state.groupPosts[i].groupId==action.payload.post.groupId) {
                    state.groupPosts[i].currentPost= action.payload.post;
                    break;
                }
            }

            if(state.groups) {
                for(let i=0;i<state.groups.length;i++) {
                    if(state.groups[i].id == action.payload.post.groupId) {
                        state.groups[i].mode = GROUP_MODE.POST_SMALL;
                        state.currentGroupMode = GROUP_MODE.POST_SMALL;
                        break;
                    }
                }
            }
        },
        setGroupMode : (state, action)=>{
            if(state.groups) {
                for(let i=0;i<state.groups.length;i++) {
                    if(state.groups[i].id === action.payload.groupId){
                        state.groups[i].mode= action.payload.mode;
                        state.currentGroupMode = action.payload.mode;
                        break;
                    }
                }
            }
        },
        
        setMessageItems : (state,action) =>{
            state.messageItems = action.payload.messageItems;
            for(let i=0;i<state.postMessages.length;i++) {
                if(state.postMessages[i].postId == action.payload.postId){
                    state.postMessages[i].messages = action.payload.messageItems;
                    state.postMessages[i].latestMsgId = action.payload.latest;
                    break;
                }
            }
        },
        
        setCurrentPostAndMessage : (state,action) =>{
            state.currentPost = action.payload.post;
            state.currentSessionId = action.payload.post.id;
            for(let i=0;i<state.groupPosts.length;i++){
                if(state.groupPosts[i].groupId==action.payload.post.groupId) {
                    state.groupPosts[i].currentPost= action.payload.post;
                    break;
                }
            }
            if(state.groups) {
                for(let i=0;i<state.groups.length;i++) {
                    if(state.groups[i].id == action.payload.post.groupId) {
                        state.groups[i].mode = GROUP_MODE.POST_SMALL;
                        state.currentGroupMode = GROUP_MODE.POST_SMALL;
                    }
                }
            }
            state.postMessages.push({
                postId : action.payload.post.id,
                messages: action.payload.messageItems,
                latestMsgId: action.payload.latest,
                oldestMsgId: action.payload.oldest,
            });
            state.messageItems = action.payload.messageItems;
            
        },        
        
        addNewMessageForPost: (state, action) =>{
            for(let i=0;i<state.postMessages.length;i++) {
                if(state.postMessages[i].postId == action.payload.chatMessage.postId){
                    state.postMessages[i].messages.push(action.payload.chatMessage);
                    state.postMessages[i].latestMsgId = action.payload.chatMessage.id;
                }
            }
        },
        setFriendList : (state, action) =>{
            state.friendList = action.payload.friendList;
        },
        toggleFriendsModal: (state,action) =>{
            state.showFriendListModal = !state.showFriendListModal;
        },
        setShareResource :(state, action)=>{
            
            state.shareResource = action.payload.shareResource;
        },
        
        setGroupUsers : (state, action) =>{
            let existed = false;
            
            for(let i=0;i<state.groupUsers.length;i++) {
                if(state.groupUsers[i].groupId == action.payload.groupId) {
                    state.groupUsers[i].users = action.payload.users;
                    existed = true; break;
                }
            }
            
            if(!existed) state.groupUsers.push(action.payload);
        },

        setGeneralChatGroupMode :(state, action) =>{
            console.log('set general chat mode');
            state.currentGroupMode = GROUP_MODE.GENERAL_CHAT;
            const msgs = action.payload.messages;
            if(msgs) {
                if(msgs.length>0) state.groupGeneralMessages.push({
                    groupId : action.payload.groupId,
                    messages: msgs,
                    latestMsgId: msgs[msgs.length-1].id,
                    oldestMsgId: msgs[0].id,
                    sessionId: action.payload.sessionId,
                } as GroupManageChatMsg);
                else {
                    state.groupGeneralMessages.push({
                    groupId: action.payload.groupId,
                    messages:[],
                    latestMsgId: '',
                    oldestMsgId: '',
                    sessionId: action.payload.sessionId,
                    });
                }
                state.messageItems = msgs;
                
            }
            else {
                state.messageItems = state.groupGeneralMessages.filter(item=> item.groupId=== action.payload.groupId)[0].messages;
            }            
            state.currentPost = null;
        },
        addOneMessageGroup: (state,action)=>{
            console.log('add one group message ');
            console.log(action.payload);
            let isCurrentGroup=false;
            for(let i=0;i<state.groupGeneralMessages.length;i++){
                const sid = state.groupGeneralMessages[i].sessionId;

                if(sid === action.payload.sessionId){
                    state.groupGeneralMessages[i].messages.push(action.payload.message);
                    state.groupGeneralMessages[i].latestMsgId= action.payload.message.id;
                    
                }

                if(state.groupGeneralMessages[i].groupId === state.currentGroupId) 
                    isCurrentGroup=true;
            }
        
            if(state.currentGroupMode === GROUP_MODE.GENERAL_CHAT && isCurrentGroup){
                //console.log('add to current messages');
                state.messageItems = [...state.messageItems, action.payload.message];
            }
        },
        
        setCurrentChat: (state,action) =>{
            console.log("set current chat");
    
            state.currentChatType = action.payload.chatType;
            state.currentSessionInfo = action.payload.sessionInfo;
            state.currentSessionId = action.payload.sessionId;
            state.messageItems = [];
                    
        },
        setChatSessionP2PList: (state,action) =>{
            console.log('set sessions to state');
            console.log(action.payload.sessions);
            state.sessionP2PList = action.payload.sessions;
        },
        addOneChatSessionP2P: (state,action)=>{
            state.sessionP2PList?.unshift(action.payload.chatSession);  
        },
        setSessionP2PMessages: (state,action)=>{
            
            if(action.payload.messages) {
                const msgs = action.payload.messages;

                state.sessionP2PMessages.push({
                    messages: action.payload.messages,
                    sessionId: action.payload.sessionId,
                    latestMsgId: msgs.length>0?msgs[msgs.length-1].id:'',
                    oldestMsgId: msgs.length>0?msgs[0].id:'',
                } as SessionMessage);
                state.messageItems = msgs;
                
            }
            else {
                state.messageItems = state.sessionP2PMessages.filter(item=>item.sessionId === action.payload.sessionId)[0].messages;
            }
                  

            state.currentChatType = MESSAGE_TYPE.MESSAGE_P2P;
            state.currentSessionInfo = action.payload.sessionInfo;
            state.currentSessionIdP2P = action.payload.sessionId;
            state.currentSessionId = action.payload.sessionId;
        },
        
        addOneMessageP2P: (state,action)=>{
            for(let i=0;i<state.sessionP2PMessages.length;i++){
                if(state.sessionP2PMessages[i].sessionId=== action.payload.message.sessionId){
                    state.sessionP2PMessages[i].messages.push(action.payload.message);
                    state.sessionP2PMessages[i].latestMsgId = action.payload.message.id;
                    
                    
                                        
                    break;
                }
            }
            if(state.sessionP2PList) {
                for(let j=0;j<state.sessionP2PList.length;j++){
                    if(state.sessionP2PList[j].sessionId === action.payload.message.sessionId) {
                        const session = state.sessionP2PList[j];
                        session.lastMessage = {
                            authorId: action.payload.message.authorId,
                            message: action.payload.message.content,
                        }
                        if( state.currentSessionIdP2P === action.payload.message.sessionId) {
                            //state.messageItems.push(action.payload.message);
                            state.currentMessageP2PMode.push(action.payload.message);                       
                            if(state.pageMode === GROUP_PAGE_MODE.CHAT_P2P) {
                                state.messageItems.push(action.payload.message);
                            }
                        }
                        else {
                            session.unseenCnt+=1;
                        }
                        if(j!= 0){
                            state.sessionP2PList.splice(j,1);
                            state.sessionP2PList.unshift(session);
                        }
                        break;
                    }
                }
                //const session = state.sessionP2PList.filter(item => item.sessionId===action.payload.message.sessionId)[0];
                
            }

        },
        changePageMode: (state, action)=>{
            if(state.pageMode === action.payload.mode) return;
            if(state.pageMode === GROUP_PAGE_MODE.GROUP && action.payload.mode===GROUP_PAGE_MODE.CHAT_P2P){
                // group=>p2p:
                state.currentMessageGroupMode= state.messageItems;
                state.messageItems = state.currentMessageP2PMode;
                

            }
            if(state.pageMode=== GROUP_PAGE_MODE.CHAT_P2P && action.payload.mode === GROUP_PAGE_MODE.GROUP){
                state.currentMessageP2PMode = state.messageItems;
                state.messageItems = state.currentMessageGroupMode;                
            }
            state.pageMode = action.payload.mode;
        },

        setSeenSessionP2P : (state, action)=>{
            if(!state.sessionP2PList) return;
            console.log("set seen");
            for(let i =0;i<state.sessionP2PList.length;i++){
                if(state.sessionP2PList[i].sessionId === action.payload.sessionId) {
                    state.sessionP2PList[i].unseenCnt = 0;
                }
            }
        },
       
    }
});

export const {
    setGroups, addOneGroup,setPostForGroup, setCurrentPost, 
    setMessageItems, setCurrentPostAndMessage,setFriendList,
    addNewMessageForPost, toggleFriendsModal,setShareResource,
    setGroupUsers, setCurrentGroup,setGroupMode, 
    setGeneralChatGroupMode,addOneMessageGroup, setCurrentChat,
    setChatSessionP2PList, setSessionP2PMessages,
    addOneMessageP2P, changePageMode, setSeenSessionP2P,
    addOneChatSessionP2P, resetState
} = chatSlice.actions;

export default chatSlice.reducer; 