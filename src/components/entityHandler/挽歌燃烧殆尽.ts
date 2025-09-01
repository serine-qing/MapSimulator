import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";

const ftprgSpawnEnemy = (enemy, talent) => {
  const {enemy_key, action_index, branch_id, summon_cnt, summon_interval, summon_start} = talent.value;

  enemy.countdown.addCountdown({
    name: branch_id,
    initCountdown: summon_start,
    countdown: summon_interval,
    maxCount: summon_cnt,
    callback: () => {
      Global.waveManager.startExtraAction({
        key: branch_id,
        enemyKey: enemy_key,
        actionIndex: action_index
      });
    }
  })
}

const Handler = {

  parseExtraWave: (branches: any) => {
    Object.keys(branches).forEach(key => {
      const branche = branches[key]?.phases;
      if(key.includes("prg_branch")){
        Global.mapModel.parseExtraActions(key, branche)
      }
    })

  },

  handleEnemyStart: (enemy: Enemy) => {
    switch (enemy.key) {
      case "enemy_10071_ftprg":    //“终点”
      case "enemy_10071_ftprg_2":
        let waitTime = 0;
        enemy.talents.forEach(talent => {
          
          if (talent.key.includes("spawn_")) {
            const {summon_cnt, summon_interval, summon_start} = talent.value;
            waitTime = Math.max(waitTime, summon_start + summon_interval * (summon_cnt - 1) + 5.5);

            ftprgSpawnEnemy(enemy, talent);
          }
        })

        enemy.idleAnimate = "Invisible";
        enemy.changeAnimation();

        enemy.addSkill({
          name: "checkPoint",
          animateTransition: {
            idleAnimate: "Idle",
            moveAnimate: "Move",
            transAnimation: "Start",
            isWaitTrans: true
          },
          initCooldown: waitTime
        })

        break;

    }
  },

  handleTalent: (enemy: Enemy, talent: any) => {
    
  },

};

export default Handler;