import { GameManager } from "../GameManager/GameManager";
import { CameraCfg, MapCfg, TileCfg } from "../GameType";

export {}
type Position ={
    x: number;
    y: number;
}
type Action = {
    isMoving: boolean;
    isFlying: boolean;
    isFalling: boolean;
    isAttacking: boolean;
    isHurting: boolean;
}
type AttackCtl = {
    attackLv: number;
    cntAttackLv: number;
    pendingAttack: boolean;
    attackType: number;
}

type FlyCtl = {
    flyDown: boolean;
    flyTime: number;
    fallingTime: number;
    climbWall: boolean;
    nextWall: boolean;

}

type OnGroundCtl = {
    isOnGround : boolean,
    colOnGround: number | null,
    colOnGroundBegin: number | null,
    colOnGroundEnd: number | null,
}

type HurtCtl = {
    cntHurt: number;
}

type CharShape = {
    w: number;
    h: number;
}

const STATE = {
    IDLE: 0,
    RUNNING: 1,
    FLYING: 2,
    ATTACKING: 3,
    HURTING_L1: 4,
}

interface MainCharacter { 
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
    action: Action;

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

}
