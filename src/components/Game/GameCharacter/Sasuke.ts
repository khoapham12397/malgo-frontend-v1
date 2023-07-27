import { gameConfig } from '../GameConfig';
import { GameManager } from '../GameManager/GameManager';
import { Explosion } from '../UnmoveObject/Explosion';
import { GAME_MODE } from '../GameContainer/GameContainerV2';
import { MettarBot } from '../GameBot/MettartBot';
import { LongKi } from '../LongKi/LongKi';
import { CameraCfg, MapCfg, TileCfg } from '../GameType';
type Position = {
  x: number;
  y: number;
};
type Action = {
  isMoving: boolean;
  isFlying: boolean;
  isFalling: boolean;
  isAttacking: boolean;
  isHurting: boolean;
};
type AttackCtl = {
  attackLv: number;
  cntAttackLv: number;
  pendingAttack: boolean;
  attackType: number;
};

type FlyCtl = {
  flyDown: boolean;
  flyTime: number;
  fallingTime: number;
  climbWall: boolean;
  nextWall: boolean;
  cntClimb: number;
};

type OnGroundCtl = {
  isOnGround: boolean;
  colOnGround: number | null;
  colOnGroundBegin: number | null;
  colOnGroundEnd: number | null;
};

type HurtCtl = {
  cntHurt: number;
};

type CharShape = {
  w: number;
  h: number;
};
type Cell = {
  col: number;
  row: number;
};
const STATE = {
  IDLE: 0,
  RUNNING: 1,
  FLYING: 2,
  ATTACKING: 3,
  HURTING_L1: 4
};

type BotHurtCtl = {
  cntHurt: number;
};
export class Sasuke {
  gameManager: GameManager;

  position: Position;
  step: number;
  gravity: number;
  vy: number;

  indFrame: number;
  dir: number;

  imageLeft: HTMLImageElement;
  imageRight: HTMLImageElement;

  imageAttack: HTMLImageElement;

  attackCtl: AttackCtl;
  flyCtl: FlyCtl;
  onGroundCtl: OnGroundCtl;
  hurtCtl: HurtCtl;

  currentState: number;
  action: Action;

  cntFrameRun: number;

  tileCfg: TileCfg;
  cameraCfg: CameraCfg;
  backgroundData: Array<any>;

  scale: number;
  configLefts: Array<any>;
  configRights: Array<any>;

  configAttackLefts: Array<any>;
  configAttackRights: Array<any>;

  currentShape: CharShape;
  mapCfg: MapCfg;

  prePosY: number;
  graphic: any;

  blood: number;
  cell: Cell;

