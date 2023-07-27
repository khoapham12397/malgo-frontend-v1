import { Dispatch } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import api from '../../config/axios2';
import {
  addGroupMember,
  addNewMessageForPost,
  addOneChatSessionP2P,
  addOneGroup,
  addOneMessageGroup,
  addOneMessageP2P,
  changePageMode,
  resetState,
  setChatSessionP2PList,
  setCurrentPost,
  setCurrentPostAndMessage,
  setFriendList,
  setGeneralChatGroupMode,
  setGroups,
  setGroupUsers,
  setMessageItems,
  setPostForGroup,
  setSeenSessionP2P,
  setSessionP2PMessages,
  setShareResource
} from '../reducers/chatReducer';
import store from '..';

import socketIOClient, { Socket } from 'socket.io-client';
import {
  addFriendEvents,
  changeFriendEventStatus
} from '../reducers/notificationReducer';
import { FRIEND_REQUEST_STATUS } from '../../components/Notification/Notification';
import {
  getAccessTokenFromStorage,
  getFixedUsername
} from '../../utils/getUser';
import { GROUP_MODE } from '../../pages/ChatPage/ChatPage';
const urlPrefix = '/user2';

export const MESSAGE_TYPE = {
  MESSAGE_P2P: 'MESSAGE_P2P',
  MESSAGE_GROUP: 'MESSAGE_GROUP',
  MESSAGE_GROUP_POST: 'MESSAGE_GROUP_POST'
};
export let socket: any = null;

export const initSocketClient = (username: string) => {
  if (socket != null) return;

  socket = (socketIOClient as any).connect(import.meta.env.VITE_URL);

  socket.on('connect', () => {
    console.log(`connect ok,socketId: ${socket.id}`);

    socket.emit('auth', {
      accessToken: getAccessTokenFromStorage()
    });
  });

  socket.on('new-message', (data: any) => {
    recieveMessage(data.message, data.type);
  });

  return socket;
};

export const loadGroups = (username: string) => {
  return function (dispatch: Dispatch) {
    api.get(`${urlPrefix}/group/${username}`).then(res => {
      const result = res.data;
      const groups = result.data.groups.map((item: any) => ({
        id: item.id,
        name: item.name,
        creatorId: item.creatorId,
        createdAt: item.createdAt,
        mode: GROUP_MODE.GENERAL_CHAT,
        generalChatSessionId: item.generalChatSessionId
      }));

      if (result.successed) {
        dispatch(setGroups({ groups: groups }));
      } else toast.error(result.message);
    });
  };
};

export const loadPosts = (
  groupId: string,
  username: string,
  direct: string
) => {
  //console.log(`load posts of group ${groupId}`);
  return function (dispatch: Dispatch) {
    let url = `${urlPrefix}/group/${groupId}/post?limit=3&username=${username}`;
    const groupPosts = store.getState().chat.groupPosts;
    let isNew = true,
      manager: any = null;
    for (let i = 0; i < groupPosts.length; i++) {
      if (groupPosts[i].groupId == groupId) {
        if (direct == 'desc') url += `&before=${groupPosts[i].oldestPostId}`;
        else url += `&later=${groupPosts[i].latestPostId}`;
        isNew = false;
        manager = groupPosts[i];
        break;
      }
    }
    api.get(url).then(result => {
      if (result.data.successed) {
        let newPosts: Array<PostData> = [],
          latest = '',
          oldest = '';

        if (manager) {
          if (direct == 'desc') {
            newPosts = [...manager.posts, ...result.data.data.posts];
            latest = manager.latestPostId;
            oldest = result.data.data.oldest;
          } else {
            newPosts = [...result.data.data.posts, ...manager.posts];
            latest = result.data.data.latest;
            oldest = manager.oldestPostId;
          }
        } else {
          newPosts = result.data.data.posts;
          latest = result.data.data.latest;
          oldest = result.data.data.oldest;
        }

        const groupManagePost: GroupManagePost = {
          groupId: groupId,
          posts: newPosts,
          latestPostId: latest,
          oldestPostId: oldest,
          currentPost: null
        };
        dispatch(
          setPostForGroup({
            groupManagePost: groupManagePost,
            isNew: isNew
          })
        );
      } else toast.error(result.data.message);
    });
  };
};

