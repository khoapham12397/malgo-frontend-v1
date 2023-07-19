export class Animation {
    name: string;
    totalFrame: number;
    currentFrame: number;
    imageLeft: HTMLImageElement;
    imageRight: HTMLImageElement;
    oWidth: number;
    oHeight: number;
    width: number;
    height: number;

    constructor(name :string, totalFrame: number, imageLeftSrc: string, imageRightSrc:string ,
        oWidth: number, oHeight: number, width: number, height: number
    ){
        this.name = name;
        this.totalFrame = totalFrame;
        this.currentFrame = 0;
        this.imageLeft = new Image();
        this.imageLeft.src = imageLeftSrc;
        this.imageRight = new Image();
        this.imageRight.src = imageRightSrc;
        this.oWidth = oWidth;
        this.oHeight = oHeight;
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D,indFrame: number, dir: number, px:number, py:number) {
        let sx = (dir==1)?indFrame*this.oWidth:(this.totalFrame-1- indFrame)*this.oWidth;
        //console.log(ctx);
        if(this.name=='fly' && indFrame ===1 && dir==-1) {
            sx+= 5;
        }
        ctx.drawImage(dir==1?this.imageLeft:this.imageRight,sx,0, this.oWidth, this.oHeight,
            px,py, this.width,this.height            
        )
    }
}