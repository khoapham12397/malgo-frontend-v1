import { createSlice } from '@reduxjs/toolkit';

type ThreadState = {
  threadData: Thread;
  manageRootCmt: ThreadManageRootCmt;
  focusComment: string;
  pendingLikeThread: boolean;
  pendingLikeCommentId: string;
  pendingReplyCommentId: string;
  pendingSendComment: boolean;
  addedCommentId: Array<{ commentId: string; index: number }>;
};

const initialState: ThreadState = {
  threadData: {} as Thread,
  manageRootCmt: {
    orderType: 0,
    size: 0,
    totalRootComment: 0,
    rootCommentList: []
  },
  focusComment: '',
  pendingLikeThread: false,
  pendingLikeCommentId: '',
  pendingReplyCommentId: '',
  pendingSendComment: false,
  addedCommentId: []
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {
    setThread: (state, action) => {
      state.threadData = action.payload.thread;

      state.manageRootCmt = {
        totalRootComment: action.payload.totalRootCmt,
        rootCommentList: [] as Array<RootComment>,
        orderType: 0,
        size: 0
      } as ThreadManageRootCmt;
      state.focusComment = '';
    },
    setOrderComment: (state, action) => {
      if (state.manageRootCmt.orderType != action.payload) {
        state.manageRootCmt = {
          totalRootComment: state.manageRootCmt.totalRootComment,
          size: 0,
          orderType: action.payload.orderType,
          rootCommentList: []
        };
      }
    },
    addRootComments: (state, action) => {
      const manage: ThreadManageRootCmt = state.manageRootCmt;
      const addComments = action.payload.comments;
      let inc = 0;
      for (let i = 0; i < addComments.length; i++) {
        const cmtId = addComments[i].data.id;
        let existed = false;

        const cmtItem = {
          commentData: addComments[i].data,
          manageChildCmt: {
            totalChildCmt: addComments[i].totalChildCmt,
            size: 0,
            orderType: addComments[i].orderType,
            childCommentList: []
          },
          reply: {
            active: false,
            replyFor: null
          },
          isFetched: true
        } as RootComment;

        for (let j = 0; j < state.addedCommentId.length; j++) {
          if (state.addedCommentId[j].commentId === cmtId) {
            cmtItem.isFetched = false;
            manage.rootCommentList[state.addedCommentId[j].index] = cmtItem;
            existed = true;
            break;
          }
        }
        if (!existed) {
          manage.rootCommentList.push(cmtItem);
          inc++;
        }
      }
      manage.size += addComments.length;
    },

    addChildComments: (state, action) => {
      const rootCmtId = action.payload.rootCmtId;
      const rootCmt = state.manageRootCmt.rootCommentList.find(
        (item: RootComment) => item.commentData.id === rootCmtId
      );
      //console.log('adding child cmt  for rootComt:' + action.payload.rootCmtId);
      if (rootCmt) {
        const manage: ManageChildCmt = rootCmt.manageChildCmt;
        const comments = action.payload.comments;

        for (let i = 0; i < comments.length; i++) {
          const cmtId = comments[i].commentData.id;
          let existed = false;
          for (let j = 0; j < state.addedCommentId.length; j++) {
            if (state.addedCommentId[j].commentId === cmtId) {
              //manage.childCommentList[state.addedCommentId[j].index] = comments[i];
              //console.log("found added cmt: "+ cmtId);
              existed = true;
              break;
            }
          }
          if (!existed) {
            manage.childCommentList.push(comments[i]);
          }
        }
        manage.size += comments.length;
      }
    },
    setReply: (state, action) => {
      const rootCmtId = action.payload.rootCmtId;
      //console.log('rootCmtID:' + rootCmtId);
      const parent = action.payload.parent; // parentId , vs username:

      const rootCmt = state.manageRootCmt.rootCommentList.find(
        item => item.commentData.id === rootCmtId
      );
      //console.log('set reply');

      if (rootCmt) {
        rootCmt.reply = {
          active: true,
          replyFor: parent
        };
      }
      //console.log(rootCmt);
    },

    setFocusComment: (state, action) => {
      state.focusComment = action.payload.commentId;
    },
    toggleLikeThread: (state, action) => {
      const x = state.threadData.isLike;
      state.threadData.isLike = !x;
      state.threadData.likes += x ? -1 : 1;
      state.pendingLikeThread = false;
    },
    toggleLikeComment: (state, action) => {
      //state.pendingLikeCommentId = "";
      if (state.pendingLikeCommentId == action.payload.cmtId) {
        state.pendingLikeCommentId = '';
      }
      const rootId =
        action.payload.rootId == ''
          ? action.payload.cmtId
          : action.payload.rootId;

      const rootCmt = state.manageRootCmt.rootCommentList.find(
        item => item.commentData.id == rootId
      );
      if (rootCmt) {
        if (rootCmt.commentData.id == action.payload.cmtId) {
          const x = rootCmt.commentData.isLike;
          rootCmt.commentData.isLike = !x;
          rootCmt.commentData.likes += x ? -1 : 1;
        } else {
          const manage: ManageChildCmt = rootCmt.manageChildCmt;
          const cmt = manage.childCommentList.find(
            item => item.commentData.id === action.payload.cmtId
          );
          if (cmt) {
            const x = cmt.commentData.isLike;
            cmt.commentData.isLike = !x;
            cmt.commentData.likes += x ? -1 : 1;
          }
        }
      }
    },
    addOneComment: (state, action) => {
      const comment: CommentData = action.payload.comment;
      if (comment.rootId == comment.id || comment.rootId == '') {
        state.manageRootCmt.rootCommentList.push({
          commentData: comment,
          manageChildCmt: {
            totalChildCmt: 0,
            childCommentList: [],
            orderType: 0,
            size: 0
          },
          reply: {
            active: false,
            replyFor: null
          },
          isFetched: false
        } as RootComment);
        state.pendingSendComment = false;

        state.addedCommentId.push({
          commentId: comment.id,
          index: state.manageRootCmt.rootCommentList.length - 1
        });
      } else {
        if (state.pendingReplyCommentId === comment.parent.id) {
          state.pendingReplyCommentId = '';
        }
        const rootCmt = state.manageRootCmt.rootCommentList.find(
          item => item.commentData.id === comment.rootId
        );
        if (rootCmt) {
          rootCmt.manageChildCmt.childCommentList.push({
            commentData: comment,
            isFetched: false
          } as ChildComment);
          rootCmt.reply = {
            active: false,
            replyFor: null
          };
          console.log('add 1 comment in addedlst: ' + comment.id);
          state.addedCommentId.push({
            commentId: comment.id,
            index: rootCmt.manageChildCmt.childCommentList.length - 1
          });
        }
      }
    },

    setThreadEdited: (state, action) => {
      state.threadData.title = action.payload.title;
      state.threadData.category = action.payload.category;
      state.threadData.content = action.payload.content;
      state.threadData.tags = action.payload.tags;
    },
    setPendingLikeThread: (state, action) => {
      state.pendingLikeThread = true;
    },
    setPendingLikeComment: (state, action) => {
      //console.log("pening like comment: "+ action.payload.commentId);
      state.pendingLikeCommentId = action.payload.commentId;
    },
    setPendingReplyComment: (state, action) => {
      state.pendingReplyCommentId = action.payload.commentId;
    },
    setPendingSendComment: (state, action) => {
      state.pendingSendComment = true;
    }
  }
});

export const {
  setThread,
  setOrderComment,
  addRootComments,
  addChildComments,
  setReply,
  setFocusComment,
  toggleLikeThread,
  toggleLikeComment,
  addOneComment,
  setThreadEdited,
  setPendingLikeThread,
  setPendingLikeComment,
  setPendingReplyComment,
  setPendingSendComment
} = threadSlice.actions;
export default threadSlice.reducer;