  constructor(gameManager: GameManager, pos: Position) {
    this.gameManager = gameManager;
    this.position = pos;
    this.cell = {
      row: Math.floor(pos.y / gameConfig.tileCfg.h),
      col: Math.floor(pos.x / gameConfig.tileCfg.w)
    };

    this.step = 16;
    this.gravity = 8;
    this.vy = 40;
    this.indFrame = 0;
    this.dir = 1;
    this.imageLeft = new Image();
    this.imageLeft.src = 'sasuke-1.png';
    this.imageRight = new Image();
    this.imageRight.src = 'sasuke-1r.png';

    this.imageAttack = new Image();
    this.imageAttack.src = 'trunks-attack-rm.png';
    this.attackCtl = {
      attackType: 0,
      attackLv: 0,
      cntAttackLv: 0,
      pendingAttack: false
    };

    this.currentState = STATE.IDLE;

    this.action = {
      isMoving: false,
      isAttacking: false,
      isFalling: false,
      isFlying: false,
      isHurting: false
    };

    this.flyCtl = {
      fallingTime: 0,
      flyTime: 0,
      flyDown: true,
      climbWall: false,
      nextWall: false,
      cntClimb: 0
    };
    this.onGroundCtl = {
      isOnGround: false,
      colOnGround: null,
      colOnGroundBegin: null,
      colOnGroundEnd: null
    };

    this.tileCfg = gameConfig.tileCfg;
    this.cameraCfg = gameConfig.cameraCfg;

    this.backgroundData = gameConfig.backgroundData;

    this.cntFrameRun = 0;
    this.scale = 1;
    /*

        this.configLefts = [
			{sx : 1246, sy: 1, ow : 100, oh: 133, w: 100, h: 133, cnt: 6},
			{sx : 1372, sy: 349, ow: 130, oh: 130, w: 130, h: 130, cnt: 4, skipFrame : 1},
			{sx : 1375,sy: 155, ow: 96, oh: 158, w: 96, h:158, cnt: 2},
			{sx : 1278, sy: 648, ow: 170, oh: 138, w: 170, h: 138, cnt: 7},
			{sx : 865, sy: 347, ow: 107, oh: 135, w: 107, h: 135, cnt: 2},
			{sx : 1858-135, sy: 168, ow: 135, oh:127, w: 135, h: 127, cnt: 1, skipFrame: 2}]
		//191,155
		this.configRights = [
			{sx : 0, sy: 0, ow : 100, oh: 133, w: 100, h: 133, cnt: 6},
			{sx : 3, sy: 346, ow: 130, oh: 130, w: 130, h: 130, cnt: 4,skipFrame :1},
			{sx : 95,sy: 155, ow: 96, oh: 158, w: 96, h:158, cnt: 2},
			{sx : 258, sy: 496, ow: 170, oh: 138, w: 170, h: 138, cnt: 7},
			{sx : 1356, sy: 5, ow: 107, oh: 135, w: 107, h: 135, cnt: 2},
			{sx : 1652+135+135, sy: 348, ow: 135, oh:127, w: 135, h:127, cnt: 1, skipFrame:2 }]
        */
    this.configLefts = [
      { sx: 2, sy: 85, ow: 81, oh: 81, w: 81, h: 81, cnt: 4 },
      { sx: 2, sy: 166, ow: 81, oh: 81, w: 81, h: 81, cnt: 6 },
      { sx: 81, sy: 248, ow: 81, oh: 81, w: 81, h: 81, cnt: 2 },
      { sx: 2, sy: 929, ow: 122, oh: 81, w: 122, h: 81, cnt: 4 },
      { sx: 2, sy: 412, ow: 81, oh: 81, w: 81, h: 81, cnt: 10 }
    ];
    // 122, 81 slash 1

    this.configRights = [
      { sx: 822, sy: 85, ow: 81, oh: 81, w: 81, h: 81, cnt: 4 },
      { sx: 822, sy: 166, ow: 81, oh: 81, w: 81, h: 81, cnt: 6 },
      { sx: 740, sy: 248, ow: 81, oh: 81, w: 81, h: 81, cnt: 2 },
      { sx: 782, sy: 929, ow: 122, oh: 81, w: 122, h: 81, cnt: 4 },
      { sx: 822, sy: 412, ow: 81, oh: 81, w: 81, h: 81, cnt: 10 }
    ];
    for (let i = 0; i < this.configLefts.length; i++) {
      this.configLefts[i].w = this.configLefts[i].w * this.scale;
      this.configLefts[i].h = this.configLefts[i].h * this.scale;
      this.configRights[i].w = this.configRights[i].w * this.scale;
      this.configRights[i].h = this.configRights[i].h * this.scale;
    }
    this.configAttackLefts = [
      { sx: 2221, sy: 964, ow: 168, oh: 138, w: 168, h: 138, cnt: 7 }, // onGroundSlash-0
      { sx: 1817, sy: 2, ow: 195, oh: 149, w: 195, h: 149, cnt: 5 }, //onGroundSlash-1
      { sx: 2135, sy: 168, ow: 190, oh: 177, w: 190, h: 177, cnt: 6 }, //
      { sx: 1565, sy: 751, ow: 172, oh: 187, w: 172, h: 187, cnt: 10 },
      { sx: 1982, sy: 559, ow: 103, oh: 153, w: 103, h: 153, cnt: 10 }
    ];

    this.configAttackRights = [
      { sx: 2, sy: 960, ow: 168, oh: 138, w: 168, h: 138, cnt: 7 }, // onGroundSlash-0
      { sx: 5, sy: 0, ow: 195, oh: 149, w: 195, h: 149, cnt: 5 }, //onGroundSlash-1
      { sx: 5, sy: 162, ow: 190, oh: 177, w: 190, h: 177, cnt: 6 }, //
      { sx: 3, sy: 354, ow: 172, oh: 187, w: 172, h: 187, cnt: 10 },
      { sx: 2, sy: 552, ow: 103, oh: 153, w: 103, h: 153, cnt: 10 }
    ];

    for (let i = 0; i < this.configAttackLefts.length; i++) {
      this.configAttackLefts[i].w = this.configAttackLefts[i].w * this.scale;
      this.configAttackLefts[i].h = this.configAttackLefts[i].h * this.scale;
      this.configAttackRights[i].w = this.configAttackRights[i].w * this.scale;
      this.configAttackRights[i].h = this.configAttackRights[i].h * this.scale;
    }

    this.currentShape = {
      h: this.configLefts[0].h,
      w: this.configLefts[0].w
    };

    this.mapCfg = gameConfig.mapCfg;

    this.hurtCtl = { cntHurt: 0 };
    //this.indFrameRun = 0;
    this.prePosY = this.position.y;
    this.blood = 120;
  }

