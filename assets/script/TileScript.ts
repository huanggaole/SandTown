import { DeviceType, TileType } from "./DataUtil";

export default class TileScript{
    row:number;
    col:number;
    tileType:TileType;
    deviceType:DeviceType;
    SWC:number;

    tileSF:cc.SpriteFrame;
    deviceSF:cc.SpriteFrame;
}