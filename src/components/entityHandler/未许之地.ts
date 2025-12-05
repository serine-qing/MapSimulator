import Enemy from "../enemy/Enemy";
import type Handler from "./Handler";

//汽水瓶的加速天赋
interface passiveTalent{
	move_speed: number
	fixed_value_damage: number
	max_time: number
	interval: number
}

class act47side implements Handler{
	handleEnemyStart(enemy: Enemy) {
		switch (enemy.key) {
			case "enemy_10146_nscola":
			case "enemy_10146_nscola_2":
			case "enemy_10149_nscan":
			case "enemy_10149_nscan_2":
				const passive: passiveTalent = enemy.getTalent("passive");
				enemy.rush(
					passive.interval,
					passive.interval,
					passive.max_time,
					passive.move_speed
				);

				enemy.countdown.addCountdown({
					name: "fixed_value_damage",
					initCountdown: 1,
					countdown: 1,
					callback:() => {
						enemy.hp -= passive.fixed_value_damage;
					}
				})
				break;
		
		}
	}
}
export default act47side;