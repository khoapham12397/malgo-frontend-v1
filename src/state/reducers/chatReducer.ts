import { createSlice } from '@reduxjs/toolkit';
import { GROUP_MODE, GROUP_PAGE_MODE } from '../../pages/GroupPage/GroupPage';
import { MESSAGE_TYPE } from '../actions/chatAction';


const initialState: ChatState = {
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
}   

const chatSlice = createSlice({
    initialState : initialState,
    name: "chat",
    reducers : {
        setGroups: (state,action) =>{
            state.groups = action.payload.groups;      
        },
        addOneGroup: (state,action) =>{
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
                if(!action.payload.isNew) state.currentGroupMode = state.groups.filter(item=>item.id===groupId)[0].mode
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
            if(grs.length>0){
                state.currentPost = grs[0].currentPost;
                state.currentSessionId  = grs[0].currentPost?grs[0].currentPost.id:null;
                console.log(grs[0].currentPost);
                if(grs[0].currentPost){
                    const postId = grs[0].currentPost.id;
                    state.messageItems = state.postMessages.filter(item=> item.postId === postId)[0].messages;
                }
                else state.messageItems= [];
            }
            state.currentPosts = state.groupPosts.filter(item => item.groupId === action.payload.groupId)[0].posts;
            if(state.groups) {
                state.currentGroupMode = state.groups.filter(item  => item.id == action.payload.groupId)[0].mode;
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
                    oldestMsgId: msgs[0].id
                } as GroupManageChatMsg);
                else {
                    state.groupGeneralMessages.push({
                    groupId: action.payload.groupId,
                    messages:[],
                    latestMsgId: '',
                    oldestMsgId: '',
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
            for(let i=0;i<state.groupGeneralMessages.length;i++){
                if(state.groupGeneralMessages[i].groupId === action.payload.groupId){
                    state.groupGeneralMessages[i].messages.push(action.payload.message);
                    state.groupGeneralMessages[i].latestMsgId= action.payload.message.id;
                    break;
                }
            }
            if(state.currentGroupMode === GROUP_MODE.GENERAL_CHAT && state.currentGroupId === action.payload.groupId){
                state.messageItems = [...state.messageItems, action.payload.message];
            }
        },
        setCurrentChat: (state,action) =>{
            console.log("set current chat");
    
            state.currentChatType = action.payload.chatType;
            state.currentSessionInfo = action.payload.sessionInfo;
            state.currentSessionId = action.payload.sessionId;
            
        },
        setChatSessionP2PList: (state,action) =>{
            console.log('set sessions to state');
            console.log(action.payload.sessions);
            state.sessionP2PList = action.payload.sessions;
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

        },
        addOneMessageP2P: (state,action)=>{
            for(let i=0;i<state.sessionP2PMessages.length;i++){
                if(state.sessionP2PMessages[i].sessionId=== action.payload.message.sessionId){
                    state.sessionP2PMessages[i].messages.push(action.payload.message);
                    state.sessionP2PMessages[i].latestMsgId = action.payload.message.id;
                    if(state.currentSessionIdP2P === action.payload.message.sessionId) {
                        state.messageItems.push(action.payload.message);
                    }
                }
            }
            
        },
        changePageMode: (state, action)=>{
            if(state.pageMode === action.payload.mode) return;
            if(state.pageMode === GROUP_PAGE_MODE.GROUP && action.payload.mode===GROUP_PAGE_MODE.CHAT_P2P){
                // p2p=>group:
                state.currentMessageGroupMode= state.messageItems;
                state.messageItems = state.currentMessageP2PMode;
            
            }
            if(state.pageMode=== GROUP_PAGE_MODE.CHAT_P2P && action.payload.mode === GROUP_PAGE_MODE.GROUP){
                state.currentMessageP2PMode = state.messageItems;
                state.messageItems = state.currentMessageGroupMode;                
            }
            state.pageMode = action.payload.mode;
        }
    }
});
export const {
    setGroups, addOneGroup,setPostForGroup, setCurrentPost, 
    setMessageItems, setCurrentPostAndMessage,setFriendList,
    addNewMessageForPost, toggleFriendsModal,setShareResource,
    setGroupUsers, setCurrentGroup,setGroupMode,
    setGeneralChatGroupMode,addOneMessageGroup, setCurrentChat,
    setChatSessionP2PList, setSessionP2PMessages,
    addOneMessageP2P, changePageMode
} = chatSlice.actions;
 
export default chatSlice.reducer; 