export const loadCurrentPost = (post: PostData, username: string) => {
  //console.log(`load and set current post and it's message: ${post.id}`);
  return function (dispatch: Dispatch) {
    const lst = store
      .getState()
      .chat.postMessages.filter(item => item.postId == post.id);
    if (lst.length == 0) {
      api
        .get(
          `${urlPrefix}/post/${post.id}/message?limit=20&username=${username}`
        )
        .then(result => {
          if (result.data.successed) {
            const chatMessages = result.data.data.chatMessages;
            //console.log(chatMessages);
            dispatch(
              setCurrentPostAndMessage({
                post: post,
                messageItems: chatMessages,
                latest:
                  chatMessages.length > 0
                    ? chatMessages[chatMessages.length - 1].id
                    : null,
                oldest: chatMessages.length > 0 ? chatMessages[0].id : null
              })
            );
          } else toast.error(result.data.data.message);
        });
    } else dispatch(setCurrentPost({ post: post }));
  };
};

export const submitMessage = (param: SubmitMessageParam) => {
  
  socket.emit('submit-message', param);
};

export const loadInitFriendList = (username: string) => {
  return function (dispatch: Dispatch) {
    api.get(`${urlPrefix}/friends/${username}`).then(result => {
      if (result.data.successed) {
        //const friendList = result.data.data.friendList.map((item:string) => ({username: item}));
        dispatch(setFriendList({ friendList: result.data.data.friendList }));
      } else toast.error(result.data.message);
    });
  };
};

const recieveMessage = (chatMessage: ChatMessages, type: string) => {

  const chatState = store.getState().chat;
  
  switch (type) {
    case MESSAGE_TYPE.MESSAGE_GROUP_POST:
      if (chatMessage.postId == chatState.currentSessionId) {
        const lst = [...chatState.messageItems, chatMessage];

        store.dispatch(
          setMessageItems({
            messageItems: lst,
            postId: chatMessage.postId,
            latest: chatMessage.id
          })
        );
      } else {
        chatState.postMessages.forEach(item => {
          if (item.postId == chatMessage.postId) {
            store.dispatch(addNewMessageForPost({ chatMessage: chatMessage }));
          }
        });
      }
      break;
    case MESSAGE_TYPE.MESSAGE_GROUP:
      store.dispatch(
        addOneMessageGroup({
          sessionId: chatMessage.sessionId,
          message: chatMessage
        })
      );
      break;

    case MESSAGE_TYPE.MESSAGE_P2P:
      const sessionList = store.getState().chat.sessionP2PList;
      if (
        sessionList &&
        sessionList.filter(item => item.sessionId === chatMessage.sessionId)
          .length > 0
      ) {
        store.dispatch(
          addOneMessageP2P({
            message: chatMessage
          })
        );
      } else {
        if (chatMessage.sessionId) getChatSessionP2P(chatMessage.sessionId);
      }
      break;
  }
};

export const postShareResource = (params: ShareResourceParams) => {
  try {
    api.post(urlPrefix + '/share', params).then(result => {
      if (result.data.successed) {
        toast.success('Share successed');
        store.dispatch(setShareResource({ shareResource: null }));
      } else toast.error(result.data.message);
    });
  } catch (error) {
    toast.error('some error');
  }
};

export const getNotification = async (username: string) => {
  try {
    const result = await api.get(urlPrefix + `/share/${username}`);
    if (result.data.succcessed) {
      return result.data.data.shares;
    } else throw Error(result.data.message);
  } catch (err) {
    throw err;
  }
};

