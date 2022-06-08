const {ccclass, property} = cc._decorator;

@ccclass
export default class PlantScript extends cc.Component {
    @property([cc.Button])
    plantBtns: Array<cc.Button> = [];

    @property(cc.SpriteFrame)
    normalSF:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    pressedSF:cc.SpriteFrame = null;

    static selectedIndex = 0;
    start(): void {
        for(let i = 0; i < this.plantBtns.length; i++){
            this.plantBtns[i].node.on("click",()=>{
                const index = i;
                for(let j = 0; j < this.plantBtns.length; j++){
                    this.plantBtns[j].normalSprite = this.normalSF;
                    this.plantBtns[j].pressedSprite = this.pressedSF;
                    this.plantBtns[j].hoverSprite = this.normalSF;
                }
                this.plantBtns[index].normalSprite = this.pressedSF;
                this.plantBtns[index].pressedSprite = this.normalSF;
                this.plantBtns[index].hoverSprite = this.pressedSF;
                PlantScript.selectedIndex = index;
            },this);
        }
    }

}