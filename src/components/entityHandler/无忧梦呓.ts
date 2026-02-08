import { Vector2 } from "three";
import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";
import Tile from "../game/Tile";
import Trap from "../game/Trap";
import DataObject from "../enemy/DataObject";
import RunesHelper from "../game/RunesHelper";
import type { Buff, Vec2 } from "@/type";
import type Handler from "./Handler";

class act45side implements Handler{
  private direction: string = "";
  private duration: number = 0;
  private cw: number = 0;
  private moonlight_gbuff: Buff = { id: "", key: "", overlay: false, effect: [] };

  private addMoonlight(obj: DataObject) {
    const enemy = obj as Enemy;
    if(enemy.isEnemy){
      enemy.addBuff(this.moonlight_gbuff);
      enemy.customData.moonlight = true;
      const spMoon = enemy.staticData.sp_moon;
      if(spMoon){
        const wakeSkill = enemy.getSkillState("wakeup");
        if(wakeSkill){
          wakeSkill.spSpeed = spMoon;
        }
      }
    }else{
      const trap = obj as Trap;
      const spMoon = trap.staticData.sp_moon;
      if(spMoon){
        const spawnSkill = trap.getSkillState("spawn");
        if(spawnSkill){
          spawnSkill.spSpeed = spMoon;
        }
      }
    }
  }

  private removeMoonlight(obj: DataObject) {
    const enemy = obj as Enemy;
    if(enemy.isEnemy){
      enemy.removeBuff("moonlight_gbuff");
      enemy.customData.moonlight = false;
      const sp = enemy.staticData.sp;
      if(sp){
        const wakeSkill = enemy.getSkillState("wakeup");
        if(wakeSkill){
          wakeSkill.spSpeed = sp;
        }
      }
    }else{
      const trap = obj as Trap;
      const sp = trap.staticData.sp;
      if(sp){
        const spawnSkill = trap.getSkillState("spawn");
        if(spawnSkill){
          spawnSkill.spSpeed = sp;
        }
      }
    }
  }

  private addTileEvent(position: Vector2) {
    Global.tileManager.addEvent({
      key: "moonlight",
      type: "in",
      isMerge: true,
      trap: ["trap_249_mjcsdw","trap_249_mjcsdw_2"],
      x: position.x,
      y: position.y,
      callback: this.addMoonlight.bind(this)
    })

    Global.tileManager.addEvent({
      key: "moonlight",
      type: "out",
      trap: ["trap_249_mjcsdw","trap_249_mjcsdw_2"],
      x: position.x,
      y: position.y,
      callback: this.removeMoonlight.bind(this)
    })
  }

