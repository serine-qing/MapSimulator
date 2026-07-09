import Enemy from "../enemy/Enemy";
import type Handler from "./Handler";

class act50side implements Handler{
  private pycpoks: Enemy[] = [];
  private hasBOSS: boolean = false;
  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_10132_pyceat":  //大喰怪
      case "enemy_10132_pyceat_2":  //大喰怪
        const eat = enemy.getSkill("eat");
        const {mass_level, range_radius, duration} = eat.blackboard;
        enemy.addDetection({
          key: "eat",
          detectionRadius: range_radius,
          duration: 0,
          every: false,
          callback: (deteEnemy: Enemy) => {
            if(deteEnemy.attributes.massLevel <= mass_level) {
              enemy.removeDetection("eat");
              enemy.animationStateTransition({
                isWaitTrans: true,
                transAnimation: "Skill",
                idleAnimate: "Idle_B",
                moveAnimate: "Move_B",
              })
              deteEnemy.finishedMap();
            }
          }
        })
        break;
      case "enemy_10130_pycpok":  //碎壳螈
      case "enemy_10130_pycpok_2":  //碎壳螈
        this.pycpoks.push(enemy);
        if(this.hasBOSS) {
          this.pycpokStartTrans(enemy);
        }
        break;
      case "enemy_10134_pycspy":  //影丝蛛
      case "enemy_10134_pycspy_2":
        enemy.unMoveable = true;
        break;

      case "enemy_1573_pyczog": //“雷之主”
        this.bossStart();
        break;
    }
  }

  handleFinishedMap(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_10130_pycpok":  //碎壳螈
      case "enemy_10130_pycpok_2":  //碎壳螈
        this.pycpoks.remove(enemy);
        break;
      case "enemy_1573_pyczog": //“雷之主”
        this.bossFinish();
        break;
    }
  }

  private bossStart() {
    this.hasBOSS = true;
    this.pycpoks.forEach(enemy => {
      this.pycpokStartTrans(enemy);
    })
  }

  private bossFinish() {
    this.hasBOSS = false;
    this.pycpoks.forEach(enemy => {
      this.pycpokEndTrans(enemy);
    })
  }

  //碎壳螈缩壳
  private pycpokStartTrans(enemy: Enemy) {
    enemy.animationStateTransition({
      isWaitTrans: false,
      transAnimation: "Skill_Begin",
      idleAnimate: "Idle_B",
      moveAnimate: "Move_B",
    })
  }

  //碎壳螈结束缩壳
  private pycpokEndTrans(enemy: Enemy) {
    enemy.animationStateTransition({
      isWaitTrans: false,
      transAnimation: "Skill_End",
      idleAnimate: "Idle_A",
      moveAnimate: "Move_A",
    })
  }

  get(){
    if(this.pycpoks.length > 0) {
      return {
        pycpoks: [...this.pycpoks],
        hasBOSS: this.hasBOSS
      };
    }
    return {};
  }

  set(state) {
    if(state.pycpoks) {
      this.pycpoks = [...state.pycpoks];
      this.hasBOSS = state.hasBOSS;
    }
  }
}

export default act50side;
