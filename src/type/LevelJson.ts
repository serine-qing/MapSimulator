/**
 * 关卡 JSON 数据类型定义
 * 基于 level JSON 的实际结构
 */

import { Vec2, BlackBoard } from './Base';

// ==================== 地块相关 ====================

/** 地块高度类型 */
export type HeightType = number; // 0 = 低地, 1 = 高台

/** 地块可建造类型 */
export type BuildableType = number; // 0 = 不可部署, 1 = 近战, 2 = 远程

/** 地块数据（来自 JSON） */
export interface TileDataJson {
  tileKey: string;              // 地块类型键名，如 "tile_road", "tile_wall"
  heightType: HeightType;
  buildableType: BuildableType;
  passableMask: number;         // 可通行掩码
  playerSideMask: number;       // 玩家侧掩码
  blackboard: BlackBoard[] | null;
  effects: unknown[] | null;
}

// ==================== 路径相关 ====================

/** 移动模式 */
export type MotionMode = number | string; // 0 = 步行, 1 = 飞行, 2 = 传送; 或 "WALK", "FLY", "TELEPORT"

/** 检查点类型 */
export type CheckPointType = number; // 0 = 普通, 1 = 等待

/** 检查点定义 */
export interface CheckPointJson {
  type: CheckPointType;
  time: number;
  position: Vec2;
  reachOffset: Vec2;
  randomizeReachOffset: boolean;
  reachDistance: number;
}

/** 路径定义 */
export interface RouteJson {
  motionMode: MotionMode;
  startPosition: Vec2;
  endPosition: Vec2;
  spawnRandomRange: Vec2;
  spawnOffset: Vec2;
  checkpoints: CheckPointJson[] | null;
  allowDiagonalMove: boolean;
  visitEveryTileCenter: boolean;
  visitEveryNodeCenter: boolean;
  visitEveryCheckPoint: boolean;
}

// ==================== 敌人相关 ====================

/** 敌人等级类型 */
export type EnemyLevelType = 'NORMAL' | 'ELITE' | 'BOSS';

/** 攻击方式 */
export type ApplyWay = 'MELEE' | 'RANGED' | 'NONE';

/** 移动方式 */
export type MotionType = 'WALK' | 'FLY';

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

/** 敌人技能（来自 JSON） */
export interface EnemySkillJson {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: BlackBoard[];
}

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

/** 敌人能力描述 */
export interface AbilityItemJson {
  text: string;
  textFormat?: string;
}

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

// ==================== 关卡敌人引用 ====================

import type { OverwrittenDataJson } from './EnemyJson';
export type { OverwrittenDataJson };

/** 敌人数据库引用 */
export interface EnemyDbRefJson {
  useDb: boolean;
  id: string;
  level: number;
  overwrittenData: OverwrittenDataJson | null;
}

// ==================== 波次相关 ====================

/** 行动类型 */
export type ActionType = number | string;
// 数字: 0 = SPAWN, 2 = ACTIVATE_PREDEFINED, 3 = TRIGGER_PREDEFINED, 4 = PLAY_OPERA, 5 = CAMERA_MOVE
// 字符串: "SPAWN", "ACTIVATE_PREDEFINED", "TRIGGER_PREDEFINED", "PLAY_OPERA", "CAMERA_MOVE"

/** 波次行动 */
export interface WaveActionJson {
  actionType: ActionType;
  managedByScheduler: boolean;
  key: string;                    // 敌人 key
  count: number;
  preDelay: number;
  interval: number;
  routeIndex: number;
  blockFragment: boolean;
  autoPreviewRoute: boolean;
  autoDisplayEnemyInfo: boolean;
  isUnharmfulAndAlwaysCountAsKilled: boolean;
  hiddenGroup: string | null;
  randomSpawnGroupKey: string | null;
  randomSpawnGroupPackKey: string | null;
  randomType: number;
  refreshType: number;
  weight: number;
  dontBlockWave: boolean;
  forceBlockWaveInBranch: boolean;
  isValid: boolean;
  notCountInTotal: boolean;
  extraMeta: unknown | null;
  actionId: string | null;
}

/** 波次片段 */
export interface WaveFragmentJson {
  preDelay: number;
  actions: WaveActionJson[];
}

/** 波次定义 */
export interface WaveJson {
  preDelay: number;
  postDelay: number;
  maxTimeWaitingForNextWave: number;
  fragments: WaveFragmentJson[];
  advancedWaveTag: string | null;
}

