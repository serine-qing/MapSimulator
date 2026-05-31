/**
 * 敌人 JSON 数据类型定义
 * 基于 enemyData.json 的实际结构
 */

import { BlackBoard } from './Base';

// ==================== 敌人属性 ====================

/** 敌人属性（来自 JSON） */
export interface EnemyAttributesJson {
  maxHp: number;
  atk: number;
  def: number;
  magicResistance: number;
  cost: number;
  blockCnt: number;
  moveSpeed: number;
  attackSpeed: number;
  baseAttackTime: number;
  respawnTime: number;
  hpRecoveryPerSec: number;
  spRecoveryPerSec: number;
  maxDeployCount: number;
  massLevel: number;
  baseForceLevel: number;
  tauntLevel: number;
  epDamageResistance: number;
  epResistance: number;
  damageHitratePhysical: number;
  damageHitrateMagical: number;
  epBreakRecoverSpeed: number;
  stunImmune: boolean;
  silenceImmune: boolean;
  sleepImmune: boolean;
  frozenImmune: boolean;
  levitateImmune: boolean;
  disarmedCombatImmune: boolean;
  fearedImmune: boolean;
  palsyImmune: boolean;
  attractImmune: boolean;
  rangeRadius: number;
}

// ==================== 敌人技能 ====================

/** 敌人技能（来自 JSON） */
export interface EnemySkillJson {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: BlackBoard[];
}

// ==================== 敌人等级数据 ====================

/** 敌人等级类型 */
export type EnemyLevelType = 'NORMAL' | 'ELITE' | 'BOSS';

/** 攻击方式 */
export type ApplyWay = 'MELEE' | 'RANGED' | 'NONE';

/** 移动方式 */
export type MotionType = 'WALK' | 'FLY';

/** 敌人等级数据（来自 JSON） */
export interface EnemyLevelDataJson {
  key: string;
  attributes: EnemyAttributesJson;
  levelType: EnemyLevelType;
  level: number;
  applyWay: ApplyWay;
  motion: MotionType;
  hugeEnemy: boolean;
  unMoveable: boolean;
  lifePointReduce: number;
  notCountInTotal: boolean;
  talentBlackboard?: BlackBoard[];
  skills: EnemySkillJson[];
  enemyTags: string[];
}

// ==================== 敌人能力描述 ====================

/** 敌人能力描述 */
export interface AbilityItemJson {
  text: string;
  textFormat?: string;
}

// ==================== 敌人数据库条目 ====================

/** 敌人数据库条目（enemyData.json） */
export interface EnemyDataEntryJson {
  Key: string;
  Levels: EnemyLevelDataJson[];
  CNName: string;
  CNDescription: string;
  CNAbilityList: AbilityItemJson[];
  JPName: string;
  JPDescription: string;
  JPAbilityList: AbilityItemJson[];
  ENName: string;
  ENDescription: string;
  ENAbilityList: AbilityItemJson[];
  KRName: string;
  KRDescription: string;
  KRAbilityList: AbilityItemJson[];
}

// ==================== 敌人数据库引用（来自关卡 JSON） ====================

/** 覆盖数据 */
export interface OverwrittenDataJson {
  m_defined?: boolean;
  m_value?: unknown;
  attributes?: {
    [key: string]: {
      m_defined: boolean;
      m_value: number;
    };
  };
  talentBlackboard?: BlackBoard[];
  skills?: EnemySkillJson[];
  prefabKey?: {
    m_defined: boolean;
    m_value: string;
  };
  [key: string]: unknown;
}

/** 敌人数据库引用 */
export interface EnemyDbRefJson {
  useDb: boolean;
  id: string;
  level: number;
  overwrittenData: OverwrittenDataJson | null;
}
