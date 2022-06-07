// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
    Cactus,
    Rock,
    Farm_Empty,
    Farm,
    VillageCommittee,
    House1,
    House2,
    House3,
    House4,
    Shop1,
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

    constructor(_nm:string,_wLimits:number,_wNum:number,pE:number,hE:number,hER:number,cE:number,mE:number,fE:number){
        this.name = _nm;
        this.workerLimits = _wLimits;
        this.workerNum = _wNum;
        this.populationEffect = pE;
        this.happinessEffect = hE;
        this.happinessEffectRange = hER;
        this.cultureEffect = cE;
        this.moneyEffect = mE;
        this.foodEffect = fE;
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

    static nextLevel(){
        this.culture += this.delCulture;
        this.money += this.delMoney;
        this.money += (this.food - this.population);
        this.levelNum++;
        this.laborNum = this.population;
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
        this.happiness = Math.floor(this.happiness / this.population);
    }

    static deviceAttr = [
        new DeviceFunc("仙人掌", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("岩石", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("荒废农田", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("农田", 3, 3, 0, 0, 0, 0, 0, 2),
        new DeviceFunc("村委会", 2, 2, 0, 10, 2, 3, -2, 0),
        new DeviceFunc("民居", 0, 0, 5, 10, 0, 0, 0, 0),
        new DeviceFunc("民居2", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("民居3", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("民居4", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("商店街", 2, 2, 0, 5, 2, 0, 2, 0)
    ];
}
