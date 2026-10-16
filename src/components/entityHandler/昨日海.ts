import Enemy from "../enemy/Enemy";
import type Handler from "./Handler";


class act52side implements Handler{

	handleEnemyConstructor(enemy: Enemy) {
		switch (enemy.key) {
			case "enemy_10213_klbm":
			case "enemy_10213_klbm_2":
			case "enemy_10214_klgn":
			case "enemy_10214_klgn_2":
			case "enemy_10216_kltwhp":
			case "enemy_10216_kltwhp_2":
			case "enemy_10215_klhjd":
			case "enemy_10215_klhjd_2":
				//初始是没有sp状态的
				if(enemy.enemyData?.spData && enemy.enemyData.spData.initSp === 0){
					enemy.unMoveable = true;
					enemy.notCountInTotal = true;
					switch(enemy.key){
						case "enemy_10213_klbm":
						case "enemy_10213_klbm_2":
							enemy.idleAnimate = "Idle2";
							break;
						case "enemy_10214_klgn":
						case "enemy_10214_klgn_2":
						case "enemy_10216_kltwhp":
						case "enemy_10216_kltwhp_2":
							enemy.idleAnimate = "B_Idle";
							break;
						case "enemy_10215_klhjd":
						case "enemy_10215_klhjd_2":
							enemy.idleAnimate = "Idle_B";
							break;
					}
				}
				break;
		}
	}
}
export default act52side;