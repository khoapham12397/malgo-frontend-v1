import { GameManager } from '../GameManager/GameManager';
import { Position } from '../GameType';

export class LongKi {
  gameManager: GameManager;
  isAlive: boolean;
  position: Position;
  imageLeft: HTMLImageElement;
  imageRight: HTMLImageElement;
  maxFrame: number;
  cntFrame: number;
  dir: number;

  ow: number;

  oh: number;

  width: number;
  height: number;
  // 215, 76

  constructor(gameManaer: GameManager, pos: Position, dir: number) {
    this.gameManager = gameManaer;
    this.isAlive = true;
    this.position = pos;
    this.imageLeft = new Image();
    this.imageLeft.src = 'masenko.png';
    this.imageRight = new Image();
    this.imageRight.src = 'masenko-r.png';
    this.maxFrame = 4;
    this.cntFrame = 0;
    this.dir = dir;

    this.ow = 215;
    this.oh = 76;
    this.width = Math.floor(this.ow * 1.5);
    this.height = Math.floor(this.oh * 1.2);
  }

  checkAlive() {
    if (this.cntFrame == this.maxFrame) {
      this.isAlive = false;
      return;
    }
    this.cntFrame += 1;
    let topLeft = { x: 0, y: 0 },
      downBottom = { x: 0, y: 0 };
    if (this.dir == 1) {
      topLeft = { x: this.position.x, y: this.position.y };
      downBottom = {
        x: this.position.x + this.width,
        y: this.position.y + this.height
      };
    } else {
      topLeft = { x: this.position.x - this.width, y: this.position.y };
      downBottom = { x: this.position.x, y: this.position.y + this.height };
    }

    this.gameManager.botList.forEach(bot => {
      const botTopLeft = {
          x: bot.position.x - bot.currentShape.w / 2,
          y: bot.position.y - bot.currentShape.h / 2
        },
        botDownBottom = {
          x: bot.position.x + bot.currentShape.w / 2,
          y: bot.position.y + bot.currentShape.h / 2
        };
      const collis =
        !(topLeft.x > botTopLeft.x || botDownBottom.x < topLeft.x) &&
        !(topLeft.y > botDownBottom.y || botTopLeft.y > downBottom.y);

      if (collis) {
        bot.beHurt();
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isAlive) return;
    let px = this.position.x;
    if (this.dir == -1) px -= this.width + 5;
    const py = Math.round(this.position.y - this.gameManager.posCameraY - 18);
    ctx.drawImage(
      this.dir == 1 ? this.imageLeft : this.imageRight,
      0,
      0,
      this.ow,
      this.oh,
      Math.round(px - this.gameManager.posCameraX),
      py,
      this.width,
      this.height
    );
  }
}
