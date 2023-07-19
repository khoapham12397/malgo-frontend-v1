import { MettarBot } from "../GameBot/MettartBot";
import { Sasuke } from "../GameCharacter/Sasuke";
import { SasukeV2 } from "../GameCharacter/SasukeV2";
import { Trunks } from "../GameCharacter/Trunks";
import { GameConfig } from "../GameConfig";
import { gameConfig } from "../GameConfig";
import { GameData } from "../GameData/GameData";
import { LongKi } from "../LongKi/LongKi";
import { Explosion } from "../UnmoveObject/Explosion";
import { FireCard } from "../UnmoveObject/FireCard";

type Cell = {
	col: number;
	row: number;	
}
export class GameManager{
    //gameConfig : GameConfig;
    posCameraX : number;
    posCameraY: number;
    configTiles: Array<any>;
	imgTile0: HTMLImageElement;

	imgTile1 : HTMLImageElement;
	imgTile2 : HTMLImageElement;
	imgTile3 : HTMLImageElement;

	imgWoodBox : HTMLImageElement;

	
	boxSlashCnt : Map<string,number>;
	boxState : boolean;

	explosionList: Array<Explosion>;
	fireCardList: Map<string,FireCard>;

	
	gameData: GameData;

	changeMode: (mode: number, quizKey: string, result: number | null) => void;

	imgFire : HTMLImageElement;
	imgMettartBot: HTMLImageElement;
	imgMettartBotRight: HTMLImageElement;

	botList: Array<MettarBot>;
	longKi: LongKi | null;
	bgImage : HTMLImageElement;
	botPosList : Array<Cell>;
	staticBotList: Array<MettarBot>;
	mainCharacter: any;

    constructor(gameData: GameData, changeMode: (mode:number, quizKey: string, result: number | null)=>void){
        this.posCameraX = 50;
        this.posCameraY = 100;
        this.configTiles = [{sx : 200, sy: 880, ow:40, oh: 20},{sx : 196 , sy: 457, ow: 60, oh: 30}, {sx: 325 , sy: 324, ow: 66, oh:33},
			{sx : 388 , sy: 877, ow: 60, oh:31}];
		
		this.imgTile0 = new Image();
		this.imgTile0.src = "tile-0.png";

		this.imgTile1 = new Image();
		this.imgTile1.src = "tile-1.png";

		this.imgTile2 = new Image();
		this.imgTile2.src = "tile-2.png";

		this.imgTile3 = new Image();
		this.imgTile3.src = "tile-3.png";

		this.imgWoodBox = new Image();
		this.imgWoodBox.src = "wood-box-1.png";

		this.imgFire = new Image();
		this.imgFire.src = "fire-card.png";
		
		this.imgMettartBot = new Image();
		this.imgMettartBot.src= "MettaurD2.png";

		this.imgMettartBotRight = new Image();
		this.imgMettartBotRight.src= "mettart-r.png";

		this.bgImage = new Image();
		this.bgImage.src = "bg8.avif";

		this.mainCharacter = new SasukeV2(this, {x: 400, y: 220});
		this.boxSlashCnt = new Map();
		this.boxState = false;
		this.explosionList = [];
		this.fireCardList = new Map();
		this.gameData = gameData;
		this.changeMode = changeMode;
		this.botList = [];
		this.longKi = null;
		for(let i=0;i<1;i++){
			this.botList.push(new MettarBot(this, {x: 1710, y: 815}, this.imgMettartBot, this.imgMettartBotRight,"bot-1"));
			this.botList.push(new MettarBot(this, {x: 1650, y: 815}, this.imgMettartBot, this.imgMettartBotRight,"bot-2"));
			this.botList.push(new MettarBot(this, {x: 1750, y: 815}, this.imgMettartBot, this.imgMettartBotRight,'bot-3'));
		}
		
		this.botPosList = [{col : 28, row: 9}];
		this.staticBotList = [new MettarBot(this, {x: 28 * 90, y: 9*90}, this.imgMettartBot, this.imgMettartBotRight,"bot-static")];
	}    
    
