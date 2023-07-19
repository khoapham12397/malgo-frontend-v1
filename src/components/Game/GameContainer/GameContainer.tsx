import { useEffect, useRef, useState } from "react"

export const GameContainer = ()=>{
    const bufferCanvas = useRef<HTMLCanvasElement>(null);
    const mainCanvas = useRef<HTMLCanvasElement>(null);

	const [loop , setLoop] = useState<any>(null);
	const [gameManager, setGameManager] = useState<any>(null);

    const [bufferCtx, setBufferCtx] = useState<any>(null);
    
    const [ctx , setCtx] = useState<any>(null);

    const handleStart = () =>{
        
        if(bufferCtx && ctx) {
			if(!loop){
            	const l = setInterval(gameLoop, 75);
				setLoop(l);
			}
			else {
				clearInterval(loop);
				setLoop(null);
			}
        }
    }    
    function gameLoop(){
		gameManager.mainCharacter.calAll();
		//gameManager.calAllObjects();

		bufferCtx.beginPath();
		
		gameManager.drawBackground(bufferCtx);
		gameManager.drawObject(bufferCtx);
		
		//gameManager.drawController(bufferCtx);
		//console.log("opponent == null "+ (gameManager.opponent == null));
		
		bufferCtx.closePath();

		ctx.drawImage(bufferCanvas.current,0,0);
		gameManager.mainCharacter.calNextFrame();
				
		//sendParamState();

	}
    function handleKeyDown(e:any){
		if(e.keyCode == 39) {
			
			if(gameManager.mainCharacter.dir==-1){
				gameManager.mainCharacter.checkCollisonLeftWall();
				gameManager.mainCharacter.dir=1;

			}
			
			gameManager.mainCharacter.move();
		}
		if(e.keyCode == 37) {
			if(gameManager.mainCharacter.dir==1) {
				gameManager.mainCharacter.checkCollisonWall();
				gameManager.mainCharacter.dir=-1
			}
			
			gameManager.mainCharacter.move();

			
			
		}
		if(e.key == 'c') {
			//gameManager.mainCharacter.slash();
			//gameManager.mainCharacter.startKiballType1();
			if(!gameManager.mainCharacter.action.isAttacking) 	
				gameManager.mainCharacter.attackCtl.pendingAttack = true;		
		}
		if(e.key=='x' && !gameManager.mainCharacter.flyCtl.nextWall) 
			gameManager.mainCharacter.fly();

		if(e.key=='b' || e.key=='n') alert(e.key);
	}

	function handleKeyUp(e: any){
		if(e.keyCode == 39 || e.keyCode == 37) gameManager.mainCharacter.stopMove();
		if(e.key == 'x' && gameManager.mainCharacter.flyCtl.nextWall) {
			gameManager.mainCharacter.fly();
		}
		if(e.key == 'c'){
			gameManager.mainCharacter.slash();
		}
	}
    const handleChangeMode = (mode: number) =>{

	}
	useEffect(()=>{
		//setGameManager(new GameManager(new GameData([],)));
		console.log("set gamemanaer");
	},[]);

    useEffect(() => {
        if(!bufferCanvas || !mainCanvas) return;

		if(!bufferCtx || !ctx) {
        	setBufferCtx(bufferCanvas.current?.getContext('2d'));
        	setCtx(mainCanvas.current?.getContext('2d'));
		}
        /*
		gameManager.bufferCtx = bufferCtx;
		gameManager.ctx = ctx;
		gameManager.bufferCanvas = bufferCanvas.current;
        */
		//setGameManager(new GameManager());	

		window.addEventListener("keydown",handleKeyDown);
		window.addEventListener("keyup",handleKeyUp);

	},[handleKeyDown, handleKeyUp]);

    return (<>
        <div style={{display: "flex"}}>
            <button onClick={handleStart}>{loop==null?"start":"pause"}</button>
        </div>
		<canvas ref = {bufferCanvas} style={{display:"none"}} width = "550px" height = "400px"  ></canvas>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <canvas ref= {mainCanvas} width="550px" height="400px">

</canvas>
        </div>
        
    </>)
}