// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MapScript from "./MapScript";
import LanguageManager from "./LanguageManager";

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

    private unsubscribeLanguage: () => void = null;

    onDestroy() {
        if (this.unsubscribeLanguage) {
            this.unsubscribeLanguage();
            this.unsubscribeLanguage = null;
        }
    }

    start () {
        const buttons = [this.populationBtn, this.workerBtn, this.cultureBtn, this.moneyBtn, this.foodBtn, this.SWCBtn];
        const labels: cc.Label[] = [];
        const keys: string[] = [];
        for (let i = 0; i < buttons.length; i++) {
            const lbl = buttons[i].node.getComponentInChildren(cc.Label);
            labels.push(lbl);
            if (lbl) {
                const init = (lbl.string || "").trim();
                const k = LanguageManager.findKeyByValue(init) || init;
                keys.push(k);
                lbl.string = LanguageManager.t(k);
            } else {
                keys.push("");
            }
        }
        this.unsubscribeLanguage = LanguageManager.onChange(() => {
            for (let i = 0; i < labels.length; i++) {
                if (labels[i] && keys[i]) {
                    labels[i].string = LanguageManager.t(keys[i]);
                }
            }
        });
        for(let i = 0; i< buttons.length; i++){
            const index = i;
            buttons[i].node.on("click", ()=>{
                for(let j = 0; j < buttons.length; j++){
                    buttons[j].normalSprite = this.normalSF;
                    buttons[j].pressedSprite = this.pressedSF;
                    buttons[j].hoverSprite = this.normalSF;
                }
                buttons[index].normalSprite = this.pressedSF;
                buttons[index].pressedSprite = this.pressedSF;
                buttons[index].hoverSprite = this.pressedSF;
                CheckClass.checkIndex = index;
                MapScript.updateCheckStatus();
            }, this);
        }

    }

    // update (dt) {}
}