  calPosition() {
    if (this.action.isMoving) this.position.x += this.step * this.dir;

    if (this.action.isFlying) {
      this.prePosY = this.position.y;
      this.position.y =
        this.position.y - this.vy + this.gravity * (this.flyCtl.flyTime + 0.5);
      this.flyCtl.flyDown = this.prePosY < this.position.y;
      this.flyCtl.flyTime += 1;
    } else this.flyCtl.flyDown = false;

    if (this.action.isFalling && !this.action.isFlying) {
      this.prePosY = this.position.y;
      this.position.y =
        this.position.y + this.gravity * (this.flyCtl.fallingTime + 0.5);

      this.flyCtl.fallingTime += 1;
      this.flyCtl.flyDown = this.position.y > this.prePosY;
    }

    this.cell = {
      row: Math.floor(this.position.y / gameConfig.tileCfg.h),
      col: Math.floor(this.position.x / gameConfig.tileCfg.w)
    };

    let dx = this.position.x - this.gameManager.posCameraX;
    let u = (gameConfig.cameraCfg.width - 50) * 0.7,
      v = (gameConfig.cameraCfg.width - 50) * 0.4;

    if (dx > u) {
      this.gameManager.posCameraX = this.position.x - u;
    } else if (dx < v) this.gameManager.posCameraX = this.position.x - v;

    this.gameManager.posCameraX = Math.min(
      this.mapCfg.width - gameConfig.cameraCfg.width,
      this.gameManager.posCameraX
    );

    let dy = this.position.y - this.gameManager.posCameraY;

    u = gameConfig.cameraCfg.height * 0.75;
    v = gameConfig.cameraCfg.height * 0.25;
    if (dy > u) {
      this.gameManager.posCameraY = Math.max(0, this.position.y - u);
    }
    if (dy < v) this.gameManager.posCameraY = Math.max(0, this.position.y - v);
  }

  checkFreeFall() {
    let indRow = Math.floor(
      (this.position.y + this.currentShape.h / 2 + this.gravity) /
        this.tileCfg.h
    );
    let indCol = Math.floor(this.position.x / this.tileCfg.w);

    this.action.isFalling = this.backgroundData[indRow][indCol] == '0';
  }
  checkOnGround() {
    let indRow = Math.floor(
      (this.position.y + this.currentShape.h / 2 + this.gravity) /
        this.tileCfg.h
    );

    let left = this.position.x - 0.25 * this.currentShape.w,
      right = this.position.x + 0.25 * this.currentShape.w;

    let startCol = Math.floor(left / this.tileCfg.w),
      endCol = Math.floor(right / this.tileCfg.w);
    let cnt = 0,
      st = null,
      ed = null;

    for (let i = startCol; i <= endCol; i++) {
      if (this.backgroundData[indRow][i] != '0') {
        cnt += 1;
        if (st == null) st = i;
        ed = i;
      }
    }
    if (cnt > 0) {
      this.flyCtl = {
        fallingTime: 0,
        flyDown: false,
        flyTime: 0,
        climbWall: this.flyCtl.climbWall,
        nextWall: this.flyCtl.nextWall,
        cntClimb: 0
      };
      this.action.isFlying = false;
      this.action.isFalling = false;

      this.onGroundCtl = {
        isOnGround: true,
        colOnGround: this.dir == 1 ? st : ed,
        colOnGroundBegin: st,
        colOnGroundEnd: ed
      };
      this.modifyOnGround();
    } else {
      this.onGroundCtl.isOnGround = false;
    }
  }
  modifyOnGround() {
    let val = this.position.y + this.currentShape.h / 2 + this.gravity;

    let indRow = Math.floor(val / this.tileCfg.h),
      indCol = this.onGroundCtl.colOnGroundBegin;

    if (indCol) {
      while (this.backgroundData[indRow][indCol] != '0') {
        this.position.y -= this.gravity;
        val -= this.gravity;

        indRow = Math.floor(val / this.tileCfg.h);
      }
    }
    indCol = this.onGroundCtl.colOnGroundEnd;
    if (indCol && indCol != this.onGroundCtl.colOnGroundBegin) {
      while (this.backgroundData[indRow][indCol] != '0') {
        this.position.y -= this.gravity / 2;
        val -= this.gravity / 2;
        indRow = Math.floor(val / this.tileCfg.h);
      }
    }
  }

