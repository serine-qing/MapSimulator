import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";

const Handler = {
  handleEnemyStart: (enemy: Enemy) => {
    switch (enemy.key) {
      case "enemy_1533_stmkgt":                            //最后的蒸汽骑士
        const bornweak = enemy.getTalent("bornweak");
        const boost = enemy.getSkill("boost");
        enemy.addBuff({
          id: "bornweak",
          key: "bornweak",
          overlay: false,
          effect: [{
            attrKey: "moveSpeed",
            method: "mul",
            value: 1 + bornweak.move_speed
          }]
        });

        enemy.addSkill({
          name: "boost",
          initCooldown: boost.initCooldown,
          cooldown: boost.cooldown,
          animateTransition: {
            transAnimation: "Boost_A",
            isWaitTrans: true
          },
          showSPBar: true,
          duration: boost.blackboard.boost_duration,
          callback: () => {
            enemy.removeBuff("bornweak");
            enemy.addBuff({
              id: "boost",
              key: "boost",
              overlay: false,
              duration: boost.blackboard.boost_duration,
              effect: [{
                attrKey: "moveSpeed",
                method: "mul",
                value: 1 + boost.blackboard.move_speed
              }]
            });
          },
          endCallback: () => {
            enemy.unMoveable = true;
            //animate名字不变 就会停在transAnimation动画
            enemy.animationStateTransition({
              idleAnimate: "Stun_A",
              moveAnimate: "Stun_A",
              transAnimation: "Stun_A",
              isWaitTrans: false,
            })

            enemy.countdown.addCountdown({
              name: "stun",
              initCountdown: boost.blackboard.stun,
              callback: () => {
                enemy.unMoveable = false;

                enemy.animationStateTransition({
                  idleAnimate: "Idle_A",
                  moveAnimate: "Move_A",
                  isWaitTrans: false,
                })
              }
            })
          }
        })
        break;
    }

  },

};

export default Handler;