import { LevelType } from "@/components/utilities/Enum";
import { Vec2 } from "./Base";
import { OverwrittenDataJson } from "./EnemyJson";

// ==========================================
// 属性相关
// ==========================================

export type EnemyAttrKey = "atk" | "attackSpeed" | "attackTime" | "baseAttackTime" | "hpRecoveryPerSec" |
    "magicResistance" | "massLevel" | "maxHp" | "moveSpeed" | "rangeRadius";
    
export interface AttrBlackboard {
  key: EnemyAttrKey;
  value: number;
}

export interface AttrChange {
  difficultyMask: string;
  calMethod: "add" | "mul" | "addmul" | "set";
  enemyLevelType: LevelType[];
  enemy: string[];
  enemyExclude: string[];
  runeAlias: string;
  blackboards: AttrBlackboard[];
}

export interface EnemyAttrChange {
  difficultyMask: string;
  calMethod: "add" | "mul" | "addmul" | "set";
  blackboards: AttrBlackboard[];
}

// ==========================================
// 敌人数据
// ==========================================

export interface EnemyAttributes {
  atk: number;
  attackSpeed: number;
  attackTime: number;
  baseAttackTime: number;
  def: number;
  hpRecoveryPerSec: number;
  magicResistance: number;
  massLevel: number;
  maxHp: number;
  moveSpeed: number;
  rangeRadius: number;
}

export interface EnemyData {
  [x: string]: any;
  data: {};
  key: string;
  waveKey: string;
  count: number;
  level: number;
  attributes: EnemyAttributes;
  baseAttributes: EnemyAttributes;
  talentBlackboard?: any[];
  talents: any;
  skills: any;
  hugeEnemy: boolean;
  unMoveable: boolean;
  description: string;
  levelType: LevelType;
  name: string;
  icon: string;
  applyWay: string;
  attrChanges: EnemyAttrChange[];
  rangeRadius: number;
  motion: string;
  notCountInTotal: boolean;
  skelUrl?: string;
  atlasUrl?: string;
  skeletonData?: any;
  skinName?: string;
  fbxMesh?: any;
  skelHeight: number;
  skelWidth: number;
  moveAnimate: string;
  idleAnimate: string;
  lifePointReduce: number;
  immunes: string[];
  abilityList: any;
  animations: any[];
}

export interface EnemyRef {
  id: string;
  level: number;
  overwrittenData: OverwrittenDataJson | null;
  useDb: boolean;
}

// ==========================================
// 敌人路径
// ==========================================

export interface CheckPoint {
  type: string;
  position: Vec2;
  time: number;
  reachOffset: Vec2;
  randomizeReachOffset: boolean;
  callback?: Function;
}

export interface EnemyRoute {
  index: number;
  allowDiagonalMove?: boolean;
  visitEveryTileCenter: boolean;
  visitEveryNodeCenter: boolean;
  visitEveryNodeStably: boolean;
  checkpoints: Array<CheckPoint>;
  startPosition: Vec2;
  endPosition: Vec2;
  isAirborne: boolean;
  motionMode: string;
  spawnOffset: Vec2;
  spawnRandomRange: Vec2;
  visualRoutes?: any;
}

export interface EnemyParam {
  startTime: number;
  fragmentTime: number;
  dontBlockWave: boolean;
  route: EnemyRoute;
}

// ==========================================
// 敌人技能
// ==========================================

export interface EnemySkill {
  cooldown: number;
  initCooldown: number;
  prefabKey: string;
  priority: number;
  spCost: number;
  blackboard: Record<string, any>;
}
