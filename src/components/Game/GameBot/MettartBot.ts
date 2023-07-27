import { gameConfig } from '../GameConfig';
import { GameManager } from '../GameManager/GameManager';
import { CharShape, Position } from '../GameType';
import { Explosion } from '../UnmoveObject/Explosion';

export {};
//import {Bullet} from './bullet';
const STATE = {
  IDLE: 0,
  RUNNING: 1,
  JUMPING: 2,
  SHOOTING: 3
};
type BotAction = {
  isRunning: boolean;
  isJumping: boolean;
  isShooting: boolean;
  isFalling: boolean;
};

type BotFlyCtl = {
  fallingTime: number;
  flyTime: number;
};
type BotHurtCtl = {
  cntHurt: number;
  isHurting: boolean;
  hurtFrameCnt: number;
  maxFrame: number;
};

export class MettarBot {
  gameManager: GameManager;
  position: Position;
  image: HTMLImageElement;
  imageRight: HTMLImageElement;

  config: Array<any>;
  configRight: Array<any>;

  indFrame: number;
  currentState: number;
  dir: number;
  action: BotAction;

  flyCtl: BotFlyCtl;

  step: number;
  name: string;

  currentShape: CharShape;

  gravity: number;
  vy: number;

  cntUpdate: number;
  isAlive: boolean;
  hurtCtl: BotHurtCtl;
  isInCamera: boolean;

  constructor(
    gameManager: GameManager,
    pos: Position,
    img: HTMLImageElement,
    imgRight: HTMLImageElement,
    name: string
  ) {
    this.gameManager = gameManager;
    //this.image = new Image();
    //this.image.src = "MettaurD2.png";
    this.image = img;
    this.imageRight = imgRight;

    this.position = pos;

    this.config = [
      { sx: 34, sy: 10, ow: 31, oh: 34, w: 31, h: 34, cnt: 6 },
      { sx: 13, sy: 50, ow: 31, oh: 39, w: 31, h: 39, cnt: 8 },
      { sx: 24, sy: 97, ow: 32, oh: 37, w: 32, h: 37, cnt: 7 },
      { sx: 18, sy: 137, ow: 34, oh: 39, w: 34, h: 39, cnt: 7 }
    ];

    this.configRight = [
      { sx: 205, sy: 10, ow: 31, oh: 34, w: 31, h: 34, cnt: 6 },
      { sx: 226, sy: 50, ow: 31, oh: 39, w: 31, h: 39, cnt: 8 },
      { sx: 214, sy: 97, ow: 32, oh: 37, w: 32, h: 37, cnt: 7 },
      { sx: 219, sy: 137, ow: 34, oh: 39, w: 34, h: 39, cnt: 7 }
    ];

    STATE.IDLE = 0;
    STATE.RUNNING = 1;
    STATE.JUMPING = 3;
    STATE.SHOOTING = 2;
    this.indFrame = 0;
    this.currentState = 0;
    this.dir = -1;

    this.action = {
      isRunning: false,
      isJumping: false,
      isShooting: false,
      isFalling: false
    };

    this.step = Math.floor(Math.random() * 10) % 2 ? 5 : 7;
    this.currentShape = {
      w: this.config[this.currentState].w,
      h: this.config[this.currentState].h
    };

    this.gravity = 4;

    this.flyCtl = {
      fallingTime: 0,
      flyTime: 0
    };

    this.vy = 15;
    this.cntUpdate = 0;
    this.isAlive = true;
    this.hurtCtl = {
      cntHurt: 0,
      hurtFrameCnt: 0,
      isHurting: false,
      maxFrame: 0
    };
    this.name = name;
    this.isInCamera = false;
  }

  run() {
    if (this.action.isRunning) return;

    this.currentState = STATE.RUNNING;
    this.currentShape.w = this.config[this.currentState].w;
    this.currentShape.h = this.config[this.currentState].h;
    this.indFrame = 0;
    this.action.isRunning = true;
    this.action.isShooting = false;
  }
  stopRun() {
    this.action.isRunning = false;
    //		this.indFrame = 0;
    if (this.action.isShooting) return;
  }
  calPosition() {
    if (this.action.isRunning) {
      this.position.x += this.step * this.dir;
    }

    if (this.action.isFalling && !this.action.isJumping) {
      this.position.y += this.gravity * (0.5 + this.flyCtl.fallingTime);
      this.flyCtl.fallingTime += 1;
    }
  }

