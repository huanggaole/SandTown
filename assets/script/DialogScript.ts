// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
            if(DialogScript.InfoLbl.string.includes("你的本轮游戏失败了")){
                cc.director.loadScene("MainScene");
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
        this.infoList.push(info);
        this.InfoLbl.string = this.infoList[0];
        this.PNode.active = true;
    }

    // update (dt) {}
}
