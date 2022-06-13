// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DetailPanelScript from "./DetailPanelScript";
import DialogScript from "./DialogScript";
import MapScript from "./MapScript";
import PlantScript from "./PlantScript";
import TileScript from "./TileScript";

export enum TileType{
    Sand,
    Dirt,
    Grass,
    Water,
    Stone,
    Sand_H,
    Dirt_H,
    Grass_H
}
export enum DeviceType{
    Empty,
    SuoSuoShu,
    Shaji,
    HuaBang,
    YunShan,
    CeBo,
    Farm,
    FarmHigh,
    CaoFangGe,
    Cactus,
    Rock,
    VillageCommittee,
    House1,
    House2,
    House3,
    House4,
    Shop1
}

export class PlantFunc{
    liveRate:number;
    liveRatePerWorker:number;
    SWCEffect:number;
    highestSWC:number;
    intro:string;

    constructor(_liveRate:number, _liveRatePerWorker:number, _swceffect:number, _highestSWC:number, _intro:string){
        this.liveRate = _liveRate;
        this.liveRatePerWorker = _liveRatePerWorker;
        this.SWCEffect = _swceffect;
        this.highestSWC = _highestSWC;
        this.intro = _intro;
    }
}

export class DeviceFunc{
    name:string;
    workerLimits:number;
    workerNum:number;

    populationEffect:number;
    happinessEffect:number;
    happinessEffectRange:number;
    cultureEffect:number;
    moneyEffect:number;
    foodEffect:number;

    plantFunc:PlantFunc;

    constructor(_nm:string,_wLimits:number,_wNum:number,pE:number,hE:number,hER:number,cE:number,mE:number,fE:number,_plantfunc = null){
        this.name = _nm;
        this.workerLimits = _wLimits;
        this.workerNum = _wNum;
        this.populationEffect = pE;
        this.happinessEffect = hE;
        this.happinessEffectRange = hER;
        this.cultureEffect = cE;
        this.moneyEffect = mE;
        this.foodEffect = fE;
        this.plantFunc = _plantfunc;
    }
}

export default class DataUtil {

    static tileArray:Array<Array<TileScript>> = [];

    static levelNum = 1;

    static laborNum = 10;
    static totalWorkerNum = 0;
    static population = 0;
    static happiness = 0;
    static culture = 0;
    static delCulture = 0;
    static money = 100;
    static delMoney = 0;
    static food = 0;

    static labourPoints = 0;

    static debtLeft = -1;

    static nextLevel(){
        if(this.labourPoints < 0){
            DialogScript.ShowDialog("小镇当前的可用劳动人力点数为赤字，本回合无法推进。请调节工作地点的人力分配，解决可用劳动人力点数的赤字问题后方可继续下一回合。");
            return;
        }
        if(this.food < this.population){
            DialogScript.ShowDialog("人口数多于小镇自产的食物数，花费" + (this.population - this.food) + "点金币为小镇人口采购足够的粮食。");
        }else if(this.food > this.population){
            DialogScript.ShowDialog("小镇自产的食物数多于人口数，卖掉多于的粮食，额外获得" + (this.food - this.population) + "点金币。");
        }
        this.culture += this.delCulture;
        this.money += this.delMoney;
        this.money += (this.food - this.population);
        this.levelNum++;
        
        // 提升土壤含水量
        PlantScript.improveSWC();
        // 土壤含水量的侵蚀
        this.erosionLand();
        // 树木的死亡
        PlantScript.killPlant();

        // 计算新回合的人口
        this.population = 0;
        for(let j = 0; j < this.tileArray.length; j++){
            for(let i = 0; i < this.tileArray[0].length; i++){
                const deviceType = this.tileArray[j][i].deviceType;
                if(deviceType > -1){
                    this.population += this.deviceAttr[deviceType].populationEffect;
                }
            }
        }
        this.laborNum = this.population;
        if(this.laborNum == 0){
            DialogScript.ShowDialog("很遗憾，你的城镇已经无人居住，沦为了一座鬼城。在" + this.levelNum + "回合的坚持后，你的本轮游戏失败了。");
        }

        if(this.money < 0 && this.debtLeft > 0){
            this.debtLeft--;
        }else if(this.money < 0 && this.debtLeft < 0){
            this.debtLeft = 3;
        }else if(this.money >= 0){
            this.debtLeft = -1;
        }
        if(this.money < 0 && this.debtLeft == 0){
            DialogScript.ShowDialog("很遗憾，你的城镇由于连续3回合财政赤字，不得不宣布破产。在经过" + this.levelNum + "回合的坚持后，你的本轮游戏失败了。");
        }
        if(this.debtLeft > 0){
            DialogScript.ShowDialog("目前小镇拥有的金币数为赤字。请在" + this.debtLeft + "回合内扭亏为盈，否则小镇破产，游戏结束。");
        }

        DetailPanelScript.getInstance().hideDetail();
    }

