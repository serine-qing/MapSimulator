import { CheckPoint } from "@/type";
import Enemy from "../enemy/Enemy";
import type Handler from "./Handler";

class act24side implements Handler{
  private checkPointIndex: number | null = null;
  private wakeupTime: number | null = null;

  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_1537_mhrors":  //火龙
        enemy.dontBlockWave = true;
        const sleeplistener = enemy.getTalent("sleeplistener");
        const wakeup = enemy.getTalent("wakeup");
        this.checkPointIndex = sleeplistener.check_point;
        this.wakeupTime = wakeup.wakeup_delay;
        break;
    }
  }

  //进入睡眠
  handleChangeCheckPoint(enemy: Enemy, oldCP: CheckPoint, newCP: CheckPoint | null) {
    if(this.checkPointIndex && this.wakeupTime){
      switch (enemy.key) {
        case "enemy_1537_mhrors":  //火龙
          if(enemy.checkPointIndex === this.checkPointIndex){
            enemy.animationStateTransition({
              isWaitTrans: false,
              idleAnimate: "Sleep",
              moveAnimate: "Sleep"
            })
            enemy.addWaitCheckPoint({
              position: oldCP.position,
              time: this.wakeupTime,
              callback: () => {
                enemy.animationStateTransition({
                  isWaitTrans: false,
                  idleAnimate: "A_Idle",
                  moveAnimate: "A_Move"
                })
              },
              index: enemy.checkPointIndex
            })
          }
          break;
      }
    }

  }

}

export default act24side;