  shoot() {
    if (this.action.isShooting) {
      if (
        (this.indFrame == 1 ||
          this.indFrame == this.config[this.currentState].cnt - 1) &&
        this.cntUpdate == 0
      ) {
        //let bullet = new Bullet(this.gameManager, this.posX +this.currentW/2, this.posY+this.currentH/2 ,1);
        //this.gameManager.enemyBullets.push(bullet);
      }
      return;
    }
    this.indFrame = 0;
    this.currentState = STATE.SHOOTING;
    this.currentShape.w = this.config[this.currentState].w;
    this.currentShape.h = this.config[this.currentState].h;
    this.action.isShooting = true;
  }

  jump() {}

  checkFreeFall() {
    let indRow = Math.floor(
      (this.position.y + this.currentShape.h / 2 + this.gravity) /
        gameConfig.tileCfg.h
    );
    if (indRow > gameConfig.mapCfg.row - 1 || indRow < 0) {
      console.log('out map at check free fall , indRow=' + indRow);
      this.isAlive = false;
      return;
    }
    let indCol = Math.floor(this.position.x / gameConfig.tileCfg.w);

    this.action.isFalling = gameConfig.backgroundData[indRow][indCol] == '0';
  }

  checkOnGround() {
    let indRow = Math.floor(
      (this.position.y + this.currentShape.h / 2 + this.gravity) /
        gameConfig.tileCfg.h
    );

    if (indRow > gameConfig.mapCfg.row - 1 || indRow < 0) {
      console.log('out map at checkonground , indRow=' + indRow);
      this.isAlive = false;
      return;
    }

    let indCol = Math.floor(this.position.x / gameConfig.tileCfg.w);

    if (gameConfig.backgroundData[indRow][indCol] != '0') {
      this.flyCtl = {
        fallingTime: 0,
        flyTime: 0
      };
      this.action.isFalling = false;
      this.action.isJumping = false;
      this.modifyOnGround();
    }
  }
  modifyOnGround() {
    let val = this.position.y + this.currentShape.h / 2 + this.gravity;

    let indRow = Math.floor(val / gameConfig.tileCfg.h),
      indCol = Math.floor(this.position.x / gameConfig.tileCfg.w);

    if (gameConfig.backgroundData[indRow][indCol]) {
      while (gameConfig.backgroundData[indRow][indCol] != '0') {
        this.position.y -= this.gravity;
        val -= this.gravity;
        if (val < 0) {
          console.log('out map at modifyonGround, y_chan = ' + val);
          this.isAlive = false;
          return;
        }
        indRow = Math.floor(val / gameConfig.tileCfg.h);
      }
    }
  }
  calAction() {
    //if(this.isShooting )
    var mainCharacter = this.gameManager.mainCharacter;
    let dx = this.position.x - mainCharacter.position.x;
    this.dir = dx > 0 ? -1 : 1;
    dx = Math.abs(dx);
    if (dx <= 400 && dx >= 80) this.run();
    else if (dx > 0 && dx < 80) {
      this.action.isRunning = false;

      this.shoot();
    } else {
      this.action.isRunning = false;
      this.action.isShooting = false;
      this.setState(STATE.IDLE);
    }
  }

  setState(state: number) {
    this.currentState = state;
    this.currentShape.w = this.config[state].w;
    this.currentShape.h = this.config[state].h;
  }

