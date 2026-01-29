import DataUtil, { DeviceType, TileType } from "./DataUtil";
import DialogScript from "./DialogScript";
import TileScript from "./TileScript";
import MenuScropt from "./MenuScript";
import MapScript from "./MapScript";
import ResearchScript from "./ResearchScript";
import LanguageManager from "./LanguageManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlantScript extends cc.Component {
    @property([cc.Button])
    plantBtns: Array<cc.Button> = [];

    @property(cc.SpriteFrame)
    normalSF:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    pressedSF:cc.SpriteFrame = null;

    @property(cc.Label)
    infoLbl:cc.Label = null;

    static selectedIndex = 0;
    static PlantBtns;
    static InfoLbl: cc.Label;
    start(): void {
        PlantScript.InfoLbl = this.infoLbl;
        LanguageManager.onChange(()=>{
            if(PlantScript.InfoLbl){
                PlantScript.InfoLbl.string = LanguageManager.getPlantIntro(PlantScript.selectedIndex);
            }
        });
        for(let i = 0; i < this.plantBtns.length; i++){
            this.plantBtns[i].node.on("click",()=>{
                const index = i;
                for(let j = 0; j < this.plantBtns.length; j++){
                    this.plantBtns[j].normalSprite = this.normalSF;
                    this.plantBtns[j].pressedSprite = this.pressedSF;
                    this.plantBtns[j].hoverSprite = this.normalSF;
                }
                this.plantBtns[index].normalSprite = this.pressedSF;
                this.plantBtns[index].pressedSprite = this.pressedSF;
                this.plantBtns[index].hoverSprite = this.pressedSF;
                PlantScript.selectedIndex = index;
                this.infoLbl.string = LanguageManager.getPlantIntro(index);
            },this);
        }
        PlantScript.PlantBtns = this.plantBtns;
    }

    static dealPlant(tile:TileScript){
        if(this.selectedIndex == 0){
            if(tile.deviceType < 0 || tile.deviceType == DeviceType.Rock){
                DialogScript.ShowDialog("此处没有植物，请选择一处有植物的图块才能进行清除植物操作。");
            }else if(tile.tileType == TileType.Stone){
                DialogScript.ShowDialog("“清除植物”按钮不能用于清除建筑用地，清除建筑用地请使用“建筑”功能下的“清除建筑”按钮。");
            }else{
                tile.deviceType = -1;
                tile.deviceSF = null;
                tile.deviceNode.getComponent(cc.Sprite).spriteFrame = null;
                DataUtil.money -= this.moneyCost[0];
            }
        } else if (this.selectedIndex > 0){
            if(tile.deviceType == DeviceType.Rock){
                DialogScript.ShowDialog("不能将植物种在岩石上。");
            } else if(tile.tileType == TileType.Stone){
                DialogScript.ShowDialog("不能将植物种在建筑用地上。");
            } else if(tile.tileType == TileType.Water){
                DialogScript.ShowDialog("不能将植物种在水体上。");
            } else if(tile.deviceType > -1){
                DialogScript.ShowDialog("不能将植物种在其他植物上。");
            } else if((this.selectedIndex == 6 || this.selectedIndex == 7) && tile.SWC < 15 && ResearchScript.cultureStatus[1] != 1){
                DialogScript.ShowDialog("目前，农田必须种在绿地（土壤含水量≥15%）上。研究“旱地培育”技术后，可以将农田种在泥地（土壤含水量≥10%）上。");
            } else if((this.selectedIndex == 6 || this.selectedIndex == 7) && tile.SWC < 10 && ResearchScript.cultureStatus[1] == 1){
                DialogScript.ShowDialog("目前，农田必须种在泥地或草地（土壤含水量≥10%）上。");
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
        DataUtil.countParams();
        MenuScropt.updateMenu();
    }

    static improveSWC(){
        for(let j = 0; j < DataUtil.tileArray.length; j++){
            for(let i = 0; i < DataUtil.tileArray[0].length; i++){
                const tile = DataUtil.tileArray[j][i];
                if(tile.deviceType >= 0 && DataUtil.deviceAttr[tile.deviceType].plantFunc != null){
                    tile.SWC += DataUtil.deviceAttr[tile.deviceType].plantFunc.SWCEffect;
                    if(tile.SWC > DataUtil.deviceAttr[tile.deviceType].plantFunc.highestSWC){
                        tile.SWC = DataUtil.deviceAttr[tile.deviceType].plantFunc.highestSWC;
                    }
                }
            }
        }
    }

    static killPlant(){
        let plantNum = 0;
        for(let j = 0; j < DataUtil.tileArray.length; j++){
            for(let i = 0; i < DataUtil.tileArray[0].length; i++){
                const tile = DataUtil.tileArray[j][i];
                if(tile.SWC < 15 && ResearchScript.cultureStatus[1]!=1 && (tile.deviceType == DeviceType.Farm || tile.deviceType == DeviceType.FarmHigh)){
                    tile.deviceType = -1;
                    tile.deviceSF = null;
                    tile.deviceNode.getComponent(cc.Sprite).spriteFrame = null;
                    plantNum++;
                }else if(tile.SWC < 10 && ResearchScript.cultureStatus[1]==1 && (tile.deviceType == DeviceType.Farm || tile.deviceType == DeviceType.FarmHigh)){
                    tile.deviceType = -1;
                    tile.deviceSF = null;
                    tile.deviceNode.getComponent(cc.Sprite).spriteFrame = null;
                    plantNum++;
                }else if(tile.SWC < 10 && tile.deviceType >= 0 && DataUtil.deviceAttr[tile.deviceType].plantFunc != null){
                    const dieprop = DataUtil.deviceAttr[tile.deviceType].plantFunc.liveRate + DataUtil.deviceAttr[tile.deviceType].plantFunc.liveRatePerWorker * DataUtil.tileArray[j][i].workerNum;
                    console.log(dieprop);
                    const rnd = Math.random() * 100;
                    if(dieprop < rnd){
                        tile.deviceType = -1;
                        tile.deviceSF = null;
                        tile.deviceNode.getComponent(cc.Sprite).spriteFrame = null;
                        plantNum++;
                    }
                }
                
            }
        }
        if(plantNum > 0){
            DialogScript.ShowDialog("由于恶劣环境的影响，沙地上有" + plantNum + "颗植物死亡了。");
        }
    }

    static moneyCost = [
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        200,
    ];

    static introTxt = [
        "清除植物：可以将一个地块上的植物清除。需要花费" + PlantScript.moneyCost[0] + "点金币。不能清除石头或建筑物。",
        "梭梭树：可以在一个空地块上种植梭梭树。需要花费" + PlantScript.moneyCost[1] + "点金币。梭梭树每回合需要人工维护，否则容易被动物啃食。",
        "沙棘：可以在一个空地块上种植沙棘。需要花费" + PlantScript.moneyCost[2] + "点金币。沙棘每个工人能提高生存率且每回合能获得1点粮食。",
        "花棒：可以在一个空地块上种植花棒。需要花费" + PlantScript.moneyCost[3] + "点金币。花棒需要人工维护，否则容易被动物啃食或生病。",
        "沙地云杉：可以在一个空地块上种植沙地云杉。需要花费" + PlantScript.moneyCost[4] + "点金币。沙地云杉不需要人工维护，但生长较慢。",
        "侧柏：可以在一个空地块上种植侧柏。需要花费" + PlantScript.moneyCost[5] + "点金币。侧柏不需要人工维护，但必须种在泥地或草地上。",
        "农田：可以在一个空地块上种植农田。需要花费" + PlantScript.moneyCost[6] + "点金币。农田每个工人获得2点粮食，但只能种在草地上。",
        "高级农田：可以在一个空地快上种植农田。需要花费" + PlantScript.moneyCost[7] + "点金币。高级农田每个工人获得10点粮食与10枚金币，但只能种在草地上。",
    ];
}
