import Enemy from "../enemy/Enemy";
import type Handler from "./Handler";

class BlinkEnemy implements Handler{
  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_1514_smephi":  //梅菲斯特，“歌者”
        enemy.initBlink("blink", {
          begin: "Move_begin",
          loop: "Move_loop",
          end: "Move_end",
          idle: "Idle"
        });
        break;
      case "enemy_1531_bbrain":  //“唤醒”
        enemy.initBlink("blink", {
          begin: "Move_Start",
          loop: "Move_Loop",
          end: "Move_End",
          idle: "Idle"
        });
        break;
    }
  }

}

export default BlinkEnemy;
