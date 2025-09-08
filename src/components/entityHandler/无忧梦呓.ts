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
    enemy.customData.moonlight = true;
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
    enemy.customData.moonlight = false;
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

//#region boss技能  
const addBossSkillEnemyLine = (enemy: Enemy, skill) => {
  let transAnimation;
  switch (skill.prefabKey) {
    case "enemyline":
      transAnimation = "A_Skill_3";
      break;
    case "enemylineadvance":
      transAnimation = "B_Skill_3";
      break;
  }
  enemy.addSkillSet({
    name: "enemyline",
    cooldown: skill.cooldown,
    initCooldown: skill.initCooldown,
    priority: skill.priority,
    animateTransition: {
      transAnimation,
      isWaitTrans: true,
      animationScale: 1.8,
    }
  })
}

const addBossSkillSummon = (enemy: Enemy, skill) => {
  const summon = skill;
  let transAnimation;
  switch (skill.prefabKey) {
    case "summon":
      transAnimation = "A_Skill_1";
      break;
    case "summonadvance":
      transAnimation = "B_Skill_1";
      break;
  }
  enemy.addSkillSet({
    name: "summon",
    cooldown: summon.cooldown,
    initCooldown: summon.initCooldown,
    priority: summon.priority,
    animateTransition: {
      transAnimation,
      isWaitTrans: true,
    },
    callback: () => {
      Global.waveManager.startExtraAction({
        key: summon.blackboard.branch_id
      });
    },
    
  })
}

const addBossSkillRide = (enemy: Enemy, skill) => {
  let idleAnimate, moveAnimate, transAnimation, rideTalentKey, endIdleAnimate, endMoveAnimate, endTransAnimation;
  switch (skill.prefabKey) {
    case "ride":
      rideTalentKey = "shield";
      idleAnimate = "A_Skill_4_Loop";
      moveAnimate = "A_Skill_4_Loop";
      transAnimation = "A_Skill_4_Begin";

      endIdleAnimate = "A_Idle";
      endMoveAnimate = "A_Move";
      endTransAnimation = "A_Skill_4_End";
      break;
    case "rideadvance":
      rideTalentKey = "shieldadvance";
      idleAnimate = "B_Skill_4_Loop";
      moveAnimate = "B_Skill_4_Loop";
      transAnimation = "B_Skill_4_Begin";

      endIdleAnimate = "B_Idle";
      endMoveAnimate = "B_Move";
      endTransAnimation = "B_Skill_4_End";
      break;
  }

  const ride = enemy.getTalent(rideTalentKey);

  const moveBuff = {
    id: "ride",
    key: "ride",
    overlay: false,
    duration:  ride ? ride.interval : 8,
    effect: [{
      attrKey: "moveSpeed",
      method: "add",
      value: ride.move_speed
    }]
  };

  enemy.addSkillSet({
    name: "ride",
    cooldown: skill.cooldown,
    initCooldown: skill.initCooldown,
    priority: skill.priority,
    animateTransition: {
      idleAnimate,
      moveAnimate,
      transAnimation,
      isWaitTrans: true,
    },
    callback: () => {
      enemy.countdown.setTimerPause("summon", true);
      enemy.countdown.setTimerPause("enemyline", true);
      enemy.countdown.setTimerPause("ride", true);
      enemy.addBuff(moveBuff)

      enemy.countdown.addCountdown({
        name: "endRide",
        initCountdown: ride ? ride.interval : 8,
        callback: () => {
          enemy.animationStateTransition({
            idleAnimate: endIdleAnimate,
            moveAnimate: endMoveAnimate,
            transAnimation: endTransAnimation,
            isWaitTrans: true,
            callback: () => {
              enemy.countdown.setTimerPause("summon", false);
              enemy.countdown.setTimerPause("enemyline", false);
              enemy.countdown.setTimerPause("ride", false);
            }
          })

        }
      })
    },
    
  })
}


