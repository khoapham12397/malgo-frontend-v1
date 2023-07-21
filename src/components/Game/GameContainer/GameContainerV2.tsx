import React from "react";
import { GameManager } from "../GameManager/GameManager";
import { QuizPanel } from "../QuizPanel/QuizPanel";
import { GameData, QUIZ_STATE } from "../GameData/GameData";
import "./GameContainer.css";
import { getFixedUsername, getUsernameFromStorage } from "../../../utils/getUser";
import { socket } from "../../../state/actions/chatAction";
import { toast } from "react-hot-toast";
import api from "../../../config/axios2";
import Loader from "../../Loader/Loader";
import { Button, Table } from "react-bootstrap";

type MyState = {
    bufferCtx: null | CanvasRenderingContext2D;
    ctx: null | CanvasRenderingContext2D;
    gameLoop: any;
    matchInfo: any;
    stateParam: any;
    socketId: any;
    quizKey: string | null;
    quiz: any;
    mode: number;
    matchState: any;
    waitingGame: boolean;
    pageMode: number;
}

export const GAME_MODE = {
    ACTION: 1,
    QUIZ: 2,
    PAUSE: 3,
    WAITING_QUIZ: 4,
}

export const GAME_PAGE_STATE = {
    NOT_IN_MATCH: 0,
    WAITING_MATCH: 1,
    IN_MATCH:2, 
} 

const timeFrame = 80;
export const screenWidth = 500 , screenHeight = 350;

export class GameContainerV2 extends React.Component<any,MyState>{
    bufferCanvas: any;
    mainCanvas : any;
    bufferCtx : any;
    ctx: any;
    socket: any;
    socket2: any;
    gameManager: any;
    myUsername: string | null;
    
    constructor(props: any) {
        super(props);
        this.bufferCanvas = React.createRef<HTMLCanvasElement>();
        this.mainCanvas = React.createRef();
        this.socket = React.createRef();
        this.socket2 = React.createRef();
        this.myUsername = getUsernameFromStorage();
        
        this.state={
            bufferCtx: null,
            ctx: null,
            gameLoop: null,
            matchInfo: null,
            stateParam: null,
            socketId: null,
            pageMode: GAME_PAGE_STATE.NOT_IN_MATCH,
            quiz: {
                quizData: {
                    description: "Với số nguyên dương N ta tính tích các chữ số của nó, tổng các chữ số của nó rồi cộng hai kết quả lại. Tổng cuối cùng ký hiệu là S(N ). Hỏi trong các số nguyên từ 1 đến 100 (kể cả 1 và 100) có bao nhiêu số N thỏa mãn S(N ) = N ?"
                    , result: 9, options: [1,2,3,9]
                },
                quizType: "option",
                quizPoint: 100,
            },
            quizKey: null,
            mode: GAME_MODE.ACTION,
            matchState : null,
            waitingGame: false,
        };
                    
        this.gameManager = null;
        
        this.gameLoop = this.gameLoop.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.initSocket = this.initSocket.bind(this);
        this.handleChangeMode = this.handleChangeMode.bind(this);
        console.log('init game container');
        console.log(this.props.location)

    }   
    
    handleKeyDown(e:any){
        if(!this.gameManager) return;
		
        if(e.keyCode == 39) {
			if(this.gameManager.mainCharacter.dir==-1){
				this.gameManager.mainCharacter.checkCollisonLeftWall();
				this.gameManager.mainCharacter.dir=1;
			}
			
			this.gameManager.mainCharacter.move();
		}

		if(e.keyCode == 37) {
			if(this.gameManager.mainCharacter.dir==1) {
				this.gameManager.mainCharacter.checkCollisonWall();
				this.gameManager.mainCharacter.dir=-1
			}
			
			this.gameManager.mainCharacter.move();
		}
        
		if(e.key == 'c') {
			//gameManager.mainCharacter.slash();
			//gameManager.mainCharacter.startKiballType1();
            /*
			if(!this.gameManager.mainCharacter.action.isAttacking) 	
				this.gameManager.mainCharacter.attackCtl.pendingAttack = true;		
            */
		}
		if(e.key=='x' && !this.gameManager.mainCharacter.flyCtl.nextWall) 
			this.gameManager.mainCharacter.fly();

	}

    componentWillUnmount(): void {
        if(this.state.matchInfo!== null){
            this.socket.current.emit('leave-game-room',{});
        }
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup",this.handleKeyUp); 

    }
    
    handleKeyUp(e: any){
		if(e.keyCode == 39 || e.keyCode == 37) this.gameManager.mainCharacter.stopMove();
		if(e.key == 'x' && this.gameManager.mainCharacter.flyCtl.nextWall) {
			this.gameManager.mainCharacter.fly();
		}
		if(e.key == 'c'){
			this.gameManager.mainCharacter.slash();
		}
	}
    

