import { gameConfig } from "../GameConfig";
import { GameManager } from "../GameManager/GameManager";

const STATE = {
    IDLE: 0,
    RUNNING: 1,
    FLYING: 2,
    ATTACKING: 3,
    HURTING_L1: 4,
}
export class Opponent {
    gameManager: GameManager;
    
    position: Position;
    step: number; gravity: number; vy: number; 
    
    indFrame: number; dir: number;

    image : HTMLImageElement;
    imageAttack : HTMLImageElement;
    
    attackCtl: AttackCtl;
    flyCtl: FlyCtl;
    onGroundCtl : OnGroundCtl;
    hurtCtl : HurtCtl;

    currentState: number;
    action: GameAction;

    cntFrameRun : number;
    indFrameRun : number;

    tileCfg: TileCfg;
    cameraCfg: CameraCfg;
    backgroundData: Array<any>;

    scale: number;
    configLefts : Array<any>;
    configRights: Array<any>;
    
    configAttackLefts: Array<any>;
    configAttackRights: Array<any>;

    currentShape: CharShape;
    mapCfg: MapCfg;

    prePosY: number;
    graphic: any;
    currentQuiz: string | null;

    constructor(gameManager : GameManager, pos: Position){
        this.gameManager = gameManager;
        this.position = pos;
        this.step = 16; this.gravity = 8;  this.vy = 38;
        this.indFrame = 0; this.dir = 1;
        this.image = new Image(); this.image.src = "trunks-tiny-rm1.png";
        this.imageAttack = new Image();
		this.imageAttack.src = "trunks-attack-rm.png";
	
        
		
        this.attackCtl = {
            attackType: 0,
            attackLv: 0,
            cntAttackLv: 0,
            pendingAttack: false,
        }
        
        this.currentState = STATE.IDLE;

        this.action = {
            isMoving: false,
            isAttacking: false,
            isFalling: false,
            isFlying: false,
            isHurting: false,
        }

		
        this.flyCtl = {
            fallingTime: 0,
            flyTime: 0,
            flyDown : true,
            climbWall: false,
            nextWall: false,
        }
        this.onGroundCtl = {
            isOnGround : false,
            colOnGround: null,
            colOnGroundBegin: null,
            colOnGroundEnd: null,
        }

        this.tileCfg = gameConfig.tileCfg 
		this.cameraCfg = gameConfig.cameraCfg;

		this.backgroundData = gameConfig.backgroundData;

        this.cntFrameRun = 0;
        this.scale=1;

        this.configLefts = [
			{sx : 1246, sy: 1, ow : 100, oh: 133, w: 100, h: 133, cnt: 6},
			{sx : 1372, sy: 349, ow: 130, oh: 130, w: 130, h: 130, cnt: 4, skipFrame : 1},
			{sx : 1375,sy: 155, ow: 96, oh: 158, w: 96, h:158, cnt: 2},
			{sx : 1278, sy: 648, ow: 170, oh: 138, w: 170, h: 138, cnt: 7},
			{sx : 1675, sy: 5, ow: 107, oh: 135, w: 107, h: 135, cnt: 4},
			{sx : 1993, sy: 168, ow: 135, oh:127, w: 135, h: 127, cnt: 3, skipFrame: 3}]
		//191,155
		this.configRights = [
			{sx : 0, sy: 0, ow : 100, oh: 133, w: 100, h: 133, cnt: 6},
			{sx : 3, sy: 346, ow: 130, oh: 130, w: 130, h: 130, cnt: 4,skipFrame :1},
			{sx : 95,sy: 155, ow: 96, oh: 158, w: 96, h:158, cnt: 2},
			{sx : 258, sy: 496, ow: 170, oh: 138, w: 170, h: 138, cnt: 7},
			{sx : 1356, sy: 5, ow: 107, oh: 135, w: 107, h: 135, cnt: 4},
			{sx : 1787, sy: 348, ow: 135, oh:127, w: 135, h:127, cnt: 3, skipFrame:3 }]

		for(let i=0;i<this.configLefts.length;i++){
			this.configLefts[i].w = this.configLefts[i].w*this.scale;
			this.configLefts[i].h = this.configLefts[i].h*this.scale;
			this.configRights[i].w = this.configRights[i].w*this.scale;
			this.configRights[i].h = this.configRights[i].h*this.scale;
		}
        this.configAttackLefts = [
            {sx: 2221, sy:964, ow: 168, oh:138, w: 168, h:138, cnt: 7},// onGroundSlash-0
            {sx: 1817 , sy: 2 ,ow: 195, oh: 149,w: 195, h: 149, cnt:5},//onGroundSlash-1
            {sx: 2135, sy: 168, ow: 190, oh: 177, w: 190, h: 177, cnt:6},// 
            {sx: 1565, sy: 751, ow: 172, oh: 187, w: 172, h:187, cnt:10},
            {sx: 1982, sy: 559, ow: 103, oh: 153, w: 103, h: 153, cnt: 10}
            ]
    
        this.configAttackRights = [
            {sx: 2, sy: 960, ow: 168, oh:138, w: 168, h:138, cnt: 7},// onGroundSlash-0
            {sx: 5, sy: 0,	ow: 195, oh: 149,w: 195, h: 149, cnt:5},//onGroundSlash-1
            {sx: 5, sy: 162, ow: 190, oh: 177, w: 190, h: 177, cnt:6},// 
            {sx: 3, sy: 354, ow: 172, oh: 187, w: 172, h:187, cnt:10},
            {sx: 2, sy: 552, ow: 103, oh: 153, w: 103, h: 153, cnt: 10}
        ]
    
        for(let i=0;i<this.configAttackLefts.length;i++){
                this.configAttackLefts[i].w = this.configAttackLefts[i].w*this.scale;
                this.configAttackLefts[i].h = this.configAttackLefts[i].h*this.scale;
                this.configAttackRights[i].w = this.configAttackRights[i].w*this.scale;
                this.configAttackRights[i].h = this.configAttackRights[i].h*this.scale;
        }

       
        this.currentShape = {
            h: this.configLefts[0].h,
            w: this.configLefts[0].w,
        }
        
        this.mapCfg = gameConfig.mapCfg;

        this.hurtCtl = {cntHurt: 0};
		this.indFrameRun = 0;
        this.prePosY = this.position.y;
        this.graphic = null;
        this.currentQuiz = null;
    }
    setParamState(data : any){
		//this.bufferData=data;
		this.position.x= data.posX; this.position.y = data.posY; 
		this.currentState = data.currentState;
		this.dir = data.dir;
        this.attackCtl.attackType = data.attackType;

		this.indFrame = data.indFrame ; this.indFrameRun = data.indFrameRun;
        if(this.currentState == STATE.ATTACKING) {
            this.currentShape.w = this.configAttackLefts[this.currentState].w;

            this.currentShape.h = this.configAttackLefts[this.currentState].h;
        }
        else {
		    this.currentShape.w = this.configLefts[this.currentState].w;
		    this.currentShape.h= this.configLefts[this.currentState].h;
        }
    }
	


