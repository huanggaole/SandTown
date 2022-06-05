import { DeviceType, TileType } from "./DataUtil";

export default class TileScript{
    row:number;
    col:number;
    y:number;
    x:number;
    tileType:TileType;
    deviceType:DeviceType;
    SWC:number;

    tileSF:cc.SpriteFrame;
    deviceSF:cc.SpriteFrame;

    // 功能参数
    workerLimits:number;
    workerNum:number;
}