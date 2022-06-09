import DataUtil, { DeviceType, TileType } from "./DataUtil";
import DialogScript from "./DialogScript";
import TileScript from "./TileScript";
import MenuScropt from "./MenuScript";

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

    static dealPlant(tile:TileScript){
        if(this.selectedIndex == 0){
            if(tile.deviceType < 0 || tile.deviceType == DeviceType.Rock){
                DialogScript.ShowDialog("此处没有植物，请选择一处有植物的图块才能进行清除植物操作。");
            }else if(tile.tileType == TileType.Stone){
                DialogScript.ShowDialog("“清除植物”按钮不能用于清除建筑用地，清除建筑用地请使用“建筑”功能下的“清除建筑”按钮。");
            }else{
                tile.deviceType = -1;
                tile.deviceSF = null;
                
                tile.deviceNode.destroy();
                DataUtil.money -= 1;
            }
        }
        DataUtil.countParams();
        MenuScropt.updateMenu();
    }
}