  checkCollisonUpWall() {
    let val = this.position.y - this.currentShape.h / 2;

    let indRow = Math.floor(val / this.tileCfg.h);

    let indCol = Math.floor(this.position.x / this.tileCfg.w);

    if (this.backgroundData[indRow][indCol] != '0') {
      while (this.backgroundData[indRow][indCol] != '0') {
        val += this.gravity / 2;
        this.position.y += this.gravity / 2;
        indRow = Math.floor(val / this.tileCfg.h);
      }
    }
  }

  checkWall() {
    let val =
      this.position.x + this.dir * (this.currentShape.w / 2 + this.step);
    let indCol = Math.floor(val / this.tileCfg.w);

    for (
      let i = this.position.y - this.currentShape.h / 4 - this.gravity;
      i < this.position.y + this.currentShape.h / 4 - 1;
      i++
    ) {
      let indRow = Math.floor(i / this.tileCfg.h);
      if (this.backgroundData[indRow][indCol] != '0') return true;
    }
    return false;
  }

  checkCollisonWall() {
    let val = this.position.x + this.currentShape.w / 2;

    let indCol = Math.floor(val / this.tileCfg.w),
      t = 0;
    let startRow = Math.floor(
      (this.position.y - this.currentShape.h / 4) / this.tileCfg.h
    );
    let endRow = Math.floor(
      (this.position.y + this.currentShape.h / 4) / this.tileCfg.h
    );
    for (let r = startRow; r <= endRow; r++) {
      if (this.backgroundData[r][indCol] != '0') {
        while (this.backgroundData[r][indCol] != '0') {
          this.position.x -= this.step / 2;
          val -= this.step / 2;
          indCol = Math.floor(val / this.tileCfg.w);
        }
        return;
      }
    }
  }

  checkCollisonLeftWall() {
    let val = this.position.x - this.currentShape.w / 2 - this.step * 0.25;
    let indCol = Math.floor(val / this.tileCfg.w);
    let startRow = Math.floor(
        (this.position.y - this.currentShape.h / 4) / this.tileCfg.h
      ),
      endRow = Math.floor(
        (this.position.y + this.currentShape.h / 4) / this.tileCfg.h
      );

    for (let r = startRow; r <= endRow; r++) {
      if (this.backgroundData[r][indCol] != '0') {
        while (this.backgroundData[r][indCol] != '0') {
          this.position.x += this.step / 2;
          val += this.step / 2;
          indCol = Math.floor(val / this.tileCfg.w);
        }
        return;
      }
    }
  }

  move() {
    if (this.action.isMoving) {
      if (
        this.currentState == STATE.ATTACKING &&
        this.attackCtl.attackType == 4
      ) {
        this.action.isMoving = false;
      }
      return;
    }
    this.action.isMoving = true;
  }

  stopMove() {
    this.action.isMoving = false;

    this.cntFrameRun = 0;
  }

  fly() {
    if (this.action.isFlying) {
      if (this.checkWall()) {
        this.position.y += -0.2 * this.vy;
        this.flyCtl.flyTime = 2;
        this.flyCtl.climbWall = true;
        this.flyCtl.nextWall = true;
        this.flyCtl.cntClimb = (this.flyCtl.cntClimb + 1) % 3;
      } else {
        this.flyCtl.climbWall = false;
        this.flyCtl.nextWall = false;
        this.flyCtl.cntClimb = 0;
      }
    } else {
      this.action.isFlying = !this.action.isFalling;
    }
  }
  slash() {
    if (this.action.isAttacking) return;

    this.action.isAttacking = true;
    this.indFrame = 0;
    const cntAttackLv = this.attackCtl.cntAttackLv;
    const attackType = this.attackCtl.attackType;
    this.attackCtl = {
      attackLv: 0,
      cntAttackLv: 0,
      pendingAttack: false,
      attackType: this.action.isFalling ? 2 : cntAttackLv == 3 ? 4 : 1
    };
  }

