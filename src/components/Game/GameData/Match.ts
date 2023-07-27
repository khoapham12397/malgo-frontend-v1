type SocketInfo = {
  username: string;
  point: number;
  solvedQuizs: any; // "quizKey": solvetime
};

export class Match {
  roomId: string;
  users: Array<string>;
  roundId: string;
  socketInfos: Map<string, SocketInfo>;
  quizSolves: Array<any>;

  constructor(
    roomId: string,
    roundId: string,
    users: Array<string>,
    socketInfos: Map<string, SocketInfo>,
    quizSolves: Array<any>
  ) {
    this.roomId = roomId;
    this.users = users;
    this.socketInfos = socketInfos;
    this.roundId = roundId;
    this.quizSolves = quizSolves;
  }
}