    initSocket(){
        
        if(!this.socket.current && this.myUsername){            
            this.socket.current = socket;
            this.setState({...this.state, socketId: socket.id});
            

            this.socket.current.on("start-match", (data: any)=>{
                
                console.log(data.matchState);
                this.setState({
                    ...this.state, matchInfo : data.matchInfo, 
                    matchState : data.matchState,
                });
                setTimeout(this.handleStart, 100);
            });
            
            this.socket.current.on("server-send-state", (data: any)=>{
               
                if(this.gameManager.opponent)
                    this.gameManager.opponent.setParamState(data.stateParam);
            });
            
            this.socket.current.on('quiz-state', (data: any)=>{
                
                if(data.matchState) {
                    console.log(data.matchState);
                    const socketInfo =  data.matchState.socketInfos.forEach((socketItem :any)=>{
                        if(socketItem.socketId== socket.Id) {
                            console.log(socketItem.solvedQuizs);
                            this.gameManager.gameData.solvedQuizs = socketItem.solvedQuizs;                            
                        }
                    });
                                    
                    this.setState({...this.state, matchState: data.matchState});
                }

                if(this.state.mode == GAME_MODE.WAITING_QUIZ) {
                    console.log('waiting quiz-state and get state from server');
                    console.log(data)
                    data.quizStateList.forEach((item :any)=>{
                        
                        const quizState = item.quizState;
                        if(item.quizKey == this.state.quizKey && 
                            quizState.state === QUIZ_STATE.KEEPING && 
                            quizState.socketId === socket.id){
                            this.handleChangeMode(GAME_MODE.QUIZ, item.quizKey, null);
                    
                        }
                        else this.handleChangeMode(GAME_MODE.ACTION ,"", null);
                       
                        this.gameManager.gameData.quizState.set(item.quizKey, quizState);
                        
                        this.gameManager.fireCardList.forEach((card:any) =>{
                            if(card.quizKey == item.quizKey) {
                                card.state = quizState.state;
                            }
                        });
                                                
                    })
                }
                else {                    
                     
                    data.quizStateList.forEach((item : any)=>{
                        const qState = item.quizState;
                        console.log(qState.state );

                        this.gameManager.gameData.quizState.set(item.quizKey, qState);
                        this.gameManager.fireCardList.forEach((card:any) =>{
                            if(card.quizKey == item.quizKey) {
                                card.state = qState.state;
                            }
                        });
                    })
                    
                }
                this.gameManager.fireCardList.forEach((card:any)=>{
                    console.log(card.state);
                });
            });
            this.socket.current.on('leave-game', (data: any)=>{
                console.log('some socket leave game match');
                console.log(data);
            });
        }
    }

    componentDidMount(): void {
        this.initSocket();
        
        this.setState({
            ...this.state,
            bufferCtx : this.mainCanvas.current.getContext('2d'),
            ctx: this.mainCanvas.current.getContext('2d'),
        });
        
        api.get('/game/quizlist?roundId=r1')
        .then(result=>{
            if(result.status === 200 && result.data.successed) {
                const gameData = new GameData(result.data.data.quizMap);
                this.gameManager = new GameManager(gameData, this.handleChangeMode);
                window.addEventListener("keydown",this.handleKeyDown);
	        	window.addEventListener("keyup",this.handleKeyUp); 
            }
        })
        .catch(error=>{
            console.log("get quiz error");
        });
        
    }

    handleChangeMode(mode: number, quizKey: string, result: number | null){
        if(mode == GAME_MODE.WAITING_QUIZ){
            clearInterval(this.state.gameLoop);
            
            this.socket.current.emit('quiz', {roomId: this.state.matchInfo.roomId, quizKey: quizKey,
                type: 'enter'
            });
            const quiz = this.gameManager.gameData.quizMap.get(quizKey);
            console.log(`at quiz ${quizKey}`);
            console.log(quiz);

            this.setState({...this.state, gameLoop: null, mode: mode, quizKey : quizKey,
                quiz: quiz,
            });
                        
        }
        if(mode == GAME_MODE.QUIZ) {
            clearInterval(this.state.gameLoop);
            if(this.state.quizKey) {
                const quiz =  (this.gameManager.gameData as GameData).quizMap.get(this.state.quizKey);
                this.setState({...this.state,gameLoop: null, mode: mode, quiz: quiz});
            }
        }
        else {
            
            if(mode==GAME_MODE.ACTION) {
                if(this.state.mode == GAME_MODE.QUIZ){
                    this.gameManager.mainCharacter.position.x -= this.gameManager.mainCharacter.dir * this.gameManager.mainCharacter.currentShape.w/2;
                    this.socket.current.emit('quiz', {
                        roomId: this.state.matchInfo.roomId, 
                        quizKey: this.state.quizKey,
                        result: result,
                        type: 'leave',
                    })
                } 
                if(!this.state.gameLoop) {
                    const loop = setInterval(this.gameLoop, timeFrame);
                    this.setState({...this.state, gameLoop: loop, mode: mode});
                }
            }
        }
    }   
    

