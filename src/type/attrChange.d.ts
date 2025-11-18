import {  LevelType } from "@/components/utilities/Enum";

declare global{

  interface AttrBlackboard{
    key:  "atk" | "attackSpeed" | "attackTime" | "baseAttackTime" | "hpRecoveryPerSec" |
      "magicResistance" | "massLevel" | "maxHp" | "moveSpeed" | "rangeRadius",
    value: number
  }

    //属性更改
  interface AttrChange{
    difficultyMask: string,
    calMethod: "add" | "mul" | "addmul" | "set";
    enemyLevelType: LevelType[],
    enemy: string[],
    enemyExclude: string[],
    runeAlias: string,
    blackboards: AttrBlackboard[];
  }

  interface EnemyAttrChange{
    difficultyMask: string,
    calMethod: "add" | "mul" | "addmul" | "set";
    blackboards: AttrBlackboard[];
  }
}
