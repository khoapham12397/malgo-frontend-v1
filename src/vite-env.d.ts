/// <reference types="vite/client" />
/// <reference types="react-scripts" />

type Thread = {
  id: string;
  author: {
    username: string;
    avatar: string;
  };
  title: string;
  summary: string;
  createdAt: number;
  views: number;
  likes: number;
  totalComments: number;
  content: string;
  isLike: boolean;
  category: ThreadCategory | null;
  categoryId: number | null;
  tags: Array<string>;
};

type CommentData = {
  id: string;
  threadId: string;
  creator: string; //username
  createdAt: number;
  content: string;
  vote: number;
  isLike: boolean;
  likes: number;
  parent: {
    id: string;
    author: string;
  };
  rootId: string;
};
// cu va:

type RootComment = {
  commentData: CommentData;
  manageChildCmt: ManageChildCmt;

  reply: {
    active: boolean;
    replyFor: {
      parentId: string;
      username: string;
    } | null;
  };
  isFetched: boolean;
};

type ThreadManageRootCmt = {
  totalRootComment: number;
  orderType: number;
  size: number;
  rootCommentList: Array<RootComment>;
};
type ChildComment = {
  commentData: CommentData;
  isFetched: boolean;
};
type addRootCommentsParam = {
  data: CommentData;
  totalChildCmt: number;
  orderType: number;
};
type addChildCommentParams = {
  rootCmtId: string;
  comments: Array<ChildComment>;
};

type setThreadDataParams = {
  thread: Thread;
  totalRootCmt: number;
};

type ManageChildCmt = {
  totalChildCmt: number;
  size: number;
  orderType: number;
  childCommentList: Array<ChildComment>;
};

type FetchThreadsApiResult = {
  threads: Array<Thread>;
  totalPage: number;
  page: number;
  itemPerPage: number;
  totalThreads: number;
};
type ThreadListState = {
  categoryId: string;
  category: string;
  type: string;
  page: number;
  totalPage: number;
  threadList: Array<Thread>;
  totalThreads: number;
  itemPerPage: number;
};

type ThreadCategory = {
  id: string;
  title: string;
  parentId: string | null;
};

type ThreadTag = {
  id: string;
  title: string;
};

type ThreadDataSummary = {
  id: string;
  title: string;
  authorId: string;
  content: string;
  likes: number | undefined;
  totalComments: number | undefined;
};
type CodingProblemFilter = {
  page: number | null;
  category: string | null;
  tags: Array<string>;
  q: string | null;
  startDif: number | null;
  endDif: number | null;
  totalPage: number | null;
  total: number | null;
};

type MathProblemFilter = {
  page: number | null;
  category: string | null;
  tags: Array<string>;
  q: string | null;
  startDif: number | null;
  endDif: number | null;
  totalPage: number | null;
  total: number | null;
  itemPerPage: number;
};

type GetProblemsParam = {
  category: string | null;
  startDif: number | null;
  endDif: number | null;
  tagList: Array<string>;
  page: number | null;
  q: string | null;
  init: boolean | undefined;
};

type CreateThreadParam = {
  title: string;
  content: string;
  categoryId: number | string;
  tags: Array<string>;
  published: boolean;
  summary: string | null;
  username: string | undefined;
};

type EditThreadParams = {
  id: string;
  content: string;
  title: string;
  tags: Array<string>;
  category: string;
  username: string | undefined;
};
type ContestSummary = {
  id: string;
  startTime: Date;
  duration: number;
};
type CodingProblem = {
  id: string;
  code: string;
  title: string;
  categoryId: string | null;
  link: string | null;
  description: string;
  timeLimit: number;
  memoryLimit: number;
  difficulty: number;
  practicePoint: number;
  totalPoint: number;
  submissionNumber: number;
  acceptedNumber: number;
  authors: Array<{ username: string }>;
  tags: Array<{ tagId: string }>;
  contestId: string | null;
  contest: ContestSummary | null;
  codeforcesTag: Array<any>;
};

