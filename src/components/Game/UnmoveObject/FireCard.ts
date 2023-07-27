import { gameConfig } from '../GameConfig';
import { GameManager } from '../GameManager/GameManager';
import { QUIZ_STATE } from '../GameData/GameData';
import { Cell, Position } from '../GameType';

export const fireCardCfg = {
  sx: 1,
  sy: 1,
  ow: 78,
  oh: 104,
  w: 78,
  h: 104
};

export class FireCard {
  gameManager: GameManager;
  img: HTMLImageElement;
  imgGrass: HTMLImageElement;
  imgLock: HTMLImageElement;

  isAlive: boolean;

  config: any;
  configLock: any;

  position: Position;
  cell: Cell;
  state: number;
  quizKey: string;

  constructor(
    gameManager: GameManager,
    pos: Position,
    quizKey: string,
    state: number
  ) {
    this.gameManager = gameManager;
    this.img = new Image();
    this.img.src = 'fire-card.png';

    this.imgLock = new Image();
    this.imgLock.src = 'lock.png';

    this.imgGrass = new Image();
    this.imgGrass.src = 'grass-card.png';

    this.isAlive = true;
    this.position = pos;

    this.config = {
      sx: 1,
      sy: 1,
      ow: 78,
      oh: 104,
      w: 52,
      h: 70
    };
    this.configLock = {
      sx: 0,
      sy: 0,
      ow: 310,
      oh: 441,
      w: 52,
      h: 70
    };
    this.cell = {
      row: Math.floor(this.position.y / gameConfig.tileCfg.h),
      col: Math.floor(this.position.x / gameConfig.tileCfg.w)
    };
    this.state = state;
    this.quizKey = quizKey;
  }

  setIsAlive(state: boolean) {
    this.isAlive = state;
  }

  checkInCamera() {
    const posCameraX = this.gameManager.posCameraX,
      posCameraY = this.gameManager.posCameraY;
    return (
      this.position.x + this.config.w / 2 >= posCameraX &&
      this.position.x - this.config.w / 2 <=
        posCameraX + gameConfig.cameraCfg.width &&
      this.position.y - this.config.h / 2 <=
        posCameraY + gameConfig.cameraCfg.height &&
      this.position.y + this.config.h / 2 >= posCameraY
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.isAlive && this.checkInCamera()) {
      if (
        this.state == QUIZ_STATE.OPENING &&
        !this.gameManager.gameData.solvedQuizs[this.quizKey]
      )
        ctx.drawImage(
          this.imgGrass,
          Math.round(
            this.position.x - this.config.w / 2 - this.gameManager.posCameraX
          ),
          Math.round(
            this.position.y -
              this.config.h / 2 -
              5 -
              this.gameManager.posCameraY
          ),
          this.config.w,
          this.config.h
        );
      else if (this.state == QUIZ_STATE.KEEPING) {
        ctx.drawImage(
          this.imgLock,
          Math.round(
            this.position.x -
              this.configLock.w / 2 -
              this.gameManager.posCameraX
          ),
          Math.round(
            this.position.y -
              this.configLock.h / 2 -
              5 -
              this.gameManager.posCameraY
          ),
          this.configLock.w,
          this.configLock.h
        );
      } else {
        ctx.drawImage(
          this.img,
          Math.round(
            this.position.x - this.config.w / 2 - this.gameManager.posCameraX
          ),
          Math.round(
            this.position.y -
              this.config.h / 2 -
              5 -
              this.gameManager.posCameraY
          ),
          this.config.w,
          this.config.h
        );
        ctx.filter = 'none';
      }
    }
  }
}
