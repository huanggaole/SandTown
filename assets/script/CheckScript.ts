// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MapScript from "./MapScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CheckClass extends cc.Component {

    @property(cc.Button)
    populationBtn: cc.Button = null;

    @property(cc.Button)
    workerBtn: cc.Button = null;

    @property(cc.Button)
    cultureBtn: cc.Button = null;

    @property(cc.Button)
    moneyBtn: cc.Button = null;

    @property(cc.Button)
    foodBtn: cc.Button = null;

    @property(cc.Button)
    SWCBtn: cc.Button = null;

    @property(cc.SpriteFrame)
    normalSF: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    pressedSF: cc.SpriteFrame = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    static checkIndex = 0;

    start () {
        const buttons = [this.populationBtn, this.workerBtn, this.cultureBtn, this.moneyBtn, this.foodBtn, this.SWCBtn];
        for(let i = 0; i< buttons.length; i++){
            const index = i;
            buttons[i].node.on("click", ()=>{
                for(let j = 0; j < buttons.length; j++){
                    buttons[j].normalSprite = this.normalSF;
                    buttons[j].pressedSprite = this.pressedSF;
                    buttons[j].hoverSprite = this.normalSF;
                }
                buttons[index].normalSprite = this.pressedSF;
                buttons[index].pressedSprite = this.normalSF;
                buttons[index].hoverSprite = this.pressedSF;
                CheckClass.checkIndex = index;
                MapScript.updateCheckStatus();
            }, this);
        }

    }

    // update (dt) {}
}
