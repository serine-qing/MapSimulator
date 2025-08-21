import Enemy from "../enemy/Enemy";

const Handler = {
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