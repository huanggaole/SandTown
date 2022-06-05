// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DataUtil, { DeviceType, TileType } from "./DataUtil";
import DetailPanelScript from "./DetailPanelScript";
import TileScript from "./TileScript";

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

    @property(cc.Node)
    tilesNode: cc.Node = null;

    @property(cc.Sprite)
    hexSlected: cc.Sprite = null;

    @property([cc.Prefab])
    tileSprites: Array<cc.Prefab> = [];

    @property([cc.Prefab])
    deviceSprites: Array<cc.Prefab> = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    
    static mapStatus = MapStatus.Move;
    ifPressed = false;
    pressPoint: cc.Vec2;
    static MapLoc: cc.Vec2;
    start () {
        // 初始化沙地
        for(let j = 0; j < this.mapHeight; j++){
            const line:Array<TileScript> = [];
            for(let i = 0; i < this.mapWidth; i++){
                const tile = new TileScript();
                // 有一定概率生成丘陵地形，其他情况下是平原地形
                if(Math.random() < this.prop_H){
                    tile.tileType = TileType.Sand_H;
                }else{
                    tile.tileType = TileType.Sand;
                }
                // 有一定概率生成仙人掌与岩石设施
                if(Math.random() < this.prop_Cactus){
                    tile.deviceType = DeviceType.Cactus;
                }else if(Math.random() < this.prop_Rock){
                    tile.deviceType = DeviceType.Rock;
                }else{
                    tile.deviceType = -1;
                }
                tile.row = j;
                tile.col = i;
                tile.y = (j - this.mapHeight / 2.0) * Math.floor(this.tileHeight * 0.75 - 2);
                tile.x = (i - this.mapWidth / 2.0 - (j % 2) * 0.5) * this.tileWidth;
                line.push(tile);
            }
            DataUtil.tileArray.push(line);
        }
        // 初始化居民区与农田
        const midHeight = Math.floor(this.mapHeight/2);
        const midWidth = Math.floor(this.mapWidth/2);
        DataUtil.tileArray[midHeight - 2][midWidth - 1].tileType = TileType.Dirt;
        DataUtil.tileArray[midHeight - 2][midWidth].tileType = TileType.Dirt;
        DataUtil.tileArray[midHeight - 2][midWidth + 1].tileType = TileType.Dirt;
        DataUtil.tileArray[midHeight - 1][midWidth - 1].tileType = TileType.Dirt;
        DataUtil.tileArray[midHeight - 1][midWidth].tileType = TileType.Grass;
        DataUtil.tileArray[midHeight - 1][midWidth].deviceType = DeviceType.Farm;
        DataUtil.tileArray[midHeight - 1][midWidth + 1].tileType = TileType.Water;
        DataUtil.tileArray[midHeight - 1][midWidth + 1].deviceType = -1;
        DataUtil.tileArray[midHeight - 1][midWidth + 2].tileType = TileType.Dirt;
        DataUtil.tileArray[midHeight][midWidth].tileType = TileType.Stone;
        DataUtil.tileArray[midHeight][midWidth].deviceType = DeviceType.VillageCommittee;
        DataUtil.tileArray[midHeight][midWidth - 1].tileType = TileType.Stone;
        DataUtil.tileArray[midHeight][midWidth - 1].deviceType = DeviceType.House1;
        DataUtil.tileArray[midHeight][midWidth - 2].tileType = TileType.Dirt;
        DataUtil.tileArray[midHeight][midWidth + 1].tileType = TileType.Grass;
        DataUtil.tileArray[midHeight][midWidth + 1].deviceType = DeviceType.Farm;
        DataUtil.tileArray[midHeight][midWidth + 2].tileType = TileType.Dirt;
        DataUtil.tileArray[midHeight + 1][midWidth - 1].tileType = TileType.Dirt;
        DataUtil.tileArray[midHeight + 1][midWidth].tileType = TileType.Stone;
        DataUtil.tileArray[midHeight + 1][midWidth].deviceType = DeviceType.Shop1;
        DataUtil.tileArray[midHeight + 1][midWidth + 1].tileType = TileType.Stone;
        DataUtil.tileArray[midHeight + 1][midWidth + 1].deviceType = DeviceType.House1;
        DataUtil.tileArray[midHeight + 1][midWidth + 2].tileType = TileType.Dirt;
        DataUtil.tileArray[midHeight + 2][midWidth - 1].tileType = TileType.Dirt;
        DataUtil.tileArray[midHeight + 2][midWidth].tileType = TileType.Dirt;
        DataUtil.tileArray[midHeight + 2][midWidth + 1].tileType = TileType.Dirt;
        // 初始化土壤含水量及工人属性
        for(let j = 0; j < this.mapHeight; j++){
            for(let i = 0; i < this.mapWidth; i++){
                const tile = DataUtil.tileArray[j][i];
                if(tile.tileType == TileType.Grass){
                    tile.SWC = 18;
                }else if(tile.tileType == TileType.Stone){
                    tile.SWC = 15;
                }else if(tile.tileType == TileType.Dirt){
                    tile.SWC = 12;
                }else if(tile.tileType == TileType.Water){
                    tile.SWC = 55;
                }else{
                    tile.SWC = 3;
                }
                if(tile.deviceType >= 0){
                    tile.workerLimits = DataUtil.deviceAttr[tile.deviceType].workerLimits;
                    tile.workerNum = DataUtil.deviceAttr[tile.deviceType].workerNum; 
                }

            }
        }
        this.refreshMap();
        this.mapNode.on(cc.Node.EventType.TOUCH_START,(event)=>{
            // console.log(this.ifPressed);
            this.pressPoint = new cc.Vec2(event.touch._point.x, event.touch._point.y);
            MapScript.MapLoc = new cc.Vec2(this.mapNode.x, this.mapNode.y);
            this.ifPressed = true;
            switch(MapScript.mapStatus){
                case MapStatus.Move: 
                    cc.game.canvas.style.cursor = "hand";
                    break;
            }
        },this);;
        this.mapNode.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            // console.log(this.ifPressed);
            if(this.ifPressed){
                switch(MapScript.mapStatus){
                    case MapStatus.Move: 
                        this.mapNode.x += (event.touch._point.x - event.touch._prevPoint.x);
                        this.mapNode.y += (event.touch._point.y- event.touch._prevPoint.y);
                        MapScript.MapLoc = new cc.Vec2(this.mapNode.x, this.mapNode.y);
                        break;
                }
            }
        },this);
        this.mapNode.on(cc.Node.EventType.TOUCH_END,(event)=>{
            // console.log(this.ifPressed);
            const releasePoint = event.touch._point;
            let delDist = (releasePoint.x - this.pressPoint.x) * (releasePoint.x - this.pressPoint.x) + (releasePoint.y - this.pressPoint.y) * (releasePoint.y - this.pressPoint.y);
            this.ifPressed = false;

            switch(MapScript.mapStatus){
                case MapStatus.Move: 
                    cc.game.canvas.style.cursor = "default";
                    if(delDist < 4){
                        const loc = MapScript.getTouchLoc(releasePoint.x, releasePoint.y);
                        if(loc.x > -1 && loc.y > -1){
                            const tile = DataUtil.tileArray[loc.y][loc.x];
                            console.log(tile);
                            DetailPanelScript.getInstance().showDetail(tile);
                            this.hexSlected.node.x = tile.x;
                            this.hexSlected.node.y = tile.y;
                            this.hexSlected.node.active = true;
                        }
                    }
                    break;
            }
        },this);
    }

    refreshMap(){
        this.tilesNode.removeAllChildren();
        // 生成 Terrain Sprite
        for(let j = 0; j < this.mapHeight; j++){
            for(let i = 0; i < this.mapWidth; i++){
                let type = DataUtil.tileArray[j][i].tileType;
                const newTS = cc.instantiate(this.tileSprites[type]);
                newTS.y = DataUtil.tileArray[j][i].y;
                newTS.x = DataUtil.tileArray[j][i].x;
                this.tilesNode.addChild(newTS);
                DataUtil.tileArray[j][i].tileSF = newTS.getComponent(cc.Sprite).spriteFrame;

                let devicetype = DataUtil.tileArray[j][i].deviceType;
                if(devicetype > -1){
                    const newDC = cc.instantiate(this.deviceSprites[devicetype]);
                    newDC.y = (j - this.mapHeight / 2.0) * Math.floor(this.tileHeight * 0.75 - 2);
                    newDC.x = (i - this.mapWidth / 2.0 - (j % 2) * 0.5) * this.tileWidth;
                    this.tilesNode.addChild(newDC);
                    DataUtil.tileArray[j][i].deviceSF = newDC.getComponent(cc.Sprite).spriteFrame;
                }else{
                    DataUtil.tileArray[j][i].deviceSF = null;
                }
            }
        }
    }

    static getTouchLoc(touchX, touchY):cc.Vec2{
        const x = touchX - MapScript.MapLoc.x - 480;
        const y = touchY - MapScript.MapLoc.y - 320;
        const loc = new cc.Vec2(-1,-1);
        // console.log(MapScript.TileLocs);
        for(let j = 0; j <  DataUtil.tileArray.length; j++){
            for(let i = 0; i < DataUtil.tileArray[0].length; i++){

                if((x - DataUtil.tileArray[j][i].x)*(x - DataUtil.tileArray[j][i].x)+(y - DataUtil.tileArray[j][i].y)*(y - DataUtil.tileArray[j][i].y) < 3600){
                    loc.x = i;
                    loc.y = j;
                }
                
            }
        }
        return loc;
    }
    // update (dt) {}
}
