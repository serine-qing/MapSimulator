import Enemy from "../enemy/Enemy";
import type Handler from "./Handler";

class act29side implements Handler{

	handleEnemyStart(enemy: Enemy) {
		switch (enemy.key) {
			case "enemy_1548_ltniak":  //巫王
        enemy.initBlink("blinks1", {
          begin: "A_Blink_Begin",
          loop: "A_Blink_Loop",
          end: "A_Blink_End",
          idle: "A_Idle"
        });
        break;
		}
	}

}

export default act29side;