  setState(state: number) {
    if (!this.action.isAttacking) {
      this.currentState = state;
      this.currentShape.w = this.configLefts[state].w;
      this.currentShape.h = this.configLefts[state].h;
    } else {
      this.currentState = STATE.ATTACKING;
      this.currentShape.w = this.configAttackLefts[this.attackCtl.attackType].w;
      this.currentShape.h = this.configAttackLefts[this.attackCtl.attackType].h;
    }
  }

  calStateDirect() {
    if (this.currentState == STATE.ATTACKING) {
      if (
        this.indFrame == this.configAttackLefts[this.attackCtl.attackType].cnt
      ) {
        this.action.isAttacking = false;
        this.indFrame = 0;
        this.attackCtl.pendingAttack = false;
        this.attackCtl.cntAttackLv = 0;
      }
    }

    if (this.currentState == STATE.HURTING_L1) {
      if (this.indFrame == this.configLefts[this.currentState].cnt) {
        this.action.isHurting = false;
        this.indFrame = 0;
      }
    }

    if (this.attackCtl.pendingAttack) {
      this.attackCtl.cntAttackLv = Math.min(this.attackCtl.cntAttackLv + 1, 3);
    }
    if (this.action.isHurting) this.setState(STATE.HURTING_L1);
    else if (this.action.isAttacking) {
      this.setState(STATE.ATTACKING);
    } else if (this.action.isFlying || this.action.isFalling) {
      this.setState(STATE.FLYING);
    } else if (this.action.isMoving) this.setState(STATE.RUNNING);
    else this.setState(STATE.IDLE);

    if (this.onGroundCtl.isOnGround) {
      let val = this.position.y + this.currentShape.h / 2 + 2;
      let indRow = Math.floor(val / this.tileCfg.h),
        indCol = this.onGroundCtl.colOnGround;

      if (indCol && this.backgroundData[indRow][indCol] == '0') {
        while (this.backgroundData[indRow][indCol] == '0') {
          val += this.gravity / 2;
          this.position.y += this.gravity / 2;
          indRow = Math.floor(val / this.tileCfg.h);
        }
      } else this.modifyOnGround();
    }
  }
  checkSlashWoodBox() {
    if (this.currentState != STATE.ATTACKING) {
      this.gameManager.boxState = false;
      return;
    }
    const startFrame = Math.max(
      0,
      this.configAttackLefts[this.attackCtl.attackType].cnt - 3
    );

    if (this.indFrame != startFrame) {
      return;
    }
    const col = Math.floor(
        (this.position.x + this.dir * (this.currentShape.w / 2 + this.step)) /
          gameConfig.tileCfg.w
      ),
      rowUp = Math.floor(
        (this.position.y - this.currentShape.h / 3) / gameConfig.tileCfg.h
      ),
      rowDown = Math.floor(
        (this.position.y + this.currentShape.h / 3) / gameConfig.tileCfg.h
      );
    //console.log("wood-box len:"+ gameConfig.woodBoxList.length);
    for (let i = 0; i < gameConfig.woodBoxList.length; i++) {
      const cell = gameConfig.woodBoxList[i];
      if (cell.col == col && (cell.row == rowUp || cell.row == rowDown)) {
        const row = cell.row == rowUp ? rowUp : rowDown;
        const boxKey = row + '-' + col;
        const x = this.gameManager.boxSlashCnt.get(boxKey);

        if (x) {
          if (x == 2) {
            this.gameManager.boxSlashCnt.delete(boxKey);
            this.gameManager.boxState = false;
            gameConfig.woodBoxList.splice(i, 1);
            gameConfig.backgroundData[row][col] = '0';
            this.gameManager.explosionList.push(
              new Explosion(
                this.gameManager,
                0,
                {
                  x: col * gameConfig.tileCfg.w,
                  y: row * gameConfig.tileCfg.h
                },
                true
              )
            );
          } else {
            this.gameManager.boxSlashCnt.set(boxKey, x + 1);
            this.gameManager.boxState = true;
          }
        } else {
          this.gameManager.boxSlashCnt.set(boxKey, 1);
          this.gameManager.boxState = true;
        }
        break;
      }
    }
  }

