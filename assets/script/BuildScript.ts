import DataUtil, { DeviceType, TileType } from "./DataUtil";
import DialogScript from "./DialogScript";
import TileScript from "./TileScript";
import MenuScropt from "./MenuScript";
import MapScript from "./MapScript";
import ResearchScript from "./ResearchScript";
import LanguageManager from "./LanguageManager";

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

    static BuildBtns;
    static selectedIndex = 0;
    static firstBuildingIndex = 12;

    private unsubscribeLanguage: () => void = null;

    onDestroy(): void {
        if (this.unsubscribeLanguage) {
            this.unsubscribeLanguage();
            this.unsubscribeLanguage = null;
        }
    }

    start(): void {
        this.unsubscribeLanguage = LanguageManager.onChange(()=>{
            if(this.infoLbl){
                this.infoLbl.string = LanguageManager.getBuildIntro(BuildScript.selectedIndex);
            }
            for(let i = 0; i < this.buildBtns.length; i++){
                const lbl = this.buildBtns[i].node.getComponentInChildren(cc.Label);
                if(lbl){
                    lbl.string = LanguageManager.getBuildName(i);
                }
            }
        });
        for(let i = 0; i < this.buildBtns.length; i++){
            this.buildBtns[i].getComponent(cc.Button).node.getChildByName("Background").getChildByName("buildingCost").getComponent(cc.Label).string = "" + BuildScript.moneyCost[i];
            {
                const lbl = this.buildBtns[i].node.getComponentInChildren(cc.Label);
                if(lbl){
                    lbl.string = LanguageManager.getBuildName(i);
                }
            }
            this.buildBtns[i].node.on("click",()=>{
                const index = i;
                for(let j = 0; j < this.buildBtns.length; j++){
                    this.buildBtns[j].normalSprite = this.normalSF;
                    this.buildBtns[j].pressedSprite = this.pressedSF;
                    this.buildBtns[j].hoverSprite = this.normalSF;
                }
                this.buildBtns[index].normalSprite = this.pressedSF;
                this.buildBtns[index].pressedSprite = this.pressedSF;
                this.buildBtns[index].hoverSprite = this.pressedSF;
                BuildScript.selectedIndex = index;
                this.infoLbl.string = LanguageManager.getBuildIntro(index);
            },this);
        }
        if(this.infoLbl){
            this.infoLbl.string = LanguageManager.getBuildIntro(BuildScript.selectedIndex);
        }
        BuildScript.BuildBtns = this.buildBtns;
    }
    static dealBuilding(tile:TileScript){
        if(this.selectedIndex == 0){
            // 岩石是独立的一类障碍物：地块本身仍是沙地，必须先判定再判断"有没有建筑"。
            // 可清除的条件是"已研究岩土工程"（cultureStatus[11] == 1），
            // -1 未解锁 / 0 可研究 都必须提示去研究。
            if(tile.deviceType == DeviceType.Rock){
                if(ResearchScript.cultureStatus[11] != 1){
                    DialogScript.ShowDialog(LanguageManager.t("dlg_geotech_needed"));
                }else{
                    tile.deviceType = -1;
                    tile.deviceSF = null;
                    tile.deviceNode.getComponent(cc.Sprite).spriteFrame = null;
                    DataUtil.money -= this.moneyCost[0];
                }
            }else if(tile.tileType > TileType.Stone){
                // 坡地属于地形而非建筑，需要岩土工程平整（当前地图 prop_H = 0，不会生成坡地）
                DialogScript.ShowDialog(LanguageManager.t("dlg_geotech_needed"));
            }else if(tile.deviceType <= 0){
                DialogScript.ShowDialog(LanguageManager.t("dlg_no_building"));
            }else if(tile.deviceType == DeviceType.VillageCommittee){
                DialogScript.ShowDialog(LanguageManager.t("dlg_government_unclearable"));
            }else if(tile.tileType == TileType.Stone){
                if(DataUtil.deviceAttr[tile.deviceType].populationEffect > 0){
                    DataUtil.laborNum -= DataUtil.deviceAttr[tile.deviceType].populationEffect;
                }
                tile.deviceType = -1;
                tile.deviceSF = null;
                tile.deviceNode.getComponent(cc.Sprite).spriteFrame = null;
                DataUtil.money -= this.moneyCost[0];
            }else{
                DialogScript.ShowDialog(LanguageManager.t("dlg_clear_building_not_for_plants"));
            }
        } else if (this.selectedIndex == 1){
            if(tile.deviceType == DeviceType.Rock || tile.tileType > 4){
                DialogScript.ShowDialog(LanguageManager.t("dlg_clear_rock_before_construction"));
            }else if(tile.deviceType > 0){
                DialogScript.ShowDialog(LanguageManager.t("dlg_clear_plants_before_construction"));
            }else if(tile.tileType == TileType.Stone){
                DialogScript.ShowDialog(LanguageManager.t("dlg_already_construction"));
            }else if(tile.tileType == TileType.Water){
                DialogScript.ShowDialog(LanguageManager.t("dlg_water_to_grass_or_dirt_before_construction"));
            }else if(tile.tileType == TileType.Sand){
                DialogScript.ShowDialog(LanguageManager.t("dlg_sand_cannot_construct"));
            }else if(tile.tileType == TileType.Dirt || tile.tileType == TileType.Grass){
                tile.tileType = TileType.Stone;
                tile.tileNode.getComponent(cc.Sprite).spriteFrame = tile.tileSF = cc.instantiate(MapScript.tileSprites[tile.tileType]).getComponent(cc.Sprite).spriteFrame;
                DataUtil.money -= this.moneyCost[1];
            }
        } else if (this.selectedIndex == 2){
            if(tile.deviceType == DeviceType.Rock || tile.tileType > 4){
                DialogScript.ShowDialog(LanguageManager.t("dlg_clear_rock_before_water"));
            }else if(tile.tileType == TileType.Water){
                DialogScript.ShowDialog(LanguageManager.t("dlg_already_water"));
            }else if(tile.deviceType > 0){
                DialogScript.ShowDialog(LanguageManager.t("dlg_clear_plants_or_building_before_water"));
            }else if(tile.tileType == TileType.Stone){
                DialogScript.ShowDialog(LanguageManager.t("dlg_restore_green_before_build_water"));
            }else if(tile.tileType == TileType.Sand || tile.tileType == TileType.Dirt){
                DialogScript.ShowDialog(LanguageManager.t("dlg_only_restore_on_construction_or_water"));
            }else if(tile.tileType == TileType.Grass){
                tile.tileType = TileType.Water;
                tile.tileNode.getComponent(cc.Sprite).spriteFrame = tile.tileSF = cc.instantiate(MapScript.tileSprites[tile.tileType]).getComponent(cc.Sprite).spriteFrame;
                DataUtil.money -= this.moneyCost[2];
            }
        } else if (this.selectedIndex == 3){
            if(tile.tileType != TileType.Water && tile.tileType != TileType.Stone){
                DialogScript.ShowDialog(LanguageManager.t("dlg_only_restore_on_construction_or_water"));
            } else if(tile.deviceType > 0){
                DialogScript.ShowDialog(LanguageManager.t("dlg_clear_building_before_restore"));
            }else{
                if(tile.SWC >= 15){
                    tile.tileType = TileType.Grass;
                }else{
                    tile.tileType = TileType.Dirt;
                }
                tile.tileNode.getComponent(cc.Sprite).spriteFrame = tile.tileSF = cc.instantiate(MapScript.tileSprites[tile.tileType]).getComponent(cc.Sprite).spriteFrame;
                DataUtil.money -= this.moneyCost[3];
            }
        } else {
            if(tile.tileType != TileType.Stone){
                DialogScript.ShowDialog(LanguageManager.t("dlg_build_on_construction_required"));
            } else if (tile.deviceType > 0){
                DialogScript.ShowDialog(LanguageManager.t("dlg_construction_has_building"));
            } else {
                tile.deviceType = this.selectedIndex + this.firstBuildingIndex - 4;
                tile.workerLimits = DataUtil.deviceAttr[tile.deviceType].workerLimits;
                tile.workerNum = 0; 
                tile.deviceNode.getComponent(cc.Sprite).spriteFrame = tile.deviceSF = MapScript.deviceSFs[tile.deviceType];
                DataUtil.money -= this.moneyCost[this.selectedIndex];
                DataUtil.laborNum += DataUtil.deviceAttr[tile.deviceType].populationEffect;
            }
        }

        // DataUtil.countParams();
        MenuScropt.updateMenu();
    }

    static moneyCost = [
        2,
        5,
        5,
        2,
        10,
        90,
        300,
        500,
        1000,
        1500,
        120,
        150,
        250,
        400,
        800,
        1200,
        50,
        200,
        450,
        2000,
        4000,
        20,
        40,
        180,
        600,
        1400,
        3000,
        6000
    ];
}
