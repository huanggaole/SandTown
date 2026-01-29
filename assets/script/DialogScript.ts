// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LanguageManager from "./LanguageManager";
const {ccclass, property} = cc._decorator;

    @ccclass
export default class DialogScript extends cc.Component {
    @property(cc.Node)
    pNode: cc.Node = null;

    @property(cc.Label)
    infoLabel: cc.Label = null;

    @property(cc.Button)
    OKBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    static PNode: cc.Node;
    static InfoLbl: cc.Label;
    static infoList = [];
    start () {
        DialogScript.PNode = this.pNode;
        DialogScript.InfoLbl = this.infoLabel;
        this.OKBtn.node.on("click",()=>{
            if(DialogScript.InfoLbl.string.includes("你的本轮游戏失败了") || DialogScript.InfoLbl.string.includes("Game Over")){
                location.reload();
            }
            DialogScript.infoList.shift();
            if(DialogScript.infoList.length == 0){
                this.pNode.active = false;
            }else{
                DialogScript.InfoLbl.string = DialogScript.infoList[0];
            }
        },this);
        this.pNode.active = false;
    }

    static ShowDialog(info:string){
        const key = LanguageManager.findKeyByValue(info);
        const msg = key ? LanguageManager.t(key) : info;
        this.infoList.push(msg);
        this.InfoLbl.string = this.infoList[0];
        this.PNode.active = true;
    }

    // update (dt) {}
}
