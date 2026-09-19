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

    tileNode:cc.Node;
    deviceNode:cc.Node;

    // 功能参数
    workerLimits:number;
    workerNum:number;

    // 幸福度的来源
    happinessSource = [];
    happinessTotal = 0;

    // adjtiles
    leftUpTile:TileScript = null;
    leftTile:TileScript = null;
    leftDownTile:TileScript = null;
    rightTile:TileScript = null;
    rightUpTile:TileScript = null;
    rightDownTile:TileScript = null;

    /**
     * 返回六个相邻地块。地图边缘处对应项为 null（地图边界不环绕），
     * 遍历时**必须**先判空——相邻加成、幸福度扩散都靠它取邻居。
     */
    getAdjacentTiles(): Array<TileScript> {
        return [this.leftUpTile, this.leftTile, this.leftDownTile,
                this.rightUpTile, this.rightTile, this.rightDownTile];
    }
}