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
    autoTrigger: false,
    showSPBar: true,
  })

  if(!Global.gameManager.deepCopyData.mpweaks){
    Global.gameManager.deepCopyData.mpweaks = [];
  }
  Global.gameManager.deepCopyData.mpweaks.push(obj)
}


const enemyToSpawn = (_enemy: BattleObject) => {
  const enemy = _enemy as Enemy;

  const gameManager = Global.gameManager;
  const prtsPoint: Enemy = gameManager.customData.prtsPoint;

  const spawnPosition: Vector2 = gameManager.staticData.prtsSpawnPosition;
  prtsPoint.addMoveCheckPoint({
    position: spawnPosition, 
    callback: () => {
      prtsPoint.animationStateTransition({
        idleAnimate: "Grab_Loop",
        moveAnimate: "Grab_Loop",
        transAnimation: "Grab_Begin",
        isWaitTrans: true
      })
    }
  });
  //todo animationScale需要更精确的数值
  prtsPoint.addMoveCheckPoint({
    position: enemy.route.startPosition, 
    callback: () => {
      enemy.start();
      prtsPoint.animationStateTransition({
        idleAnimate: "Idle",
        moveAnimate: "Idle",
        transAnimation: "Grab_End",
        animationScale: 1.5,
        isWaitTrans: true
      })
    }
  });
}

const mpweakToClick = (mpweak: BattleObject) => {
  const gameManager = Global.gameManager;
  const prtsPoint: Enemy = gameManager.customData.prtsPoint;

  let position;
  if("tilePosition" in mpweak) position = mpweak.tilePosition;
  else if("position" in mpweak) position = mpweak.position;

  prtsPoint.addMoveCheckPoint({
    position,
    index: prtsPoint.checkPointIndex + 1,
    callback: () => {

      prtsPoint.animationStateTransition({
        transAnimation: "Click",
        animationScale: 1.5,
        isWaitTrans: true
      })
      mpweak.triggerSkill("mpweak");
      mpweak.customData.needClick = false;
    }
  });
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

    if(!prtsPoint) return false;
    
    if(enemy.isAirborne){
      prtsPoint.deepCopyData.commands.push("spawn");
      prtsPoint.deepCopyData.prtsBattleObjects.push(enemy);
      
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

        enemy.deepCopyData.commands = [];                     //指令队列
        enemy.deepCopyData.prtsBattleObjects = [];           //指令目标队列
        break;
      case "enemy_10082_mpweak":   //弱化节点
        addMpweakSkill(enemy);
        break;
    }
  },

  handleChangeCheckPoint: (enemy: Enemy) => {

  },

  afterGameUpdate: () => {
    const prtsPoint: Enemy = Global.gameManager.customData.prtsPoint;
    if(!prtsPoint) return;
    const commands: string[] = prtsPoint.deepCopyData.commands;
    const prtsBattleObjects: BattleObject[] = prtsPoint.deepCopyData.prtsBattleObjects;

    const mpweaks: BattleObject[] = Global.gameManager.deepCopyData.mpweaks;

    //检索sp满了的弱化节点
    mpweaks && mpweaks.forEach((mpweak: BattleObject) => {
      if(mpweak.customData.needClick) return;  //已经加入点击队列

      const skill = mpweak.getSkillState("mpweak");
      if( skill && skill.sp === skill.spCost){
        
        mpweak.customData.needClick = true;
        //场上存在充能完成的弱化节点时，会生成一个移动至该处并尝试【激活】的指令，并将其插入为下一个指令
        commands.unshift("click");
        prtsBattleObjects.unshift(mpweak);
      }
    })

    if(prtsPoint.currentCheckPoint()) return;       //目前有正在执行的工作

    const battleObject = prtsBattleObjects.shift();
    const command = commands.shift();

    if(battleObject){

      if(command === "click"){ //弱化节点
        mpweakToClick(battleObject);
      }else{
        enemyToSpawn(battleObject);
      }
    }else{
      //无事可干
      const startPosition = prtsPoint.route.startPosition;

      if(!prtsPoint.tilePosition.equals(startPosition)){

        prtsPoint.addMoveCheckPoint({
          position: startPosition
        });
      }
    }

  },  
};

export default Handler;