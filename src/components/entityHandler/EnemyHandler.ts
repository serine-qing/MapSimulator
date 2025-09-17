import Enemy from "../enemy/Enemy";
import * as THREE from "three";
import Global from "../utilities/Global";
import act35side from "./太阳甩在身后";
import act41side from "./挽歌燃烧殆尽";
import act42side from "./众生行记";
import act44side from "./墟";
import act45side from "./无忧梦呓";
import main15 from "./15章";

const EnemyHandler = {
  checkActionDatas: (actionDatas: ActionData[][]) => {
    main15.checkActionDatas(actionDatas);
  },

  handleSpawnEnemy: (enemy: Enemy): boolean => {
    return main15.handleSpawnEnemy(enemy);
  },

  handleStart: (enemy: Enemy) => {
    act41side.handleEnemyStart(enemy);
    act42side.handleEnemyStart(enemy);
    act44side.handleEnemyStart(enemy);
    act45side.handleEnemyStart(enemy);
    main15.handleEnemyStart(enemy);

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
    }

    //判断是否是近地悬浮
    const abilityList = enemy.enemyData.abilityList;
    if(abilityList){
      const find = abilityList.find(ability => {
        return ability.text?.replace(/[^\u4e00-\u9fa5]/g, "") === "近地悬浮";
      });

      if(find){
        enemy.nearFly = true;
      }
    }
  },

  handleTalent: (enemy: Enemy, talent: any) => {
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
          //todo 无法覆盖到敌人 需要修改
          Global.gameBuff.addBuff({
            id: "strength" + enemy.id,
            key: "strength",
            applyType: "all",
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
  },

  handleSkill: (enemy: Enemy, skill: any) => {
    act35side.handleSkill(enemy, skill);
    act42side.handleSkill(enemy, skill);
    act44side.handleSkill(enemy, skill);
    act45side.handleSkill(enemy, skill);

    const { initCooldown, cooldown } =  skill;

    switch (skill.prefabKey) {
      case "doom":
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
  },

  handleChangeCheckPoint: (enemy: Enemy) => {
  },

  handlePickUp: (enemy: Enemy, vehicle: Enemy) => {
    act45side.handlePickUp(enemy, vehicle);
  },

  handleDropOff: (enemy: Enemy, vehicle: Enemy) => {
    act45side.handleDropOff(enemy, vehicle);
  },

  handleAttack:(enemy: Enemy) => {
    act45side.handleAttack(enemy);
  },

  finishedMap: (enemy: Enemy) => {
    enemy.talents?.forEach(talent => {
      switch (talent.key) {
        case "strength":       //传令兵
          if(
            enemy.key === "enemy_1080_sotidp" || 
            enemy.key === "enemy_1080_sotidp_2" ||
            enemy.key === "enemy_1506_patrt"
          ){
            Global.gameBuff.removeBuff("strength" + enemy.id);
          }
          break;
      }
    })
  },

  handleReborn: (enemy: Enemy) => {
    act45side.handleReborn(enemy);
  },

  handleDie: (enemy: Enemy) => {
    act35side.handleDie(enemy);
  },

  handleEnemySet: (enemy: Enemy, state) => {

  }
}


export default EnemyHandler;