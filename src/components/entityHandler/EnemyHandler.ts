import Enemy from "../enemy/Enemy";
import { Direction } from "../utilities/Enum";
import Global from "../utilities/Global";

const handleGractrl = (enemy: Enemy, effect) => {
  if(enemy.key === "enemy_1543_cstlrs" || enemy.key === "enemy_1334_ristar") return;
  if(Math.abs(enemy.unitVector.y) < 0.45) {
    enemy.gractrlSpeed = 1;
    return;
  };
  
  const massLevel = enemy.getAttr("massLevel");
  const massDirection = effect[0].value;

  let speedMultipy = 1;
  let reverse;
  
  if(
    (enemy.unitVector.y > 0 && massDirection === Direction.UP) ||
    (enemy.unitVector.y < 0 && massDirection === Direction.DOWN)
  ){
    reverse = false;
  }else{
    reverse = true;
  }

  if(massLevel === 0){
    speedMultipy = reverse? 0.9 : 1.08;
  }else if(massLevel === 1){
    speedMultipy = reverse? 0.66 : 1.2;
  }else if(massLevel === 2){
    speedMultipy = reverse? 0.6 : 1.32;
  }else if(massLevel === 3){
    speedMultipy = reverse? 0.36 : 2.4;
  }else if(massLevel >= 4){
    speedMultipy = reverse? 0.3 : 2.64;
  }
  
  enemy.gractrlSpeed = speedMultipy; 

}

const EnemyHandler = {
  handleBirthAnimation: (enemy: Enemy) => {
    if(enemy.hasBirthAnimation){
      switch (enemy.key) {
        //压力舒缓帮手
        case "enemy_10119_ymgbxm":
        case "enemy_10119_ymgbxm_2":
          enemy.animationStateTransition({
            moveAnimate: enemy.moveAnimate,
            idleAnimate: enemy.idleAnimate,
            transAnimation: "Start",
            animationScale: 1,
            isWaitTrans: true
          })
          break;
      }
    }
  },

  handleTalent: (enemy: Enemy, talent: any) => {
    const {move_speed, interval, duration, trig_cnt, unmove_duration} = talent.value;
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
        const callback = () => {};
        if( waitTime ){
          enemy.countdown.addCountdown({
            name: "checkPoint",
            initCountdown: waitTime,
            callback: () => {
              switch (enemy.key) {
                //念旧
                case "enemy_10057_cjstel":
                case "enemy_10057_cjstel_2":
                  enemy.motion = "FLY"
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

      case "endhole":  //土遁忍者
        enemy.idleAnimate = "Invisible";
        enemy.changeAnimation();
        enemy.countdown.addCountdown({
          name: "checkPoint",
          initCountdown: duration,
          callback: () => {
            enemy.animationStateTransition({
              moveAnimate: "Move",
              idleAnimate: "Idle",
              transAnimation: "Start",
              animationScale: 0.22,
              isWaitTrans: true
            })
          }
        });

        break;
      case "strength":     //传令兵
        if(enemy.key === "enemy_1080_sotidp" || enemy.key === "enemy_1080_sotidp_2"){
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
    }
  },

  handleSkill: (enemy: Enemy, skill: any) => {
    let countdown =  skill.initCooldown;

    switch (skill.prefabKey) {
      case "doom":
        
        if(enemy.key === "enemy_1521_dslily"){
          //昆图斯需要加上前两个阶段的时间
          const growup1 = enemy.getTalent("growup1");
          const growup2 = enemy.getTalent("growup2");
          countdown += growup1.interval + growup2.interval;
        }
        enemy.countdown.addCountdown({
          name: "end",
          initCountdown: countdown,
          callback: () => {
            enemy.finishedMap();
          }
        })
        break;
      case "switchmodetrigger":
        if(enemy.key === "enemy_10116_ymgtop" || enemy.key === "enemy_10116_ymgtop_2"){ //水遁忍者

          enemy.countdown.addCountdown({
            name: "switchmodetrigger",
            initCountdown: countdown,
            callback: () => {
              enemy.animationStateTransition({
                moveAnimate: "Skill_Loop",
                idleAnimate: "Skill_Loop",
                transAnimation: "Skill_Begin",
                isWaitTrans: true
              })
            }
          })
        }
        
        break;

      case "takeoff":
        //风遁忍者
        if(enemy.key === "enemy_10117_ymggld" || enemy.key === "enemy_10117_ymggld_2"){
          enemy.addWatcher({
            name: "takeoff",
            function: () => {
              if(enemy.speedRate() >= 8){
                enemy.animationStateTransition({
                  moveAnimate: "Fly_Move",
                  idleAnimate: "Fly_Idle",
                  transAnimation: "Fly_Begin",
                  animationScale: 0.35,
                  isWaitTrans: true
                });
                enemy.removeWatcher("takeoff");
              }
            }
          });
        }
        break;
    }
  },

  finishedMap: (enemy: Enemy) => {
    enemy.talents?.forEach(talent => {
      switch (talent.key) {
        case "strength":       //传令兵
          if(enemy.key === "enemy_1080_sotidp" || enemy.key === "enemy_1080_sotidp_2"){
            Global.gameBuff.removeBuff("strength" + enemy.id);
          }
          break;
      }
    })
  },


  updateBuffAfterUnitVector: (enemy: Enemy) => {
    const globalBuffs = Global.gameBuff.globalBuffs;

    globalBuffs.forEach(buff => {
      switch (buff.key) {
        case "gractrl":
          handleGractrl(enemy, buff.effect);
          break;
      }

    })
  }
}


export default EnemyHandler;