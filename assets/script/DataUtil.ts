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

    static population = 0;
    static happiness = 0;
    static culture = 0;
    static money = 0;
    static food = 0;

    static labourPoints = 0;

    static nextLevel(){
        this.levelNum++;
    }

    static deviceAttr = [
        new DeviceFunc("仙人掌", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("岩石", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("荒废农田", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("农田", 3, 3, 0, 0, 0, 0, 0, 2),
        new DeviceFunc("村委会", 2, 2, 0, 10, 2, 3, -4, 0),
        new DeviceFunc("民居", 0, 0, 5, 0, 0, 0, 0, 0),
        new DeviceFunc("民居2", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("民居3", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("民居4", 0, 0, 0, 0, 0, 0, 0, 0),
        new DeviceFunc("商店街", 2, 2, 0, 5, 2, 0, 1, 0)
    ];
}
