// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DataUtil from "./DataUtil";
import DetailPanelScript from "./DetailPanelScript";
import MapScript, { MapStatus } from "./MapScript";

const {ccclass, property} = cc._decorator;

enum operType{
    Move,
    Plant,
    Build,
    Research,
    Check
}

@ccclass
export default class MenuScript extends cc.Component {

    @property(cc.Label)
    roundLbl: cc.Label = null;

    @property(cc.Label)
    populationLbl: cc.Label = null;

    @property(cc.Label)
    happinessLbl: cc.Label = null;

    @property(cc.Label)
    cultureLbl: cc.Label = null;

    @property(cc.Label)
    delCultureLbl: cc.Label = null;

    @property(cc.Label)
    moneyLbl: cc.Label = null;

    @property(cc.Label)
    delMoneyLbl: cc.Label = null;

    @property(cc.Label)
    foodLbl: cc.Label = null;

    @property(cc.Button)
    moveButton: cc.Button = null;

    @property(cc.Button)
    plantButton: cc.Button = null;

    @property(cc.Button)
    buildButton: cc.Button = null;

    @property(cc.Button)
    researchButton: cc.Button = null;

    @property(cc.Button)
    checkButton: cc.Button = null;

    @property(cc.Button)
    nextButton: cc.Button = null;

    @property(cc.SpriteFrame)
    normalSF:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    pressedSF:cc.SpriteFrame = null;

    @property(cc.Node)
    plantPanel:cc.Node = null;

    @property(cc.Node)
    buildPanel:cc.Node = null;

    @property(cc.Node)
    checkPanel:cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    static popLbl;
    static hapLbl;
    static culLbl;
    static delCulLbl;
    static monLbl;
    static delMonLbl;
    static fooLbl;
    // onLoad () {}
    operState:operType = operType.Move;
    start () {
        this.refreshMenu();
        MenuScript.popLbl = this.populationLbl;
        MenuScript.hapLbl = this.happinessLbl;
        MenuScript.culLbl = this.cultureLbl;
        MenuScript.delCulLbl = this.delCultureLbl;
        MenuScript.monLbl = this.moneyLbl;
        MenuScript.delMonLbl = this.delMoneyLbl;
        MenuScript.fooLbl = this.foodLbl;
        this.moveButton.node.on("click",()=>{
            this.operState = operType.Move;
            this.updateButtons();
        },this);

        this.plantButton.node.on("click",()=>{
            if(this.operState == operType.Plant){
                this.operState = operType.Move;
            }else{
                this.operState = operType.Plant;
            }
            this.updateButtons();
        },this);

        this.buildButton.node.on("click",()=>{
            if(this.operState == operType.Build){
                this.operState = operType.Move;
            }else{
                this.operState = operType.Build;
            }
            this.updateButtons();
        },this);

        this.researchButton.node.on("click",()=>{
            if(this.operState == operType.Research){
                this.operState = operType.Move;
            }else{
                this.operState = operType.Research;
            }
            this.updateButtons();
        },this);

        this.checkButton.node.on("click",()=>{
            if(this.operState == operType.Check){
                this.operState = operType.Move;
            }else{
                this.operState = operType.Check;
            }
            this.updateButtons();
        },this);

        this.nextButton.node.on("click",()=>{
            DataUtil.nextLevel();
            this.refreshMenu();
        },this);
    }

