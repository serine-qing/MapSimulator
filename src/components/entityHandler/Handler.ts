import Enemy from "../enemy/Enemy"
import RunesHelper from "../game/RunesHelper";
import Tile from "../game/Tile"
import Trap from "../game/Trap"
import type { ActionData, trapData, EnemyData, CheckPoint } from "@/type";

interface Handler{
  parseRunes?(runesHelper: RunesHelper);

  checkActionDatas?(actionDatas: ActionData[]);

  parseExtraWave?(branches: any);

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

  handleChangeCheckPoint?(enemy: Enemy, oldCP: CheckPoint, newCP: CheckPoint);

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


  get?(): any;

  set?(state: any);
}

export default Handler;