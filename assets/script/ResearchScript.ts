import DataUtil, { DeviceType, TileType } from "./DataUtil";
import DialogScript from "./DialogScript";
import TileScript from "./TileScript";
import MenuScropt from "./MenuScript";
import MapScript from "./MapScript";
import PlantScript from "./PlantScript";
import LanguageManager from "./LanguageManager";

const {ccclass, property} = cc._decorator;

/**
 * cultureStatus 的初始值模板。
 * 该数组会被研究进度就地改写（见 refreshBtns / researchBtn 回调），
 * 因此保留一份模板，供"重开一局 / 进入战役关卡"时还原。
 * 取值：-1 未解锁，0 可研究，1 已研究。
 */
const CULTURE_STATUS_INIT = [
    0, -1, -1, -1, -1,
    -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1
];

@ccclass
export default class ResearchScript extends cc.Component {
    @property(cc.Prefab)
    culturePrefab: cc.Prefab = null;

    @property(cc.Node)
    researchView: cc.Node = null;

    @property(cc.SpriteFrame)
    normalSF:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    pressedSF:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    disableSF:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    costShortSF:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    finishedSF:cc.SpriteFrame = null;

    @property(cc.Label)
    infoLbl:cc.Label = null;

    @property(cc.Button)
    researchBtn:cc.Button = null;

    static btns = [];
    static normalSF;
    static pressedSF;
    static disableSF;
    static costShortSF;
    static finishedSF;
    static infoLbl;
    static selectedIndex = -1;

    private unsubscribeLanguage: () => void = null;

    onDestroy(): void {
        if (this.unsubscribeLanguage) {
            this.unsubscribeLanguage();
            this.unsubscribeLanguage = null;
        }
    }

    /** 还原被研究进度改写的静态状态。start() 开头会调用，场景切换时由 MapScript.onLoad 兜底。 */
    static resetStatics(): void {
        ResearchScript.cultureStatus = CULTURE_STATUS_INIT.slice();
        ResearchScript.btns = [];
        ResearchScript.selectedIndex = -1;
    }

    start(): void {
        ResearchScript.resetStatics();
        ResearchScript.normalSF = this.normalSF;
        ResearchScript.pressedSF = this.pressedSF;
        ResearchScript.disableSF = this.disableSF;
        ResearchScript.costShortSF = this.costShortSF;
        ResearchScript.finishedSF = this.finishedSF;
        ResearchScript.infoLbl = this.infoLbl;
        this.unsubscribeLanguage = LanguageManager.onChange(()=>{
            ResearchScript.refreshBtns();
            if(ResearchScript.selectedIndex >= 0){
                ResearchScript.showCultureInfo(ResearchScript.selectedIndex);
            } else {
                ResearchScript.showCultureInfo(0);
            }
        });
        for(let i = 0; i < 25; i++){
            const btn = cc.instantiate(this.culturePrefab);
            btn.getComponent(cc.Button).node.on("click",()=>{
                ResearchScript.showCultureInfo(i);
                if(ResearchScript.cultureStatus[i] == 0 && DataUtil.culture >= ResearchScript.cultureCost[i]){
                    ResearchScript.selectedIndex = i;
                    this.researchBtn.normalSprite = this.normalSF;
                    this.researchBtn.pressedSprite = this.pressedSF;
                    this.researchBtn.hoverSprite = this.normalSF;
                }else if(DataUtil.culture < ResearchScript.cultureCost[i]){
                    ResearchScript.selectedIndex = -1;
                    this.researchBtn.normalSprite = this.disableSF;
                    this.researchBtn.pressedSprite = this.disableSF;
                    this.researchBtn.hoverSprite = this.disableSF;
                }
                ResearchScript.refreshBtns();
            }, this);
            ResearchScript.btns.push(btn);
            this.researchView.addChild(btn);
        }

        this.researchBtn.node.on("click",()=>{
            if(ResearchScript.selectedIndex >= 0 && ResearchScript.cultureStatus[ResearchScript.selectedIndex] == 0 && DataUtil.culture >= ResearchScript.cultureCost[ResearchScript.selectedIndex]){
                ResearchScript.dealCulture(ResearchScript.selectedIndex);
                DataUtil.culture -= ResearchScript.cultureCost[ResearchScript.selectedIndex];
                ResearchScript.cultureStatus[ResearchScript.selectedIndex] = 1;
                ResearchScript.showCultureInfo(ResearchScript.selectedIndex);
                ResearchScript.selectedIndex = -1;
                this.researchBtn.normalSprite = this.disableSF;
                this.researchBtn.pressedSprite = this.disableSF;
                this.researchBtn.hoverSprite = this.disableSF;
                ResearchScript.refreshBtns();
                MenuScropt.updateMenu();
            }
        },this);

        ResearchScript.refreshBtns();
        ResearchScript.showCultureInfo(0);
    }

