import DataUtil, { DeviceType, TileType } from "./DataUtil";
import DialogScript from "./DialogScript";
import TileScript from "./TileScript";
import MenuScropt from "./MenuScript";
import MapScript from "./MapScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BuildScript extends cc.Component {
    @property([cc.Button])
    buildBtns: Array<cc.Button> = [];

    @property(cc.SpriteFrame)
    normalSF:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    pressedSF:cc.SpriteFrame = null;

    @property(cc.Label)
    infoLbl:cc.Label = null;

    static selectedIndex = 0;

    start(): void {
        for(let i = 0; i < this.buildBtns.length; i++){
            this.buildBtns[i].node.on("click",()=>{
                const index = i;
                for(let j = 0; j < this.buildBtns.length; j++){
                    this.buildBtns[j].normalSprite = this.normalSF;
                    this.buildBtns[j].pressedSprite = this.pressedSF;
                    this.buildBtns[j].hoverSprite = this.normalSF;
                }
                this.buildBtns[index].normalSprite = this.pressedSF;
                this.buildBtns[index].pressedSprite = this.normalSF;
                this.buildBtns[index].hoverSprite = this.pressedSF;
                BuildScript.selectedIndex = index;
                this.infoLbl.string = BuildScript.introTxt[index];
            },this);
        }
    }

    static dealBuilding(tile:TileScript){
        if(this.selectedIndex == 0){
            if(tile.deviceType == DeviceType.Rock || tile.tileType > 4){
                DialogScript.ShowDialog("在研究“岩土工程”之后，方可用此功能铲平岩石或土坡。");
            }else if(tile.deviceType <= 0){
                DialogScript.ShowDialog("此处没有建筑，请选择一处有建筑物的图块才能进行清除建筑操作。");
            }else if(tile.deviceType == DeviceType.VillageCommittee){
                DialogScript.ShowDialog("此建筑为小镇的政府建筑，不能被清除。");
            }else if(tile.tileType == TileType.Stone){
                if(DataUtil.deviceAttr[tile.deviceType].populationEffect > 0){
                    DataUtil.laborNum -= DataUtil.deviceAttr[tile.deviceType].populationEffect;
                }
                tile.deviceType = -1;
                tile.deviceSF = null;
                tile.deviceNode.getComponent(cc.Sprite).spriteFrame = null;
                DataUtil.money -= this.moneyCost[0];
            }else{
                DialogScript.ShowDialog("“清除建筑”按钮不能用于清除植物，清除植物请使用“种植”功能下的“清除植物”按钮。");
            }
        } else if (this.selectedIndex == 1){
            if(tile.deviceType == DeviceType.Rock || tile.tileType > 4){
                DialogScript.ShowDialog("在将土地改建为建设用地前，请先清除此地块上的岩石或土坡清除。需要研究“岩土工程”。");
            }else if(tile.deviceType > 0){
                DialogScript.ShowDialog("在将土地改建为建设用地前，请先清除此地块上的植物。");
            }else if(tile.tileType == TileType.Water){
                DialogScript.ShowDialog("在将土地改建为建设用地前，请先将水体改建成草地或泥地。");
            }else if(tile.tileType == TileType.Stone){
                DialogScript.ShowDialog("当前土地块已经是建设用地了。");
            }else if(tile.tileType == TileType.Sand){
                DialogScript.ShowDialog("沙土松散，无法进行建设。请先提高土壤含水量。");
            }else if(tile.tileType == TileType.Dirt || tile.tileType == TileType.Grass){
                tile.tileType = TileType.Stone;
                tile.tileNode.getComponent(cc.Sprite).spriteFrame = tile.tileSF = cc.instantiate(MapScript.tileSprites[tile.tileType]).getComponent(cc.Sprite).spriteFrame;
                DataUtil.money -= this.moneyCost[1];
            }
        } else if (this.selectedIndex == 2){
            if(tile.deviceType == DeviceType.Rock || tile.tileType > 4){
                DialogScript.ShowDialog("在将土地改建为水体前，请先清除此地块上的岩石或土坡清除。需要研究“岩土工程”。");
            }else if(tile.deviceType > 0){
                DialogScript.ShowDialog("在将土地改建为水体前，请先清除此地块上的植物或建筑。");
            }else if(tile.tileType == TileType.Water){
                DialogScript.ShowDialog("当前土地块已经是水体了。");
            }else if(tile.tileType == TileType.Stone){
                DialogScript.ShowDialog("在将建设用地改建为水体前，请先“退建还草”，将建设用地改建为草地或泥地。");
            }else if(tile.tileType == TileType.Sand || tile.tileType == TileType.Dirt){
                DialogScript.ShowDialog("只有土壤含水量较高的绿地才能挖掘出水体。");
            }else if(tile.tileType == TileType.Grass){
                tile.tileType = TileType.Water;
                tile.tileNode.getComponent(cc.Sprite).spriteFrame = tile.tileSF = cc.instantiate(MapScript.tileSprites[tile.tileType]).getComponent(cc.Sprite).spriteFrame;
                DataUtil.money -= this.moneyCost[2];
            }
        } else if (this.selectedIndex == 3){
            if(tile.tileType != TileType.Water && tile.tileType != TileType.Stone){
                DialogScript.ShowDialog("只能对建设用地或水体进行复土还绿操作。");
            } else if(tile.deviceType > 0){
                DialogScript.ShowDialog("在将建设用地复土还绿前，请先清除此地块上的建筑。");
            }else{
                if(tile.SWC >= 15){
                    tile.tileType = TileType.Grass;
                }else{
                    tile.tileType = TileType.Dirt;
                }
                tile.tileNode.getComponent(cc.Sprite).spriteFrame = tile.tileSF = cc.instantiate(MapScript.tileSprites[tile.tileType]).getComponent(cc.Sprite).spriteFrame;
                DataUtil.money -= this.moneyCost[3];
            }
        }

        DataUtil.countParams();
        MenuScropt.updateMenu();
    }

    static moneyCost = [
        2,
        5,
        5,
        2,

    ];

    static introTxt=[
        "清除建筑：可以将一个建筑用地上的建筑清除。需要花费" + BuildScript.moneyCost[0] + "点金币。不能清除石头或植物。",
        "建设用地：可以将泥地或草地改建为建设用地。需要花费" + BuildScript.moneyCost[1] + "点金币。所有的建筑必须建在建设用地上。",
        "建设水体：可以草地改建为水体。需要花费" + BuildScript.moneyCost[2] + "点金币。水体有助于灌溉周围的植物，并为野生动物提供饮水。",
        "复土还绿：可以将建设用地或水体根据土壤含水率重新恢复为泥土或绿地，需要花费" + BuildScript.moneyCost[3] + "点金币。",
    ];
}