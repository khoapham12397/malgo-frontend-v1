import { Dispatch } from '@reduxjs/toolkit';
import {
  setThreadListState,
  toggleLikeThreadInList
} from '../reducers/threadListReducer';
import store from '..';
import { toggleLikeThread } from '../reducers/threadReducer';
import { toast } from 'react-hot-toast';
import { getAccessTokenFromStorage } from '../../utils/getUser';
const host = (import.meta.env.VITE_API_URL as string)+'discussion';

export const fetchThreads = (
  category: string,
  categoryId: string,
  type: string,
  page: number | undefined,
  username: string | undefined
) => {
  return function (dispatch: Dispatch<any>) {
    page = page == undefined ? 1 : page;
    let url =
      host +
      '/threads?category=' +
      categoryId +
      '&type=' +
      type +
      '&page=' +
      page;
    if (username != undefined) url += '&username=' + username;
    console.log(`fetch threads with username: ${username}`);
    fetch(url, {method: 'GET', headers :{'Authorization': `Bearer ${getAccessTokenFromStorage()}`}})
      .then(res => res.json())
      .then(result => {
        const threadsResult: FetchThreadsApiResult = result.data;
        //console.log("item per page: "+ threadsResult.itemPerPage);
        dispatch(
          setThreadListState({
            category: category,
            categoryId: categoryId,
            type: type,
            page: threadsResult.page,
            threadList: threadsResult.threads,
            totalPage: threadsResult.page,
            totalThreads: threadsResult.totalThreads,
            itemPerPage: threadsResult.itemPerPage
          } as ThreadListState)
        );
      });
  };
};

export const likeThreadInList = (
  threadId: string,
  username: string | undefined
) => {
  if (username == undefined) {
    toast.error("You're not logged in!");
    return;
  }
  return function (dispatch: Dispatch<any>) {
    const params = {
      threadId: threadId,
      username: username
    };
    fetch(host + '/likeThread', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json',
        'Authorization':`Bearer ${getAccessTokenFromStorage()}`
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.successed) {
          dispatch(toggleLikeThreadInList({ threadId: threadId })); //
          if (store.getState().thread.threadData.id == threadId) {
            dispatch(toggleLikeThread({}));
          }
        }
      });
  };
};
