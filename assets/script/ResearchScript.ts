import DataUtil, { DeviceType, TileType } from "./DataUtil";
import DialogScript from "./DialogScript";
import TileScript from "./TileScript";
import MenuScropt from "./MenuScript";
import MapScript from "./MapScript";

const {ccclass, property} = cc._decorator;

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
    start(): void {
        ResearchScript.normalSF = this.normalSF;
        ResearchScript.pressedSF = this.pressedSF;
        ResearchScript.disableSF = this.disableSF;
        ResearchScript.costShortSF = this.costShortSF;
        ResearchScript.finishedSF = this.finishedSF;
        ResearchScript.infoLbl = this.infoLbl;
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
            btn.getChildByName("Background").getChildByName("cultureName").getComponent(cc.Label).string = ResearchScript.cultureName[i];
            btn.getChildByName("Background").getChildByName("cultureCost").getComponent(cc.Label).string = "" + ResearchScript.cultureCost[i];
        }
    }

    static showCultureInfo(cIndex:number){
        this.infoLbl.string = this.cultureName[cIndex].replace("\n","") + ":\n";
        if(this.culturePre[cIndex] >= 0){
            this.infoLbl.string += "(完成\"" + this.cultureName[this.culturePre[cIndex]].replace("\n","") + "\"以解锁此研究。)\n";
        }
        this.infoLbl.string += "\n" + this.introTxt[cIndex] + "\n";
        this.infoLbl.string += "\n需要花费" + this.cultureCost[cIndex] + "点文化点数。\n";
        if(this.cultureStatus[cIndex] == 1){
            this.infoLbl.string += "\n(已研究)\n"
        }
    }

    static dealCulture(cIndex:number){
        if(cIndex == 0){
            DataUtil.deviceAttr[11].workerLimits = 4;
            DataUtil.deviceAttr[11].happinessEffectRange = 3;
        }
        DataUtil.countParams();
    }

    static cultureStatus = [
        0,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
    ];

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

    static cultureName = [
        "三农改革",
        "旱地培育",
        "农业代加工",
        "技术教育",
        "美丽乡村",
        "新农村建设",
        "农业机械化",
        "农民职业化",
        "文化建设",
        "便民生活圈",
        "城镇化",
        "岩土工程",
        "工业自动化",
        "普及\n公共服务",
        "精神文明\n建设",
        "城市化",
        "清洁能源",
        "产业升级",
        "科技创新",
        "全民健身",
        "生态文明\n建设",
        "生物科技",
        "碳中和贸易",
        "全民科普",
        "绿色服务业",
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

    static introTxt=[
        "目标是农民增收、农业发展、农村稳定。完成此研究将解锁建筑“平房小院”，并将“村委会”的最大工作人员数提升至4人，幸福度的影响范围提升至3单元格。",
        "旱地培育：研究此技术后，农田可以建设在泥土块上。",
        "农业代加工：研究此技术后，将解锁建筑“风力磨坊”。",
        "技术教育：研究此技术后，将解锁建筑“学校”。",
        "美丽乡村：研究此技术后，将解锁建筑“公园”。",
        "建设改善农民衣食住行，建设基础设施以及农民的生活保障机制。完成此研究将解锁建筑\"洋房别墅\"，并将\"村委会\"的最大工作人员数提升至6人，幸福度的影响范围提升至4单元格。",
        "农业机械化：",
        "农民职业化：研究此技术后，将解锁建筑“手工加工厂”。",
        "文化建设：研究此技术后，将解锁建筑“活动室”。",
        "便民生活圈：研究此技术后，将解锁建筑“快餐店”。",
        "城镇化",
        "岩土工程",
        "工业自动化：研究此技术后，将解锁建筑“重工厂”。",
        "普及公共服务：研究此技术后，将解锁建筑“图书馆”。",
        "精神文明建设：研究此技术后，将解锁建筑“大礼堂”。",
        "城市化",
        "清洁能源",
        "产业升级：研究此技术后，将解锁建筑“高新产业园”。",
        "科技创新：研究此技术后，将解锁建筑“研究所”。",
        "全民健身：研究此技术后，将解锁建筑“体育馆”。",
        "生态文明建设",
        "生物科技",
        "碳中和贸易：研究此技术后，将解锁建筑“固碳车间”。",
        "全民科普：研究此技术后，将解锁建筑“文化产业园”。",
        "绿色服务业：研究此技术后，将解锁建筑“生态度假区”。"
    ]
}