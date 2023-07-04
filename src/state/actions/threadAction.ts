import { Dispatch } from '@reduxjs/toolkit';
import {
  addChildComments,
  addOneComment,
  addRootComments,
  setPendingLikeComment,
  setPendingLikeThread,
  setPendingReplyComment,
  setPendingSendComment,
  setThread,
  setThreadEdited,
  toggleLikeComment,
  toggleLikeThread
} from '../reducers/threadReducer';
import store from '..';
import { toggleLikeThreadInList } from '../reducers/threadListReducer';
import { toast } from 'react-hot-toast';

const host = (import.meta.env.VITE_API_URL as string)+ 'discussion';

export const fetchThread = (threadId: string, username: string | undefined) => {

  return function (dispatch: Dispatch<any>) {
    let url = host + '/thread/' + threadId;
    if (username != undefined) url += '?username=' + username;

    fetch(url)
      .then(res => res.json())
      .then(result => {
        const data: setThreadDataParams = result.data;
        if (store.getState().thread.threadData.id != threadId) {
          dispatch(setThread(data));
          if (data.thread.totalComments > 0) {
            dispatch(fetchRootComment(data.thread.id, username));
          }
        }
      });
  };
};

export const fetchRootComment = (
  threadId: string,
  username: string | undefined
) => {
  // threadId , orderType , skip
  return (dispatch: Dispatch<any>) => {
    const orderType = store.getState().thread.manageRootCmt.orderType;
    const skip = store.getState().thread.manageRootCmt.size;

    let url =
      host +
      '/rootComments?threadId=' +
      threadId +
      '&orderType=' +
      orderType +
      '&skip=' +
      skip;
    if (username != undefined) url += '&username=' + username;

    fetch(url)
      .then(res => res.json())
      .then(result => {
        dispatch(addRootComments(result.data));
      });
  };
};

export const fetchChildComment = (
  rootCmtId: string,
  fetched: number,
  take: number,
  username: string | undefined
) => {
  return (dispatch: Dispatch) => {
    let url =
      host +
      '/childComments?rootCmtId=' +
      rootCmtId +
      '&skip=' +
      fetched +
      '&take=' +
      take;
    if (username != undefined) url += '&username=' + username;

    fetch(url)
      .then(res => res.json())
      .then(result => {
        console.log('fetch child cmt: ');
        console.log(result.data);
        dispatch(addChildComments(result.data as addChildCommentParams));
      });
  };
};
export type PostCommentParam = {
  content: string;
  threadId: string;
  parentId: string | null;
  rootId: string | null;
  parentCreator: string | null;
  username: string | undefined;
};

export const postComment = (param: PostCommentParam) => {
  if (param.username == undefined || param.username == null) {
    toast.error("You're not logged in!");
    return;
  }

  return function (dispatch: Dispatch<any>) {
    if (!(param.parentId == null || param.parentId == '')) {
      dispatch(setPendingReplyComment({ commentId: param.parentId }));
    } else dispatch(setPendingSendComment({}));

    fetch(host + '/comment', {
      method: 'POST',
      body: JSON.stringify(param),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        dispatch(addOneComment(result.data));
      });
  };
};

export const likeThread = (threadId: string, username: string | undefined) => {
  if (username == undefined) {
    toast.error("You're not logged in!");
    return;
  }

  return function (dispatch: Dispatch<any>) {
    dispatch(setPendingLikeThread({}));

    const params = {
      threadId: threadId,
      username: username
    };

    fetch(host + '/likeThread', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        if (result.successed) {
          dispatch(toggleLikeThreadInList({ threadId: threadId }));
          dispatch(toggleLikeThread({}));
        }
      });
  };
};

export const likeComment = (
  cmtId: string,
  rootCmtId: string,
  username: string | undefined
) => {
  if (username == undefined) {
    toast.error("You're not logged in!");
    return;
  }
  return function (dispatch: Dispatch<any>) {
    dispatch(setPendingLikeComment({ commentId: cmtId }));
    const params = {
      commentId: cmtId,
      username: username
    };

    fetch(host + '/likeComment', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        if (result.successed) {
          dispatch(toggleLikeComment({ rootId: rootCmtId, cmtId: cmtId })); //
        }
      });
  };
};

export const postThread = (params: CreateThreadParam) => {
  if (params.username == undefined) {
    toast.error("You're not logged in!");
    return;
  }
  fetch(host + '/thread', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(result => {
      if (result.successed) {
        toast.success('create successed');
      } else toast.error(result.message);
    })
    .catch(err => {
      alert('error!!!');
    });
};

export const editThread = (params: EditThreadParams) => {
  if (params.username == undefined) {
    toast.error("You're not logged in!");
    return;
  }
  return function (dispatch: Dispatch<any>) {
    fetch(host + '/editThread', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        if (result.successed) dispatch(setThreadEdited(result.data));
        else alert('error');
      });
  };
};
