// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DataUtil, { DeviceType, TileType } from "./DataUtil";

const {ccclass, property} = cc._decorator;

enum MapStatus{
    Move,
    Build
}
@ccclass
export default class MapScript extends cc.Component {

    mapWidth = 32;
    mapHeight = 32;
    tileWidth = 120;
    tileHeight = 140;

    prop_H = 1/12;
    prop_Cactus = 1/12;
    prop_Rock = 1/24;

    @property(cc.Node)
    mapNode: cc.Node = null;

    @property([cc.Prefab])
    tileSprites: Array<cc.Prefab> = [];

    @property([cc.Prefab])
    deviceSprites: Array<cc.Prefab> = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    
    static mapStatus = MapStatus.Move;
    ifPressed = false;
    start () {
        // 初始化沙地
        for(let j = 0; j < this.mapHeight; j++){
            const line = [];
            const line_device = [];
            for(let i = 0; i < this.mapWidth; i++){
                // 有一定概率生成丘陵地形，其他情况下是平原地形
                if(Math.random() < this.prop_H){
                    line.push(TileType.Sand_H);
                }else{
                    line.push(TileType.Sand);
                }
                // 有一定概率生成仙人掌与岩石设施
                if(Math.random() < this.prop_Cactus){
                    line_device.push(DeviceType.Cactus);
                }else if(Math.random() < this.prop_Rock){
                    line_device.push(DeviceType.Rock);
                }else{
                    line_device.push(-1);
                }
            }
            DataUtil.mapArray.push(line);
            DataUtil.deviceArray.push(line_device);
        }
        // 初始化居民区与农田
        const midHeight = Math.floor(this.mapHeight/2);
        const midWidth = Math.floor(this.mapWidth/2);
        DataUtil.mapArray[midHeight - 2][midWidth - 1] = TileType.Dirt;
        DataUtil.mapArray[midHeight - 2][midWidth] = TileType.Dirt;
        DataUtil.mapArray[midHeight - 2][midWidth + 1] = TileType.Dirt;
        DataUtil.mapArray[midHeight - 1][midWidth - 1] = TileType.Dirt;
        DataUtil.mapArray[midHeight - 1][midWidth] = TileType.Grass;
        DataUtil.deviceArray[midHeight - 1][midWidth] = DeviceType.Farm;
        DataUtil.mapArray[midHeight - 1][midWidth + 1] = TileType.Water;
        DataUtil.deviceArray[midHeight - 1][midWidth + 1] = -1;
        DataUtil.mapArray[midHeight - 1][midWidth + 2] = TileType.Dirt;
        DataUtil.mapArray[midHeight][midWidth] = TileType.Stone;
        DataUtil.deviceArray[midHeight][midWidth] = DeviceType.VillageCommittee;
        DataUtil.mapArray[midHeight][midWidth - 1] = TileType.Stone;
        DataUtil.deviceArray[midHeight][midWidth - 1] = DeviceType.House1;
        DataUtil.mapArray[midHeight][midWidth - 2] = TileType.Dirt;
        DataUtil.mapArray[midHeight][midWidth + 1] = TileType.Grass;
        DataUtil.deviceArray[midHeight][midWidth + 1] = DeviceType.Farm;
        DataUtil.mapArray[midHeight][midWidth + 2] = TileType.Dirt;
        DataUtil.mapArray[midHeight + 1][midWidth - 1] = TileType.Dirt;
        DataUtil.mapArray[midHeight + 1][midWidth] = TileType.Stone;
        DataUtil.deviceArray[midHeight + 1][midWidth] = DeviceType.Shop1;
        DataUtil.mapArray[midHeight + 1][midWidth + 1] = TileType.Stone;
        DataUtil.deviceArray[midHeight + 1][midWidth + 1] = DeviceType.House1;
        DataUtil.mapArray[midHeight + 1][midWidth + 2] = TileType.Dirt;
        DataUtil.mapArray[midHeight + 2][midWidth - 1] = TileType.Dirt;
        DataUtil.mapArray[midHeight + 2][midWidth] = TileType.Dirt;
        DataUtil.mapArray[midHeight + 2][midWidth + 1] = TileType.Dirt;

        this.refreshMap();
        this.mapNode.on(cc.Node.EventType.TOUCH_START,(event)=>{
            console.log(this.ifPressed);
            this.ifPressed = true;
            switch(MapScript.mapStatus){
                case MapStatus.Move: 
                    cc.game.canvas.style.cursor = "hand";
                    break;
            }
        },this);;
        this.mapNode.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            console.log(this.ifPressed);
            if(this.ifPressed){
                switch(MapScript.mapStatus){
                    case MapStatus.Move: 
                        this.mapNode.x += (event.touch._point.x - event.touch._prevPoint.x);
                        this.mapNode.y += (event.touch._point.y- event.touch._prevPoint.y);
                        break;
                }
            }
        },this);
        this.mapNode.on(cc.Node.EventType.TOUCH_END,()=>{
            console.log(this.ifPressed);
            this.ifPressed = false;
            switch(MapScript.mapStatus){
                case MapStatus.Move: 
                    cc.game.canvas.style.cursor = "default";
                    break;
            }
        },this);
    }

    refreshMap(){
        this.mapNode.removeAllChildren();
        // 生成 Terrain Sprite
        for(let j = 0; j < this.mapHeight; j++){
            for(let i = 0; i < this.mapWidth; i++){
                let type = DataUtil.mapArray[j][i];
                const newTS = cc.instantiate(this.tileSprites[type]);
                newTS.y = (j - this.mapHeight / 2.0) * Math.floor(this.tileHeight * 0.75 - 2);
                newTS.x = (i - this.mapWidth / 2.0 - (j % 2) * 0.5) * this.tileWidth;
                this.mapNode.addChild(newTS);

                let devicetype = DataUtil.deviceArray[j][i];
                if(devicetype > -1){
                    const newDC = cc.instantiate(this.deviceSprites[devicetype]);
                    newDC.y = (j - this.mapHeight / 2.0) * Math.floor(this.tileHeight * 0.75 - 2);
                    newDC.x = (i - this.mapWidth / 2.0 - (j % 2) * 0.5) * this.tileWidth;
                    this.mapNode.addChild(newDC);
                }
            }
        }
    }
    // update (dt) {}
}
