import { ExtraWaveData } from "@/type/Map";
import Enemy from "../enemy/Enemy"
import RunesHelper from "../game/RunesHelper";
import Tile from "../game/Tile"
import Trap from "../game/Trap"
import type { ActionData, trapData, EnemyData, CheckPoint } from "@/type";

interface Handler{
  parseRunes?(runesHelper: RunesHelper);

  checkActionDatas?(actionDatas: ActionData[]);

  parseExtraWave?(branches: any);
  
  afterParseExtraWave?(extraWaves: ExtraWaveData[]);

  handleTileInit?(tile: Tile);

  afterTilesInit?(tiles: Tile[]);

  afterModelInit?();
  
  initTileEvents?(tile: Tile);

  afterGameInit?();

  /**
   * 初始化地图在视图上的位置
   */
  afterInitMapPosition?();

  beforeEnemyStart?(enemyData: EnemyData);
  
  handleEnemyConstructor?(enemy: Enemy);

  handleSpawnEnemy?(enemy: Enemy): boolean;

  handleEnemyStart?(enemy: Enemy);

  /**
   * 某个敌人结束生命周期
   */
  handleFinishedMap?(enemy: Enemy);

  /**
   * 额外波次生成结束触发
   */
  afterExtraWaveFinish?(key: string);

  handleTrapStart?(trap: Trap);

  handleTalent?(enemy: Enemy, talent: any);

  handleSkill?(enemy: Enemy, skill: any);

  handleChangeCheckPoint?(enemy: Enemy, oldCP: CheckPoint, newCP: CheckPoint | null);

  handleEnemyWait?(enemy: Enemy, waitTime: number);            //敌人触发停驻检查点

  handleEnemyWaitFinish?(enemy: Enemy, waitTime: number);            //敌人结束停驻检查点

  handlePickUp?(enemy: Enemy, vehicle: Enemy);   //vehicle载具

  handleDropOff?(enemy: Enemy, vehicle: Enemy);

  handleAttack?(enemy: Enemy);
  
  handleReborn?(enemy: Enemy);

  handleDie?(enemy: Enemy);

  handleEnemySet?(enemy: Enemy, state);

  handleEnemyUnbalanceMove?(enemy: Enemy);               //敌人失衡移动

  handleEnemyBoundCrash?(enemy: Enemy, tile: Tile);      //敌人撞墙事件

  afterMoveCamera?();

  afterGameUpdate?();

  afterGameViewInit?();

  /**
   * handler运行时会动态部署、但地图可能没预置实例的装置key（在parseRunes时已确定）。
   * MapModel.getTrapDatas会收集这些key一起加载资源并存进trapAssetTemplates，
   * 部署时用 mapModel.getTrapProto(key) 取模板（预置实例优先）
   */
  extraTrapKeys?(): string[];


  get?(): any;

  set?(state: any);
}

export default Handler;