type Quiz = {
    quizKey: string; // col-row
    quizData: any;
    quizType: string;
}

export const QUIZ_STATE = {
    OPENING : 0,
    KEEPING: 1,
    CLOSED: 2,
}


export class GameData {
    
    quizMap : Map<string,Quiz>;

    quizState: Map<string, {state: number, socketId: (string | null)}>;
    solvedQuizs: any;
    
    constructor(quizMap: any) {
        this.quizMap = new Map();
        Object.keys(quizMap).forEach(key => {
            this.quizMap.set(key, quizMap[key]);
        });
        
        this.quizState = new Map();

        Object.keys(quizMap).forEach(key => {
            this.quizState.set(key, {state: QUIZ_STATE.OPENING, socketId: null});
        });
        console.log(this.quizState);
        this.solvedQuizs = {}; 
    }
}