    static refreshBtns(){
        if(ResearchScript.btns.length < 25){
            return;
        }
        for(let i = 0; i < 25; i++){
            const btn = ResearchScript.btns[i];
            
            if(ResearchScript.culturePre[i] >= 0){
                if(ResearchScript.cultureStatus[ResearchScript.culturePre[i]] == 1 && ResearchScript.cultureStatus[i] < 0){
                    ResearchScript.cultureStatus[i] = 0;
                }
            }
            if(ResearchScript.cultureStatus[i] == -1){
                btn.getComponent(cc.Button).normalSprite = this.disableSF;
                btn.getComponent(cc.Button).pressedSprite = this.disableSF;
                btn.getComponent(cc.Button).hoverSprite = this.disableSF;
                btn.getComponent(cc.Button).disabledSprite = this.disableSF;
                btn.getChildByName("Background").getChildByName("cultureName").getComponent(cc.Label).node.color = new cc.Color(55,55,55);
                btn.getChildByName("Background").getChildByName("cultureCost").getComponent(cc.Label).node.color = new cc.Color(55,55,55);
            }else if(ResearchScript.cultureStatus[i] == 1){
                btn.getComponent(cc.Button).normalSprite = this.finishedSF;
                btn.getComponent(cc.Button).pressedSprite = this.finishedSF;
                btn.getComponent(cc.Button).hoverSprite = this.finishedSF;
                btn.getComponent(cc.Button).disabledSprite = this.finishedSF;
                btn.getChildByName("Background").getChildByName("cultureName").getComponent(cc.Label).node.color = new cc.Color(0,0,255);
                btn.getChildByName("Background").getChildByName("cultureCost").getComponent(cc.Label).node.color = new cc.Color(0,0,255);
            }else if(ResearchScript.cultureStatus[i] == 0){
                if(DataUtil.culture < ResearchScript.cultureCost[i]){
                    btn.getComponent(cc.Button).normalSprite = this.costShortSF;
                    btn.getComponent(cc.Button).pressedSprite = this.costShortSF;
                    btn.getComponent(cc.Button).hoverSprite = this.costShortSF;
                    btn.getComponent(cc.Button).disabledSprite = this.costShortSF;
                    btn.getChildByName("Background").getChildByName("cultureName").getComponent(cc.Label).node.color = new cc.Color(255,0,0);
                    btn.getChildByName("Background").getChildByName("cultureCost").getComponent(cc.Label).node.color = new cc.Color(255,0,0);
                }else{
                    if(i == ResearchScript.selectedIndex){
                        btn.getComponent(cc.Button).normalSprite = this.pressedSF;
                        btn.getComponent(cc.Button).pressedSprite = this.pressedSF;
                        btn.getComponent(cc.Button).hoverSprite = this.pressedSF;
                    }else{
                        btn.getComponent(cc.Button).normalSprite = this.normalSF;
                        btn.getComponent(cc.Button).pressedSprite = this.pressedSF;
                        btn.getComponent(cc.Button).hoverSprite = this.normalSF;
                    }
                    btn.getChildByName("Background").getChildByName("cultureName").getComponent(cc.Label).node.color = new cc.Color(0,0,0);
                    btn.getChildByName("Background").getChildByName("cultureCost").getComponent(cc.Label).node.color = new cc.Color(0,0,0);
                }
            }
            btn.getChildByName("Background").getChildByName("cultureName").getComponent(cc.Label).string = LanguageManager.getCultureName(i);
            btn.getChildByName("Background").getChildByName("cultureCost").getComponent(cc.Label).string = "" + ResearchScript.cultureCost[i];
        }
    }