    updateButtons(){
        this.moveButton.normalSprite = this.normalSF;
        this.plantButton.normalSprite = this.normalSF;
        this.buildButton.normalSprite = this.normalSF;
        this.researchButton.normalSprite = this.normalSF;
        this.checkButton.normalSprite = this.normalSF;
        this.moveButton.hoverSprite = this.normalSF;
        this.plantButton.hoverSprite = this.normalSF;
        this.buildButton.hoverSprite = this.normalSF;
        this.researchButton.hoverSprite = this.normalSF;
        this.checkButton.hoverSprite = this.normalSF;
        this.moveButton.pressedSprite = this.pressedSF;
        this.plantButton.pressedSprite = this.pressedSF;
        this.buildButton.pressedSprite = this.pressedSF;
        this.researchButton.pressedSprite = this.pressedSF;
        this.checkButton.pressedSprite = this.pressedSF;
        this.plantPanel.active = false;
        this.buildPanel.active = false;
        this.checkPanel.active = false;
        
        MapScript.clearPlantStatus();
        MapScript.clearCheckStatus();
        if(this.operState == operType.Move){
            MapScript.mapStatus = MapStatus.Move;
            this.moveButton.normalSprite = this.pressedSF;
            this.moveButton.pressedSprite = this.normalSF;
            this.moveButton.hoverSprite = this.pressedSF;
        }else{
            DetailPanelScript.getInstance().hideDetail();
        }
        if(this.operState == operType.Plant){
            this.plantPanel.active = true;
            MapScript.mapStatus = MapStatus.Plant;
            MapScript.updatePlantStatus();
            this.plantButton.normalSprite = this.pressedSF;
            this.plantButton.pressedSprite = this.normalSF;
            this.plantButton.hoverSprite = this.pressedSF;
        }
        if(this.operState == operType.Build){
            this.buildPanel.active = true;
            MapScript.mapStatus = MapStatus.Build;
            MapScript.updateBuildStatus();
            this.buildButton.normalSprite = this.pressedSF;
            this.buildButton.pressedSprite = this.normalSF;
            this.buildButton.hoverSprite = this.pressedSF;
        }
        if(this.operState == operType.Research){
            this.researchButton.normalSprite = this.pressedSF;
            this.researchButton.pressedSprite = this.normalSF;
            this.researchButton.hoverSprite = this.pressedSF;
        }
        if(this.operState == operType.Check){
            this.checkPanel.active = true;
            MapScript.mapStatus = MapStatus.check;
            MapScript.updateCheckStatus();
            this.checkButton.normalSprite = this.pressedSF;
            this.checkButton.pressedSprite = this.normalSF;
            this.checkButton.hoverSprite = this.pressedSF;
        }
    }

    // 更新 menu lbl
    refreshMenu(){
        DataUtil.countParams();
        this.roundLbl.string = "第 " + DataUtil.levelNum + " 回合";
        this.populationLbl.string = (DataUtil.laborNum - DataUtil.totalWorkerNum) + "/" + DataUtil.population;
        this.happinessLbl.string = "" + DataUtil.happiness;
        this.cultureLbl.string = "" + DataUtil.culture;
        if(DataUtil.delCulture > 0){
            this.delCultureLbl.string = "+" + DataUtil.delCulture;
        }else{
            this.delCultureLbl.string = "" + DataUtil.delCulture;
        }
        this.moneyLbl.string = "" + DataUtil.money;
        if(DataUtil.delMoney > 0){
            this.delMoneyLbl.string = "+" + DataUtil.delMoney;
        }else{
            this.delMoneyLbl.string = "" + DataUtil.delMoney;
        }
        this.foodLbl.string = "" + DataUtil.food;
        this.updateButtons();
    }

    static updateMenu(){
        DataUtil.countParams();
        MenuScript.popLbl.string = DataUtil.labourPoints + "/" + DataUtil.population;
        MenuScript.hapLbl.string = "" + DataUtil.happiness;
        MenuScript.culLbl.string = "" + DataUtil.culture;
        if(DataUtil.delCulture > 0){
            MenuScript.delCulLbl.string = "+" + DataUtil.delCulture;
        }else{
            MenuScript.delCulLbl.string = "" + DataUtil.delCulture;
        }
        MenuScript.monLbl.string = "" + DataUtil.money;
        if(DataUtil.delMoney > 0){
            MenuScript.delMonLbl.string = "+" + DataUtil.delMoney;
        }else{
            MenuScript.delMonLbl.string = "" + DataUtil.delMoney;
        }
        MenuScript.fooLbl.string = "" + DataUtil.food;
    }

    // update (dt) {}
}
