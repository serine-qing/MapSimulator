import Enemy from "../enemy/Enemy"
import RunesHelper from "../game/RunesHelper";
import Tile from "../game/Tile"
import Trap from "../game/Trap"

interface Handler{
  parseRunes?(runesHelper: RunesHelper);

  checkActionDatas?(actionDatas: ActionData[]);

  parseExtraWave?(trapDatas: trapData[], branches: any, extraRoutes);

  handleTileInit?(tile: Tile);
  
  initTileEvents?(tile: Tile);

  afterGameInit?();

  beforeEnemyStart?(enemyData: EnemyData);
  
  handleEnemyConstructor?(enemy: Enemy);

  handleSpawnEnemy?(enemy: Enemy): boolean;

  handleEnemyStart?(enemy: Enemy);

  handleTrapStart?(trap: Trap);

  handleTalent?(enemy: Enemy, talent: any);

  handleSkill?(enemy: Enemy, skill: any);

  handleChangeCheckPoint?(enemy: Enemy);

  handlePickUp?(enemy: Enemy, vehicle: Enemy);   //vehicle载具

  handleDropOff?(enemy: Enemy, vehicle: Enemy);

  handleAttack?(enemy: Enemy);
  
  handleReborn?(enemy: Enemy);

  handleDie?(enemy: Enemy);

  handleEnemySet?(enemy: Enemy, state);

  afterMoveCamera?();

  afterGameUpdate?();

  afterGameViewInit?();
}

export default Handler;