    gameLoop(){
        if(!this.state.bufferCtx || !this.state.ctx) return;
		this.gameManager.mainCharacter.calAll();
		this.gameManager.calAllObjects();
        this.state.bufferCtx.clearRect(0,0,screenWidth,screenHeight);
        this.state.bufferCtx.beginPath();
		this.gameManager.drawBackground(this.state.bufferCtx);

		this.gameManager.drawObject(this.state.bufferCtx);
        this.gameManager.mainCharacter.draw(this.state.bufferCtx);

		
		this.state.bufferCtx.closePath();

        this.gameManager.mainCharacter.calNextFrame();
	} 
    

    handleGameRequest = ()=>{
        if(!this.socket.current){
            toast.error("You are not connected, please wait a few seccond")
            return;
        }

        this.socket.current.emit("game-req", {
            username: getUsernameFromStorage(),
            roundId: 'r1',
        });
        this.setState({...this.state, pageMode: GAME_PAGE_STATE.WAITING_MATCH});
    }
    
    handleStart(){
        if(!this.state.gameLoop) {
            this.setState({
                ...this.state,
                gameLoop : setInterval(this.gameLoop, timeFrame),
                waitingGame: false, pageMode: GAME_PAGE_STATE.IN_MATCH,
            });
        }
        else {
            clearInterval(this.state.gameLoop);
            this.setState({...this.state, gameLoop: null});
        }
    }    
   
    render(): React.ReactNode {
       
        return <div className="game-container">
		
        <canvas ref = {this.bufferCanvas} style={{display:"none"}} width = {screenWidth} height = {screenHeight}  ></canvas>
        
        <div className="main">
            <div className="game-screen-area">
                <canvas ref= {this.mainCanvas} width={screenWidth} height= {screenHeight} 
                    style={{position: "absolute", }}
                >
                </canvas>
                <div style={{position: "absolute", width: screenWidth, height: screenHeight, display: this.state.mode==GAME_MODE.QUIZ?"block":"none"}}>
                    {
                    this.state.quizKey?
                    <QuizPanel 
                        quizData={this.state.quiz.quizData}
                        quizType = {this.state.quiz.quizType}
                        quizKey = {this.state.quizKey}
                        handleChangeMode = {this.handleChangeMode}
                    />:''
                    }
                    
                </div>
            </div>
            {
                (this.state.pageMode==GAME_PAGE_STATE.IN_MATCH)?
                <img src='bg8.png' width={screenWidth} height={screenHeight}/>:
                (this.state.pageMode==GAME_PAGE_STATE.WAITING_MATCH)?
                <div style={{width: screenWidth, height: screenHeight}} className='waiting-bgr'>
                    <span>Waiting for other users </span> <Loader/>
                </div>:
                <div className='init-screen' style={{width: screenWidth, height: screenHeight}}>
                    <img src='bg8.png' width={screenWidth} height={screenHeight} className='img-init'/>
                    {this.myUsername?<Button onClick={this.handleGameRequest} className='btn-start'>Start</Button>
                    :<div className='start-btn'>Please login before</div>}
                </div>
            }
        <div>
            {this.state.matchState?
            <Table className="score-table">
                <thead>
                <tr>
                    <th key= {0}></th>
                    {Object.keys(this.state.matchState.quizStates).map((quizKey,index)=>
                        <th key = {index+1}>Quiz {index+1}</th>)
                    }
                </tr>
                </thead>
                <tbody>
                    {this.state.matchState.socketInfos.map((socket:any)=><tr>
                        <td>{getFixedUsername(socket.username)}</td>
                        {Object.keys(this.state.matchState.quizStates).map(quizKey => {
                            return (<td key = {quizKey}>
                                {socket.solvedQuizs[quizKey]?"solved":"unsolved"}
                            </td>);
                        })}
                    </tr>)}
                   
                </tbody>
                
            </Table>:""}
            <img src='panel.png' width={0} height={0}/>
            <img src='fire.png' width ={0} height={0}/>
            <img src='grass-card.png'width ={0} height={0}/>
            <img src='fire-card.png'width ={0} height={0}/>

        </div>
        </div>
        <div style={{height:'500px'}}/>
        </div>
    }
}
export default GameContainerV2;
/**
 * matchState: {
 *  roundId: string;
 *  users: Array<string>; 
 *  startTime: string; //timestamp
 *  maxTime: string; //-> number
 *  quizSolveds: Array<{
 *    "quizKey1": Array<{
 *         "username1": timeSolve (timestamp number),
 *         "username2": ...
 *      }>,
 *    "quizKey2": ...
 *  }>;
 *  quizStates : {
 *      "quizKey1" : {
 *         quizState : number;
 *         socketId: null | string; // socketId keep this quiz
 *
 *         },
 *      "quizKey2" : ...
 *  },
 *  socketInfos : Array<{socketId: string; username: string}>
 * }
 * <div>
            {(this.state.matchInfo!=null)?<div>
                RoomID: {this.state.matchInfo.roomId}
            <br/>
            <br/>
            </div>:""}
            {this.state.stateParam?this.state.stateParam.greeting:""}
        </div>
 */