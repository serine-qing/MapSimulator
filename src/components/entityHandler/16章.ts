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
        if(waveManager.currentCameraView === 0){
          //一阶段boss不计入击杀
          enemy.notCountInTotal = true;
          return;
        }
        enemy.isExtra = false;
        const summonfearpj = enemy.getSkill("summonfearpj");
        const branch_id = summonfearpj.blackboard.branch_id;
        const summonLength = waveManager.getExtraWave(branch_id)?.length;
        enemy.customData.summonIndex = 0;
        enemy.addSkill({
          name: "summonfearpj",
          cooldown: summonfearpj.cooldown,
          initCooldown: summonfearpj.initCooldown,
          animateTransition:{
            transAnimation: "Skill_1",
            isWaitTrans: true,
            callback: () => {
              enemy.customData.summonIndex = enemy.customData.summonIndex % summonLength;

              waveManager.startExtraAction({
                key: branch_id,
                fragmentIndex: enemy.customData.summonIndex
              })
              enemy.customData.summonIndex ++;
            }
          },
        })
        break;
    }
  }
};

export default Handler;