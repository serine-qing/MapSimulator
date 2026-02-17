import { en } from "element-plus/lib/locale/index.js";
import Enemy from "../enemy/Enemy";
import { LevelType } from "../utilities/Enum";
import type Handler from "./Handler";

class act23side implements Handler{
  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_1302_ymtro":
      case "enemy_1302_ymtro_2":    //“越长尘”
        const bus = enemy.getTalent("bus");
        const busCount = bus?.max_cnt;
        if(busCount){
          enemy.maxPickUpCount = busCount;
          enemy.addDetection({
            key: "bus",
            detectionRadius: 0.5,
            duration: 0,
            every: true,
            callback: (find: Enemy) => {
              //是否是领袖以外的非机械敌人
              if(find.levelType !== LevelType.BOSS && !find.enemyTags.includes("machine")){
                enemy.pickUp(find);
              }
            }
          })
        }
        break;
    }
  }
}

export default act23side;
