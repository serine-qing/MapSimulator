import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";
import type Handler from "./Handler";

class main17 implements Handler{
  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      // case "enemy_1590_muama":  //ama
      // case "enemy_1591_mutwin":  //ama
      // case "enemy_1591_mutwin_2":  //ama
      case "enemy_1593_musnake":  //终始
        enemy.unMoveable = true;
        enemy.dontBlockWave = true;
        enemy.notCountInTotal = true;
        break;
    }
    switch (enemy.key) {
      case "enemy_1591_mutwin":  //ama
        Global.waveManager.startExtraAction({
          key: "boss"
        })
        break;
    }
  }
  
}

export default main17;
