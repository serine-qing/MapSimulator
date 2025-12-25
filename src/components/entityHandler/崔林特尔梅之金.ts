import Enemy from "../enemy/Enemy";
import type Handler from "./Handler";

class act29side implements Handler{
	ltniakBlinkCooldowns: number[];         //巫王的闪烁时间间隔
	currentBlinkIndex: number = 0;          //当前闪烁执行次数
	
	setBlinkCountdown(enemy: Enemy){
		const cooldown = this.ltniakBlinkCooldowns[this.currentBlinkIndex];
		enemy.countdown.addCountdown({
			name: "blink0",
			initCountdown: cooldown,
			callback: () => {
				enemy.animationStateTransition({
					isWaitTrans: false,
					transAnimation: "A_Blink_Begin",
					idleAnimate: "A_Blink_Loop",
					callback: () => {
						this.blink(enemy);
						enemy.animationStateTransition({
							isWaitTrans: false,
							transAnimation: "A_Blink_End",
							idleAnimate: "A_Idle"
						})
					}
				});
				this.currentBlinkIndex = Math.min(
					this.ltniakBlinkCooldowns.length - 1,
					this.currentBlinkIndex + 1
				);
				this.setBlinkCountdown(enemy);
			}
		})
	}

	blink(enemy: Enemy){
		const position = enemy.currentCheckPoint().position;
		enemy.setPosition(position.x, position.y);
		enemy.nextCheckPoint();
	}

	handleEnemyStart(enemy: Enemy) {
		switch (enemy.key) {
			case "enemy_1548_ltniak":  //巫王
        enemy.unMoveable = true;
        const blinks1 = enemy.getSkill("blinks1");
				this.ltniakBlinkCooldowns = Object.values(blinks1.blackboard);
				this.ltniakBlinkCooldowns.unshift(blinks1.initCooldown);
				this.ltniakBlinkCooldowns.push(blinks1.cooldown);
				this.setBlinkCountdown(enemy);
        break;
		}
	}

	get(){
		const state = {
			currentBlinkIndex: this.currentBlinkIndex
		}
		return state;
	}

	
	set(state: any){
		this.currentBlinkIndex = state.currentBlinkIndex;
	}
	
}

export default act29side;