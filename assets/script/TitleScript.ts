// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TitleScript extends cc.Component {

    @property(cc.Button)
    startBtn: cc.Button = null;

    @property(cc.Button)
    introBtn: cc.Button = null;

    @property(cc.Node)
    introNode: cc.Node = null;

    @property(cc.Button)
    closeBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.startBtn.node.on("click",()=>{
            cc.director.loadScene("GameScene");
        },this);
        this.introBtn.node.on("click",()=>{
            this.introNode.active = true;
        },this);
        this.closeBtn.node.on("click",()=>{
            this.introNode.active = false;
        },this);
        this.introNode.active = false;
    }

    // update (dt) {}
}