  checkFireCard() {
    const myCol = Math.floor(this.position.x / gameConfig.tileCfg.w),
      myRow = Math.floor(this.position.y / gameConfig.tileCfg.h);
    const quizKey = myRow + '-' + myCol;

    const card = this.gameManager.fireCardList.get(quizKey);
    //console.log("card == null ?" + (card==null));
    if (card) {
      //console.log("vao day");
      if (
        this.gameManager.gameData.quizState.get(quizKey)?.state == 0 &&
        !this.gameManager.gameData.solvedQuizs[quizKey]
      ) {
        //  console.log("change to waiting quiz mode");
        this.gameManager.changeMode(GAME_MODE.WAITING_QUIZ, quizKey, null);
      }
    }
  }

  beHurt() {
    if (this.action.isHurting) return;
    this.action.isHurting = true; // dung
    this.hurtCtl.cntHurt = 0;
    this.blood -= 10;
    this.setState(STATE.HURTING_L1);
  }

  checkSlashBot() {
    //if(this.currentState != STATE.ATTACKING) return;
    const maxFrame = Math.max(
      0,
      this.configAttackLefts[this.attackCtl.attackType].cnt - 1
    );
    if (
      this.currentState == STATE.ATTACKING &&
      this.indFrame == maxFrame - 1 &&
      this.attackCtl.attackType == 4
    ) {
      const px =
          this.position.x +
          this.dir * (this.currentShape.w / 2 - this.step / 2),
        py = this.position.y - this.currentShape.h / 4;

      this.gameManager.longKi = new LongKi(
        this.gameManager,
        { x: px, y: py },
        this.dir
      );
      this.action.isMoving = false;
    }
    if (this.indFrame != maxFrame) {
      return;
    }

    this.gameManager.botList.forEach(bot => {
      if (bot.isAlive) this.checkSingleBot(bot);
    });
    this.gameManager.staticBotList.forEach(bot => {
      if (bot.isAlive) this.checkSingleBot(bot);
    });
  }
  checkSingleBot(bot: MettarBot) {
    const upBot = bot.position.y - bot.currentShape.h / 2 + 3;
    const bottomBot = bot.position.y + bot.currentShape.h / 2 + 3;

    let collis =
      upBot < this.position.y + this.currentShape.h / 2 &&
      bottomBot > this.position.y - this.currentShape.h / 2;
    let hurtColis = true;
    if (this.dir == 1) {
      const limitRight = this.position.x + this.currentShape.w / 2 + this.step;
      const u = bot.position.x > this.position.x - this.currentShape.w / 4;
      collis =
        collis && limitRight >= bot.position.x - bot.currentShape.w / 2 && u;
      hurtColis =
        limitRight -
          this.step -
          (this.currentState == STATE.ATTACKING
            ? this.currentShape.w / 4
            : 0) >=
          bot.position.x - bot.currentShape.w / 4 && u;
    } else {
      const limitLeft = this.position.x - this.currentShape.w / 2 - this.step;
      const u = bot.position.x < this.position.x + this.currentShape.w / 4;
      collis =
        collis && limitLeft <= bot.position.x + bot.currentShape.w / 2 && u;
      hurtColis =
        limitLeft +
          this.step +
          (this.currentState == STATE.ATTACKING
            ? this.currentShape.w / 4
            : 0) <=
          bot.position.x + bot.currentShape.w / 4 && u;
    }
    if (collis && this.currentState == STATE.ATTACKING) {
      //alert("trung roi");
      const maxFrame = Math.max(
        0,
        this.configAttackLefts[this.attackCtl.attackType].cnt - 1
      );
      if (this.indFrame == maxFrame) bot.beHurt();
    }
    //if(hurtColis && bot.isAlive) this.beHurt();
  }
  setBotAppear() {
    // 17 7
    //if(this.gameManager.challenge != null) return;
    const left = gameConfig.tileCfg.w * 17,
      right = gameConfig.tileCfg.w * 22,
      bottom = gameConfig.tileCfg.h * 10,
      up = gameConfig.tileCfg.h * 7;

    if (
      this.position.x > left &&
      this.position.x < right &&
      this.position.y > up &&
      this.position.y < bottom
    ) {
      this.gameManager.botList.forEach(bot => {
        if (!bot.isAlive) {
          //console.log("hey");
          const dir = Math.floor(Math.random() * 10) % 2 == 0 ? 1 : -1;
          const posX = this.position.x + Math.floor(Math.random() * 250) * dir,
            posY = this.position.y - Math.floor(Math.random() * 400);

          bot.init({ x: posX, y: posY });
        }
      });
    }
    for (let i = 0; i < this.gameManager.botPosList.length; i++) {
      const cell = this.gameManager.botPosList[i];
      if (this.cell.col == cell.col && this.cell.row == cell.row) {
        this.gameManager.staticBotList.forEach(bot => {
          if (!bot.isAlive || !bot.checkInCamera()) {
            const dir = Math.floor(Math.random() * 10) % 2 == 0 ? 1 : -1;

            const posX =
                this.position.x + Math.floor(Math.random() * 250) * dir,
              posY = this.position.y - Math.floor(Math.random() * 400);
            bot.init({ x: posX, y: posY });
          }
        });
        break;
      }
    }
  }
  calAll() {
    this.calPosition();

    //this.calAttackLv();
    this.checkFreeFall();
    this.checkOnGround();
    //this.beHurt();
    this.calStateDirect();
    this.checkCollisonUpWall();

    if (this.dir == 1) this.checkCollisonWall();
    else this.checkCollisonLeftWall();
    this.checkSlashWoodBox();
    this.checkFireCard();
    this.checkSlashBot();
    this.setBotAppear();
  }

