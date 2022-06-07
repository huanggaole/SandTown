import { DeviceType, TileType } from "./DataUtil";

export default class TileScript{
    row:number;
    col:number;
    y:number;
    x:number;
    r:number;
    s:number;
    q:number;
    tileType:TileType;
    deviceType:DeviceType;
    SWC:number;

    tileSF:cc.SpriteFrame;
    deviceSF:cc.SpriteFrame;

    // 功能参数
    workerLimits:number;
    workerNum:number;

    // 幸福度的来源
    happinessSource = [];
    happinessTotal = 0;
}