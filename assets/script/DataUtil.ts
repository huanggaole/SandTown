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
        
    ];

    House1 = {

    };
}
