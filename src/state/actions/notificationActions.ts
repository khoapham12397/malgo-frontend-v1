import { Dispatch } from '@reduxjs/toolkit';
import api from '../../config/axios2';
import { setShares } from '../reducers/notificationReducer';
import store from '..';

const urlPrefix = '/user2';

export const getShares = (username: string) => {
  return function (dispatch: Dispatch) {
    api.get(urlPrefix + `/share/${username}`).then(result => {
      if (result.data.successed) {
        dispatch(setShares({ shares: result.data.data.shares }));
      }
    });
  };
};

export const postLookedShare = (shareId: string, username: string) => {
  api.post(urlPrefix + `/share/${shareId}/looked`, { username: username });
};
