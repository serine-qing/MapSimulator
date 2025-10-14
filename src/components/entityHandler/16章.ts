import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";

const Handler = {
  afterMoveCamera: () => {
    const extraWaves = Global.waveManager.extraWaves;
    const find = extraWaves["folchr_m2_route"];
    if(find){
      Global.waveManager.startExtraAction({
        key: "folchr_m2_route"
      })
    }
  },

  handleEnemyStart: (enemy: Enemy) => {
    switch (enemy.key) {
      case "enemy_1571_mirbst":  //狂躁异质裂兽
        const m0crazybonus = enemy.getTalent("m0crazybonus");
        if(m0crazybonus){ 
          enemy.addBuff({
            id: "m0crazybonus",
            key: "m0crazybonus",
            overlay: false,
            effect: [{
              attrKey: "moveSpeed",
              method: "mul",
              value: m0crazybonus.move_speed
            }]
          })
        }
        
        break;
      case "enemy_1572_folchr":  //圣愚
        const waveManager = Global.waveManager;
        if(waveManager.currentCameraView === 0) return;

        const summonfearpj = enemy.getSkill("summonfearpj");
        const branch_id = summonfearpj.blackboard.branch_id;
        enemy.addSkill({
          name: "summonfearpj",
          cooldown: summonfearpj.cooldown,
          initCooldown: summonfearpj.initCooldown,
          animateTransition:{
            transAnimation: "Skill_1",
            isWaitTrans: true,
            callback: () => {
              waveManager.startExtraAction({
                key: branch_id
              })
            }
          },
        })
        break;
    }
  }
};

export default Handler;