export const checkFriendShip = async (username1: string, username2: string) => {
  try {
    const result = await api.get(
      urlPrefix + `/checkfriend?username1=${username1}&username2=${username2}`
    );
    if (result.data.successed) {
      return result.data.data.isFriend;
    } else throw Error(result.data.message);
  } catch (error) {
    toast.error('');
  }
};

export const getRelationship = async (username1: string, username2: string) => {
  try {
    const result = await api.get(
      urlPrefix + `/relationship?username1=${username1}&username2=${username2}`
    );
    if (result.data.successed) {
      return result.data.data;
    } else throw Error(result.data.message);
  } catch (error) {
    toast.error('');
  }
};

export const requestFriend = async (username1: string, username2: string) => {
  //console.log('send friend req');
  const result = await api.post(urlPrefix + '/friendreq', {
    senderId: username1,
    recieverId: username2
  });
  if (result.data.successed) {
    return result.data.data.friendRequest;
  } else toast.error(result.data.message);
};

export const getFriendRequest = (username: string) => {
  return function (dispatch: Dispatch) {
    api.get(urlPrefix + `/friendreq/to/${username}`).then(result => {
      if (result.data.successed) {
        const friendReqs: Array<FriendRequest> = result.data.data.friendReqList;
        const friendEvents: Array<FriendEvent> = friendReqs.map(
          freq =>
            ({
              type: 'FRIEND_REQUEST',
              senderId: freq.senderId,
              recieverId: freq.recieverId,
              content: `${freq.senderId} sent you a friend request`,
              id: freq.id,
              status: FRIEND_REQUEST_STATUS.UNSEEN
            } as FriendEvent)
        );
        dispatch(addFriendEvents({ friendEvents: friendEvents }));
      }
    });
  };
};

export const acceptFriend = (params: AcceptFriendParam) => {
  return function (dispatch: Dispatch) {
    api.post(urlPrefix + '/acceptfriend', params).then(result => {
      if (result.data.successed) {
        dispatch(
          changeFriendEventStatus({
            id: params.requestId,
            status: FRIEND_REQUEST_STATUS.ACCEPT,
            content: 'Accepted friend request'
          })
        );
        //loadInitFriendList();
      }
    });
  };
};

export const createGroup = (username: string, groupName: string) => {
  return function (dispatch: Dispatch) {
    api
      .post(urlPrefix + '/group', { name: groupName, creatorId: username })
      .then(result => {
        if (result.data.successed) {
          dispatch(addOneGroup({ group: result.data.data.group }));
          toast.success('create group successful');
        }
      });
  };
};

export const createPostGroup = (params: CreatePostGroupParam) => {
  api.post(urlPrefix + '/group/thread', params).then(result => {
    if (result.data.successed) {
      //const posts = [result.data.data.post,...store.getState().chat.groupPosts];
      const newPost = result.data.data.post;
      const groupManagePost = store
        .getState()
        .chat.groupPosts.filter(item => item.groupId === newPost.groupId)[0];
      const x = JSON.parse(JSON.stringify(groupManagePost)) as GroupManagePost;
      x.posts.unshift(newPost);
      x.latestPostId = newPost.id;
      store.dispatch(setPostForGroup({ groupManagePost: x, isNew: false }));
    } else toast.error(result.data.message);
  });
};

export const addUserToGroup = (params: AddUserToGroupParam) => {
  api
    .post(urlPrefix + '/group/user', params)
    .then(result => {
      if (result.data.successed) {
        toast.success(`Add ${getFixedUsername(params.username2)} successful`);

        store.dispatch(
          addGroupMember({
            groupId: params.groupId,
            groupUser: result.data.data
          })
        );
      } else toast.error(result.data.message);
    })
    .catch(error => {
      toast.error(error.response.data.message);
    });
};