  private removeTileEvent(position: Vector2) {
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

  private getShadowRect(position: Vector2 | Vec2, direction: string): Tile[] {
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

  private addShadows(position: Vector2 | Vec2, direction: string) {
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

    const rect = this.getShadowRect( {x, y}, direction);

    rect.forEach(tile => {
      tile.addDynamicTexture("moonlight_shadow", "moonlight_shadow");
      this.removeTileEvent(tile.position);
    })
  }

  private removeShadows(position: Vector2 | Vec2, direction: string) {
    const rect = this.getShadowRect(position, direction);

    rect.forEach(tile => {
        tile.removeDynamicTexture("moonlight_shadow");
        this.addTileEvent(tile.position);
    })
  }

  private canSleep(enemy: Enemy): boolean {
    if(
      enemy.key.includes("enemy_10103_mjcppp") ||
      enemy.key.includes("enemy_10105_mjcdol")
    ){
      return true;
    }
    return false;
  }

  private addBossSkillEnemyLine(enemy: Enemy, skill: any) {
    let transAnimation;
    switch (skill.prefabKey) {
      case "enemyline":
        transAnimation = "A_Skill_3";
        break;
      case "enemylineadvance":
        transAnimation = "B_Skill_3";
        break;
    }
    enemy.addSkill({
      name: "enemyline",
      cooldown: skill.cooldown,
      initCooldown: skill.initCooldown,
      priority: skill.priority,
      animateTransition: {
        transAnimation,
        isWaitTrans: true,
        animationScale: 1.8
      }
    })
  }

  private addBossSkillSummon(enemy: Enemy, skill: any) {
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
    const randomFragment = enemy.level !== 0;

    enemy.addSkill({
      name: "summon",
      cooldown: summon.cooldown,
      initCooldown: summon.initCooldown,
      priority: summon.priority,
      animateTransition: {
        transAnimation,
        isWaitTrans: true,
      },
      callback: () => {
        const options = {
          key: summon.blackboard.branch_id,
          fragmentIndex: null
        };

        if(randomFragment) options.fragmentIndex = Global.seededRandom.nextInt(0, 9);
        Global.waveManager.startExtraAction(options);
      },
    })
  }

  private addBossSkillRide(enemy: Enemy, skill: any) {
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

    const moveBuff: Buff = {
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

    enemy.addSkill({
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
        enemy.countdown.stopCountdown("summon");
        enemy.countdown.stopCountdown("enemyline");
        enemy.countdown.stopCountdown("ride");
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
                enemy.countdown.startCountdown("summon");
                enemy.countdown.startCountdown("enemyline");
                enemy.countdown.startCountdown("ride");
              }
            })

          }
        })
      },
    })
  }

  parseRunes(runesHelper: RunesHelper) {
    const staticData = Global.gameManager.staticData;
    const mapModel = Global.mapModel;

    const moonlightRune = runesHelper.getRunes("env_system_new", "env_034_act45side_light")[0];

    //月光机制
    if(moonlightRune){
      staticData.hasMoonlight = true;
      this.direction = runesHelper.getBlackboard(moonlightRune, "direction")?.toLowerCase();
      this.duration = runesHelper.getBlackboard(moonlightRune, "duration");
      this.cw = runesHelper.getBlackboard(moonlightRune, "cw");
      mapModel.addExtraDescription({
        text: `月光切换间隔：${this.duration}秒，切换方向：${this.cw === 1 ? "顺时针" : "逆时针"}`,
      })
    }

    let desc = "";

    const gbuffRune = runesHelper.getRunes("env_gbuff_new", "act45side_enemy_global_buff")[0];
    if(gbuffRune){
      const moveSpeed = runesHelper.getBlackboard(gbuffRune, "move_speed");
      const attackSpeed = runesHelper.getBlackboard(gbuffRune, "attack_speed");
      this.moonlight_gbuff = {
        id: "moonlight_gbuff",
        key: "moonlight_gbuff",
        overlay: false,
        effect: [
          {
            attrKey: "moveSpeed",
            method: "add",
            value: moveSpeed
          },
          {
            attrKey: "attackSpeed",
            method: "add",
            value: attackSpeed
          },
        ]
      }

      desc += `月光下敌人移动速度+${moveSpeed}，攻击速度+${attackSpeed}%`;
    }

    const charbuffRune = runesHelper.getRunes("env_gbuff_new", "act45side_ally_global_buff")[0];
    if(charbuffRune){
      const attackSpeed = runesHelper.getBlackboard(charbuffRune, "attack_speed");
      desc += `；我方干员攻击速度+${attackSpeed}%`
    }

    desc !== "" && mapModel.addExtraDescription({
      text: desc,
      color: "#d22d2dcc"
    })
  }

  parseExtraWave(branches: any) {
    Object.keys(branches).forEach(key => {
      if(key.includes("ldevil_")){
        Global.mapModel.parseExtraActions(key, branches[key].phases)
      }
    });
  }

  afterGameInit() {
    if(!Global.gameManager.staticData.hasMoonlight) return;
    const gameManager = Global.gameManager;
    gameManager.customData.moonlightDire = this.direction;
    gameManager.staticData.cw = this.cw;

    Global.tileManager.flatTiles.forEach(tile => {
      this.addTileEvent(tile.position);
    })

    Global.trapManager.traps.forEach(trap => {
      this.addShadows(trap.position, this.direction);
    })

    gameManager.countdown.addCountdown({
        name: "turnMoonlight",
        initCountdown: this.duration,
        countdown: this.duration,
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
            this.removeShadows(trap.position, beforeDire)
          })

          Global.trapManager.traps.forEach(trap => {
            this.addShadows(trap.position, currentDire);
          })

        }
      })
  }

  handleTrapStart(trap: Trap) {
    if(trap.key === "trap_249_mjcsdw"){
      const branch_id = trap.getSkillBoard("branch_id");

      const action = Global.mapModel.extraWaves.find(data => data.key === branch_id)?.actionDatas[0][0];
      const enemyKey = action?.enemyData?.key;
      const isEX = enemyKey === "enemy_10110_mjcsdw_2";

      if(branch_id){
        const sp = trap.getSkillBoard("sp");
        trap.staticData.sp = sp;
        trap.staticData.sp_moon = sp + trap.getSkillBoard("sp_moon");

        trap.addSkill({
          name: "spawn",
          initCooldown: 0,
          initSp: 0,
          spCost: 999,
          spSpeed: sp,
          spPlusBySecond: true,
          maxCount: 1,
          showSPBar: true,
          callback: () => {
            if (isEX) {
              Global.waveManager.startExtraAction({
                key: branch_id
              });
            } else {
              trap.countdown.addCountdown({
                name: "spawnDelay",
                initCountdown: 3,
                callback: () => {
                  Global.waveManager.startExtraAction({
                    key: branch_id
                  });
                }
              });
            }
          },
        })
      }
    }
  }

  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_10103_mjcppp":
      case "enemy_10104_mjcbln":
      case "enemy_10105_mjcdol":
      case "enemy_10107_mjcdog":
      case "enemy_10108_mjclun":
      case "enemy_10110_mjcsdw":
      case "enemy_10103_mjcppp_2":
      case "enemy_10104_mjcbln_2":
      case "enemy_10105_mjcdol_2":
      case "enemy_10107_mjcdog_2":
      case "enemy_10108_mjclun_2":
      case "enemy_10110_mjcsdw_2":
        enemy.startAnimate = "Start";
        break;
    }
    switch (enemy.key) {
      case "enemy_10104_mjcbln":
      case "enemy_10104_mjcbln_2":
        enemy.canAttack = true;
        break;
      case "enemy_1569_ldevil":
        enemy.canReborn = true;
        const damage = enemy.attributes.maxHp * ( enemy.enemyData.level === 0? 0.01 : 0.015);
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
  }

  handleTalent(enemy: Enemy, talent: any) {
    switch (talent.key) {
      case "sleep2wake":
        enemy.staticData.sp = talent.value.sp;
        enemy.staticData.sp_moon = talent.value.sp + talent.value.sp_moon;
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
  }

  handleSkill(enemy: Enemy, skill: any) {
    switch (skill.prefabKey) {
      case "wakeup":
        if( this.canSleep(enemy) ){
          let idleAnimate, moveAnimate, activeIdleAnimate, activeMoveAnimate, awakeTransAnim, sleepTransAnim;

          switch (enemy.key) {
            case "enemy_10103_mjcppp":
            case "enemy_10103_mjcppp_2":
              idleAnimate = "Idle_B";
              moveAnimate = "Move_B";
              activeIdleAnimate = "Idle_A";
              activeMoveAnimate = "Move_A";
              awakeTransAnim = "Revive";
              break;
            case "enemy_10105_mjcdol":
            case "enemy_10105_mjcdol_2":
              idleAnimate = "A_Idle";
              moveAnimate = "A_Move";
              activeIdleAnimate = "B_Idle";
              activeMoveAnimate = "B_Move";
              awakeTransAnim = "AtoB";
              sleepTransAnim = "BtoA"
              break;
          }

          const sleep2wake = enemy.getTalent("sleep2wake");
          const wake2sleep = enemy.getTalent("wake2sleep");
          const unmoveTime = sleep2wake?.unmove;
          const defaultSpeed = enemy.attributes.moveSpeed;
          const moveSpeed = wake2sleep.move_speed || 1;

          enemy.idleAnimate = idleAnimate;
          enemy.moveAnimate = moveAnimate;

          const sleepCountdown = () => {
            enemy.customData.isSleep = true;
            if(unmoveTime){
              enemy.idle();
              enemy.unMoveable = true;
              enemy.countdown.addCountdown({
                name: "unmove",
                initCountdown: unmoveTime,
                callback: () => {
                  enemy.unMoveable = false;
                }
              })
            }
          }

          sleepCountdown();

          enemy.addSkill({
            name: "wakeup",
            initSp: 0,
            spCost: skill.spCost,
            spSpeed: sleep2wake.sp,
            spPlusBySecond: true,
            showSPBar: true,
            eternal: true,
            maxCount: 1,
            callback: () => {
              enemy.countdown.removeCountdown("unmove");
              enemy.animationStateTransition({
                idleAnimate: activeIdleAnimate,
                moveAnimate: activeMoveAnimate,
                transAnimation: awakeTransAnim,
                isWaitTrans: true
              });
              enemy.customData.isSleep = false;
              enemy.unMoveable = false;
              enemy.attributes.moveSpeed = moveSpeed;

              enemy.countdown.addCountdown({
                name: "wake2sleep",
                initCountdown: wake2sleep.duration,
                callback: () => {
                  enemy.attributes.moveSpeed = defaultSpeed;
                  sleepCountdown();
                  enemy.animationStateTransition({
                    idleAnimate,
                    moveAnimate,
                    transAnimation: sleepTransAnim,
                    isWaitTrans: true
                  });
                  enemy.reStartSkill("wakeup");
                }
              });
            },
          })
        }
        break;
      case "getchar":
        if(enemy.key.includes("enemy_10107_mjcdog")){
          enemy.dropOffRandomOffset = 0.4;
          enemy.maxPickUpCount = 1;
          const getenmey = enemy.getTalent("getenmey");
          let { range_radius, move_speed, duration, cooldown } = getenmey;

          enemy.addSkill({
            name: "getenmey",
            initCooldown: 0,
            cooldown: cooldown + duration,
            autoTrigger: false,
            animateTransition: {
              idleAnimate: "B_Idle",
              moveAnimate: "B_Move",
              transAnimation: "AtoB",
              isWaitTrans: true,
            },
            callback: (timer, find) => {
              enemy.pickUp(find);
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
              });

              enemy.countdown.addCountdown({
                name: "dropOff",
                initCountdown: duration,
                callback: () => {
                  enemy.dropOff();
                  enemy.animationStateTransition({
                    idleAnimate: "A_Idle",
                    moveAnimate: "A_Move",
                    isWaitTrans: false,
                  });
                }
              });
            },
          })

          enemy.addDetection({
            key: "getenmey",
            detectionRadius: range_radius,
            enemyKeys: ["enemy_10103_mjcppp", "enemy_10103_mjcppp_2","enemy_10105_mjcdol","enemy_10105_mjcdol_2"],
            duration: 0,
            every: false,
            callback: (find: Enemy) => {
              if(enemy.isFullyLoaded()) return;
              if(find.customData.isSleep){
                enemy.triggerSkill("getenmey", find);
              }
            }
          })
        }
        break;
      case "summon":
        if(enemy.key === "enemy_1569_ldevil"){
          this.addBossSkillSummon(enemy, skill);
        }
        break;
      case "enemyline":
        if(enemy.key === "enemy_1569_ldevil"){
          this.addBossSkillEnemyLine(enemy, skill);
        }
        break;
      case "ride":
        if(enemy.key === "enemy_1569_ldevil"){
          this.addBossSkillRide(enemy, skill);
        }
        break;
    }
  }

  handlePickUp(enemy: Enemy, vehicle: Enemy) {
    if(this.canSleep(enemy)){
      enemy.stopSkill("wakeup");
    }
  }

  handleDropOff(enemy: Enemy, vehicle: Enemy) {
    if(this.canSleep(enemy)){
      enemy.startSkill("wakeup");
    }
  }

  handleAttack(enemy: Enemy) {
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
              enemy.nearFly = true;
            }
          }
        })
        break;
    }
  }

  handleReborn(enemy: Enemy) {
    if(enemy.key === "enemy_1569_ldevil"){
      enemy.canReborn = false;
      enemy.countdown.removeCountdown("damageSelf");
      enemy.countdown.removeCountdown("endRide");
      enemy.countdown.startCountdown("summon");
      enemy.countdown.startCountdown("enemyline");
      enemy.countdown.startCountdown("ride");

      const reborn = enemy.getTalent("reborn");
      const health = 1 / (reborn.duration - 1) * enemy.attributes.maxHp;

      enemy.unMoveable = true;
      enemy.removeSkill("summon");
      enemy.removeSkill("enemyline");
      enemy.removeSkill("ride");

      Global.waveManager.startExtraAction({
        key: reborn.branch_id
      })

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
                this.addBossSkillSummon(enemy, enemy.getSkill("summonadvance"));
                this.addBossSkillEnemyLine(enemy, enemy.getSkill("enemylineadvance"));
                this.addBossSkillRide(enemy, enemy.getSkill("rideadvance"));
              }
            });
          }
        }
      });
    }
  }
}

export default act45side;
