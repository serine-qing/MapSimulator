import Enemy from "../enemy/Enemy";

const Handler = {
  handleTalent: (enemy: Enemy, talent: any) => {
    const {duration, range_radius} = talent.value;
    switch (talent.key) {
      case "endhole":  //土遁忍者
        enemy.idleAnimate = "Invisible";
        enemy.changeAnimation();
        const firstCP = enemy.route.checkpoints[0];
        if(firstCP.type === "WAIT_FOR_SECONDS"){
          firstCP.time = Math.max(0 , firstCP.time - duration);
        }

        enemy.addSkill({
          name: "checkPoint",
          animateTransition: {
            moveAnimate: "Move",
            idleAnimate: "Idle",
            transAnimation: "Start",
            animationScale: 4.54,
            isWaitTrans: true
          },
          initCooldown: duration
        })

        break;

      case "ymgholjumptrigger": //雷遁忍者遇到伪装的土遁忍者触发跳跃
        enemy.addDetection({
          detectionRadius: range_radius,
          enemyKeys: ["enemy_10115_ymghol","enemy_10115_ymghol_2"],
          duration: 0.1,
          every: false,
          callback: (ymghol: Enemy) => {
            if(ymghol.idleAnimate === "Invisible"){
              enemy.triggerSkill("jump");
            }
          }
        })
        break;
      case "holetiletrigger": //雷遁忍者遇到坑触发跳跃
        enemy.addDetection({
          detectionRadius: range_radius,
          tileKeys: ["tile_hole"],
          duration: 0.1,
          every: false,
          callback: () => {
            enemy.triggerSkill("jump");
          }
        })
      
      break;
    }
  },

  handleSkill: (enemy: Enemy, skill: any) => {
    const { initCooldown, cooldown } =  skill;

    switch (skill.prefabKey) {
      case "switchmodetrigger":
        if(enemy.key === "enemy_10116_ymgtop" || enemy.key === "enemy_10116_ymgtop_2"){ //水遁忍者

          enemy.addSkill({
            name: "switchmodetrigger",
            animateTransition: {
              moveAnimate: "Skill_Loop",
              idleAnimate: "Skill_Loop",
              transAnimation: "Skill_Begin",
              isWaitTrans: true
            },
            initCooldown,
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
                  animationScale: 2.86,
                  isWaitTrans: true
                });
                enemy.removeWatcher("takeoff");
                enemy.motion = "FLY";
              }
            }
          });
        }
        break;
      
      case "jump":  //雷遁忍者
        const jumpspeedup = enemy.talents.find(talent =>  talent.key === "jumpspeedup")?.value?.move_speed;

        enemy.addSkill({
          name: "jump",
          animateTransition: {
            transAnimation: "Jump",
            startLag: 0.33,
            endLag: 0.33,
            isWaitTrans: false,
            callback: () => {
              enemy.motion = "WALK";
            }
          },
          initCooldown,
          cooldown,
          trigger: "manual",
          callback: () => {
            enemy.motion = "FLY";
            enemy.addBuff({
              id: "jumpspeedup",
              key: "jumpspeedup",
              overlay: false,
              duration: 2,
              effect: [{
                attrKey: "moveSpeed",
                method: "mul",
                value: jumpspeedup ? jumpspeedup : 3
              }]
            })
          }
        })

        break;
    }
  }
};

export default Handler;