// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
enum TileType{
    Sand,
    Dirt,
    Grass,
    Water,
    Stone
}
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
    @property(cc.Node)
    mapNode: cc.Node = null;

    @property([cc.Prefab])
    tileSprites: Array<cc.Prefab> = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    mapArray = [];
    static mapStatus = MapStatus.Move;
    ifPressed = false;
    start () {
        for(let j = 0; j < this.mapHeight; j++){
            const line = [];
            for(let i = 0; i < this.mapWidth; i++){
                line.push(TileType.Sand);
            }
            this.mapArray.push(line);
        }
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
                let type = this.mapArray[j][i];
                const newTS = cc.instantiate(this.tileSprites[type]);
                newTS.y = (j - this.mapHeight / 2.0) * Math.floor(this.tileHeight * 0.75 - 2);
                newTS.x = (i - this.mapWidth / 2.0 - (j % 2) * 0.5) * this.tileWidth;

                this.mapNode.addChild(newTS);
            }
        }
    }
    // update (dt) {}
}
