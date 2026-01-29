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
    start(): void {
        LanguageManager.onChange(()=>{
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
            if((tile.deviceType == DeviceType.Rock || tile.tileType > 4) && ResearchScript.cultureStatus[11] != 0){
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

    static introTxt=[
        "清除建筑：可以将一个建筑用地上的建筑清除。不能清除植物。研究\"岩土工程\"后可以清除岩石。",
        "建设用地：可以将泥地或草地改建为建设用地。所有的建筑必须建在建设用地上。",
        "建设水体：可以草地改建为水体。水体有助于灌溉周围的植物，并为野生动物提供饮水。",
        "复土还绿：可以将建设用地或水体根据土壤含水率重新恢复为泥土或绿地。",
        "棚屋：本地的传统住宅，能容纳5个居民，为住户提供10点幸福度。",
        "平房小院：农村常见的住宅，能容纳7个居民，为住户提供20点幸福度。",
        "洋房别墅：新农村建设时期流行的住宅，能容纳10个居民，为住户提供40点幸福度。",
        "公寓楼：城市化初期很受欢迎的住宅，能容纳12个居民，为住户提供20点幸福度。",
        "高层住宅：深度城市化后流行的住宅，能容纳20个居民，为住户提供30点幸福度。",
        "垂直森林：面向未来的生态主义住宅，能容纳15个居民，为住户提供40点幸福度。",
        "商店街：可以采购商品。每位工作人员可以产生2点金钱，2格内的住宅建筑提供5点幸福度。",
        "公园：市民放松身心的地点。每位工作人员产生2点文化，3格内的住宅建筑提供5点幸福度。",
        "快餐店：为市民提供餐饮与娱乐。每位工作人员产生5点金钱，3格以内的住宅建筑提供5点幸福度。",
        "大礼堂：放映电影、戏剧、音乐会的文化场所。每位工作人员产生5点文化、5点金钱，5格以内的住宅建筑提供5点幸福度。",
        "运动场：全民健身场所，也会举办演唱会等文化活动。每位工作人员产生5点文化、5点金钱，6格以内的住宅建筑提供5点幸福度。",
        "生态度假区：可以在城市中亲近自然。每位工作人员产生5点文化、10点金钱，6格以内的住宅建筑提供5点幸福度。",
        "学校：开展终身学习、技术培训的场所。每位工作人员产生5点文化，花费2点金钱。",
        "活动室：唱歌、跳舞、打乒乓球的文娱场所。每位工作人员产生8点文化，花费4点金钱。",
        "图书馆：读书、看报、办各种展览的场所。每位工作人员产生12点文化，花费6点金钱。",
        "研究所：研究前沿技术的科技场所。每位工作人员产生20点文化，花费8点金钱。",
        "文化产业园：能够同时产生大量文化与金钱。每位工作人员产生20点文化，5点金钱。",
        "木材厂：每位工作人员产生5点金钱，周围每毗邻1棵云杉或侧柏，收入+1点金币。受噪音影响，2格以内的住宅降低5幸福度。",
        "采石场：每位工作人员产生5点金钱，周围每毗邻1格岩石，收入+3点金币。受噪音与粉尘影响，3格以内的住宅降低5幸福度。",
        "风力磨坊：每位工作人员产生10点金钱，受噪声影响，3格以内的住宅降低5幸福度。",
        "手工加工厂：每位工作人员产生20点金钱，受噪声影响，3格以内的住宅降低10幸福度。",
        "重工厂：每位工作人员产生40点金钱，受噪声影响，3格以内的住宅降低15幸福度。",
        "高新产业园：每位工作人员产生40点金钱。",
        "固碳车间：每位工作人员产生60点金钱。"
    ];
}
