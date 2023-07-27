import { gameConfig } from '../GameConfig';
import { GAME_MODE } from '../GameContainer/GameContainerV2';
import { QUIZ_STATE } from '../GameData/GameData';
import { GameManager } from '../GameManager/GameManager';
import { FireCard, fireCardCfg } from './FireCard';
import { Position } from '../GameType';

const configBoom = [
  {
    sx: 1,
    sy: 400,
    oWidth: 191,
    oHeight: 150,
    width: 127,
    height: 100,
    cntFrames: 5,
    imgSrc: 'fire.png'
  },
  {
    sx: 8,
    sy: 217,
    oWidth: 190,
    oHeight: 143,
    width: 129,
    height: 100,
    cntFrames: 5,
    imgSrc: 'fire.png'
  }
];

export class Explosion {
  gameManager: GameManager;
  type: number;
  position: Position;
  indFrame: 0;
  image: HTMLImageElement;
  isAlive: boolean;
  isOfBox: boolean;
  constructor(
    gameManager: GameManager,
    type: number,
    pos: Position,
    isOfBox: boolean
  ) {
    this.gameManager = gameManager;
    this.type = type;
    this.position = pos;
    this.indFrame = 0;
    this.image = new Image();
    this.image.src = configBoom[this.type].imgSrc;

    this.isAlive = true;
    this.isOfBox = isOfBox;
    //console.log("create explosion");
  }
  checkIsAlive() {
    if (this.indFrame == configBoom[this.type].cntFrames) return false;
    return true;
  }
  calAll() {
    this.isAlive = this.checkIsAlive();
    if (!this.isAlive && this.isOfBox) {
      const row = Math.floor(this.position.y / gameConfig.tileCfg.h),
        col = Math.floor(this.position.x / gameConfig.tileCfg.w);
      const quizSt = this.gameManager.gameData.quizState.get(row + '-' + col);

      if (quizSt) {
        const pos = {
          x: col * gameConfig.tileCfg.w + fireCardCfg.w / 2,
          y:
            row * gameConfig.tileCfg.h +
            fireCardCfg.h / 2 -
            (fireCardCfg.h - gameConfig.tileCfg.h)
        };
        //console.log("add fire card");
        this.gameManager.fireCardList.set(
          row + '-' + col,
          new FireCard(this.gameManager, pos, row + '-' + col, quizSt.state)
        );
      }
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isAlive) return;
    let config = configBoom[this.type];

    let px = config.sx + this.indFrame * config.oWidth,
      py = config.sy;
    //console.log(this.image.src);
    ctx.drawImage(
      this.image,
      px,
      py,
      config.oWidth,
      config.oHeight,
      Math.round(this.position.x - this.gameManager.posCameraX - 20),
      Math.round(this.position.y - this.gameManager.posCameraY - 10),
      config.width,
      config.height
    );
    this.indFrame += 1;
  }
}
