import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";

//todo 还有spawn_2 spawn_3等等等等 
const Handler = {

  parseExtraWave: (branches: any, enemyDbRefs: any[]) => {
    Object.keys(branches).forEach(key => {
      let changeEnemyKey;

      //修改出怪的id
      enemyDbRefs.forEach(enemyDbRef => {
        const blackboard = enemyDbRef.overwrittenData?.talentBlackboard;
        if(blackboard){
          const find = blackboard.find(item => {
            return item.key === "spawn_1.branch_id" && item.valueStr === key;
          });
          if(find){
            changeEnemyKey = blackboard.find(item => item.key === "spawn_1.enemy_key")?.valueStr;
          }
        }
      })
      
      const branche = branches[key]?.phases;
      if(changeEnemyKey){
        branche.forEach(item => {
          item.actions.forEach(action => {
            action.key = changeEnemyKey;
          })
        });
      }

      Global.mapModel.parseExtraActions(key, branche)
    })
  },


  handleTalent: (enemy: Enemy, talent: any) => {
    switch (talent.key) {
      case "spawn_1":      //“终点”
        const {branch_id, summon_cnt, summon_interval, summon_start} = talent.value;
        const waitTime = summon_start + summon_interval * (summon_cnt - 1) + 6;
        enemy.countdown.addCountdown({
          name: "checkPoint",
          initCountdown: waitTime
        })
        enemy.countdown.addCountdown({
          name: "spawnEnemy",
          initCountdown: summon_start,
          countdown: summon_interval,
          maxCount: summon_cnt,
          callback: () => {
            Global.waveManager.startExtraAction(branch_id);
          }
        })

        break;
    }
  },

};

export default Handler;