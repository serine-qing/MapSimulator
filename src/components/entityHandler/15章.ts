import { Vector2 } from "@/spine/Utils";
import Enemy from "../enemy/Enemy";
import Tile from "../game/Tile";
import Global from "../utilities/Global";
import Trap from "../game/Trap";
import BattleObject from "../enemy/BattleObject";

const addMpweakSkill = (obj: BattleObject) => {
  obj.addSkill({
    name: "mpweak",
    initSp: 0,
    spCost: 30,
    spSpeed: 1,
    duration: 30,
    showSPBar: true,
  })
}

const Handler = {
  //删除多余的侵入式调用
  checkActionDatas: (actionDatas: ActionData[][]) => {
    let hasPrtsPoint = false;
    actionDatas.forEach(arr => {
      for(let i = 0; i < arr.length; i++){
        const actionData = arr[i];
        if(actionData?.enemyData?.key === "enemy_10072_mpprhd"){
          if(hasPrtsPoint){
            arr.splice(i, 1);
            i--;
          }else{
            hasPrtsPoint = true;
          }
        }
      }

    })  
  },

  handleTileInit: (tile: Tile) => {
    //prts抓怪点
    if(tile.tileKey === "tile_mpprts_enemy_born"){
      Global.gameManager.staticData.prtsSpawnPosition = tile.position;
    }
  },

  handleTrapStart: (trap: Trap) => {
    if(trap.key === "trap_227_mpweak"){
      addMpweakSkill(trap);
    }
  },

  handleSpawnEnemy: (enemy: Enemy): boolean => {
    const gameManager = Global.gameManager;
    const prtsPoint: Enemy = gameManager.customData.prtsPoint;
    const spawnPosition: Vector2 = gameManager.staticData.prtsSpawnPosition;

    if(!prtsPoint) return false;

    if(enemy.isAirborne){

      prtsPoint.addMoveCheckPoint(spawnPosition, () => {
          prtsPoint.animationStateTransition({
            idleAnimate: "Grab_Loop",
            moveAnimate: "Grab_Loop",
            transAnimation: "Grab_Begin",
            isWaitTrans: true
          })
      });
      
      prtsPoint.addMoveCheckPoint(enemy.route.startPosition, () => {
        enemy.start();
        prtsPoint.animationStateTransition({
          idleAnimate: "Idle",
          moveAnimate: "Idle",
          transAnimation: "Grab_End",
          isWaitTrans: true
        })
      });
      return true;
    }

    return false;
  },

  handleEnemyStart: (enemy: Enemy) => {
    switch (enemy.key) {
      case "enemy_10072_mpprhd":   //侵入式调用
        Global.gameManager.customData.prtsPoint = enemy;
        enemy.clearCheckPoint();
        enemy.cantFinished = true;
        break;
      case "enemy_10082_mpweak":   //弱化节点
        addMpweakSkill(enemy);
        break;
    }
  },

  handleChangeCheckPoint: (enemy: Enemy) => {
    //侵入式调用没有可执行序列，就返回原地
    if(enemy.key === "enemy_10072_mpprhd" && !enemy.currentCheckPoint()){
      const startPosition = enemy.route.startPosition;

      if(!enemy.tilePosition.equals(startPosition)){
        enemy.addMoveCheckPoint(startPosition);
      }
    }
  },
};

export default Handler;