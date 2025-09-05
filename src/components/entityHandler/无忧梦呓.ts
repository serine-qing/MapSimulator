import { Vector2 } from "three";
import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";
import Tile from "../game/Tile";
import Trap from "../game/Trap";
import DataObject from "../enemy/DataObject";

let hasMoonlight = false;
let direction, duration;
let cw; //旋转方向 1顺时针 0逆时针
let moonlight_gbuff: Buff;


const addMoonlight = (obj: DataObject) => {
  const enemy = obj as Enemy;
  if(enemy.isEnemy){
    enemy.addBuff(moonlight_gbuff);
    const spMoon = enemy.staticData.sp_moon;
    if(spMoon){
      const wakeSkill = enemy.spSkillData.find(data => data.name === "wakeup");
      if(wakeSkill){
        wakeSkill.spSpeed = spMoon;
      }
    }
  }else{
    //装置
    const trap = obj as Trap;
    const spMoon = trap.staticData.sp_moon;
    if(spMoon){
      const spawnSkill = trap.spSkillData.find(data => data.name === "spawn");
      if(spawnSkill){
        spawnSkill.spSpeed = spMoon;
      }
    }
  }
}

const removeMoonlight = (obj: DataObject) => {
  const enemy = obj as Enemy;
  if(enemy.isEnemy){
    enemy.removeBuff("moonlight_gbuff");
    const sp = enemy.staticData.sp;
    if(sp){
      const wakeSkill = enemy.spSkillData.find(data => data.name === "wakeup");
      if(wakeSkill){
        wakeSkill.spSpeed = sp;
      }
    }
  }else{
    const trap = obj as Trap;
    const sp = trap.staticData.sp;
    if(sp){
      const spawnSkill = trap.spSkillData.find(data => data.name === "spawn");
      if(spawnSkill){
        spawnSkill.spSpeed = sp;
      }
    }
  }
}

const addTileEvent = (position) => {
  Global.tileManager.addEvent({
    key: "moonlight",
    type: "in",
    isMerge: true,
    trap: ["trap_249_mjcsdw","trap_249_mjcsdw_2"],
    x: position.x,
    y: position.y,
    callback: addMoonlight
  })

  Global.tileManager.addEvent({
    key: "moonlight",
    type: "out",
    trap: ["trap_249_mjcsdw","trap_249_mjcsdw_2"],
    x: position.x,
    y: position.y,
    callback: removeMoonlight
  })
}

const removeTileEvent = (position) => {
  Global.tileManager.removeEvent({
    key: "moonlight",
    type: "in",
    x: position.x,
    y: position.y,
  })

  Global.tileManager.removeEvent({
    key: "moonlight",
    type: "out",
    x: position.x,
    y: position.y,
  })
}

const getShadowRect = (position: Vector2 | Vec2, direction: string): Tile[] => {
  const x1 = position.x;
  const y1 = position.y;
  let x2, y2;

  switch (direction) {
    case "right":
      x2 = -Infinity;
      y2 = y1;
      break;
    case "left":
      x2 = Infinity;
      y2 = y1;
      break;
    case "down":
      x2 = x1;
      y2 = Infinity;
      break;
    case "up":
      x2 = x1;
      y2 = -Infinity;
      break;
  }

  return Global.tileManager.getRect(x1, x2, y1, y2);
}

const addShadows = (position: Vector2 | Vec2, direction: string) => {
  let {x ,y} = position;
  switch (direction) {
    case "left":
      x += 1;
      break;
    case "right":
      x -= 1;
      break;
    case "up":
      y -= 1;
      break;
    case "down":
      y += 1;
      break;
  }

  const rect = getShadowRect( {x, y}, direction);

  rect.forEach(tile => {
    tile.addDynamicTexture("moonlight_shadow", "moonlight_shadow");
    removeTileEvent(tile.position);
  })
}

const removeShadows = (position: Vector2 | Vec2, direction: string) => {
  const rect = getShadowRect(position, direction);

  rect.forEach(tile => {
    
      tile.removeDynamicTexture("moonlight_shadow");
      addTileEvent(tile.position);
  })
}

