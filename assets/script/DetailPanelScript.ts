// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DataUtil, { TileType } from "./DataUtil";
import MenuScript from "./MenuScript";
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
    introLbl: cc.Label = null;

    @property(cc.Label)
    SWCLbl: cc.Label = null;

    @property(cc.Button)
    closeBtn: cc.Button = null;

    @property(cc.Sprite)
    hexSlected: cc.Sprite = null;

    @property(cc.Node)
    workerNode: cc.Node = null;

    @property(cc.Label)
    workerLbl: cc.Label = null;

    @property(cc.Label)
    effectLbl: cc.Label = null;

    @property(cc.Button)
    minusBtn: cc.Button = null;
    
    @property(cc.Button)
    addBtn: cc.Button = null;

    @property([cc.Sprite])
    pawnSprites: Array<cc.Sprite> = [];

    @property(cc.SpriteFrame)
    pawnSF:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    pawn_Occupy_SF:cc.SpriteFrame = null;

    @property(cc.Node)
    HouseNode: cc.Node = null;

    @property(cc.Label)
    lodgerLbl: cc.Label = null;

    static PNode: cc.Node;

    currentTile: TileScript;

    static getInstance(){
        return this.PNode.getComponent(DetailPanelScript);
    }

    start(){
        this.closeBtn.node.on("click",()=>{
            this.parentNode.active = false;
            this.hexSlected.node.active = false;
        },this);
        this.minusBtn.node.on("click",()=>{
            if(this.currentTile.workerNum > 0){
                this.currentTile.workerNum--;
                this.freshWorkerInfo(this.currentTile);
            }
        },this);
        this.addBtn.node.on("click",()=>{
            if(this.currentTile.workerNum < this.currentTile.workerLimits){
                this.currentTile.workerNum++;
                this.freshWorkerInfo(this.currentTile);
            }
        },this);
        DetailPanelScript.PNode = this.parentNode;
        this.parentNode.active = false;
    }

    showDetail(tile:TileScript){
        this.currentTile = tile;
        this.parentNode.active = true;
        this.tile_icon.spriteFrame = tile.tileSF;
        this.SWCLbl.string = "土壤含水量:" + tile.SWC + "%";
        if(tile.deviceSF == null){
            this.device_icon.node.active = false;
        }else{
            this.device_icon.spriteFrame = tile.deviceSF;
            this.device_icon.node.active = true;
        }
        if(tile.tileType == TileType.Sand || tile.tileType == TileType.Sand_H){
            this.introLbl.string = "土壤含水量小于10%时为沙地，可以通过种植防风固沙植物提高沙地的土壤含水量。";
        }
        if(tile.tileType == TileType.Dirt || tile.tileType == TileType.Dirt_H){
            this.introLbl.string = "土壤含水量在10%~15%之间为泥地，可以通过种植植物提高泥地的土壤含水量。泥地可被建设为建设用地。";
        }
        if(tile.tileType == TileType.Grass || tile.tileType == TileType.Grass_H){
            this.introLbl.string = "土壤含水量在15%以上为草地，草地上可以种植庄稼。草地可以被建设为建设用地。草地可以被建设为水体。";
        }
        if(tile.tileType == TileType.Water){
            this.introLbl.string = "水体可以被改建为泥地或草地。当土壤含水量降至15%以下时，水体会退化为泥地。";
        }
        if(tile.deviceType < 0){
            this.discLbl.string = this.tileName[tile.tileType];
            this.parentNode.height = 200;
            this.workerNode.active = false;
            this.HouseNode.active = false;
            return;
        }else{
            this.discLbl.string = this.tileName[tile.tileType] + " · " + DataUtil.deviceAttr[tile.deviceType].name;
        }
        const tileAttr = DataUtil.deviceAttr[tile.deviceType];
        if(tileAttr.workerLimits > 0){
            this.parentNode.height = 400;
            this.freshWorkerInfo(tile);
            this.workerNode.active = true;
            this.HouseNode.active = false;
            this.introLbl.string = "每位工作人员可以产生";
            if(tileAttr.cultureEffect > 0){
                this.introLbl.string += tileAttr.cultureEffect + "点文化，";
            }
            if(tileAttr.foodEffect > 0){
                this.introLbl.string += tileAttr.foodEffect + "点粮食，";
            }
            if(tileAttr.moneyEffect > 0){
                this.introLbl.string += tileAttr.moneyEffect + "点金钱，";
            }
            if(tileAttr.moneyEffect < 0){
                this.introLbl.string += "花费" + Math.abs(tileAttr.moneyEffect) + "点金钱，";
            }
            if(tileAttr.happinessEffectRange > 0){
                this.introLbl.string += tileAttr.happinessEffectRange + "格以内的住宅建筑的幸福度"
            }
            if(tileAttr.happinessEffect > 0){
                this.introLbl.string += "增加" + tileAttr.happinessEffect + "点。"
            }
            if(tileAttr.happinessEffect < 0){
                this.introLbl.string += "减少" + tileAttr.happinessEffect + "点。"
            }
        }else if(tileAttr.populationEffect > 0){
            this.parentNode.height = 400;
            this.introLbl.string = "此建筑为住宅建筑，可以吸引" + tileAttr.populationEffect + "名工作人员前来居住。"
            if(tileAttr.happinessEffect > 0){
                this.introLbl.string += "住在这个建筑中的居民可获得" + tileAttr.happinessEffect + "点幸福度。";
            }
            this.workerNode.active = false;
            this.lodgerLbl.string = "居住的人数：" + tileAttr.populationEffect + "\n住在这里的幸福度：" + tile.happinessTotal + "\n\n幸福度来源：\n" + tileAttr.happinessEffect + "来自住宅本身提供";
            for(let i = 0; i < tile.happinessSource.length; i++){
                this.lodgerLbl.string += "\n" + tile.happinessSource[i].value + "来自" + tile.happinessSource[i].dist + "格外的" + tile.happinessSource[i].name;
            }
            this.HouseNode.active = true;
        }
        else{
            this.parentNode.height = 200;
            this.workerNode.active = false;
            this.HouseNode.active = false;
            // this.introLbl.string = "";
        }
    }

    // update (dt) {}

    freshWorkerInfo(tile:TileScript){
        const workerLimits = tile.workerLimits;
        const workerNum = tile.workerNum;
        // console.log(tile, workerLimits, workerNum);
        this.workerLbl.string = "工作人员个数：" + workerNum + "/" + workerLimits;
        for(let i = 0; i < this.pawnSprites.length; i++){
            if(i >= workerLimits){
                this.pawnSprites[i].node.active = false;
            }else{
                if(i >= workerNum){
                    this.pawnSprites[i].spriteFrame = this.pawnSF;
                }else{
                    this.pawnSprites[i].spriteFrame = this.pawn_Occupy_SF;
                }
                this.pawnSprites[i].node.active = true;
            }
        }
        MenuScript.updateMenu();
        const tileAttr = DataUtil.deviceAttr[tile.deviceType];
        this.effectLbl.string = "";
        if(tileAttr.cultureEffect > 0){
            this.effectLbl.string += "文化 + " + (tileAttr.cultureEffect * workerNum) + "; ";
        }
        if(tileAttr.foodEffect > 0){
            this.effectLbl.string += "粮食 + " + (tileAttr.foodEffect * workerNum) + "; ";
        }
        if(tileAttr.moneyEffect > 0){
            this.effectLbl.string += "金钱 + "+ (tileAttr.moneyEffect * workerNum) + "; ";
        }
        if(tileAttr.moneyEffect < 0){
            this.effectLbl.string += "金钱 - " + (Math.abs(tileAttr.moneyEffect) * workerNum) + "; ";
        }
        if(tileAttr.happinessEffectRange > 0){
            this.effectLbl.string += "\n" + tileAttr.happinessEffectRange + "格以内住宅幸福度"
        }
        if(tileAttr.happinessEffect > 0){
            this.effectLbl.string += " + " + (tileAttr.happinessEffect * workerNum) + "。"
        }
        if(tileAttr.happinessEffect < 0){
            this.effectLbl.string += " - " + (tileAttr.happinessEffect * workerNum) + "。"
        }
    }

    tileName = ["沙地","泥地","草地","水体","建设用地","沙坡","泥坡","草坡"];
    
}