    static showCultureInfo(cIndex:number){
        const nm = LanguageManager.getCultureName(cIndex).replace("\n","");
        this.infoLbl.string = nm + ":\n";
        if(this.culturePre[cIndex] >= 0){
            const preNm = LanguageManager.getCultureName(this.culturePre[cIndex]).replace("\n","");
            this.infoLbl.string += LanguageManager.t("research_unlock_pre", { name: preNm }) + "\n";
        }
        this.infoLbl.string += "\n" + LanguageManager.getCultureIntro(cIndex) + "\n";
        this.infoLbl.string += "\n" + LanguageManager.t("research_need_cost", { cost: this.cultureCost[cIndex] }) + "\n";
        if(this.cultureStatus[cIndex] == 1){
            this.infoLbl.string += "\n" + LanguageManager.t("research_already") + "\n";
        }
    }

    static dealCulture(cIndex:number){
        if(cIndex == 0){
            DataUtil.deviceAttr[11].workerLimits = 4;
            DataUtil.deviceAttr[11].happinessEffectRange = 3;
        }
        if(cIndex == 5){
            DataUtil.deviceAttr[11].workerLimits = 6;
            DataUtil.deviceAttr[11].happinessEffectRange = 4;
        }
        if(cIndex == 6){
            PlantScript.PlantBtns[7].node.active = true;
        }
        if(cIndex == 10){
            DataUtil.deviceAttr[11].name = "镇政府";
            DataUtil.deviceAttr[11].workerLimits = 8;
            DataUtil.deviceAttr[11].happinessEffectRange = 5;
        }
        if(cIndex == 15){
            DataUtil.deviceAttr[11].workerLimits = 9;
            DataUtil.deviceAttr[11].happinessEffectRange = 6;
        }
        if(cIndex == 16){
            DataUtil.deviceAttr[DeviceType.Industry1].happinessEffect = -1;
            DataUtil.deviceAttr[DeviceType.Industry2].happinessEffect = -1;
            DataUtil.deviceAttr[DeviceType.Industry3].happinessEffect = -1;
            DataUtil.deviceAttr[DeviceType.Industry3].moneyEffect = 30;
            DataUtil.deviceAttr[DeviceType.Industry4].happinessEffect = -2;
            DataUtil.deviceAttr[DeviceType.Industry5].happinessEffect = -3;
        }
        if(cIndex == 20){
            DataUtil.deviceAttr[11].happinessEffectRange = 9;
        }
        if(cIndex == 21){
            DataUtil.deviceAttr[DeviceType.SuoSuoShu].plantFunc.liveRate = 100;
            DataUtil.deviceAttr[DeviceType.Shaji].plantFunc.liveRate = 100;
            DataUtil.deviceAttr[DeviceType.HuaBang].plantFunc.liveRate = 100;
            DataUtil.deviceAttr[DeviceType.YunShan].plantFunc.liveRate = 100;
            DataUtil.deviceAttr[DeviceType.CeBo].plantFunc.liveRate = 100;
            DataUtil.deviceAttr[DeviceType.Shaji].foodEffect = 2;
            DataUtil.deviceAttr[DeviceType.Farm].foodEffect = 4;
            DataUtil.deviceAttr[DeviceType.FarmHigh].foodEffect = 20;
        }
        DataUtil.countParams();
    }

    static cultureStatus = CULTURE_STATUS_INIT.slice();

    static culturePre = [
        -1,
        0,
        0,
        0,
        0,
        0,
        5,
        5,
        5,
        5,
        5,
        10,
        10,
        10,
        10,
        10,
        15,
        15,
        15,
        15,
        15,
        20,
        20,
        20,
        20
    ];

    static cultureCost = [
        10,
        200,
        100,
        20,
        50,
        250,
        600,
        500,
        300,
        400,
        500,
        1000,
        800,
        600,
        900,
        2000,
        3000,
        1500,
        2500,
        2000,
        5000,
        8000,
        9000,
        6000,
        7000,
    ];
}