  calNextFrame() {
    let config = null;
    if (this.action.isAttacking)
      config =
        this.dir == 1
          ? this.configAttackLefts[this.attackCtl.attackType]
          : this.configAttackRights[this.attackCtl.attackType];
    else
      config =
        this.dir == 1
          ? this.configLefts[this.currentState]
          : this.configRights[this.currentState];
    console.log('current State:' + this.currentState);
    if (this.currentState != STATE.FLYING) {
      if (this.currentState == STATE.HURTING_L1) {
        if (this.hurtCtl.cntHurt % 2 == 1) this.indFrame += 1;
        this.hurtCtl.cntHurt = (this.hurtCtl.cntHurt + 1) % 2;
      } else this.indFrame += 1;
    }
    console.log('indFrame: ' + this.indFrame);
  }
  draw(ctx: CanvasRenderingContext2D) {
    let config = null;

    let px =
        this.position.x -
        this.gameManager.posCameraX -
        this.currentShape.w / 2 +
        this.dir * this.step * 0.95,
      py =
        this.position.y - this.currentShape.h / 2 - this.gameManager.posCameraY,
      sx = null,
      sy = null,
      ow = null,
      oh = null,
      w = null,
      h = null;

    if (this.currentState != STATE.RUNNING) py += 2;

    if (this.currentState == STATE.FLYING) py -= 2;
    //if(this.dir==-1) px -= this.currentShape.w;

    if (this.currentState == STATE.ATTACKING) {
      config =
        this.dir == 1
          ? this.configAttackLefts[this.attackCtl.attackType]
          : this.configAttackRights[this.attackCtl.attackType];
    } else
      config =
        this.dir == 1
          ? this.configLefts[this.currentState]
          : this.configRights[this.currentState];

    if (this.currentState == STATE.FLYING) {
      if (this.flyCtl.flyDown) {
        this.indFrame = 1;
        this.flyCtl.climbWall = false;
      } else {
        if (this.flyCtl.climbWall) {
          this.indFrame = this.flyCtl.cntClimb == 0 ? 1 : 0;
        } else this.indFrame = 0;
      }
    } else this.indFrame = this.indFrame % config.cnt;

    console.log('indFrame modified:' + this.indFrame);
    sx = config.sx + this.indFrame * config.ow * this.dir;
    sy = config.sy;

    if (this.currentState == STATE.HURTING_L1) ctx.filter = 'contrast(80%)';

    ctx.drawImage(
      this.action.isAttacking
        ? this.imageAttack
        : this.dir == 1
        ? this.imageLeft
        : this.imageRight,
      sx,
      sy,
      config.ow,
      config.oh,
      Math.round(px),
      Math.round(py),
      config.w,
      config.h
    );
    //console.log(`px=${px}, py = ${py}`);
    ctx.filter = 'none';
    this.drawBlood(ctx);
  }

  drawBlood(ctx: CanvasRenderingContext2D) {
    // xet muc mau dung:
    ctx.fillStyle = 'midnightblue';
    ctx.fillRect(10, 10, 10, 121);
    ctx.fillStyle = '#CC0000';
    if (this.blood > 0)
      ctx.fillRect(10, 10 + (120 - this.blood), 10, this.blood);
  }
}
