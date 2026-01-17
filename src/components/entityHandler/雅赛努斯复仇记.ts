import Enemy from "../enemy/Enemy";
import Tile from "../game/Tile";
import GameConfig from "../utilities/GameConfig";
import Global from "../utilities/Global";
import type Handler from "./Handler";

class act48side implements Handler{
  private usedTiles: Tile[] = [];

  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_10158_mnzeno":             //小兵
      case "enemy_10158_mnzeno_2":
        const rush = enemy.getTalent("speed");
        const moveSpeedAdd = 0.1;
        const maxCount =  rush.value / moveSpeedAdd;
        enemy.rush(0, rush.interval, maxCount, moveSpeedAdd);
        break;
      case "enemy_10157_mnggyl":             //疑问的雕像
      case "enemy_10157_mnggyl_2":
        const suiside = enemy.getTalent("suiside");
        enemy.setZOffset(-GameConfig.TILE_SIZE + 1);
        enemy.addDetection({
          key: "mnggyl",
          detectionRadius: 0.05,
          duration: 0,
          every: false,
          tileKeys: ["tile_act48side"],
          callback: (tile: Tile) => {
            console.log(tile)
            const index = this.usedTiles.findIndex(t => t === tile);
            if(index > -1) return;

            enemy.removeDetection("mnggyl");
            this.usedTiles.push(tile);
            enemy.setZOffset(-GameConfig.TILE_SIZE);
            enemy.unMoveable = true;
            enemy.dontBlockWave = true;
            enemy.addEndCountdown(
              suiside.duration, 
              () => {
                this.usedTiles.remove(tile);
              }
            );
            enemy.animationStateTransition({
              transAnimation: "Change",
              idleAnimate: "B_Idle",
              isWaitTrans: false
            })
          }
        })
        break;
      case "enemy_1580_mnchrn":             //赞索斯，复仇者
        const movecheck = enemy.getTalent("movecheck");
        enemy.countdown.addCountdown({
          name: "movecheck",
          initCountdown: movecheck.interval,
          callback: () => {
            enemy.animationStateTransition({
              transAnimation: "Move_2_Begin",
              moveAnimate: "Move_2_Loop",
              isWaitTrans: true
            })
            enemy.addBuff({
              id: "movecheck",
              key: "movecheck",
              overlay: false,
              effect: [{
                attrKey: "moveSpeed",
                method: "mul",
                value: 1 + movecheck.move_speed
              }]
            })
          }
        })
        break;
    }
  }

  handleFinishedMap(enemy: Enemy) {
    if(enemy.key === "enemy_1580_mnchrn"){      //赞索斯，复仇者
      const reborn = enemy.getTalent("reborn"); 
      Global.waveManager.startExtraAction({
        key: reborn.branch_id
      })
    }
  }


  get(){
    const states = {
      usedTiles: [...this.usedTiles]
    }
    return states;
  }

  set(state: any) {
    if(state && state.usedTiles){
      this.usedTiles = [...state.usedTiles];
    }
  }
}
export default act48side;