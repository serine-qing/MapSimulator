import Tile from "../game/Tile";
import Enemy from "../enemy/Enemy";
import * as THREE from "three";
import Global from "../utilities/Global";
import { GC_Add } from "../game/GC";
import Trap from "../game/Trap";
import Handler from "./Handler";

import act1vhalfidle from "../entityHandler/次生预案";
import act35side from "./太阳甩在身后";
import act37side from "./追迹日落以西";
import act41side from "./挽歌燃烧殆尽";
import act42side from "./众生行记";
import act44side from "./墟";
import act45side from "./无忧梦呓";
import act46side from "./雪山降临1101";
import main11 from "./11章";
import main15 from "./15章";
import main16 from "./16章";
import RunesHelper from "../game/RunesHelper";

//todo 从雪山降临1101活动开始 将Handler转为实例化的类，前面的Handler就慢慢改了

class GameHandler implements Handler{
  private handlers: Handler[] = [];
  constructor(){
    this.handlers.push(new act46side());
    this.handlers.push(new main11());
    this.handlers.push(new main15());
  }

  public parseRunes(runesHelper: RunesHelper) {
    //todo 
    act42side.parseRunes(runesHelper)
    act45side.parseRunes(runesHelper)
    this.handlers.forEach(handler => {
      handler.parseRunes && handler.parseRunes(runesHelper);
    })
  }

  //初始化全部Actions后执行
  public afterGameInit() {
    act42side.afterGameInit();
    act45side.afterGameInit();
    act1vhalfidle.afterGameInit();
  }

  public beforeGameInit () {
    
  }

  handleTileInit (tile: Tile) {
    this.handlers.forEach(handler => {
      handler.handleTileInit && handler.handleTileInit(tile);
    })
  }

  afterGameUpdate () {
    this.handlers.forEach(handler => {
      handler.afterGameUpdate && handler.afterGameUpdate();
    })
  }

  afterGameViewInit () {
    this.handlers.forEach(handler => {
      handler.afterGameViewInit && handler.afterGameViewInit();
    })
  }

  afterMoveCamera () {
    main16.afterMoveCamera();
  }

  checkActionDatas (actionDatas: ActionData[]) {
    this.handlers.forEach(handler => {
      handler.checkActionDatas && handler.checkActionDatas(actionDatas);
    })
  }

  handleEnemyConstructor (enemy: Enemy) {
    act37side.handleEnemyConstructor(enemy);
  }

  //劫持SpawnEnemy方法
  handleSpawnEnemy (enemy: Enemy): boolean {
    let spawnEnemy = false;
    this.handlers.forEach(handler => {
      if(handler.handleSpawnEnemy && handler.handleSpawnEnemy(enemy)){
        spawnEnemy = true;
      }
    })
    return spawnEnemy;
  }

  handleEnemyStart (enemy: Enemy) {
    act37side.handleEnemyStart(enemy);
    act41side.handleEnemyStart(enemy);
    act42side.handleEnemyStart(enemy);
    act44side.handleEnemyStart(enemy);
    act45side.handleEnemyStart(enemy);
    main16.handleEnemyStart(enemy);

    this.handlers.forEach(handler => {
      handler.handleEnemyStart && handler.handleEnemyStart(enemy);
    })

    switch (enemy.key) {
      case "enemy_1334_ristar":   //行星碎屑
        enemy.unMoveable = false;
        enemy.cantFinished = true;
        break;
      case "enemy_10082_mpweak": //弱化节点
        enemy.unMoveable = true;
        break;
      case "enemy_1367_dseed":  //血泊
        enemy.unMoveable = true;
        enemy.notCountInTotal = true;
        break;
      case "enemy_1432_lrccon":  //茧缚
      case "enemy_1432_lrccon_2":
        enemy.dontBlockWave = true;
        break;
      case "enemy_1554_lrtsia":  //特雷西娅
        enemy.notCountInTotal = true;
        enemy.dontBlockWave = true;
        enemy.unMoveable = true;
        break
    }

    //判断是否是近地悬浮
    const abilityList = enemy.enemyData.abilityList;

    let roadFly = "近地悬浮"
    switch (localStorage.currentLang) {
      case "JP":
        roadFly = "低空浮揚"
        break;
      case "EN":
        roadFly = "Low-Altitude Hovering";
        break;
      case "KR":
        roadFly = "공중 부양";
        break;
    }

    if(abilityList && Array.isArray(abilityList)){
      //YJ数据里面的空abilityList 有的是数组 有的是对象
      const find = abilityList.find(ability => {
        return ability.text?.replace(/<[^>]*>/g, "") === roadFly;
      });

      if(find){
        enemy.nearFly = true;
      }
    }
  }