//#endregion       

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
            },
            {
              attrKey: "attackSpeed",
              method: "add",
              value: rune.blackboard.find(item => item.key === "attack_speed")?.value
            },
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
    switch (enemy.key) {
      case "enemy_10104_mjcbln":
      case "enemy_10104_mjcbln_2":
        enemy.canAttack = true;
        break;
      case "enemy_1569_ldevil":       //给莫菲丝加个自伤，方便看二阶段出怪
        enemy.canReborn = true;
        const damage = enemy.attributes.maxHp * 0.005;
        enemy.countdown.addCountdown({
          name: "damageSelf",
          initCountdown: 1,
          countdown: 1,
          callback: () => {
            enemy.hp -= damage;
          }
        });
        break;
    }
  },

  handleTalent: (enemy: Enemy, talent: any) => {
    switch (talent.key) {
      case "sleep2wake":
        enemy.staticData.sp = talent.value.sp;
        enemy.staticData.sp_moon = talent.value.sp_moon;
        break;
    
      case "bigger":
        enemy.customData.size = 0;
        enemy.staticData.bigger = talent.value.value;
        break;

      case "sword":
        if(enemy.key.includes("enemy_10108_mjclun")){
          enemy.applyWay = "RANGED";
          enemy.customData.stack_cnt = 0;
          const {ability_range_forward_extend, atk, interval, max_stack_cnt} = talent.value;

          enemy.countdown.addCountdown({
            name: "mjclunAttackRange",
            initCountdown: interval,
            countdown: interval,
            callback: () => {
              if(enemy.customData.moonlight && enemy.customData.stack_cnt < 30){
                enemy.customData.stack_cnt += 1;
                enemy.addBuff({
                  id: "mjclunAttackRange",
                  key: "mjclunAttackRange",
                  overlay: false,
                  effect: [{
                    attrKey: "rangeRadius",
                    method: "add",
                    value: ability_range_forward_extend * enemy.customData.stack_cnt
                  }]
                })
              }
              
            }
          })
        }
        break;
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
      case "getchar":
        return;
        if(enemy.key.includes("enemy_10107_mjcdog")){   //安眠伴随兽
          enemy.attributes.moveSpeed = 1.6;
          const getenmey = enemy.getTalent("getenmey");
          let { range_radius, move_speed, duration, cooldown } = getenmey;
          enemy.addDetection({
            detectionRadius: range_radius,
            enemyKeys: ["enemy_10103_mjcppp", "enemy_10103_mjcppp_2","enemy_10105_mjcdol","enemy_10105_mjcdol_2"],
            duration: 0.1,
            every: false,
            callback: () => {
              if(enemy.pickUpCount !== 0) return;
              enemy.pickUp();

              enemy.addBuff({
                id: "getenmey",
                key: "getenmey",
                overlay: false,
                duration,
                effect: [{
                  attrKey: "moveSpeed",
                  method: "add",
                  value: move_speed
                }]
              })
              enemy.animationStateTransition({
                idleAnimate: "B_Idle",
                moveAnimate: "B_Move",
                transAnimation: "AtoB",
                isWaitTrans: true,
              })

              enemy.countdown.addCountdown({
                name: "dropOff",
                initCountdown: duration,
                callback: () => {
                  enemy.dropOff();
                  enemy.animationStateTransition({
                    idleAnimate: "A_Idle",
                    moveAnimate: "A_Move",
                    isWaitTrans: false,
                  })
                }
              })
            }
          })
        }
        break;
      case "summon":
        if(enemy.key === "enemy_1569_ldevil"){ //莫菲丝
          addBossSkillSummon(enemy, skill);
        }
        break;
      case "enemyline":
        if(enemy.key === "enemy_1569_ldevil"){ //莫菲丝
          addBossSkillEnemyLine(enemy, skill);
        }
        break;
      case "ride":
        if(enemy.key === "enemy_1569_ldevil"){ //莫菲丝
          addBossSkillRide(enemy, skill);
        }
        break;
    }


  },

  handleAttack: (enemy: Enemy) => {
    switch (enemy.key) {
      case "enemy_10104_mjcbln":
      case "enemy_10104_mjcbln_2":
        enemy.animationStateTransition({
          transAnimation: "Attack",
          isWaitTrans: true,
          animationScale: 0.95,
          callback: () => {
            enemy.customData.size += enemy.staticData.bigger;
            if(enemy.customData.size >= 1){
              enemy.canAttack = false;
              enemy.animationStateTransition({
                idleAnimate: "Idle_2",
                moveAnimate: "Move_2",
                transAnimation: "Takeoff",
                isWaitTrans: true,
              })
              enemy.motion = "FLY";
            }
          }
        })
        break;
    
    }
  },

  handleReborn: (enemy: Enemy) => {
    if(enemy.key === "enemy_1569_ldevil"){
      enemy.canReborn = false;
      enemy.countdown.removeCountdown("damageSelf");
      const reborn = enemy.getTalent("reborn");
      const health = 1 / (reborn.duration - 1) * enemy.attributes.maxHp;

      enemy.unMoveable = true;
      enemy.removeSkillSet("summon");
      enemy.removeSkillSet("enemyline");
      enemy.removeSkillSet("ride");

      Global.waveManager.startExtraAction({
        key: reborn.branch_id
      })
      //todo 打断当前动画
      enemy.animationStateTransition({
        idleAnimate: "A_Revive_2",
        moveAnimate: "A_Revive_2",
        transAnimation: "A_Revive_1",
        isWaitTrans: true,
      });
      
      enemy.countdown.addCountdown({
        name: "reborn",
        initCountdown: 1,
        countdown: 1,
        maxCount: reborn.duration,
        callback: (timer) => {
          enemy.hp += health;
          if(timer.count >= reborn.duration){
            enemy.animationStateTransition({
              idleAnimate: "B_Idle",
              moveAnimate: "B_Move",
              transAnimation: "A_Revive_3",
              isWaitTrans: true,
              callback: () => {
                enemy.unMoveable = false;
                addBossSkillSummon(enemy, enemy.getSkill("summonadvance"));
                addBossSkillEnemyLine(enemy, enemy.getSkill("enemylineadvance"));
                addBossSkillRide(enemy, enemy.getSkill("rideadvance"));
              }
            });
            
          }
        }
      });
    }
  },

  handleDestroy: () => {
    hasMoonlight = false;
  }
};

export default Handler;