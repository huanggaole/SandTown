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

    private unsubscribeLanguage: () => void = null;

    onDestroy(): void {
        if (this.unsubscribeLanguage) {
            this.unsubscribeLanguage();
            this.unsubscribeLanguage = null;
        }
    }

    start(): void {
        PlantScript.InfoLbl = this.infoLbl;
        this.unsubscribeLanguage = LanguageManager.onChange(()=>{
            if(PlantScript.InfoLbl){
                PlantScript.InfoLbl.string = LanguageManager.getPlantIntro(PlantScript.selectedIndex);
            }
            for(let i = 0; i < this.plantBtns.length; i++){
                const lbl = this.plantBtns[i].node.getComponentInChildren(cc.Label);
                if(lbl){
                    lbl.string = LanguageManager.getPlantName(i);
                }
            }
        });
        for(let i = 0; i < this.plantBtns.length; i++){
            const lbl = this.plantBtns[i].node.getComponentInChildren(cc.Label);
            if(lbl){
                lbl.string = LanguageManager.getPlantName(i);
            }
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
        if(this.infoLbl){
            this.infoLbl.string = LanguageManager.getPlantIntro(PlantScript.selectedIndex);
        }
        PlantScript.PlantBtns = this.plantBtns;
    }

    static dealPlant(tile:TileScript){
        if(this.selectedIndex == 0){
            if(tile.deviceType < 0 || tile.deviceType == DeviceType.Rock){
                DialogScript.ShowDialog(LanguageManager.t("dlg_no_plant_here"));
            }else if(tile.tileType == TileType.Stone){
                DialogScript.ShowDialog(LanguageManager.t("dlg_clear_plant_not_for_construction"));
            }else{
                tile.deviceType = -1;
                tile.deviceSF = null;
                tile.deviceNode.getComponent(cc.Sprite).spriteFrame = null;
                DataUtil.money -= this.moneyCost[0];
            }
        } else if (this.selectedIndex > 0){
            if(tile.deviceType == DeviceType.Rock){
                DialogScript.ShowDialog(LanguageManager.t("dlg_cannot_plant_on_rock"));
            } else if(tile.tileType == TileType.Stone){
                DialogScript.ShowDialog(LanguageManager.t("dlg_cannot_plant_on_construction"));
            } else if(tile.tileType == TileType.Water){
                DialogScript.ShowDialog(LanguageManager.t("dlg_cannot_plant_on_water"));
            } else if(tile.deviceType > -1){
                DialogScript.ShowDialog(LanguageManager.t("dlg_cannot_plant_on_other_plant"));
            } else if((this.selectedIndex == 6 || this.selectedIndex == 7) && tile.SWC < 15 && ResearchScript.cultureStatus[1] != 1){
                DialogScript.ShowDialog(LanguageManager.t("dlg_farm_requires_grass_pre_research"));
            } else if((this.selectedIndex == 6 || this.selectedIndex == 7) && tile.SWC < 10 && ResearchScript.cultureStatus[1] == 1){
                DialogScript.ShowDialog(LanguageManager.t("dlg_farm_requires_dirt_or_grass_post_research"));
            } else if((this.selectedIndex == 5) && tile.SWC < 10){
                DialogScript.ShowDialog(LanguageManager.t("dlg_thuja_requires_dirt_or_grass"));
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
            DialogScript.ShowDialog(LanguageManager.t("dlg_plants_dead", { num: plantNum }));
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
}