type CreateMathProblemParam = {
  title: string;
  description: string;
  categoryId: number | string;
  tags: Array<string>;
  difficulty: number;
  username: string | undefined;
  hint: string | undefined;
};
type MathProblemTag = {
  id: string;
  name: string;
};
type MathProblemCategory = {
  id: string;
  name: string;
};
type MathProbSummary = {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  category: {
    id: string;
    name: string;
  };
};

type MathProbItem = {
  id: string;
  id: string;
  title: string;
  description: string;
  difficulty: number;
  category: {
    id: string;
    name: string;
  };
  tags: Array<any>;
  hint: string;
  solutions: Array<MathProbSolution>;
  prevProblems: Array<{ id: string; title: string }>;
  nextProblems: Array<{ id: string; title: string }>;
  problemSet: Array<any>;
};

type MathNote = {
  content: string;
  creatorId: string;
  createdAt: Date;
  mathProblemId: string;
  imageLink: Array<string>;
};
type MathSolution = {
  content: string;
  creatorId: string;
  createdAt: Date;
  mathProblemId: string;
  imageLink: Array<string>;
  checked: boolean;
};
type MathProbState = {
  mathProblem: MathProbItem;
  note: MathNote | null;
  mySolution: MathSolution | null;
  otherSolutions: Array<MathSolution>;
};
type CreateMathNoteParam = {
  username: string;
  content: string;
  numImg: number;
  problemId: string;
  addToSolution: boolean;
};

type EditMathNoteParam = {
  problemId: string;
  username: string;
  content: string;
  oldImages: Array<string>;
  addToSolution: boolean;
};

type EditMathProbParam = {
  problemId: string;
  title: string;
  description: string;
  categoryId: number | string;
  tags: Array<string>;
  difficulty: number;
  username: string | undefined;
  hint: string | undefined;
  prevProblems: string | undefined;
  nextProblems: string | undefined;
  probSetList: Array<any>;
};
type CreateMathProbSetParam = {
  title: string;
  numProb: number;
  problems: Array<{ problemId: string; order: string }>;
  username: string;
};

type Group = {
  id: string;
  name: string;
  creatorId: string;
  createdAt: string;
  generalChatSessionId: string;
  mode: string;
};

type PostData = {
  id: string;
  content: string;
  authorId: string;
  createdAt: number;
  groupId: string;
  title: string;
};

type GroupManagePost = {
  groupId: string;
  oldestPostId: string;
  latestPostId: string;
  posts: Array<PostData>;
  currentPost: null | PostData;
};

type ChatMessages = {
  id: string;
  content: string;
  authorId: string;
  createdAt: number;
  postId: string | undefined | null;
  sessionId: string | undefined | null;
  referenceMessage: ReferenceMessage | null;
};

type PostManageMsg = {
  postId: string;
  latestMsgId: string;
  oldestMsgId: string;
  messages: Array<ChatMessages>;
};

type GroupManageChatMsg = {
  groupId: string;
  sessionId: string;
  messages: Array<ChatMessages>;
  latestMsgId: string;
  oldestMsgId: string;
};
type PostData = {
  id: string;
  content: string;
  authorId: string;
  createdAt: number;
  groupId: string;
  title: string;
};
type Friend = {
  username: string;
  isOnline: boolean | undefined | null;
};
type ChatSessionInfo = {
  title: string;
  partnerId: string;
};
type ChatSessionP2P = {
  sessionId: string;
  partner: string;
  lastMessage: { authorId: string; message: string };
  lastUpdate: number;
  unseenCnt: number;
  joinedAt: number;
};
type SessionMessage = {
  sessionId: string;
  messages: Array<ChatMessages>;
  latestMsgId: string;
  oldestMsgId: string;
};

