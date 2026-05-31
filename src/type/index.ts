// Base - 基础类型和全局扩展声明
export type { Vec2, KeyValue, BlackBoard, Effect } from "./Base";

// constants - 常量和扩展方法
export { immuneTable, math_clamp, array_remove, array_equal } from "./constants";

// Stage - 关卡信息
export type { Stage } from "./Stage";

// Map - 地图和装置数据
export type { TileData, PathNode, PathMap, trapData } from "./Map";

// Enemy - 敌人相关数据
export type {
  AttrBlackboard,
  AttrChange,
  EnemyAttrChange,
  EnemyAttributes,
  EnemyData,
  EnemyRef,
  CheckPoint,
  EnemyRoute,
  EnemyParam,
  EnemySkill
} from "./Enemy";

// Action - 行动数据
export type { ActionData } from "./Action";

// Buff - Buff数据
export type { Buff, BuffParam } from "./Buff";

// LevelJson - 关卡 JSON 数据类型
export type {
  TileDataJson,
  RouteJson,
  CheckPointJson,
  WaveJson,
  WaveActionJson,
  WaveFragmentJson,
  BranchJson,
  BranchPhaseJson,
  BranchesJson,
  RuneJson,
  PredefinesJson,
  PredefinedInstanceJson,
  PredefinedCardJson,
  MapDataJson,
  LevelDataJson,
  LevelOptionsJson,
  EnemyDbRefJson,
  OverwrittenDataJson
} from "./LevelJson";

// EnemyJson - 敌人 JSON 数据类型
export type {
  EnemyDataEntryJson,
  EnemyLevelDataJson,
  EnemyAttributesJson,
  EnemySkillJson,
  AbilityItemJson
} from "./EnemyJson";