    static countParams(){
        this.population = 0;
        this.happiness = 0;
        this.delCulture = 0;
        this.delMoney = 0;
        this.food = 0;
        this.totalWorkerNum = 0;
        const happinessPlace = [];
        for(let j = 0; j < this.tileArray.length; j++){
            for(let i = 0; i < this.tileArray[0].length; i++){
                const deviceType = this.tileArray[j][i].deviceType;
                if(deviceType > -1){
                    const device = this.deviceAttr[deviceType];
                    this.population += device.populationEffect;
                    this.totalWorkerNum += this.tileArray[j][i].workerNum;
                    this.delCulture += device.cultureEffect * this.tileArray[j][i].workerNum;
                    this.delMoney += device.moneyEffect * this.tileArray[j][i].workerNum;
                    this.food += device.foodEffect * this.tileArray[j][i].workerNum;
                    this.tileArray[j][i].happinessSource = [];
                    this.happiness = 0;
                    if(device.happinessEffectRange > 0){
                        happinessPlace.push({r:this.tileArray[j][i].r,s:this.tileArray[j][i].s,q:this.tileArray[j][i].q,range:device.happinessEffectRange,value:(device.happinessEffect * this.tileArray[j][i].workerNum),name:device.name});
                    }
                }
            }
        }
        this.labourPoints = this.laborNum - this.totalWorkerNum;
        // 计算幸福度及来源
        for(let j = 0; j < this.tileArray.length; j++){
            for(let i = 0; i < this.tileArray[0].length; i++){
                const deviceType = this.tileArray[j][i].deviceType;
                if(deviceType > -1){
                    const device = this.deviceAttr[deviceType];
                    if(device.populationEffect > 0){
                        const r0 = this.tileArray[j][i].r;
                        const s0 = this.tileArray[j][i].s;
                        const q0 = this.tileArray[j][i].q;
                        this.tileArray[j][i].happinessTotal = device.happinessEffect;
                        for(let k = 0; k < happinessPlace.length; k++){
                            const r1 = happinessPlace[k].r;
                            const s1 = happinessPlace[k].s;
                            const q1 = happinessPlace[k].q;
                            let dr = r1 - r0;
                            let ds = s1 - s0;
                            let dq = q1 - q0;
                            let dist = Math.max(Math.abs(dr), Math.abs(ds), Math.abs(dq));
                            if(dist <= happinessPlace[k].range){
                                this.tileArray[j][i].happinessSource.push({name:happinessPlace[k].name, value:happinessPlace[k].value, dist:dist, range:happinessPlace[k].range});
                                this.tileArray[j][i].happinessTotal += happinessPlace[k].value;
                            }
                        }
                        this.happiness += this.tileArray[j][i].happinessTotal * device.populationEffect;
                    }
                }
            }
        }
        if(this.population > 0){
            this.happiness = Math.floor(this.happiness / this.population);
        }else{
            this.happiness = 0;
        }
    }