export const getGroupMembers = async (groupId: string, username: string) => {
  api
    .get(urlPrefix + `/group/member?username=${username}&groupId=${groupId}`)
    .then(result => {
      if (result.data.successed) {
        store.dispatch(
          setGroupUsers({
            groupId: groupId,
            users: result.data.data.members
          })
        );
      }
    });
};

export const loadGeneralChatMsg = async (groupId: string) => {
  if (
    store
      .getState()
      .chat.groupGeneralMessages.filter(item => item.groupId === groupId)
      .length == 0
  ) {
    api.get(urlPrefix + `/group/${groupId}/message`).then(result => {
      if (result.data.successed) {
        store.dispatch(
          setGeneralChatGroupMode({
            groupId: groupId,
            messages: result.data.data.chatMessages,
            sessionId: result.data.data.sessionId
          })
        );
      }
    });
  } else store.dispatch(setGeneralChatGroupMode({ groupId: groupId }));
};

export const loadChatSessionP2PList = () => {
  api
    .get(urlPrefix + `/session/p2p`)
    .then(result => {
      if (result.data.successed) {
        result.data.data.chatSessions.sort(
          (a: ChatSessionP2P, b: ChatSessionP2P) =>
            a.lastUpdate < b.lastUpdate ? 1 : -1
        );
        //console.log(result.data.data.chatSession);
        store.dispatch(
          setChatSessionP2PList({ sessions: result.data.data.chatSessions })
        );
      }
    })
    .catch(error => {
      console.log(`error occur when fetch chat session`);
      console.log(error);
    });
};

export const loadChatSessionMessages = async (
  sessionId: string,
  partnerId: string,
  unseenCnt: number
) => {
  if (
    store
      .getState()
      .chat.sessionP2PMessages.filter(item => item.sessionId === sessionId)
      .length === 0
  ) {
    const result = await api.get(
      urlPrefix + `/session/p2p/${sessionId}/message`
    );
    if (result.data.successed) {
      store.dispatch(
        setSessionP2PMessages({
          messages: result.data.data.chatMessages,
          sessionId: sessionId,
          sessionInfo: {
            partnerId: partnerId,
            title: getFixedUsername(partnerId)
          } as ChatSessionInfo,
          chatType: MESSAGE_TYPE.MESSAGE_P2P
        })
      );
    }
  } else {
    store.dispatch(
      setSessionP2PMessages({
        sessionId: sessionId,
        sessionInfo: {
          partnerId: partnerId,
          title: getFixedUsername(partnerId)
        } as ChatSessionInfo,
        chatType: MESSAGE_TYPE.MESSAGE_P2P
      })
    );
  }
  if (unseenCnt > 0) {
    setSeenMsgSessionP2P(sessionId);
  }
};

export const setSeenMsgSessionP2P = async (sessionId: string) => {
  const result = await api.get(urlPrefix + `/session/${sessionId}/seen`);
  if (result.data.successed) {
    store.dispatch(setSeenSessionP2P({ sessionId: sessionId }));
  }
};

export const getChatSessionP2P = async (sessionId: string) => {
  const result = await api.get(urlPrefix + `/session/${sessionId}`);
  if (result.data.successed) {
    store.dispatch(
      addOneChatSessionP2P({ chatSession: result.data.data.chatSession })
    );
  }
};

export const disconnectSocket = async () => {
  if (socket) {
    socket.emit('disconnnect-user', {});
  }
};
export const changePageChatMode = (mode: string) => {
  return function (dispatch: Dispatch<any>) {
    dispatch(changePageMode({ mode: mode }));
  };
};
type SendMessageP2PParam = {
  username: string;
  recieverId: string;
  content: string;
  sessionId: string | null;
  referenceMessage: ReferenceMessage | null;
};
export const sendMessageP2PWithoutSession = async (
  param: SendMessageP2PParam
) => {
  const result = await api.post('/user2/message', param);
  if (result.status === 201 && result.data.successed) {
    const chatMessage = result.data.data.chatMessage;
  }
};

export const resetChatState = () => {
  store.dispatch(resetState({}));
};
