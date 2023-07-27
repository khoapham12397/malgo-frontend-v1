import { createSlice } from '@reduxjs/toolkit';

const FriendEvent = {
  FRIEND_REQUEST: 1,
  FRIEND_ACCEPT: 2
};

type NotificationState = {
  shares: Array<ShareP2P> | null;
  friendEvents: Array<FriendEvent> | null;
};

const initialState: NotificationState = {
  shares: null,
  friendEvents: null
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    setShares: (state, action) => {
      //console.log(`set shares ${action.payload.shares}`);
      state.shares = action.payload.shares;
    },
    setFriendEvents: (state, action) => {},

    addFriendEvents: (state, action) => {
      if (!state.friendEvents) {
        state.friendEvents = action.payload.friendEvents;
      } else {
        //state.friendEvents = [...state.friendEvents, ...action.payload.friendEvents];
        action.payload.friendEvents.forEach((item: any) => {
          if (
            state.friendEvents &&
            state.friendEvents.filter(evt => evt.id === item.id).length === 0
          ) {
            state.friendEvents.push(item);
          }
        });
      }
    },

    changeFriendEventStatus: (state, action) => {
      if (!state.friendEvents) return;
      for (let i = 0; i < state.friendEvents.length; i++) {
        if (state.friendEvents[i].id == action.payload.id) {
          state.friendEvents[i].status = action.payload.status;
          state.friendEvents[i].content = action.payload.content;
        }
      }
    }
  }
});

export const {
  setShares,
  setFriendEvents,
  addFriendEvents,
  changeFriendEventStatus
} = notificationSlice.actions;

export default notificationSlice.reducer;