const Handler = {
  parseRune: (rune) => {
    if(rune.key === "env_system_new"){
      const type = rune.blackboard.find(item => item.key === "key")?.valueStr;
      if(type === "env_034_act45side_light"){
        hasMoonlight = true;
        direction = rune.blackboard.find(item => item.key === "direction")?.valueStr?.toLowerCase();
        duration = rune.blackboard.find(item => item.key === "duration")?.value;
        cw = rune.blackboard.find(item => item.key === "cw")?.value;
        
      }
    }else if(rune.key === "env_gbuff_new" && hasMoonlight){
      const type = rune.blackboard.find(item => item.key === "key")?.valueStr;
      if(type === "act45side_enemy_global_buff"){

        moonlight_gbuff = {
          id: "moonlight_gbuff", 
          key: "moonlight_gbuff", 
          overlay: false, 
          effect: [
            {
              attrKey: "moveSpeed",
              method: "mul",
              value: rune.blackboard.find(item => item.key === "move_speed")?.value + 1
            }
          ]
        }

      }
    }
  },

  parseExtraWave: (branches) => {
    Object.keys(branches).forEach(key => {
      if(key.includes("ldevil_")){
        Global.mapModel.parseExtraActions(key, branches[key].phases)
      }
    });
  },

  afterGameInit: () => {
    if(!hasMoonlight) return;
    const gameManager = Global.gameManager;
    gameManager.customData.moonlightDire = direction;
    gameManager.staticData.cw = cw; 

    Global.tileManager.flatTiles.forEach(tile => {
      addTileEvent(tile.position);
    })

    Global.trapManager.traps.forEach(trap => {
      addShadows(trap.position, direction);
    })

    gameManager.countdown.addCountdown({
        name: "turnMoonlight",
        initCountdown: duration,
        countdown: duration,
        callback:() => {
          let beforeDire = gameManager.customData.moonlightDire;
          let currentDire;
          let cw = gameManager.staticData.cw;
          switch (beforeDire) {
            case "left":
              currentDire = cw === 1? "up" : "down";
              break;
            case "right":
              currentDire = cw === 1? "down" : "up";
              break;
            case "up":
              currentDire = cw === 1? "right" : "left";
              break;
            case "down":
              currentDire = cw === 1? "left" : "right";
              break;
          }

          gameManager.customData.moonlightDire = currentDire;

          Global.trapManager.traps.forEach(trap => {
            removeShadows(trap.position, beforeDire)
          })

          Global.trapManager.traps.forEach(trap => {
            addShadows(trap.position, currentDire);
          })
          
        }
      })

  },

  handleTrapStart: (trap: Trap) => {
    if(trap.key === "trap_249_mjcsdw"){
      const branch_id = trap.getSkillBoard("branch_id");
      if(branch_id){
        const sp = trap.getSkillBoard("sp");
        trap.staticData.sp = sp;
        trap.staticData.sp_moon = sp + trap.getSkillBoard("sp_moon");

        trap.addSPSkill({
            name: "spawn",
            initSp: 0,
            spCost: 999,
            spSpeed: sp,
            maxCount: 1,
            callback: () => {
              Global.waveManager.startExtraAction({
                key: branch_id
              })
            }
          })
      }
    }
  },

  handleEnemyStart: (enemy: Enemy) => {

  },

  handleTalent: (enemy: Enemy, talent: any) => {
    if(talent.key === "sleep2wake"){
      enemy.staticData.sp = talent.value.sp;
      enemy.staticData.sp_moon = talent.value.sp_moon;
    }
  },

  handleSkill: (enemy: Enemy, skill: any) => {
    switch (skill.prefabKey) {
      case "wakeup":
        if(
          enemy.key.includes("enemy_10103_mjcppp") || //"浅睡的臼齿"
          enemy.key.includes("enemy_10105_mjcdol")     //"发条仆从"
        ){
          let idleAnimate, moveAnimate, activeIdleAnimate, activeMoveAnimate, transAnimation, moveSpeed;
          
          const sleep2wake = enemy.getTalent("sleep2wake");
          const wake2sleep = enemy.getTalent("wake2sleep");
          const unmoveTime = sleep2wake?.unmove;

          switch (enemy.key) {
            case "enemy_10103_mjcppp":
              idleAnimate = "Idle_B";
              moveAnimate = "Move_B";
              activeIdleAnimate = "Idle_A";
              activeMoveAnimate = "Move_A";
              transAnimation = "Revive";
              
              moveSpeed = wake2sleep?.move_speed || 1;
              break;
            case "enemy_10105_mjcdol":
              idleAnimate = "B_Idle";
              moveAnimate = "B_Move";
              activeIdleAnimate = "A_Idle";
              activeMoveAnimate = "A_Move";
              transAnimation = "BtoA";
              moveSpeed = wake2sleep?.move_speed || 1;
              break;
          }
          
          enemy.idleAnimate = idleAnimate;
          enemy.moveAnimate = moveAnimate;
          enemy.unMoveable = true;
          enemy.countdown.addCountdown({
            name: "unmove",
            initCountdown: unmoveTime,
            callback: () => {
              enemy.unMoveable = false;
            }
          })

          enemy.addSPSkill({
            name: "wakeup",
            initSp: 0,
            spCost: skill.spCost,
            spSpeed: sleep2wake.sp,
            maxCount: 1,
            callback: () => {
              enemy.animationStateTransition({
                idleAnimate: activeIdleAnimate,
                moveAnimate: activeMoveAnimate,
                transAnimation,
                isWaitTrans: true
              });
              enemy.unMoveable = false;
              enemy.attributes.moveSpeed = moveSpeed;
            }
          })

        }
        break;
      case "summon":
        if(enemy.key === "enemy_1569_ldevil"){ //莫菲丝
          const summon = skill;

          enemy.addSkill({
            name: "summon",
            cooldown: summon.cooldown,
            initCooldown: summon.initCooldown,
            animateTransition: {
              idleAnimate: "A_Idle",
              moveAnimate: "A_Move",
              transAnimation: "A_Skill_3",
              isWaitTrans: true
            },
            callback: () => {
              Global.waveManager.startExtraAction({
                key: summon.blackboard.branch_id
              })
            }
          })
        }
        break;
    }


  },

  handleDestroy: () => {
    hasMoonlight = false;
  }
};

export default Handler;