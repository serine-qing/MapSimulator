import { BlackBoard } from "@/type/Base";
import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";
import type Handler from "./Handler";
import { getBlackBoardItem } from "../utilities/utilities";
import { Vector2 } from "three";

class main17 implements Handler{
  map1Center: Vector2 = new Vector2(0,0);
  map2Center: Vector2 = new Vector2(0,0);
  
  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_10211_murad":   //泄漏源
        enemy.dontBlockWave = true;
        break;
      case "enemy_1590_muama":  //ama
      case "enemy_1591_mutwin":  //ama异构体
      case "enemy_1591_mutwin_2":  //ama异构体2
        enemy.unMoveable = true;
        const {initCooldown, cooldown} = enemy.getSkill("blink");
        enemy.addSkill({
          name: "blink",
          initCooldown,
          cooldown,
          callback: () => {
            enemy.animationStateTransition({
              isWaitTrans: true,
              transAnimation: "Move",
              callback: () => {
                enemy.blinkToNextCheckPoint();
                enemy.animationStateTransition({
                  isWaitTrans: true,
                  transAnimation: "Start"
                })
              }
            })
          }
        })
        break;
      case "enemy_1593_musnake":  //终始
        enemy.unMoveable = true;
        const timeout = enemy.getTalent("timeout");
        if(timeout?.interval){
          enemy.addEndCountdown(timeout.interval);
        }
        break;
    }
  }
  handleFinishedMap(enemy: Enemy) {
    switch (enemy.key) {
      //模拟中异构体一起结束，之后到最终阶段
      case "enemy_1591_mutwin":  //ama异构体
        Global.waveManager.enemiesInMap.forEach(enemy => {
          enemy.hp = 0;
        })
        Global.waveManager.startExtraAction({
          key: "boss"
        })
        Global.gameManager.countdown.addCountdown({
          name: "boss_wait",
          initCountdown: 1,
          callback: () => {
            Global.gameManager.setMapPosition(this.map2Center);
          }
        })
        break;
    }
  }

  afterInitMapPosition() {
    const runesHelper = Global.mapModel.runesHelper;
    const mainline17_ctrl = runesHelper.getRunes("env_system_new", "env_v073_mainline17_ctrl");
    if(mainline17_ctrl && mainline17_ctrl[0]){
      const blackboard = mainline17_ctrl[0].blackboard;
      const map1MinX = getBlackBoardItem( "boundary_min_col_0", blackboard );
      const map1MaxX = getBlackBoardItem( "boundary_max_col_0", blackboard );
      const map1MinY = getBlackBoardItem( "boundary_min_row_0", blackboard );
      const map1MaxY = getBlackBoardItem( "boundary_max_row_0", blackboard );

      const map2MinX = getBlackBoardItem( "boundary_min_col_1", blackboard );
      const map2MaxX = getBlackBoardItem( "boundary_max_col_1", blackboard );
      const map2MinY = getBlackBoardItem( "boundary_min_row_1", blackboard );
      const map2MaxY = getBlackBoardItem( "boundary_max_row_1", blackboard );

      if(
        map1MinX !== null && 
        map1MaxX !== null && 
        map1MinY !== null && 
        map1MaxY !== null && 
        map2MinX !== null && 
        map2MaxX !== null && 
        map2MinY !== null && 
        map2MaxY !== null
      ){
        this.map1Center.set((map1MinX + map1MaxX) / 2, (map1MinY + map1MaxY) / 2);
        this.map2Center.set((map2MinX + map2MaxX) / 2, (map2MinY + map2MaxY) / 2);
        Global.gameManager.setMapPosition(this.map1Center);
      }
    }
    
    
  }
  
}

export default main17;
