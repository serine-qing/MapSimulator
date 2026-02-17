import Enemy from "../enemy/Enemy";
import type Handler from "./Handler";

class act37side implements Handler{
  handleEnemyConstructor(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_10027_vtsk":
        enemy.startAnimate = "Start";
        break;
    }
  }

  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_10030_vtwand":
      case "enemy_10028_vtswd":
      case "enemy_10029_vtshld":
        enemy.setHighlandEnemy();
        break;
      case "enemy_10027_vtsk":
        enemy.startAnimate = "Start";
        enemy.addSkill({
          name: "appear",
          initCooldown: 0,
          animateTransition: {
            idleAnimate: "Idle",
            moveAnimate: "Move",
            transAnimation: "Skill_1",
            isWaitTrans: true,
          },
        })
        break;
    }
  }
}

export default act37side;
