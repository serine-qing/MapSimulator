import Enemy from "../enemy/Enemy"
import RunesHelper from "../game/RunesHelper";
import Tile from "../game/Tile"
import Trap from "../game/Trap"

abstract class Handler{
  abstract parseRunes(runesHelper: RunesHelper);

  abstract checkActionDatas(actionDatas: ActionData[]);

  abstract parseExtraWave(trapDatas: trapData[], branches: any, extraRoutes);

  abstract handleTileInit(tile: Tile);
  
  abstract initTileEvents(tile: Tile);

  abstract afterGameInit();

  abstract beforeEnemyStart(enemyData: EnemyData);
  
  abstract handleEnemyConstructor(enemy: Enemy);

  abstract handleSpawnEnemy(enemy: Enemy): boolean;

  abstract handleEnemyStart(enemy: Enemy);

  abstract handleTrapStart(trap: Trap);

  abstract handleTalent(enemy: Enemy, talent: any);

  abstract handleSkill(enemy: Enemy, skill: any);

  abstract handleChangeCheckPoint(enemy: Enemy);

  abstract handlePickUp(enemy: Enemy, vehicle: Enemy);   //vehicle载具

  abstract handleDropOff(enemy: Enemy, vehicle: Enemy);

  abstract handleAttack(enemy: Enemy);
  
  abstract handleReborn(enemy: Enemy);

  abstract handleDie(enemy: Enemy);

  abstract handleEnemySet(enemy: Enemy, state);

  abstract afterGameUpdate();

  abstract afterGameViewInit();
}

export default Handler;