type ChatState = {
  groups: Array<Group> | null;
  groupPosts: Array<GroupManagePost>;
  groupUsers: Array<{ groupId: string; users: Array<GroupUser> }>;

  currentPosts: Array<PostData>;

  postMessages: Array<PostManageMsg>;

  messageItems: Array<ChatMessages>;
  friendList: Array<Friend> | null;

  currentPost: PostData | null;
  currentSessionId: string | null;

  currentGroupId: string | null;
  currentGroupMode: string | null;

  showFriendListModal: boolean;
  shareResource: { id: string; type: string } | null;
  groupGeneralMessages: Array<GroupManageChatMsg>;

  sessionP2PList: Array<ChatSessionP2P> | null;
  currentSessionIdP2P: string | null;

  currentChatType: string | null;
  currentSessionInfo: ChatSessionInfo | null;
  sessionP2PMessages: Array<SessionMessage>;

  currentMessageGroupMode: Array<ChatMessages>;
  currentMessageP2PMode: Array<ChatMessages>;
  pageMode: string;

  currentGeneralSessionId: string | null;

  contactList: null | Array<{
    username: string;
    isOnline: boolean;
    sessionId: string;
  }>;
};

type GroupUser = {
  username: string;
  isOnline: boolean | undefined | null;
};

type ShareResourceParams = {
  senderId: string;
  recieverId: string;
  id: string;
  type: string;
  resourceLink: string | null;
};

type ShareP2P = {
  id: string;
  resourceId: string;
  resourceType: string;
  senderId: string;
  receiverId: string;
  look: boolean;
  resourceLink: string;
  createdAt: number;
};

type FriendRequest = {
  id: string;
  senderId: string;
  recieverId: string;
  disable: boolean;
};

type FriendEvent = {
  id: string;
  type: string;
  senderId: string;
  recieverId: string;
  content: string;
  status: string;
};

type AcceptFriendParam = {
  requestId: string;
  senderId: string;
  recieverId: string;
};

type ReferenceMessage = {
  id: string;
  summary: string;
  author: string;
};

type SubmitMessageParam = {
  username: string;
  message: string;
  postId: string | null;
  sessionId: string | null;
  groupId: string | null;
  type: string;
  recieverId: string | null;
  referenceMessage: null | ReferenceMessage;
};
type CreatePostGroupParam = {
  authorId: string;
  content: string;
  title: string;
  groupId: string;
};

type AddUserToGroupParam = {
  username1: string;
  username2: string;
  groupId: string;
};

type SubmissionData = {
  username: string;
  id: string;
  contestId: string | null;
  problemId: string;
  code: string;
  language: string;
  result: string;
  status: Array<{
    id: number;
    time: null | number;
    memory: number | null;
  }>;
  createTime: string;
  statistic_info: any;
};
type SubmissionFilter = {
  username: string | undefined;
  contestId: string | undefined;
  problemId: string | undefined;
};

type AlgorithmContest = {
  id: string;
  name: string;
  start_time: number;
  duration: number;
  rating_floor: number;
  rating_ceil: number;
  has_register: boolean;
};

type CodingContestProblem = {
  id: string;
  contest_id: string;
  time_limit: number;
  memory_limit: number;
  description: string;
  points: number;
  display_order: number;
  author: Array<{ username: string }>;
  testcases: string;
  name: string;
  points_loss_per_min: number;
};

type CodingLanguage = {
  id: number;
  name: string;
};

type CodingSubmission = {
  ID: string;
  Time: number;
  Memory: number;
  ProblemID: string;
  Username: string;
  Verdict: string;
  SubmittedAt: string;
  LanguageID: number;
  SourceCode: string;
};

type CodingContestSubmission = {
  id: string;
  problem_id: string;
  contest_id: string;
  username: string;
  submitted_at: string;
  time: number;
  memory: number;
  language_id: number;
  verdict: string;
  points: number;
  source_code: string;
};

type CodingSubmissionRecord = {
  id: string;
  problem_id: string;
  contest_id: string;
  username: string;
  submitted_at: string;
  time: number;
  memory: number;
  language_id: number;
  verdict: string;
  points: number;
};

type CodingContestProblemStatus = {
  problem_id: string;
  points: number | null;
  minutes_to_solve: number | null;
  penalty: number;
};

type CodingContestStanding = {
  rank: number;
  username: string;
  total_points: number;
  problem_statuses: Array<CodingContestProblemStatus>;
};

type User = {
  username: string;
  email: string;
  auth0_id: string;
  admin_type: string;
  create_time: string;
  is_disabled: boolean;
};
