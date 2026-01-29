// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DataUtil, { DeviceType, TileType } from "./DataUtil";
import DialogScript from "./DialogScript";
import MapScript, { MapStatus } from "./MapScript";
import MenuScript from "./MenuScript";
import TileScript from "./TileScript";
import LanguageManager from "./LanguageManager";

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
                if(MapScript.mapStatus == MapStatus.Check){
                    MapScript.updateCheckStatus();
                }
            }
        },this);
        this.addBtn.node.on("click",()=>{
            if(DataUtil.labourPoints <=0){
                DialogScript.ShowDialog(LanguageManager.t("need_labors"));
                return;
            }
            if(this.currentTile.workerNum < this.currentTile.workerLimits){
                this.currentTile.workerNum++;
                this.freshWorkerInfo(this.currentTile);
                if(MapScript.mapStatus == MapStatus.Check){
                    MapScript.updateCheckStatus();
                }
            }
        },this);
        DetailPanelScript.PNode = this.parentNode;
        this.parentNode.active = false;
    }

    hideDetail(){
        this.hexSlected.node.active = false;
        this.parentNode.active = false;
    }

    showDetail(tile:TileScript){
        this.currentTile = tile;
        this.parentNode.active = true;
        this.tile_icon.spriteFrame = tile.tileSF;
        this.SWCLbl.string = LanguageManager.t("soil_moisture") + Math.round(tile.SWC * 10) / 10.0 + "%";
        if(tile.deviceSF == null){
            this.device_icon.node.active = false;
        }else{
            this.device_icon.spriteFrame = tile.deviceSF;
            this.device_icon.node.active = true;
        }
        if(tile.tileType == TileType.Sand || tile.tileType == TileType.Sand_H){
            this.introLbl.string = LanguageManager.t("intro_sand");
        }
        if(tile.tileType == TileType.Dirt || tile.tileType == TileType.Dirt_H){
            this.introLbl.string = LanguageManager.t("intro_dirt");
        }
        if(tile.tileType == TileType.Grass || tile.tileType == TileType.Grass_H){
            this.introLbl.string = LanguageManager.t("intro_grass");
        }
        if(tile.tileType == TileType.Water){
            this.introLbl.string = LanguageManager.t("intro_water");
        }
        if(tile.deviceType < 0){
            this.discLbl.string = LanguageManager.getTileName(tile.tileType);
            this.parentNode.height = 200;
            this.workerNode.active = false;
            this.HouseNode.active = false;
            return;
        }else{
            const deviceType = tile.deviceType;
            let deviceName = "";
            if (deviceType === DeviceType.VillageCommittee) {
                deviceName = LanguageManager.t("village_committee_name");
            } else if (deviceType >= 12) {
                deviceName = LanguageManager.getBuildName(deviceType - 12 + 4);
            } else if (deviceType >= 1 && deviceType <= 7) {
                deviceName = LanguageManager.getPlantName(deviceType);
            } else {
                deviceName = DataUtil.deviceAttr[deviceType].name;
            }
                        this.discLbl.string = LanguageManager.getTileName(tile.tileType) + " · " + deviceName;
        }
        const tileAttr = DataUtil.deviceAttr[tile.deviceType];
        if(tileAttr.plantFunc != null){
            if(tileAttr.workerLimits > 0){
                this.parentNode.height = 400;
                this.freshWorkerInfo(tile);
                this.workerNode.active = true;
                this.HouseNode.active = false;
            }else{
                this.parentNode.height = 200;
                this.workerNode.active = false;
                this.HouseNode.active = false;
            }
            const deviceType = tile.deviceType;
            let deviceName = "";
            if (deviceType === DeviceType.VillageCommittee) {
                deviceName = LanguageManager.t("village_committee_name");
            } else if (deviceType >= 12) {
                deviceName = LanguageManager.getBuildName(deviceType - 12 + 4);
            } else if (deviceType >= 1 && deviceType <= 7) {
                deviceName = LanguageManager.getPlantName(deviceType);
            } else {
                deviceName = DataUtil.deviceAttr[deviceType].name;
            }
            this.introLbl.string = deviceName + " " + LanguageManager.t("per_worker_prefix");
            if(tileAttr.plantFunc.liveRatePerWorker > 0){
                this.introLbl.string += LanguageManager.t("per_worker_survival", { val: tileAttr.plantFunc.liveRatePerWorker });
            }
            this.introLbl.string += LanguageManager.t("per_turn_swc_up_to", { swc: tileAttr.plantFunc.SWCEffect, max: tileAttr.plantFunc.highestSWC });
            if(tileAttr.foodEffect > 0){
                this.introLbl.string += LanguageManager.t("per_worker_food", { val: tileAttr.foodEffect });
            }
        } else if(tileAttr.workerLimits > 0){
            this.parentNode.height = 400;
            this.freshWorkerInfo(tile);
            this.workerNode.active = true;
            this.HouseNode.active = false;
            this.introLbl.string = LanguageManager.t("per_worker_prefix");
            if(tileAttr.cultureEffect > 0){
                this.introLbl.string += LanguageManager.t("per_worker_culture", { val: tileAttr.cultureEffect });
            }
            if(tileAttr.foodEffect > 0){
                this.introLbl.string += LanguageManager.t("per_worker_food", { val: tileAttr.foodEffect });
            }
            if(tileAttr.moneyEffect > 0){
                this.introLbl.string += LanguageManager.t("per_worker_money", { val: tileAttr.moneyEffect });
            }
            if(tileAttr.name == "木材厂"){
                this.introLbl.string += LanguageManager.t("lumber_adj_bonus");
            }
            if(tileAttr.name == "采石场"){
                this.introLbl.string += LanguageManager.t("quarry_adj_bonus");
            }
            if(tileAttr.moneyEffect < 0){
                this.introLbl.string += LanguageManager.t("per_worker_cost_money", { val: Math.abs(tileAttr.moneyEffect) });
            }
            if(tileAttr.happinessEffectRange > 0){
                this.introLbl.string += " " + LanguageManager.t("happiness_range_label", { range: tileAttr.happinessEffectRange });
            }
            if(tileAttr.happinessEffect > 0){
                this.introLbl.string += LanguageManager.t("happiness_plus", { val: tileAttr.happinessEffect });
            }
            if(tileAttr.happinessEffect < 0){
                this.introLbl.string += LanguageManager.t("happiness_minus", { val: Math.abs(tileAttr.happinessEffect) });
            }
        }else if(tileAttr.populationEffect > 0){
            this.parentNode.height = 400;
            this.introLbl.string = LanguageManager.t("residential_intro", { num: tileAttr.populationEffect });
            if(tileAttr.happinessEffect > 0){
                this.introLbl.string += " " + LanguageManager.t("residential_happiness_gain", { val: tileAttr.happinessEffect });
            }
            this.workerNode.active = false;
            this.lodgerLbl.string = LanguageManager.t("lodger_residents", { num: tileAttr.populationEffect })
                + "\n" + LanguageManager.t("lodger_happiness_here", { val: tile.happinessTotal })
                + "\n\n" + LanguageManager.t("lodger_sources_header") + "\n"
                + LanguageManager.t("lodger_house_self", { val: tileAttr.happinessEffect });
            for(let i = 0; i < tile.happinessSource.length; i++){
                const srcName = this.localizeDeviceName(tile.happinessSource[i].name);
                this.lodgerLbl.string += "\n" + LanguageManager.t("lodger_source_item", { val: tile.happinessSource[i].value, name: srcName, dist: tile.happinessSource[i].dist });
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
        this.workerLbl.string = LanguageManager.t("worker_count") + workerNum + "/" + workerLimits;
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
        if(tileAttr.plantFunc != null){
            this.effectLbl.string += LanguageManager.t("soil_moisture_increase_prefix") + (tileAttr.plantFunc.SWCEffect) + "%; \n";
            this.effectLbl.string += LanguageManager.t("soil_moisture_increase_suffix") + (tileAttr.plantFunc.highestSWC) + "%; \n";
            this.effectLbl.string += LanguageManager.t("population_label") + (tileAttr.plantFunc.liveRate + tileAttr.plantFunc.liveRatePerWorker * workerNum) + "%; ";
        }
        if(tileAttr.cultureEffect > 0){
            this.effectLbl.string += LanguageManager.t("effect_culture_plus", { val: (tileAttr.cultureEffect * workerNum) }) + "; ";
        }
        if(tileAttr.foodEffect > 0){
            this.effectLbl.string += LanguageManager.t("effect_food_plus", { val: (tileAttr.foodEffect * workerNum) }) + "; ";
        }
        if(tileAttr.moneyEffect > 0){
            let extraMoney = 0;
            if(tile.deviceType == DeviceType.Industry1){
                if(tile.leftUpTile.deviceType == DeviceType.CeBo || tile.leftUpTile.deviceType == DeviceType.YunShan){
                    extraMoney++;
                }
                if(tile.leftTile.deviceType == DeviceType.CeBo || tile.leftTile.deviceType == DeviceType.YunShan){
                    extraMoney++;
                }
                if(tile.leftDownTile.deviceType == DeviceType.CeBo || tile.leftDownTile.deviceType == DeviceType.YunShan){
                    extraMoney++;
                }
                if(tile.rightUpTile.deviceType == DeviceType.CeBo || tile.rightUpTile.deviceType == DeviceType.YunShan){
                    extraMoney++;
                }
                if(tile.rightTile.deviceType == DeviceType.CeBo || tile.rightTile.deviceType == DeviceType.YunShan){
                    extraMoney++;
                }
                if(tile.rightDownTile.deviceType == DeviceType.CeBo || tile.rightDownTile.deviceType == DeviceType.YunShan){
                    extraMoney++;
                }
            }
            // 判断是否是采石场
            if(tile.deviceType == DeviceType.Industry2){
                if(tile.leftUpTile.deviceType == DeviceType.Rock){
                    extraMoney +=3;
                }
                if(tile.leftTile.deviceType == DeviceType.Rock){
                    extraMoney +=3;
                }
                if(tile.leftDownTile.deviceType == DeviceType.Rock){
                    extraMoney +=3;
                }
                if(tile.rightUpTile.deviceType == DeviceType.Rock){
                    extraMoney +=3;
                }
                if(tile.rightTile.deviceType == DeviceType.Rock){
                    extraMoney +=3;
                }
                if(tile.rightDownTile.deviceType == DeviceType.Rock){
                    extraMoney +=3;
                }
            }
            this.effectLbl.string += LanguageManager.t("effect_money_plus", { val: ((tileAttr.moneyEffect + extraMoney) * workerNum) }) + "; ";
        }
        if(tileAttr.moneyEffect < 0){
            this.effectLbl.string += LanguageManager.t("effect_money_minus", { val: (Math.abs(tileAttr.moneyEffect) * workerNum) }) + "; ";
        }
        if(tileAttr.happinessEffectRange > 0){
            this.effectLbl.string += "\n" + LanguageManager.t("happiness_range_label", { range: tileAttr.happinessEffectRange });
        }
        if(tileAttr.happinessEffect > 0){
            this.effectLbl.string += LanguageManager.t("happiness_plus", { val: (tileAttr.happinessEffect * workerNum) });
        }
        if(tileAttr.happinessEffect < 0){
            this.effectLbl.string += LanguageManager.t("happiness_minus", { val: Math.abs(tileAttr.happinessEffect * workerNum) });
        }
    }

    localizeDeviceName(name: string): string {
        if (LanguageManager.current === "zh") return name;
        if (name === DataUtil.deviceAttr[DeviceType.VillageCommittee].name) {
            return LanguageManager.t("village_committee_name");
        }
        const pIdx = LanguageManager.plantNameZh.indexOf(name);
        if (pIdx >= 0) return LanguageManager.getPlantName(pIdx);
        const bIdx = LanguageManager.buildNameZh.indexOf(name);
        if (bIdx >= 0) return LanguageManager.getBuildName(bIdx);
        return name;
    }

}