  checkCollisonLeftWall() {
    let val = this.position.x - this.currentShape.w / 2;
    let indCol = Math.floor(val / gameConfig.tileCfg.w);
    let row = Math.floor(this.position.y / gameConfig.tileCfg.h);

    if (gameConfig.backgroundData[row][indCol] != '0') {
      while (gameConfig.backgroundData[row][indCol] != '0') {
        this.position.x += this.step;
        val += this.step;
        indCol = Math.floor(val / gameConfig.tileCfg.w);
      }
    }
  }
  checkCollisonWall() {
    let val = this.position.x + this.currentShape.w / 2;

    let indCol = Math.floor(val / gameConfig.tileCfg.w),
      t = 0;
    let startRow = Math.floor(
      (this.position.y - this.currentShape.h / 4) / gameConfig.tileCfg.h
    );
    let endRow = Math.floor(
      (this.position.y + this.currentShape.h / 4) / gameConfig.tileCfg.h
    );
    let row = Math.floor(this.position.y / gameConfig.tileCfg.h);

    while (gameConfig.backgroundData[row][indCol] != '0') {
      this.position.x -= this.step;
      val -= this.step;
      if (val < 0) {
        this.isAlive = false;
        return;
      }
      indCol = Math.floor(val / gameConfig.tileCfg.w);
    }

    //
  }
  beHurt() {
    if (this.hurtCtl.cntHurt == this.hurtCtl.maxFrame) {
      this.isAlive = false;
      const row = Math.floor(
          (this.position.y - this.currentShape.h / 2) / gameConfig.tileCfg.h
        ),
        col = Math.floor(
          (this.position.x - this.currentShape.w / 2) / gameConfig.tileCfg.w
        );

      this.gameManager.explosionList.push(
        new Explosion(
          this.gameManager,
          0,
          {
            y: row * gameConfig.tileCfg.h,
            x: col * gameConfig.tileCfg.w + this.step
          },
          false
        )
      );
    } else {
      this.hurtCtl.hurtFrameCnt = 0;
      this.hurtCtl.cntHurt += 1;
      this.hurtCtl.isHurting = true;
    }
  }
  checkInCamera() {
    return (
      this.position.x + this.currentShape.w / 2 > this.gameManager.posCameraX &&
      this.position.x - this.currentShape.w / 2 <
        this.gameManager.posCameraX + gameConfig.cameraCfg.width &&
      this.position.y + this.currentShape.h / 2 > this.gameManager.posCameraY &&
      this.position.y - this.currentShape.h / 2 <
        this.gameManager.posCameraY + gameConfig.cameraCfg.height
    );
  }
  calAll() {
    if (!this.isAlive) return;
    this.calAction();

    this.calPosition();
    this.checkFreeFall();
    this.checkOnGround();
    if (this.dir == -1) this.checkCollisonLeftWall();
    else this.checkCollisonWall();
  }
  init(pos: Position) {
    this.position = pos;
    this.isAlive = true;
    this.indFrame = 0;
    this.currentState = 0;
    this.dir = -1;

    this.action = {
      isRunning: false,
      isJumping: false,
      isShooting: false,
      isFalling: false
    };

    this.step = Math.floor(Math.random() * 10) % 2 ? 5 : 7;
    this.currentShape = {
      w: this.config[this.currentState].w,
      h: this.config[this.currentState].h
    };

    this.flyCtl = {
      fallingTime: 0,
      flyTime: 0
    };
    this.hurtCtl = {
      cntHurt: 0,
      hurtFrameCnt: 0,
      isHurting: false,
      maxFrame: 0
    };
    this.cntUpdate = 0;
  }
  draw(ctx: CanvasRenderingContext2D) {
    //console.log(this.currentState);
    if (!this.checkInCamera() || !this.isAlive) return;
    let cfg =
      this.dir == -1
        ? this.config[this.currentState]
        : this.configRight[this.currentState];
    this.indFrame = this.indFrame % cfg.cnt;
    let padding = (this.currentState == 3 ? 2.6 : 0) * -this.dir;

    let sx = cfg.sx + this.indFrame * cfg.ow * -this.dir,
      sy = cfg.sy,
      ow = cfg.ow,
      oh = cfg.oh;
    if (this.hurtCtl.isHurting) {
      if (this.hurtCtl.hurtFrameCnt == 3) {
        this.hurtCtl.isHurting = false;
        this.hurtCtl.hurtFrameCnt = 0;
      } else {
        this.hurtCtl.hurtFrameCnt += 1;
      }
    }
    if (this.hurtCtl.isHurting) ctx.filter = 'contrast(70%)';

    ctx.drawImage(
      this.dir == -1 ? this.image : this.imageRight,
      sx,
      sy,
      ow,
      oh,
      Math.round(
        this.position.x - this.currentShape.w / 2 - this.gameManager.posCameraX
      ),
      Math.round(
        this.position.y -
          this.currentShape.h / 2 -
          this.gameManager.posCameraY +
          this.gravity +
          5
      ),
      this.currentShape.w,
      this.currentShape.h
    );
    ctx.filter = 'none';

    this.indFrame += this.cntUpdate;
    this.cntUpdate = (this.cntUpdate + 1) % 2;
  }
}