	checkInCamera(){
		return (this.position.x + this.currentShape.w/2 >= this.gameManager.posCameraX &&
		this.position.x - this.currentShape.w/2<= this.gameManager.posCameraX +gameConfig.cameraCfg.width &&
		this.position.y + this.currentShape.h/2 >= this.gameManager.posCameraY &&
		this.position.y - this.currentShape.h/2 <= this.gameManager.posCameraY + gameConfig.cameraCfg.height);
	}
    draw(ctx: CanvasRenderingContext2D){
		if(!this.checkInCamera() || this.currentQuiz != null) return;
        console.log("draw op");
        let config = null;

		let px = this.position.x - this.gameManager.posCameraX - this.currentShape.w/2 + this.dir*this.step*0.95,
			py = this.position.y - this.currentShape.h/2 - this.gameManager.posCameraY ,
			sx = null, sy = null, ow = null, oh = null, w =null, h=null;

        if(this.currentState != STATE.RUNNING) 
            py += 2;
        if(this.currentState == STATE.FLYING) py-=2;     
        if(this.currentState == STATE.ATTACKING && this.attackCtl.attackType == 1){
            py+= 15;
        } 
		//if(this.dir==-1) px -= this.currentShape.w;

		if(this.currentState == STATE.ATTACKING) {
			config = (this.dir==1)?this.configAttackLefts[this.attackCtl.attackType]:this.configAttackRights[this.attackCtl.attackType];
		}
		else config = (this.dir==1)?this.configLefts[this.currentState]:this.configRights[this.currentState];

		
		if(this.currentState == STATE.RUNNING){
			sx = config.sx - this.indFrameRun*config.ow * this.dir; sy = config.sy;
		}
		else {
			sx = config.sx - this.indFrame*config.ow * this.dir; sy = config.sy;
		}
		
		ctx.drawImage((this.currentState==STATE.ATTACKING)?this.imageAttack:this.image, sx, sy, config.ow, config.oh, 
			Math.round(px), Math.round(py),config.w,config.h);
		
	}
}