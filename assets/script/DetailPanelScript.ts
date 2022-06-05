// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DataUtil from "./DataUtil";
import TileScript from "./TileScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DetailPanelScript extends cc.Component {
    @property(cc.Node)
    parentNode: cc.Node = null;

    @property(cc.Sprite)
    tile_icon: cc.Sprite = null;

    @property(cc.Sprite)
    device_icon: cc.Sprite = null;

    @property(cc.Label)
    discLbl: cc.Label = null;

    @property(cc.Label)
    SWCLbl: cc.Label = null;

    @property(cc.Button)
    closeBtn: cc.Button = null;

    static PNode: cc.Node;

    static getInstance(){
        return this.PNode.getComponent(DetailPanelScript);
    }

    start(){
        this.closeBtn.node.on("click",()=>{this.parentNode.active = false;},this);
        DetailPanelScript.PNode = this.parentNode;
        this.parentNode.active = false;
    }

    showDetail(tile:TileScript){
        this.parentNode.active = true;
        this.tile_icon.spriteFrame = tile.tileSF;
        if(tile.deviceSF == null){
            this.device_icon.node.active = false;
        }else{
            this.device_icon.spriteFrame = tile.deviceSF;
            this.device_icon.node.active = true;
        }
        if(tile.deviceType < 0){
            this.discLbl.string = this.tileName[tile.tileType];
        }else{
            this.discLbl.string = this.tileName[tile.tileType] + " · " + this.deviceName[tile.deviceType];
        }
        this.SWCLbl.string = "土壤含水量:" + tile.SWC + "%";
    }

    // update (dt) {}

    tileName = ["沙地","泥地","草地","水体","建设用地","沙坡","泥坡","草坡"];
    deviceName = ["仙人掌","岩石","荒废农田","农田","村委会","民居","民居2","民居3","民居4","商店街"];
}