    static erosionLand(){
        const newSWC = [];
        for(let j = 0; j < this.tileArray.length; j++){
            const line = [];
            for(let i = 0; i < this.tileArray[0].length; i++){
                const tile = this.tileArray[j][i];
                let swc = tile.SWC * 0.7;
                if(tile.rightUpTile){
                    swc += tile.rightUpTile.SWC * 0.05;
                } else {
                    swc += tile.SWC * 0.05;
                }
                if(tile.rightTile){
                    swc += tile.rightTile.SWC * 0.05;
                } else {
                    swc += tile.SWC * 0.05;
                }
                if(tile.rightDownTile){
                    swc += tile.rightDownTile.SWC * 0.05;

                } else {
                    swc += tile.SWC * 0.05;
                }
                if(tile.leftDownTile){
                    swc += tile.leftDownTile.SWC * 0.05;

                } else {
                    swc += tile.SWC * 0.05;
                }
                if(tile.leftTile){
                    swc += tile.leftTile.SWC * 0.05;

                } else {
                    swc += tile.SWC * 0.05;
                }
                if(tile.leftUpTile){
                    swc += tile.leftUpTile.SWC * 0.05;

                } else {
                    swc += tile.SWC * 0.05;
                }
                line.push(swc);
            }
            newSWC.push(line);
        }
        var upToDirt = 0;
        var upToGrass = 0;
        var downToDirt = 0;
        var downToSand = 0;
        var waterToDirt = 0;
        var stoneToSand = 0;
        for(let j = 0; j < this.tileArray.length; j++){
            for(let i = 0; i < this.tileArray[0].length; i++){
                const tile = this.tileArray[j][i];
                if(tile.tileType == TileType.Sand && newSWC[j][i] >= 10){
                    upToDirt ++;
                    tile.tileType = TileType.Dirt;
                } else if (tile.tileType == TileType.Sand_H && newSWC[j][i] >= 10){
                    upToDirt ++;
                    tile.tileType = TileType.Dirt_H;
                } else if (tile.tileType == TileType.Dirt && newSWC[j][i] >= 15){
                    upToGrass ++;
                    tile.tileType = TileType.Grass;
                } else if(tile.tileType == TileType.Dirt_H && newSWC[j][i] >= 15){
                    upToGrass ++;
                    tile.tileType = TileType.Grass_H;
                } else if(tile.tileType == TileType.Grass && newSWC[j][i] < 15){
                    downToDirt ++;
                    tile.tileType = TileType.Dirt;
                } else if(tile.tileType == TileType.Water && newSWC[j][i] < 15){
                    waterToDirt ++;
                    tile.tileType = TileType.Dirt;
                }else if(tile.tileType == TileType.Grass_H && newSWC[j][i] < 15){
                    downToDirt ++;
                    tile.tileType = TileType.Dirt_H;
                } else if(tile.tileType == TileType.Dirt && newSWC[j][i] < 10){
                    downToSand ++;
                    tile.tileType = TileType.Sand;
                } else if(tile.tileType == TileType.Dirt_H && newSWC[j][i] < 10){
                    downToSand ++;
                    tile.tileType = TileType.Sand_H;
                } else if(tile.tileType == TileType.Stone && newSWC[j][i] < 10){
                    stoneToSand ++;
                    if(tile.deviceType == DeviceType.VillageCommittee){
                        DialogScript.ShowDialog("很遗憾，你的" + DataUtil.deviceAttr[DeviceType.VillageCommittee].name + "受土地沙漠化的影响被损毁了。在经过" + this.levelNum + "回合的坚持后，你的本轮游戏失败了。");
                    }
                    tile.tileType = TileType.Sand;
                    tile.deviceType = -1;
                    tile.deviceNode.getComponent(cc.Sprite).spriteFrame = tile.deviceSF = null;
                }

                tile.SWC = newSWC[j][i];
                // console.log();
                tile.tileNode.getComponent(cc.Sprite).spriteFrame = tile.tileSF = (MapScript.tileSprites[tile.tileType] as cc.Prefab).data.getComponent(cc.Sprite).spriteFrame;
                // tile.tileNode.getComponent(cc.sprite)
            }
        }
        if(upToDirt > 0 || upToGrass > 0 || downToDirt > 0 || downToSand > 0 || waterToDirt > 0 || stoneToSand > 0){
            let res = "";
            if(upToDirt > 0 || upToGrass > 0){
                res += "在人工治理的努力下";
                if(upToDirt > 0){
                    res += "，有" + upToDirt + "个沙地块改善为泥土块";
                }
                if(upToGrass > 0){
                    res += "，有" + upToGrass + "个泥土块改善为草地块";
                }
                res += "。\n";
            }
            if(downToSand > 0 || downToDirt > 0 || waterToDirt > 0 || stoneToSand > 0){
                res += "受恶劣环境的影响";
                if(downToSand > 0){
                    res += "，有" + downToSand + "个泥土块退化为沙地块";
                }
                if(downToDirt > 0){
                    res += "，有" + downToDirt + "个草地块退化为泥地块";
                }
                if(waterToDirt > 0){
                    res += "，有" + waterToDirt + "个水体块退化为泥地块";
                }
                if(stoneToSand > 0){
                    res += "，有" + stoneToSand + "处建设用地退化为沙地块，其上的建筑均被损坏";
                }
                res += "。";
            }
            DialogScript.ShowDialog(res);
        }
    }

    static deviceAttr = [
        new DeviceFunc("空地", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("梭梭树", 1, 0, 0, 0, 0, 0, 0, 0, new PlantFunc(45, 45, 3, 16, "")),
        new DeviceFunc("沙棘", 2, 0, 0, 0, 0, 0, 0, 1, new PlantFunc(33, 33, 1, 15, "")),
        new DeviceFunc("花棒", 1, 0, 0, 0, 0, 0, 0, 0, new PlantFunc(40, 40, 2, 17, "")),
        new DeviceFunc("沙地云杉", 0, 0, 0, 0, 0, 0, 0, 0, new PlantFunc(90, 0, 1, 18, "")),
        new DeviceFunc("侧柏", 0, 0, 0, 0, 0, 0, 0, 0, new PlantFunc(100, 0, 2, 20, "")),
        new DeviceFunc("农田", 3, 3, 0, 0, 0, 0, 0, 2),
        new DeviceFunc("高级农田", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("草方格", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("仙人掌", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("岩石", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("村委会", 2, 2, 0, 5, 2, 3, -2, 0),
        new DeviceFunc("民居", 0, 0, 5, 10, 0, 0, 0, 0),
        new DeviceFunc("民居2", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("民居3", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("民居4", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("商店街", 2, 2, 0, 5, 2, 0, 2, 0)
    ];
}