	drawBackground(ctx : CanvasRenderingContext2D){
		
		let firstRow =  Math.floor(this.posCameraY /gameConfig.tileCfg.h);
		let firstCol = Math.floor(this.posCameraX /gameConfig.tileCfg.w);

		let finalRow = Math.floor((this.posCameraY + gameConfig.cameraCfg.height)/gameConfig.tileCfg.h);
		let finalCol = Math.floor((this.posCameraX + gameConfig.cameraCfg.width)/gameConfig.tileCfg.w);
		
		

		//ctx.fillStyle = "dimgray"
		//ctx.fillStyle = "#111111";
		//ctx.fillRect(0,0,550,400);
		// vi du viec ve 1 tam hinh lon trong 1 hinh  nho dung:

		// 800-626 = 174 500-443 = 
		//ctx.filter = "contrast(60%)";
		// delta = 400 => ding: 
		//this.mainCharacter.position.x;
		// duoc het dung; van de dangla ga;
		// no la posCamera dung; /a dig:
		//ctx.clearRect(0,0,550,400);
		/*
		const startX = this.posCameraX % 626;		
		ctx.drawImage(this.bgImage,-startX,0,626,443);

		if(startX!=0){
			ctx.drawImage(this.bgImage, 626-startX, 0, 626,443);
		}*/
		/*
		ctx.drawImage(this.bgImage,626,0,174,443);
		ctx.drawImage(this.bgImage,0,443,626,57);
		ctx.drawImage(this.bgImage,626,443,174,57);
		*/
		ctx.filter ="none";
		for(let i = firstRow ; i <= finalRow;i++){
			//if(gameConfig.backgroundData[i] == undefined) console.log("i = "+i);
			for(let j = firstCol ; j<= finalCol;j++){
				let py = i * gameConfig.tileCfg.h - this.posCameraY;
				let px = j * gameConfig.tileCfg.w - this.posCameraX;

					let tileType = 0;
					
					tileType = Number(gameConfig.backgroundData[i][j]);
					let config = this.configTiles[tileType];
					/*
					if(tileType==0) ctx.drawImage(this.imgTile0,0,0, 58, 58
						, px,py, gameConfig.tileCfg.w, gameConfig.tileCfg.h);
					*/
					if(tileType == 2)
					ctx.drawImage(this.imgTile2,0,0, 64, 30
						, px,py, gameConfig.tileCfg.w, gameConfig.tileCfg.h);

					if(tileType == 1) {
						ctx.drawImage(this.imgTile1,0,0,61,56,px,py,
						gameConfig.tileCfg.w,gameConfig.tileCfg.h);
					//	ctx.fillStyle = 'black';
					//	ctx.fillRect(px,py, gameConfig.tileCfg.w, gameConfig.tileCfg.h);
					}
					if(tileType ==3) {
						ctx.drawImage(this.imgTile3,0,0,63,63,px,py,
							gameConfig.tileCfg.w,gameConfig.tileCfg.h);
					}
					if(tileType == 4) {
						if(this.boxState) {
							ctx.filter = "contrast(70%)";

						}
						else ctx.filter = "none";
						ctx.drawImage(this.imgWoodBox,0,0, 250, 250
							, px,py, gameConfig.tileCfg.w, gameConfig.tileCfg.h);
						ctx.filter ="none";
					}
				
			}
		}	
	}
	
	calMainCharacter() {
		if(this.mainCharacter)
		this.mainCharacter.calAll();
	}

	calAllObjects(){
		let explosions = [];
		for(let i=0;i<this.explosionList.length;i++){
			this.explosionList[i].calAll();
			if(this.explosionList[i].isAlive){
				explosions.push(this.explosionList[i]); 
			}
		}
		this.explosionList = explosions;		
		
		this.fireCardList.forEach((item,key)=>{
			if(!item.isAlive) this.fireCardList.delete(key);
		})

		for(let i=0;i<this.botList.length;i++){
			if(this.botList[i].isAlive){
				this.botList[i].calAll();
			}		
		}
		this.staticBotList.forEach(bot=>{
			if(bot.isAlive) bot.calAll();
		})
		if(this.longKi) {
			this.longKi.checkAlive();
			if(!this.longKi.isAlive) this.longKi = null;
		}
		
	}
	drawObject(ctx : CanvasRenderingContext2D) {		
		//this.mettartBot.draw(ctx);
		for(let i=0;i<this.explosionList.length;i++) {
			this.explosionList[i].draw(ctx);
		}
		
		this.fireCardList.forEach(item => {
			item.draw(ctx);
		})
		
		for(let i=0;i<this.botList.length;i++) {
			this.botList[i].draw(ctx);
			
		}
		this.staticBotList.forEach(bot=> bot.draw(ctx));
		if(this.longKi) this.longKi.draw(ctx);
	}
	
}