  handleTalent (enemy: Enemy, talent: any) {
    act35side.handleTalent(enemy, talent);
    act42side.handleTalent(enemy, talent);
    act44side.handleTalent(enemy, talent);
    act45side.handleTalent(enemy, talent);
    const {move_speed, interval, duration, trig_cnt, unmove_duration, range_radius} = talent.value;
    let waitTime;

    switch (talent.key) {
      case "rush": //冲刺！

        if(move_speed && interval && trig_cnt){
          enemy.countdown.addCountdown({
            name: "rush",
            initCountdown: talent.value.predelay,
            countdown: interval,
            maxCount: trig_cnt,
            callback: (timer) => {
              enemy.addBuff({
                id: "rush",
                key: "rush",
                overlay: false,
                effect: [{
                  attrKey:"moveSpeed",
                  method: "mul",
                  value: timer.count * move_speed + 1
                }]
              });
            }
          })
        }
        
        break;
      case "revive":   //萨卡兹魔剑士、恶咒者
      case "sleepwalking": //钵海收割者
        if( unmove_duration ){
          enemy.countdown.addCountdown({
            name: "checkPoint",
            initCountdown: unmove_duration
          });
        }
        break;
      case "wait": //念旧
      case "sleep": //驮兽
        waitTime = duration || interval;
        if( waitTime ){
          enemy.countdown.addCountdown({
            name: "checkPoint",
            initCountdown: waitTime,
            callback: () => {
              switch (enemy.key) {
                //念旧
                case "enemy_10057_cjstel":
                case "enemy_10057_cjstel_2":
                  enemy.animationStateTransition({
                    idleAnimate: "Idle_b",
                    moveAnimate: "Move",
                    transAnimation: "Takeoff",
                    isWaitTrans: true,
                  })
                  enemy.motion = "FLY";
                  break;
              }
            }
          });
        }


        break;
      case "timeup":  //prts 岁相等
        waitTime = duration || interval;
        if(waitTime){
          enemy.countdown.addCountdown({
            name: "end",
            initCountdown: waitTime - Global.waveManager.gameSecond,
            callback: () => {
              enemy.finishedMap();
            }
          });
        }
          
        break;
      case "strength":     //传令兵，爱国者
        if(
          enemy.key === "enemy_1080_sotidp" || 
          enemy.key === "enemy_1080_sotidp_2" ||
          enemy.key === "enemy_1506_patrt"
        ){
          Global.buffManager.addAura({
            id: "strength" + enemy.id,
            key: "strength",
            enemy: ["enemy_1078_sotisc","enemy_1078_sotisc_2"],
            effect:[{
              attrKey: "moveSpeed",
              method: "mul",
              value: 1.3
            }]
          })
        }
        break;
      case "bleed":       //随时间掉血
        const { damage } = talent.value;
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

  handleSkill (enemy: Enemy, skill: any) {
    act35side.handleSkill(enemy, skill);
    act42side.handleSkill(enemy, skill);
    act44side.handleSkill(enemy, skill);
    act45side.handleSkill(enemy, skill);
    this.handlers.forEach(handler => {
      handler.handleSkill && handler.handleSkill(enemy, skill);
    })

    const { initCooldown, cooldown } =  skill;

    switch (skill.prefabKey) {
      case "doom":
      case "suicide":
        if(enemy.key === "enemy_1554_lrtsia") return; //特蕾西娅
        if(enemy.key === "enemy_1574_xdagt") return;  //披挂冰雪的少女
        let cd = initCooldown;
        if(enemy.key === "enemy_1521_dslily"){
          
          //昆图斯需要加上前两个阶段的时间
          const growup1 = enemy.getTalent("growup1");
          const growup2 = enemy.getTalent("growup2");
          cd += growup1.interval + growup2.interval;
        }
        enemy.countdown.addCountdown({
          name: "end",
          initCountdown: cd,
          callback: () => {
            enemy.finishedMap();
          }
        })
        break;

    }
  }

  handleChangeCheckPoint(enemy: Enemy, oldCP: CheckPoint, newCP: CheckPoint) {
    this.handlers.forEach(handler => {
      handler.handleChangeCheckPoint && handler.handleChangeCheckPoint(enemy, oldCP, newCP);
    })
  }

  handleEnemyWait(enemy: Enemy, waitTime: number) {
    this.handlers.forEach(handler => {
      handler.handleEnemyWait && handler.handleEnemyWait(enemy, waitTime);
    })
  }

  handleEnemyWaitFinish(enemy: Enemy, waitTime: number) {
    this.handlers.forEach(handler => {
      handler.handleEnemyWaitFinish && handler.handleEnemyWaitFinish(enemy, waitTime);
    })
  }

  handlePickUp (enemy: Enemy, vehicle: Enemy) {
    act45side.handlePickUp(enemy, vehicle);
  }

  handleDropOff (enemy: Enemy, vehicle: Enemy) {
    act45side.handleDropOff(enemy, vehicle);
  }

  handleAttack(enemy: Enemy) {
    act45side.handleAttack(enemy);
  }

  handleEnemyUnbalanceMove(enemy: Enemy){
    this.handlers.forEach(handler => {
      handler.handleEnemyUnbalanceMove && handler.handleEnemyUnbalanceMove(enemy);
    })
  }

  handleEnemyBoundCrash(enemy: Enemy, tile: Tile){
    this.handlers.forEach(handler => {
      handler.handleEnemyBoundCrash && handler.handleEnemyBoundCrash(enemy, tile);
    })
  }

  finishedMap (enemy: Enemy) {
    enemy.talents?.forEach(talent => {
      switch (talent.key) {
        case "strength":       //传令兵
          if(
            enemy.key === "enemy_1080_sotidp" || 
            enemy.key === "enemy_1080_sotidp_2" ||
            enemy.key === "enemy_1506_patrt"
          ){
            Global.buffManager.removeAura("strength" + enemy.id);
          }
          break;
      }
    })
  }

  handleReborn (enemy: Enemy) {
    act45side.handleReborn(enemy);
  }

  handleDie (enemy: Enemy) {
    this.handlers.forEach(handler => {
      handler.handleDie && handler.handleDie(enemy);
    })
    act35side.handleDie(enemy);
  }

  handleEnemySet (enemy: Enemy, state) {

  }

  handleTrapStart (trap: Trap) {
    act42side.handleTrapStart(trap);
    act44side.handleTrapStart(trap);
    act45side.handleTrapStart(trap);

    this.handlers.forEach(handler => {
      handler.handleTrapStart && handler.handleTrapStart(trap);
    })
  }

  handleInitTrapSkill (trap: Trap) {
    switch (trap.key) {
      //土石结构的壳
      case "trap_032_mound":
        if(trap.mainSkillLvl === 1){
          const skin = trap.fbxMesh.children[1];
          trap.fbxMesh.remove(skin);
          GC_Add(skin);
        }
        break;
    }
  }
}

export default GameHandler;