// ==================== 分支相关 ====================

/** 分支阶段 */
export interface BranchPhaseJson {
  preDelay: number;
  actions: WaveActionJson[];
  m_randomActionGroups: unknown | null;
  m_actionWithRandomSpawn: unknown | null;
  m_validActionPackKeys: unknown | null;
}

/** 分支定义 */
export interface BranchJson {
  phases: BranchPhaseJson[];
}

/** 分支集合 */
export interface BranchesJson {
  [key: string]: BranchJson;
}

// ==================== 符文相关 ====================

/** 符文定义 */
export interface RuneJson {
  difficultyMask: number;
  key: string;
  professionMask: number;
  buildableMask: number;
  blackboard: BlackBoard[];
}

// ==================== 预设相关 ====================

/** 角色/单位实例 */
export interface CharacterInstanceJson {
  characterKey: string;
  level: number;
  phase: number;
  favorPoint: number;
  potentialRank: number;
}

/** 天赋覆盖 */
export interface OverrideTalentJson {
  prefabKey: string;
  blackboard: BlackBoard[];
}

/** 预设单位 */
export interface PredefinedInstanceJson {
  position: Vec2;
  direction: number;
  hidden: boolean;
  alias: string | null;
  uniEquipIds: string[] | null;
  showSpIllust: boolean;
  masterInfos: unknown | null;
  inst: CharacterInstanceJson;
  skillIndex: number;
  mainSkillLvl: number;
  skinId: string;
  tmplId: string | null;
  overrideSkillBlackboard: BlackBoard[] | null;
  overrideTalents: OverrideTalentJson[] | null;
}

/** 预设卡牌 */
export interface PredefinedCardJson {
  initialCnt: number;
  hidden: boolean;
  alias: string | null;
  uniEquipIds: string[] | null;
  showSpIllust: boolean;
  masterInfos: unknown | null;
  inst: CharacterInstanceJson;
  skillIndex: number;
  mainSkillLvl: number;
  skinId: string;
  tmplId: string | null;
  overrideSkillBlackboard: BlackBoard[] | null;
  overrideTalents: OverrideTalentJson[] | null;
}

/** 预设数据 */
export interface PredefinesJson {
  characterInsts: PredefinedInstanceJson[];
  tokenInsts: PredefinedInstanceJson[];
  characterCards: PredefinedCardJson[];
  tokenCards: PredefinedCardJson[];
}

// ==================== 地图数据 ====================

/** 地图数据 */
export interface MapDataJson {
  map: number[][];                   // 二维数组，存储地块索引
  tiles: TileDataJson[];             // 地块定义数组
  blockEdges: unknown[] | null;
  tags: string[] | null;
  effects: unknown[] | null;
  layerRects: unknown[] | null;
}

// ==================== 关卡配置 ====================

/** 关卡选项 */
export interface LevelOptionsJson {
  characterLimit: number;
  maxLifePoint: number;
  initialCost: number;
  maxCost: number;
  costIncreaseTime: number;
  moveMultiplier: number;
  steeringEnabled: boolean;
  isTrainingLevel: boolean;
  isHardTrainingLevel: boolean;
  isPredefinedCardsSelectable: boolean;
  displayRestTime: boolean;
  maxPlayTime: number;
  functionDisableMask: number;
  configBlackBoard: BlackBoard[] | null;
  enemyTauntLevelPow: number;
}

/** 关卡数据（完整 JSON 结构） */
export interface LevelDataJson {
  // 关卡基本信息（由后端添加，非原始 JSON 字段）
  id?: string;
  levelCode?: string;
  challenge?: string;
  sandTable?: unknown[];

  options: LevelOptionsJson;
  levelId: string | null;
  mapId: string | null;
  bgmEvent: string;
  environmentSe: string | null;
  mapData: MapDataJson;
  tilesDisallowToLocate: Vec2[];
  runes: RuneJson[];
  optionalRunes: RuneJson[] | null;
  globalBuffs: unknown[] | null;
  routes: RouteJson[];
  extraRoutes: RouteJson[];
  enemies: unknown[];               // 内联敌人实例
  enemyDbRefs: EnemyDbRefJson[];
  waves: WaveJson[];
  branches: BranchesJson;
  predefines: PredefinesJson;
  hardPredefines: PredefinesJson;
  excludeCharIdList: string[] | null;
  randomSeed: number;
  operaConfig: unknown | null;
  cameraPlugin: string;
  runtimeData: unknown | null;
}
