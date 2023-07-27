import { configureStore } from '@reduxjs/toolkit';
import threadListReducer from './reducers/threadListReducer';
import threadReducer from './reducers/threadReducer';
import codingProblemListReducer from './reducers/CProblemListReducer';
import threadBaseReducer from './reducers/threadBaseReducer';
import MathProblemListReducer from './reducers/MathProblemListReducer';
import chatReducer from './reducers/chatReducer';
import notificationReducer from './reducers/notificationReducer';
const store = configureStore({
  reducer: {
    thread: threadReducer,
    threadList: threadListReducer,
    codingProblemList: codingProblemListReducer,
    threadBase: threadBaseReducer,
    mathProblemList: MathProblemListReducer,
    chat: chatReducer,
    notification: notificationReducer
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
