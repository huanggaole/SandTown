import DataUtil, { DeviceType, TileType } from "./DataUtil";
import DialogScript from "./DialogScript";
import TileScript from "./TileScript";
import MenuScropt from "./MenuScript";
import MapScript from "./MapScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BuildScript extends cc.Component {
    @property([cc.Button])
    buildBtns: Array<cc.Button> = [];

    @property(cc.SpriteFrame)
    normalSF:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    pressedSF:cc.SpriteFrame = null;

    @property(cc.Label)
    infoLbl:cc.Label = null;

    static selectedIndex = 0;

    start(): void {
        for(let i = 0; i < this.buildBtns.length; i++){
            this.buildBtns[i].node.on("click",()=>{
                const index = i;
                for(let j = 0; j < this.buildBtns.length; j++){
                    this.buildBtns[j].normalSprite = this.normalSF;
                    this.buildBtns[j].pressedSprite = this.pressedSF;
                    this.buildBtns[j].hoverSprite = this.normalSF;
                }
                this.buildBtns[index].normalSprite = this.pressedSF;
                this.buildBtns[index].pressedSprite = this.normalSF;
                this.buildBtns[index].hoverSprite = this.pressedSF;
                BuildScript.selectedIndex = index;
                this.infoLbl.string = BuildScript.introTxt[index];
            },this);
        }
    }

    static dealBuilding(tile:TileScript){
        if(this.selectedIndex == 0){
            if(tile.deviceType <= 0 || tile.deviceType == DeviceType.Rock){
                DialogScript.ShowDialog("此处没有建筑，请选择一处有建筑物的图块才能进行清除建筑操作。");
            }else if(tile.deviceType == DeviceType.VillageCommittee){
                DialogScript.ShowDialog("此建筑为小镇的政府建筑，不能被清除。");
            }else if(tile.tileType == TileType.Stone){
                if(DataUtil.deviceAttr[tile.deviceType].populationEffect > 0){
                    DataUtil.laborNum -= DataUtil.deviceAttr[tile.deviceType].populationEffect;
                }
                tile.deviceType = -1;
                tile.deviceSF = null;
                tile.deviceNode.getComponent(cc.Sprite).spriteFrame = null;
                DataUtil.money -= this.moneyCost[0];
            }else{
                DialogScript.ShowDialog("“清除建筑”按钮不能用于清除植物，清除植物请使用“种植”功能下的“清除植物”按钮。");
            }
        } 
        /*
        else if (this.selectedIndex > 0){
            if(tile.deviceType == DeviceType.Rock){
                DialogScript.ShowDialog("不能将植物种在岩石上。");
            } else if(tile.tileType == TileType.Stone){
                DialogScript.ShowDialog("不能将植物种在建筑用地上。");
            } else if(tile.tileType == TileType.Water){
                DialogScript.ShowDialog("不能将植物种在水体上。");
            } else if(tile.deviceType > -1){
                DialogScript.ShowDialog("不能将植物种在其他植物上。");
            } else if((this.selectedIndex == 6 || this.selectedIndex == 7) && tile.SWC < 15){
                DialogScript.ShowDialog("目前，农田必须种在绿地（土壤含水量≥15%）上。研究“旱地培育”技术后，可以将农田种在泥地（土壤含水量≥10%）上。");
            } else if((this.selectedIndex == 5) && tile.SWC < 10){
                DialogScript.ShowDialog("侧柏必须种在泥地或草地（土壤含水量≥10%）上。");
            } else {
                tile.deviceType = this.selectedIndex;
                tile.workerLimits = DataUtil.deviceAttr[tile.deviceType].workerLimits;
                tile.workerNum = 0;
                tile.deviceSF = MapScript.deviceSFs[tile.deviceType];
                tile.deviceNode.getComponent(cc.Sprite).spriteFrame = tile.deviceSF;
                DataUtil.money -= this.moneyCost[this.selectedIndex];
            }
        }
        */
        DataUtil.countParams();
        MenuScropt.updateMenu();
    }

    static moneyCost = [
        2,
        2
    ];

    static introTxt=[
        "清除建筑：可以将一个建筑用地上的建筑清除。需要花费" + BuildScript.moneyCost[0] + "点金币。不能清除石头或植物。",
        ""
    ];
}