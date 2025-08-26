import Enemy from "../enemy/Enemy";
import Trap from "../game/Trap";
import Global from "../utilities/Global";

const Handler = {
  parseExtraWave: (trapDatas: trapData[], branches: any) => {
    trapDatas.forEach(trapData => {
      switch (trapData.key) {
        case "trap_250_hlctrl":
          const brancheData = branches?.popeRoute?.phases[0]?.actions;
          if(brancheData){
            trapData.customData.extraKeys = [];

            brancheData.forEach((branche, index) => {
              const key = `phase${index}`;
              trapData.customData.extraKeys.push(key);
              Global.mapModel.parseExtraActions(key ,[
                {
                  preDelay: 0,
                  actions: [branche]
                }
              ])
            })
          }

          break;
      }
    })
  },

  handleTrapStart: (trap: Trap) => {
    switch (trap.key) {
      //寻根圣事 绑定事件
      case "trap_250_hlctrl":
        //todo 继续工作
        //寻根圣事 开启下一boss波次
        trap['ShownNextTile'] = () => {
          Global.waveManager.startExtraAction(trap.customData.extraKeys[0]);
          console.log(324243)
        };
        break;
    }
  },


  handleTalent: (enemy: Enemy, talent: any) => {

    const {duration, range_radius} = talent.value;
    // switch (talent.key) {
    //   case "":
    //     console.log(enemy)
    //     break;
    // }
  },

  handleSkill: (enemy: Enemy, skill: any) => {
    const { initCooldown, cooldown } =  skill;
    switch (skill.prefabKey) {
      case "foreverenhance":
        const skilltrigger = enemy.getTalent("skilltrigger");
        const move_speed_add = skill.blackboard.move_speed_add;
        const atk_add = skill.blackboard.atk_add;
        enemy.addSkill({
          name: "foreverenhance",
          animateTransition: {
            transAnimation: "Skill",
            isWaitTrans: true
          },
          initCooldown: skilltrigger.interval,
          cooldown: skilltrigger.interval,
          maxCount: skilltrigger.max_stack_cnt,
          cooldownStop: false,
          callback: (timer) => {
            enemy.addBuff({
              id: "attributestorage",
              key: "attributestorage",
              overlay: false,
              effect: [
                {
                  attrKey: "moveSpeed",
                  method: "mul",
                  value: 1 + timer.count * move_speed_add
                },
                {
                  attrKey: "atk",
                  method: "mul",
                  value: 1 + timer.count * atk_add
                }
              ]
            })
          }
        })
        break;
      
      case "rangeheal":

        enemy.addSkill({
          name: "rangeheal",
          animateTransition: {
            transAnimation: "Skill",
            isWaitTrans: true,
            animationScale: 1
          },
          initCooldown,
          cooldown
        })
        break;
    }
  }
};

export default Handler;