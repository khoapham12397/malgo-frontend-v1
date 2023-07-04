import { createSlice } from '@reduxjs/toolkit';

const initialState: ThreadListState = {
  category: 'all',
  categoryId: '0',
  type: 'latest',
  page: 0,
  totalPage: 0,
  threadList: [],
  totalThreads: 0,
  itemPerPage: 0
};

const threadListSlice = createSlice({
  name: 'threadList',
  initialState,
  reducers: {
    setThreadListState: (state, action) => {
      Object.assign(state, action.payload);
    },

    toggleLikeThreadInList: (state, action) => {
      const threadId = action.payload.threadId;
      const thread = state.threadList.find(item => item.id === threadId);
      if (thread) {
        const x = thread.isLike;
        thread.isLike = !x;
        thread.likes += x ? -1 : 1;
      }
    }
  }
});
export const { setThreadListState, toggleLikeThreadInList } =
  threadListSlice.actions;
export default threadListSlice.reducer;
